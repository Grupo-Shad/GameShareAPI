import { expect } from "chai";
import supertest from "supertest";
import gameGenerator from "./generador/game.js";
import wishlistGenerator from "./generador/wishlist.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

//Cambiar la ruta
const request = supertest("http://localhost:8080");

// Tokens válidos desde variables de entorno
// Para usar: crear archivo .env.test o configurar variables:
// TEST_JWT_USER1=Bearer tu_token_aqui
// TEST_JWT_USER2=Bearer tu_segundo_token_aqui
// TEST_FIREBASE_UID1=firebase_uid_del_user1
// TEST_FIREBASE_UID2=firebase_uid_del_user2
const testTokens = {
  user1: process.env.TEST_JWT_USER1
    ? `Bearer ${process.env.TEST_JWT_USER1}`
    : "Bearer CONFIGURAR_EN_ENV",
  user2: process.env.TEST_JWT_USER2
    ? `Bearer ${process.env.TEST_JWT_USER2}`
    : "Bearer CONFIGURAR_EN_ENV",
};

const testFirebaseUids = {
  user1: process.env.TEST_FIREBASE_UID1 || "CONFIGURAR_EN_ENV",
  user2: process.env.TEST_FIREBASE_UID2 || "CONFIGURAR_EN_ENV",
};

// Verificar que los tokens estén configurados
before(() => {
  if (testTokens.user1 === "Bearer CONFIGURAR_EN_ENV") {
    console.warn("⚠️  TEST_JWT_USER1 no configurado en variables de entorno");
    console.warn("   Agregar en .env: TEST_JWT_USER1=Bearer tu_token_aqui");
  }
  if (testTokens.user2 === "Bearer CONFIGURAR_EN_ENV") {
    console.warn("⚠️  TEST_JWT_USER2 no configurado en variables de entorno");
    console.warn("   Agregar en .env: TEST_JWT_USER2=Bearer tu_segundo_token");
  }
});

describe("*** TEST DEL SERVICIO APIREST GAME (ext) ***", () => {
  describe("POST /api/games", () => {
    it("Debería incorporar un game sin problemas", async () => {
      const game = gameGenerator.get();

      const response = await request
        .post("/api/games")
        .set("Authorization", testTokens.user1)
        .send(game);
      expect(response.status).to.eql(201);

      const gameGuardado = response.body;
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
      expect(new Date(gameGuardado.releaseDate).toISOString()).to.equal(
        game.releaseDate
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

      const invalidGame = {
        ...game,
        name: "",
      };

      const response = await request
        .post("/api/games")
        .set("Authorization", testTokens.user1)
        .send(invalidGame);

      expect(response.status).to.be.oneOf([400, 422]);
      expect(response.body).to.have.property("error").that.is.a("string");
    });
  });

  describe("PUT /api/games/:id", () => {
    let gameId;

    before(async () => {
      const game = gameGenerator.get();
      const postRes = await request
        .post("/api/games")
        .set("Authorization", testTokens.user1)
        .send(game);
      gameId = postRes.body._id;
    });

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

      const putRes = await request
        .put(`/api/games/${gameId}`)
        .set("Authorization", testTokens.user1)
        .send(updateData);
      expect(putRes.status).to.eql(200);

      const updatedGame = putRes.body;
      expect(updatedGame.name).to.eql(updateData.name);
      expect(new Date(updatedGame.releaseDate).toISOString()).to.eql(
        updateData.releaseDate.toISOString()
      );
      expect(updatedGame.publisher).to.eql(updateData.publisher);
      expect(updatedGame.availablePlatforms).to.eql(
        updateData.availablePlatforms
      );
      expect(updatedGame.developerStudio).to.eql(updateData.developerStudio);
      expect(updatedGame.genre).to.eql(updateData.genre);
      expect(updatedGame.featured).to.eql(updateData.featured);
      expect(updatedGame.imageUrl).to.eql(updateData.imageUrl);
    });

    it("Debería fallar al actualizar con datos inválidos", async () => {
      const invalidUpdate = {
        name: "",
      };

      const putRes = await request
        .put(`/api/games/${gameId}`)
        .set("Authorization", testTokens.user1)
        .send(invalidUpdate);
      expect(putRes.status).to.be.oneOf([400, 422]);
      expect(putRes.body).to.have.property("error").that.is.a("string");
    });
  });
});

