import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
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
  },
  { versionKey: false, collection: "Game" }
);

export const GameModel = mongoose.model("Game", gameSchema);
