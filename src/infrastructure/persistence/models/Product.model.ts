import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.set("autoIndex", false);

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
