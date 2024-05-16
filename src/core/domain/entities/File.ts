import { CarModel } from ".";
import { FileType } from "../../../shared/enums";

export class File {
  constructor(
    public fileUrl: string,
    public type: FileType,
    public carModelId: CarModel | string,
    public _id?: string,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
