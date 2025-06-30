import mongoose from "mongoose";
import crypto from "crypto";

const wishlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: String,
      required: true,
    },
    games: [
      {
        game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
          required: true,
        },
        notes: {
          type: String,
          default: "",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sharedWith: [
      {
        user: {
          type: String,
          required: true,
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shareableId: {
      type: String,
      unique: true,
    },
  },
  {
    versionKey: false,
    collection: "Wishlist",
    timestamps: true,
  }
);

// Pre-save middleware para generar shareableId automáticamente
wishlistSchema.pre("save", function (next) {
  if (!this.shareableId) {
    this.shareableId = crypto.randomUUID();
  }
  next();
});

export const WishlistModel = mongoose.model("Wishlist", wishlistSchema);
