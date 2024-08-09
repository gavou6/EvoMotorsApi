import { Receipt } from "../../../domain/entities";
import { CreateReceiptDTO, UpdateReceiptDTO } from "../../dtos/Receipt";

export interface IReceiptService {
  createReceipt(dto: CreateReceiptDTO): Promise<Receipt>;
  getReceiptById(id: string): Promise<Receipt | null>;
  getAllReceipts(): Promise<Receipt[]>;
  updateReceipt(id: string, dto: UpdateReceiptDTO): Promise<Receipt | null>;
  deleteReceipt(id: string): Promise<void>;
}
