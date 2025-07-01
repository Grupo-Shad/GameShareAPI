import { expect } from 'chai'
import supertest from 'supertest'
import generador from './generador/game.js'

//Cambiar la ruta
const request = supertest('http://localhost:8080')

describe('*** TEST DEL SERVICIO APIREST GAME (ext) ***', () => {

  describe('POST /api/games', () => {
    it('Debería incorporar un game sin problemas', async () => {
      const game = generador.get()

      const response = await request.post('/api/games').send(game)
      expect(response.status).to.eql(200)

      const gameGuardado = response.body
      expect(gameGuardado).to.include.keys('name', 'releaseDate', 'publisher', 'availablePlatforms', 'developerStudio', 'genre', 'featured', 'imageUrl', '_id')

      expect(gameGuardado.name).to.eql(game.name)
      expect(new Date(gameGuardado.releaseDate).toISOString()).to.eql(game.releaseDate.toISOString())
      expect(gameGuardado.publisher).to.eql(game.publisher)
      expect(gameGuardado.availablePlatforms).to.eql(game.availablePlatforms)
      expect(gameGuardado.developerStudio).to.eql(game.developerStudio)
      expect(gameGuardado.genre).to.eql(game.genre)
      expect(gameGuardado.featured).to.eql(game.featured)
      expect(gameGuardado.imageUrl).to.eql(game.imageUrl)
    })

    it('Debería fallar al intentar incorporar un game con datos inválidos', async () => {
      const game = generador.get()

      // Creo un game invalido con campo "name" vacío
      const invalidGame = {
        ...game,
        name: '', // campo obligatorio vacío
      }

      const response = await request.post('/api/games').send(invalidGame)

      // Se espera error 400 o 422
      expect(response.status).to.be.oneOf([400, 422])

      // Opcional: verificar que el body contenga mensaje de error
      expect(response.body).to.have.property('error').that.is.a('string')
    })
  })

  describe('PUT /api/games/:id', () => {
    let gameId

    before(async () => {
      // Crear un game para actualizarlo después
      const game = generador.get()
      const postRes = await request.post('/api/games').send(game)
      gameId = postRes.body._id
    })

    it('Debería actualizar un game con datos válidos', async () => {
      const updateData = {
        name: 'Updated Game Name',
        releaseDate: new Date('2023-01-01'),
        publisher: 'Updated Publisher',
        availablePlatforms: ['PC', 'Xbox'],
        developerStudio: 'Updated Studio',
        genre: ['Action', 'RPG'],
        featured: true,
        imageUrl: 'https://example.com/image.jpg'
      }

      const putRes = await request.put(`/api/games/${gameId}`).send(updateData)
      expect(putRes.status).to.eql(200)

      const updatedGame = putRes.body
      expect(updatedGame).to.include.keys('name', 'releaseDate', 'publisher', 'availablePlatforms', 'developerStudio', 'genre', 'featured', 'imageUrl', '_id')

      expect(updatedGame.name).to.eql(updateData.name)
      expect(new Date(updatedGame.releaseDate).toISOString()).to.eql(updateData.releaseDate.toISOString())
      expect(updatedGame.publisher).to.eql(updateData.publisher)
      expect(updatedGame.availablePlatforms).to.eql(updateData.availablePlatforms)
      expect(updatedGame.developerStudio).to.eql(updateData.developerStudio)
      expect(updatedGame.genre).to.eql(updateData.genre)
      expect(updatedGame.featured).to.eql(updateData.featured)
      expect(updatedGame.imageUrl).to.eql(updateData.imageUrl)
    })

    it('Debería fallar al actualizar con datos inválidos', async () => {
      const invalidUpdate = {
        name: '', // nombre vacío no permitido
      }

      const putRes = await request.put(`/api/games/${gameId}`).send(invalidUpdate)
      expect(putRes.status).to.be.oneOf([400, 422])
      expect(putRes.body).to.have.property('error').that.is.a('string')
    })
  })

})


describe("*** TEST DEL SERVICIO APIREST WHISLIST (ext) ***", () => {
  // AJUSTAR LOS DATOS
  const testFirebaseUid = "test-user-uid"; // uid del usuario autenticado
  let testWishlistId;
  const targetUserUidToRemove = "target-user-uid";

  before(async () => {
    // Crear una wishlist para usarla en tests, si necesitas
    const createRes = await request
      .post("/api/wishlists")
      .send({
        title: "Wishlist de prueba",
        description: "Para tests",
        firebaseUid: testFirebaseUid,
      });

    testWishlistId = createRes.body.id || createRes.body._id;
  });

  describe("GET /api/wishlists", () => {
    it("Debería obtener las wishlists del usuario", async () => {
      const res = await request
        .get("/api/wishlists")
        .set("Authorization", `Bearer token-de-prueba`) // si usas auth
        .query({ firebaseUid: testFirebaseUid }); // o como lo pases

      expect(res.status).to.eql(200);
      expect(res.body).to.be.an("array");
      if (res.body.length > 0) {
        expect(res.body[0]).to.include.all.keys(
          "id",
          "title",
          "description",
          "owner",
          "games",
          "isOwner",
          "createdAt",
          "updatedAt"
        );
      }
    });
  });

  describe("DELETE /api/wishlists/:wishlistId/share/:targetFirebaseUid", () => {

    it("Debería revocar acceso a un usuario compartido", async () => {
      const res = await request
        .delete(`/api/wishlists/${testWishlistId}/share/${targetUserUidToRemove}`)
        .set("Authorization", `Bearer token-de-prueba`) // si usas auth
        .send({ firebaseUid: testFirebaseUid }); // propietario actual

      // Status esperado: 200 OK (según implementación)
      expect(res.status).to.eql(200);

      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("sharedWith").that.is.an("array");
    });

    it("Debería fallar al revocar acceso con wishlistId inválido", async () => {
      const res = await request
        .delete(`/api/wishlists/invalidId/share/${targetUserUidToRemove}`)
        .set("Authorization", `Bearer token-de-prueba`)
        .send({ firebaseUid: testFirebaseUid });

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property("error").that.is.a("string");
    });
  });
});