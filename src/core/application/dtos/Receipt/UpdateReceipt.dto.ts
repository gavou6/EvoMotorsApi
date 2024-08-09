export type UpdateReceiptDTO = {
  _id?: string;
  userId?: string;
  productId?: string[];
  installationTime?: Date;
  reviewVehicleStart?: number;
  reviewVehicleResponse?: number;
  reviewFunctionality?: number;
  reviewService?: number;
  reviewTime?: number;
  reviewRecommendation?: number;
  discount?: string;
  date?: Date;
  finalPrice?: number;
  arriveTime?: Date;
};
