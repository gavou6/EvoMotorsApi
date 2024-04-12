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
      ref: "Product",
    },
    carModelId: [
      {
        type: String,
        required: true,
        ref: "CarModel",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductPrice = mongoose.model<ProductPriceDocument>(
  "ProductPrice",
  productPriceSchema,
);

export default ProductPrice;
