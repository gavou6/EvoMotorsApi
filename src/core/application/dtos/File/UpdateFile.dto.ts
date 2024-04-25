import { FileType } from "../../../../shared/enums";

export type UpdateFileDTO = {
  fileUrl?: string;
  type?: FileType;
  carModelId?: string;
};
