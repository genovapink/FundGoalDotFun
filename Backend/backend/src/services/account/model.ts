import { model, Schema } from "mongoose";

const TABLE_ACCOUNT = "account";

const ROLE = ["A", "B"];

const accountSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLE,
      default: ROLE[0],
    },
  },
  {
    timestamps: true,
  }
);

const Account = model(TABLE_ACCOUNT, accountSchema, TABLE_ACCOUNT);

export { Account };
