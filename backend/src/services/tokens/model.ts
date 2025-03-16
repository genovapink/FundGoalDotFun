import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
  name: string;
  symbol: string;
  launchDate: Date;
  marketCap: number;
  status: string;
  bondingCurveParams: object;
  url: string;
  address: string;
  author: string;
  description: string;
}

const TokenSchema: Schema = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  launchDate: { type: Date, required: true },
  marketCap: { type: Number, required: true },
  status: { type: String, required: true },
  bondingCurveParams: { type: Object, required: true },
  url: { type: String, required: true },
  address: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
});

export const TokenModel = mongoose.model<IToken>("Token", TokenSchema);
