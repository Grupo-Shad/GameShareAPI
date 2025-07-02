import { expect } from "chai";
import supertest from "supertest";
import gameGenerator from "./generador/game.js";
import wishlistGenerator from "./generador/wishlist.js";

//Cambiar la ruta
const request = supertest("http://localhost:8080");
const JWT =
  "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NzQ4NTAwMmYwNWJlMDI2N2VmNDU5ZjViNTEzNTMzYjVjNThjMTIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVG9tYXMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ2FtZXNoYXJlYXBwLWQyMzk1IiwiYXVkIjoiZ2FtZXNoYXJlYXBwLWQyMzk1IiwiYXV0aF90aW1lIjoxNzUxNDc4MTE2LCJ1c2VyX2lkIjoidTQ4dWRJUWJVYVRVcUJUaFFYbm1zUkpxVGlFMyIsInN1YiI6InU0OHVkSVFiVWFUVXFCVGhRWG5tc1JKcVRpRTMiLCJpYXQiOjE3NTE0NzgxMTYsImV4cCI6MTc1MTQ4MTcxNiwiZW1haWwiOiJhbWVuZG8xOTY0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbWVuZG8xOTY0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.19L-rF5PyaW4LMP-t3IuBmgC-ffzFJkKlTNLcTxdBgN6GLagwy9Rr2jsRQ6-jPr2h3IKW3WU9AdwO9rVetSSlUbebmbEpdym92rKu5Z5ZF-1BQiecEDJXQvcT6oDJYvZECnLqOnEov8Hvoj195oNSbiXKBcOBuw8P0BjVjYsRMmSjmSZ4kd5yNqmBsI4qZm0kD3tINdE1Kt4hTZh8ryg4Y8eicLaTtCYmH7AnTy0qQNJtdpEDmJNTlMOb_bbUQ5dZLJVmtdNWFOexuMivqmF0eHYrbUBC2NeTjoDP11IgLPW2fZ1_XbgVhuwf_xoN2qUnkKe8ODcCR_vkmjMJoG6Cw ";

describe("*** TEST DEL SERVICIO APIREST GAME (ext) ***", () => {
  describe("POST /api/games", () => {
    it("Debería incorporar un game sin problemas", async () => {
      const game = gameGenerator.get();

      const response = await request
        .post("/api/games")
        .set("Authorization", JWT)
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
        .set("Authorization", JWT)
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
        .set("Authorization", JWT)
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
        .set("Authorization", JWT)
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
        .set("Authorization", JWT)
        .send(invalidUpdate);
      expect(putRes.status).to.be.oneOf([400, 422]);
      expect(putRes.body).to.have.property("error").that.is.a("string");
    });
  });
});

describe("*** TEST DEL SERVICIO APIREST WHISLIST (ext) ***", () => {
  // Ajustar datos
  const testFirebaseUid = "test-user-uid";
  let testWishlistId;
  const targetUserUidToRemove = "target-user-uid";

  before(async () => {
    // Crear wishlist usando el generador
    const wishlistData = wishlistGenerator.generateWishlist();

    // Podés incluir firebaseUid si tu API lo requiere
    const createRes = await request
      .post("/api/wishlists")
      .set("Authorization", JWT)
      .send({
        ...wishlistData,
        firebaseUid: testFirebaseUid,
      });

    testWishlistId = createRes.body.id || createRes.body._id;
  });

  describe("GET /api/wishlists", () => {
    it("Debería obtener las wishlists del usuario", async () => {
      const res = await request
        .get("/api/wishlists")
        .set("Authorization", JWT)
        .query({ firebaseUid: testFirebaseUid });

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
          `/api/wishlists/${testWishlistId}/share/${targetUserUidToRemove}`
        )
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NzQ4NTAwMmYwNWJlMDI2N2VmNDU5ZjViNTEzNTMzYjVjNThjMTIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVG9tYXMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ2FtZXNoYXJlYXBwLWQyMzk1IiwiYXVkIjoiZ2FtZXNoYXJlYXBwLWQyMzk1IiwiYXV0aF90aW1lIjoxNzUxNDcyMDgxLCJ1c2VyX2lkIjoidTQ4dWRJUWJVYVRVcUJUaFFYbm1zUkpxVGlFMyIsInN1YiI6InU0OHVkSVFiVWFUVXFCVGhRWG5tc1JKcVRpRTMiLCJpYXQiOjE3NTE0NzIwODEsImV4cCI6MTc1MTQ3NTY4MSwiZW1haWwiOiJhbWVuZG8xOTY0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbWVuZG8xOTY0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.xzQkbTEdngJ39mi-u7R5QDbx0WrVd62PqqO7f5wlzTbk87CHEZj9yqauAfeeshBI8TvGimo1gTxWSiIO1R8x84fYdbh5TDOqdt0gyAAoFKKqB_pbONrGmdL6p7R6gdJEfYSSskkDBT0sln9_LXyHpHJ-xTaslSA4sIbgllGTHOVFN_8yPEFdOAKs4MeXU149ofrXRJrh5UEumTq65t5ADCZBV5CojjxGgeBd4cDsMlBf0uEBktfMDfU2iihGu89rrZvY8HeWXV_WNJWYcl9A8jGd_xqq6s4nxMEAJhV03R3L4vd56ZGiqZBv00ubMjiV2E1Gf4YsNfIyG5yFfNlhTQ`
        )
        .send({ firebaseUid: testFirebaseUid });

      expect(res.status).to.eql(200);
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("sharedWith").that.is.an("array");
    });

    it("Debería fallar al revocar acceso con wishlistId inválido", async () => {
      const res = await request
        .delete(`/api/wishlists/invalidId/share/${targetUserUidToRemove}`)
        .set(
          "Authorization",
          `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NzQ4NTAwMmYwNWJlMDI2N2VmNDU5ZjViNTEzNTMzYjVjNThjMTIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVG9tYXMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ2FtZXNoYXJlYXBwLWQyMzk1IiwiYXVkIjoiZ2FtZXNoYXJlYXBwLWQyMzk1IiwiYXV0aF90aW1lIjoxNzUxNDcyMDgxLCJ1c2VyX2lkIjoidTQ4dWRJUWJVYVRVcUJUaFFYbm1zUkpxVGlFMyIsInN1YiI6InU0OHVkSVFiVWFUVXFCVGhRWG5tc1JKcVRpRTMiLCJpYXQiOjE3NTE0NzIwODEsImV4cCI6MTc1MTQ3NTY4MSwiZW1haWwiOiJhbWVuZG8xOTY0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhbWVuZG8xOTY0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.xzQkbTEdngJ39mi-u7R5QDbx0WrVd62PqqO7f5wlzTbk87CHEZj9yqauAfeeshBI8TvGimo1gTxWSiIO1R8x84fYdbh5TDOqdt0gyAAoFKKqB_pbONrGmdL6p7R6gdJEfYSSskkDBT0sln9_LXyHpHJ-xTaslSA4sIbgllGTHOVFN_8yPEFdOAKs4MeXU149ofrXRJrh5UEumTq65t5ADCZBV5CojjxGgeBd4cDsMlBf0uEBktfMDfU2iihGu89rrZvY8HeWXV_WNJWYcl9A8jGd_xqq6s4nxMEAJhV03R3L4vd56ZGiqZBv00ubMjiV2E1Gf4YsNfIyG5yFfNlhTQ`
        )
        .send({ firebaseUid: testFirebaseUid });

      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body).to.have.property("error").that.is.a("string");
    });
  });
});
