// fakerGameGenerator.js
import { faker } from "@faker-js/faker/locale/en";

const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
const genres = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports"];

const get = () => ({
  name: faker.commerce.productName(),
  releaseDate: faker.date.past({ years: 10 }).toISOString(),
  publisher: faker.company.name(),
  availablePlatforms: faker.helpers.arrayElements(platforms, { min: 1, max: 5 }),
  developerStudio: faker.company.name(),
  genre: faker.helpers.arrayElements(genres, { min: 1, max: 3 }),
  featured: faker.datatype.boolean(),
  imageUrl: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
});

console.log(get())

export default {
  get
};
