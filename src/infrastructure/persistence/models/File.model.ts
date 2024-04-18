import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { FileType } from "../../../shared/enums";

export interface FileDocument extends Document {
  fileUrl: string;
  type: FileType;
}

const fileSchema = new Schema<FileDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    fileUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(FileType),
    },
  },
  {
    timestamps: true,
  },
);

const File = mongoose.model<FileDocument>("File", fileSchema);

export default File;
