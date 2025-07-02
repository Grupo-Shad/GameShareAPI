import { faker } from "@faker-js/faker/locale/en";

// Genera datos para crear wishlist via API POST
const generateWishlistData = () => {
  return {
    title: faker.lorem.words({ min: 2, max: 5 }), // Entre 2-5 palabras para evitar títulos muy largos
    description: faker.lorem.sentences({ min: 1, max: 3 }), // Máximo 3 oraciones para no exceder 500 chars
  };
};

// Genera datos válidos para agregar un juego a una wishlist
const generateGameData = (gameId) => {
  return {
    gameId: gameId || faker.string.uuid(),
    notes: faker.lorem.sentence({ min: 3, max: 10 }), // Máximo 200 caracteres
  };
};

// Genera datos para compartir wishlist
const generateShareData = (targetUserId) => {
  return {
    targetUserId: targetUserId || faker.string.uuid(),
  };
};

// Genera wishlist completa (para casos de prueba complejos)
const generateWishlist = (gameObjects = []) => {
  const games = faker.helpers
    .arrayElements(gameObjects, {
      min: 0,
      max: Math.min(5, gameObjects.length),
    })
    .map((game) => ({
      game: game.name || game.id,
      notes: faker.lorem.sentence(),
      addedAt: faker.date.recent({ days: 30 }).toISOString(),
    }));

  const sharedWith = Array.from(
    { length: faker.number.int({ min: 0, max: 3 }) },
    () => ({
      user: faker.internet.email(),
      sharedAt: faker.date.recent({ days: 30 }).toISOString(),
    })
  );

  return {
    title: faker.lorem.words({ min: 2, max: 5 }),
    description: faker.lorem.sentences({ min: 1, max: 3 }),
    owner: faker.internet.email(),
    games,
    sharedWith,
    shareableId: faker.string.uuid(),
    createdAt: faker.date.recent({ days: 60 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  };
};

// Genera múltiples wishlists para tests de listas
const generateWishlists = (count = 5) => {
  return Array.from({ length: count }, () => generateWishlist());
};

// Genera datos inválidos para tests de error
const generateInvalidWishlistData = () => {
  const invalidCases = [
    { title: "", description: "Valid description" }, // Título vacío
    { title: "A".repeat(101), description: "Valid description" }, // Título muy largo
    { title: "Valid title", description: "A".repeat(501) }, // Descripción muy larga
    {}, // Sin título
  ];

  return faker.helpers.arrayElement(invalidCases);
};

console.log("Datos para API:", generateWishlistData());

export default {
  generateWishlistData, // Para POST /api/wishlists
  generateGameData, // Para POST /api/wishlists/:id/games
  generateShareData, // Para POST /api/wishlists/:id/share
  generateWishlist, // Para casos completos
  generateWishlists, // Para tests de listas
  generateInvalidWishlistData, // Para tests de errores
};
