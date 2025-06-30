import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    collection: "User",
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);
