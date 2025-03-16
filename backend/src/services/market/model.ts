import mongoose, { Schema, Document } from "mongoose";

interface Market extends Document {
  tokenId: Schema.Types.ObjectId; 
  price: number;
  volume: number;
  timestamp: Date;
  liquidity: number;
}

const MarketSchema: Schema = new Schema({
  tokenId: { type: Schema.Types.ObjectId, ref: "Token", required: true },
  price: { type: Number, required: true },
  volume: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  liquidity: { type: Number, required: true },
});

export const MarketModel = mongoose.model<Market>("Market", MarketSchema);
