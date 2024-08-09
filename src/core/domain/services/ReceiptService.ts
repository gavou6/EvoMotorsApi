import { CreateReceiptDTO, UpdateReceiptDTO } from "../../application/dtos";
import {
  IReceiptRepository,
  IReceiptService,
} from "../../application/interfaces";
import { Receipt } from "../entities";

export class ReceiptService implements IReceiptService {
  constructor(private receiptRepository: IReceiptRepository) {}

  async getReceiptById(id: string): Promise<Receipt | null> {
    return this.receiptRepository.findById(id);
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return this.receiptRepository.findAll();
  }

  async createReceipt(dto: CreateReceiptDTO): Promise<Receipt> {
    return this.receiptRepository.save(dto);
  }

  async updateReceipt(
    id: string,
    dto: UpdateReceiptDTO,
  ): Promise<Receipt | null> {
    return this.receiptRepository.update(id, dto);
  }

  async deleteReceipt(id: string): Promise<void> {
    await this.receiptRepository.deleteById(id);
  }
}
