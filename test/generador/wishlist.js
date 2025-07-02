import { faker } from "@faker-js/faker/locale/en";

const generateWishlist = (gameObjects = []) => {
  const games = faker.helpers.arrayElements(gameObjects, {
    min: 1,
    max: Math.min(5, gameObjects.length),
  }).map(game => ({
    game: game.name, // Podés usar el ID si lo tuvieras, aquí usamos el nombre
    notes: faker.lorem.sentence(),
    addedAt: faker.date.recent({ days: 30 }).toISOString(),
  }));

  const sharedWith = Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
    user: faker.internet.email(),
    sharedAt: faker.date.recent({ days: 30 }).toISOString(),
  }));

  return {
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    owner: faker.internet.email(),
    games,
    sharedWith,
    shareableId: faker.string.uuid(), // SIN usar crypto
  };
};

console.log(generateWishlist())

export default {
  generateWishlist,
};