import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        favorites: {
            type: [String],
        },
    },  
    { versionKey: false, collection: "Favorite" }
);

export const FavoriteModel = mongoose.model("Favorite", favoriteSchema);