export class Brand {
  public id?: string; // Make `id` optional

  constructor(
    public name: string,
    public description?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this.id) {
      this.id = id;
    }
  }
}
