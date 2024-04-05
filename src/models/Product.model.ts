import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface ProductDocument extends Document {
  _id: string;
  name: string;
  description?: string;
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

productSchema.set("autoIndex", false);

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