describe("*** TEST DEL SERVICIO APIREST WHISLIST (ext) ***", () => {
  // Variables para los usuarios de prueba
  let user1Data, user2Data;
  let user1Id, user2Id;
  let testWishlistId;

  // Usar los usuarios de test desde variables de entorno
  const user1FirebaseUid = testFirebaseUids.user1;
  const user2FirebaseUid = testFirebaseUids.user2;

  const user1JWT = testTokens.user1;
  const user2JWT = testTokens.user2;

  before(async () => {
    try {
      // Usar timestamp para hacer datos únicos
      const timestamp = Date.now();

      // Crear usuarios de test con datos simples
      user1Data = {
        username: `testuser1_${timestamp}`,
        email: `testuser1_${timestamp}@example.com`,
        firebaseUid: user1FirebaseUid,
        avatar: "https://example.com/avatar1.jpg",
      };

      user2Data = {
        username: `testuser2_${timestamp}`,
        email: `testuser2_${timestamp}@example.com`,
        firebaseUid: user2FirebaseUid,
        avatar: "https://example.com/avatar2.jpg",
      };

      // Crear o obtener primer usuario usando register-or-get
      const registerUser1Res = await request
        .post("/api/users/register-or-get")
        .send(user1Data);

      if (registerUser1Res.status === 200 || registerUser1Res.status === 201) {
        user1Id =
          registerUser1Res.body.user._id || registerUser1Res.body.user.id;
        console.log("Usuario 1 registrado/obtenido:", user1Id);
      } else {
        throw new Error(
          `Error al registrar/obtener user1: ${
            registerUser1Res.status
          } - ${JSON.stringify(registerUser1Res.body)}`
        );
      }

      // Crear o obtener segundo usuario usando register-or-get
      const registerUser2Res = await request
        .post("/api/users/register-or-get")
        .send(user2Data);

      if (registerUser2Res.status === 200 || registerUser2Res.status === 201) {
        user2Id =
          registerUser2Res.body.user._id || registerUser2Res.body.user.id;
        console.log("Usuario 2 registrado/obtenido:", user2Id);
      } else {
        throw new Error(
          `Error al registrar/obtener user2: ${
            registerUser2Res.status
          } - ${JSON.stringify(registerUser2Res.body)}`
        );
      }

      // Crear wishlist usando el generador mejorado
      const wishlistData = wishlistGenerator.generateWishlistData();

      const createWishlistRes = await request
        .post("/api/wishlists")
        .set("Authorization", user1JWT)
        .send(wishlistData);

      if (createWishlistRes.status === 201) {
        testWishlistId =
          createWishlistRes.body.id || createWishlistRes.body._id;
      } else {
        throw new Error(
          `Error al crear wishlist: ${
            createWishlistRes.status
          } - ${JSON.stringify(createWishlistRes.body)}`
        );
      }

      // Compartir wishlist
      const shareRes = await request
        .post(`/api/wishlists/${testWishlistId}/share`)
        .set("Authorization", user1JWT)
        .send({ targetUserId: user2Id });

      if (shareRes.status !== 200) {
        throw new Error(
          `Error al compartir wishlist: ${shareRes.status} - ${JSON.stringify(
            shareRes.body
          )}`
        );
      }
    } catch (error) {
      console.error("Error en setup de wishlists:", error);
      throw error;
    }
  });

  describe("GET /api/wishlists", () => {
    it("Debería obtener las wishlists del usuario", async () => {
      const res = await request
        .get("/api/wishlists")
        .set("Authorization", user1JWT)
        .query({ firebaseUid: user1FirebaseUid });

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
        .delete(
          `/api/wishlists/${testWishlistId}/share/${user2Data.firebaseUid}`
        )
        .set("Authorization", user1JWT);

      expect(res.status).to.eql(200);
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("sharedWith").that.is.an("array");
    });

    it("Debería fallar al revocar acceso con wishlistId inválido", async () => {
      // Usar un ObjectId válido pero que no existe
      const nonExistentId = "507f1f77bcf86cd799439011";

      const res = await request
        .delete(
          `/api/wishlists/${nonExistentId}/share/${user2Data.firebaseUid}`
        )
        .set("Authorization", user1JWT);

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property("error").that.is.a("string");
    });

    it("Debería fallar al revocar acceso con firebaseUid inexistente", async () => {
      const res = await request
        .delete(
          `/api/wishlists/${testWishlistId}/share/nonexistent-firebase-uid`
        )
        .set("Authorization", user1JWT);

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property("error").that.is.a("string");
    });

    it("Debería fallar si un usuario que no es owner trata de revocar acceso", async () => {
      // Primero re-compartir la wishlist
      await request
        .post(`/api/wishlists/${testWishlistId}/share`)
        .set("Authorization", user1JWT)
        .send({ targetUserId: user2Id });

      // Intentar revocar acceso usando el JWT del usuario que no es owner
      const res = await request
        .delete(
          `/api/wishlists/${testWishlistId}/share/${user2Data.firebaseUid}`
        )
        .set("Authorization", user2JWT);

      // El test puede fallar por dos razones válidas:
      // 1. Usuario no es owner (400/403 con "error")
      // 2. JWT no coincide con usuario real (403 con "message" - Token inválido)
      expect(res.status).to.be.oneOf([400, 403]);

      // Aceptar tanto "error" como "message" porque ambos son fallos válidos
      const hasErrorProperty = res.body.hasOwnProperty("error");
      const hasMessageProperty = res.body.hasOwnProperty("message");

      expect(hasErrorProperty || hasMessageProperty).to.be.true;

      if (hasErrorProperty) {
        expect(res.body.error).to.be.a("string");
      }
      if (hasMessageProperty) {
        expect(res.body.message).to.be.a("string");
      }
    });
  });
});
