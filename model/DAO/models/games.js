import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  availablePlatforms: {
    type: [String],
    required: true,
  },
  developerStudio: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export const gameModel = mongoose.model("Game", gameSchema);
