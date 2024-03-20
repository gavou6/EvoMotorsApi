import { Document } from "mongoose";
import { IBrandRepository } from "../../../application/interfaces/Brand/IBrandRepository";
import { Brand } from "../../../domain/entities/Brand";
import BrandModel, { BrandDocument } from "../models/Brand.model";

interface BrandDoc extends Document, BrandDocument {}

export class BrandRepository implements IBrandRepository {
  async findById(id: string): Promise<Brand | null> {
    const brandDoc = await BrandModel.findById(id).exec();
    if (!brandDoc) return null;
    return this.docToEntity(brandDoc);
  }

  async findAll(): Promise<Brand[]> {
    const brandDocs = await BrandModel.find().exec();
    if (!brandDocs.length) return [];
    return brandDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(brand: Brand): Promise<Brand> {
    const brandDoc = new BrandModel({
      name: brand.name,
      description: brand.description,
    });
    const savedBrandDoc = await brandDoc.save();
    return this.docToEntity(savedBrandDoc);
  }

  async update(id: string, brand: Brand): Promise<Brand> {
    const updatedBrandDoc = await BrandModel.findByIdAndUpdate(
      id,
      {
        name: brand.name,
        description: brand.description,
      },
      { new: true },
    ).exec();
    if (!updatedBrandDoc) throw new Error("Brand not found");
    return this.docToEntity(updatedBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await BrandModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: BrandDoc): Brand {
    return new Brand(doc._id.toString(), doc.name, doc.description);
  }
}
