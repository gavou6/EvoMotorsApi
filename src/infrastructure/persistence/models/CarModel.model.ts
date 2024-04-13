import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Combustion, EngineType } from "../../../shared/enums";

interface CarModelDocument extends Document {
  _id: string;
  name: string;
  brandId: string;
  year: string;
  engineSize: string;
  cylinder: string;
  combustion: Combustion;
  engineType: EngineType;
  productId: string[];
  fileId: string[];
}

const carModelSchema = new Schema<CarModelDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    brandId: {
      type: String,
      required: true,
      ref: "Brand",
    },
    year: {
      type: String,
      required: true,
    },
    engineSize: {
      type: String,
      required: true,
    },
    cylinder: {
      type: String,
      required: true,
    },
    combustion: {
      type: String,
      required: true,
      enum: Object.values(Combustion),
    },
    engineType: {
      type: String,
      required: true,
      enum: Object.values(EngineType),
    },
    productId: [
      {
        type: String,
        ref: "Product",
      },
    ],
    fileId: [
      {
        type: String,
        ref: "File",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const CarModel = mongoose.model<CarModelDocument>("CarModel", carModelSchema);

export default CarModel;
