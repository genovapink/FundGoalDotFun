import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
  name: string;
  ticker: string;
  description: string;
  initialBuyPerToken?: number;
  marketCap: number;
  contractAddress?: string;
  bondingCurveAddress?: string;
  donationAddress?: string;
  status: "active" | "inactive";
  imageUrl?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema: Schema = new Schema({
  name: { type: String, required: true },
  ticker: { type: String, required: true },
  description: { type: String, required: true },
  initialBuyPerToken: { type: Number },
  marketCap: {
    type: Number,
  },
  contractAddress: { type: String },
  bondingCurveAddress: { type: String },
  donationAddress: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  imageUrl: { type: String },
  postUrl: { type: String },
  // socialLinks: {
  //   website: { type: String },
  //   twitter: { type: String },
  //   telegram: { type: String },
  // },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TokenSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const TokenModel = mongoose.model<IToken>("Token", TokenSchema);
