import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface BrandDocument extends Document {
  name: string;
  description?: string;
}

export type BrandInput = {
  name: string;
  description?: string;
};

const brandSchema = new Schema<BrandDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const Brand = mongoose.model<BrandDocument>("Brand", brandSchema);

export default Brand;
