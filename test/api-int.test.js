import { expect } from "chai";
import supertest from "supertest";
import gameGenerator from "./generador/game.js";
import wishlistGenerator from "./generador/wishlist.js";
import Server from "../server.js";

describe("*** TEST DEL SERVICIO APIREST GAME (int) ***", () => {
  let server; // para iniciar/parar el servidor entre tests
  let app; // app de Express que retorna server.start()
  let request; // instancia de supertest(app)
  let gameId; // para compartir el ID entre tests

  //hook de mocha que se ejecuta antes de que empiezen los tests
  before(async () => {
    server = new Server(8082, "MONGODB");
    app = await server.start();
    request = supertest(app);
  });
  //hook de mocha que se ejecuta despues de que terminen los test
  after(async () => {
    await server.stop();
  });

  describe("POST /api/games", () => {
    it("Debería incorporar un game sin problemas", async () => {
      const game = gameGenerator.get();

      const response = await request.post("/api/games").send(game);
      expect(response.status).to.eql(200);

      const gameGuardado = response.body;
      gameId = gameGuardado._id; // para el PUT

      expect(gameGuardado).to.include.keys(
        "name",
        "releaseDate",
        "publisher",
        "availablePlatforms",
        "developerStudio",
        "genre",
        "featured",
        "imageUrl"
      );

      expect(gameGuardado.name).to.eql(game.name);
      expect(new Date(gameGuardado.releaseDate).toISOString()).to.eql(
        game.releaseDate.toISOString()
      );
      expect(gameGuardado.publisher).to.eql(game.publisher);
      expect(gameGuardado.availablePlatforms).to.eql(game.availablePlatforms);
      expect(gameGuardado.developerStudio).to.eql(game.developerStudio);
      expect(gameGuardado.genre).to.eql(game.genre);
      expect(gameGuardado.featured).to.eql(game.featured);
      expect(gameGuardado.imageUrl).to.eql(game.imageUrl);
    });

    it("Debería fallar al intentar incorporar un game con datos inválidos", async () => {
      const game = gameGenerator.get();
      const invalidGame = { ...game, name: "" };

      const response = await request.post("/api/games").send(invalidGame);
      expect(response.status).to.be.oneOf([400, 422]);
      expect(response.body).to.have.property("error").that.is.a("string");
    });
  });

  describe("PUT /api/games/:id", () => {
    it("Debería actualizar un game con datos válidos", async () => {
      const updateData = {
        name: "Updated Game Name",
        releaseDate: new Date("2023-01-01"),
        publisher: "Updated Publisher",
        availablePlatforms: ["PC", "Xbox"],
        developerStudio: "Updated Studio",
        genre: ["Action", "RPG"],
        featured: true,
        imageUrl: "https://example.com/image.jpg",
      };

      const res = await request.put(`/api/games/${gameId}`).send(updateData);
      expect(res.status).to.eql(200);

      const updatedGame = res.body;
      expect(updatedGame.name).to.eql(updateData.name);
    });

    it("Debería fallar al actualizar con datos inválidos", async () => {
      const res = await request.put(`/api/games/${gameId}`).send({ name: "" });
      expect(res.status).to.be.oneOf([400, 422]);
      expect(res.body).to.have.property("error");
    });
  });
});

describe("*** TEST DEL SERVICIO APIREST WHISHLIST (int) ***", () => {
  const testFirebaseUid = "test-user-uid";
  let testWishlistId;
  const targetUserUidToRemove = "target-user-uid";

  before(async () => {
    // Generar una wishlist usando el generador
    const generatedWishlist = wishlistGenerator.generateWishlist();

    // Opcional: asegurate de setear firebaseUid si tu API lo necesita
    const wishlistToSend = {
      ...generatedWishlist,
      firebaseUid: testFirebaseUid,
    };

    // Crear la wishlist en la API
    const res = await request.post("/api/wishlists").send(wishlistToSend);

    testWishlistId = res.body._id || res.body.id;
  });

  describe("GET /api/wishlists", () => {
    it("Debería obtener wishlists por firebaseUid", async () => {
      const res = await request
        .get("/api/wishlists")
        .query({ firebaseUid: testFirebaseUid });

      expect(res.status).to.eql(200);
      expect(res.body).to.be.an("array");

      if (res.body.length) {
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
    it("Debería revocar acceso a un usuario", async () => {
      const res = await request
        .delete(
          `/api/wishlists/${testWishlistId}/share/${targetUserUidToRemove}`
        )
        .send({ firebaseUid: testFirebaseUid });

      expect(res.status).to.eql(200);
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("sharedWith").that.is.an("array");
    });
  });
});
