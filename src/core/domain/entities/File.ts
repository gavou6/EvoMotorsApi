import { FileType } from "../../../shared/enums";

export class File {
  public id?: string; // Make `id` optional

  constructor(
    public fileUrl: string,
    public type: FileType,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this.id) {
      this.id = id;
    }
  }
}
