export class Platform {
  constructor(
    public name: string,
    public description?: string,
    public _id?: string,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
