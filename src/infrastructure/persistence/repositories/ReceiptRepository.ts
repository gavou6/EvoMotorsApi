import { Document } from "mongoose";
import ReceiptModel, { ReceiptDocument } from "../models/Receipt.model";
import { IReceiptRepository } from "../../../core/application/interfaces/Receipt/IReceiptRepository";
import { Receipt } from "../../../core/domain/entities";
import {
  CreateReceiptDTO,
  UpdateReceiptDTO,
} from "../../../core/application/dtos";

interface ReceiptDoc extends Document, ReceiptDocument {}

export class ReceiptRepository implements IReceiptRepository {
  async findById(id: string): Promise<Receipt | null> {
    const receiptDoc = await ReceiptModel.findById(id).exec();
    if (!receiptDoc) return null;
    return this.docToEntity(receiptDoc);
  }

  async findAll(): Promise<Receipt[]> {
    const receiptDocs = await ReceiptModel.find().exec();
    if (!receiptDocs.length) return [];
    return receiptDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Receipt
  }

  async save(dto: CreateReceiptDTO): Promise<Receipt> {
    const receiptDoc = new ReceiptModel(dto);
    const savedReceiptDoc = await receiptDoc.save();
    return this.docToEntity(savedReceiptDoc);
  }

  async update(id: string, dto: UpdateReceiptDTO): Promise<Receipt> {
    const updatedReceiptDoc = await ReceiptModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedReceiptDoc) throw new Error("Receipt not found");
    return this.docToEntity(updatedReceiptDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ReceiptModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ReceiptDoc): Receipt {
    //const receipt = new Receipt(doc.name, doc.description, doc._id.toString());
    const receipt = new Receipt(
      doc._id,
      doc.userId,
      doc.productId,
      doc.installationTime,
      doc.reviewVehicleStart,
      doc.reviewVehicleResponse,
      doc.reviewFunctionality,
      doc.reviewService,
      doc.reviewTime,
      doc.reviewRecommendation,
      doc.discount,
      doc.date,
      doc.finalPrice,
      doc.arriveTime,
      );
    return receipt;
  }
}
