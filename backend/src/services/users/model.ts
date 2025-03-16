import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  address: string;
  username?: string;
  watchlist: string[];
}

const UserSchema: Schema = new Schema({
  address: { type: String, required: true },
  username: { type: String },
  watchlist: [{ type: Schema.Types.ObjectId, ref: "Token" }],
});

export const UserModel = mongoose.model<User>("User", UserSchema);
