import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface ProductPriceDocument extends Document {
  _id: string;
  productId: mongoose.Schema.Types.ObjectId;
  carModelId: mongoose.Schema.Types.ObjectId[];
  price: number;
}

const productPriceSchema = new Schema<ProductPriceDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    productId: {
      type: String,
      required: true,
      ref: "Product", // Asumiendo que existe un modelo Product
    },
    carModelId: [
      {
        type: String,
        required: true,
        ref: "CarModel", // Asumiendo que existe un modelo CarModel
      },
    ],
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Esto agregará automáticamente campos para `createdAt` y `updatedAt`
  },
);

const ProductPrice = mongoose.model<ProductPriceDocument>(
  "ProductPrice",
  productPriceSchema,
);

export default ProductPrice;
