import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface ProductDocument extends Document {
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
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
