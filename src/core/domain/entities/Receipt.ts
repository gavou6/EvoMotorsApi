export class Receipt {
  constructor(
    public _id: string,
    public userId: string,
    public productId: string[],
    public installationTime: Date,
    public reviewVehicleStart: number,
    public reviewVehicleResponse: number,
    public reviewFunctionality: number,
    public reviewService: number,
    public reviewTime: number,
    public reviewRecommendation: number,
    public discount: string,
    public date: Date,
    public finalPrice: number,
    public arriveTime: Date,
    ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
