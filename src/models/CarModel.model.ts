import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { CombustionType, EngineType } from "../shared/enums";

interface CarModelDocument extends Document {
  _id: string;
  name: string;
  brandId: string;
  year: string;
  engine: string;
  cylinder: number;
  combustion: CombustionType;
  engineType: EngineType;
  files: string[];
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
      validate: {
        validator: function (v: string) {
          const yearNum = parseInt(v, 10);
          return (
            /^\d{4}$/.test(v) &&
            yearNum >= 1886 &&
            yearNum <= new Date().getFullYear()
          );
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid year! Year must be a four-digit number between 1886 and the current year.`,
      },
    },
    engine: {
      type: String,
      required: true,
    },
    cylinder: {
      type: Number,
      required: true,
    },
    combustion: {
      type: String,
      required: true,
      enum: Object.values(CombustionType),
    },
    engineType: {
      type: String,
      required: true,
      enum: Object.values(EngineType),
    },
    files: [
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
