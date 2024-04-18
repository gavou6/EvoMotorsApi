import { FileType } from "../../../../shared/enums";

export type CreateFileDTO = {
  fileUrl: string;
  type: FileType;
};
