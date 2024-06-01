import { Injectable } from '@nestjs/common';
import { CreateSaleAnimalDto } from './dto/create-sale-animal.dto';
import { UpdateSaleAnimalDto } from './dto/update-sale-animal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaleAnimal } from 'src/schemas/sale-animals.schemas';

@Injectable()
export class SaleAnimalsService {
  constructor(
    @InjectModel('SaleAnimal') private readonly saleAnimals: Model<SaleAnimal>,
  ) {}
  async create(createSaleAnimalDto: CreateSaleAnimalDto, user) {
    return await this.saleAnimals.create({
      userId: user.id,
      type: createSaleAnimalDto.type,
      assets: createSaleAnimalDto.assets,
      lactation: createSaleAnimalDto.lactation,
      currentMilk: createSaleAnimalDto.currentMilk,
      maxMilk: createSaleAnimalDto.maxMilk,
      price: createSaleAnimalDto.price,
      isPriceNegotiable: createSaleAnimalDto.isPriceNegotiable,
      details: createSaleAnimalDto.details,
      location: createSaleAnimalDto.lactation,
      qualityVerification: createSaleAnimalDto.qualityVerification,
    });
  }

  async findAll() {
    return await this.saleAnimals.find();
  }

  async findOne(id: string) {
    return this.saleAnimals.findById(id);
  }

  async getAnimalFilter(
    priceRange?: string,
    lactation?: number,
    milkRange?: string,
  ) {
    if (priceRange && lactation && milkRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      const [minMilk, maxMilk] = milkRange.split('-').map(Number);

      const query: any = {
        price: { $gte: minPrice, $lte: maxPrice },
        lactation: lactation,
        currentMilk: { $gte: minMilk, $lte: maxMilk },
      };
      return this.saleAnimals.find(query).exec();
    } else if (priceRange && milkRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      const [minMilk, maxMilk] = milkRange.split('-').map(Number);

      const query: any = {
        price: { $gte: minPrice, $lte: maxPrice },
        currentMilk: { $gte: minMilk, $lte: maxMilk },
      };
      return this.saleAnimals.find(query).exec();
    } else if (priceRange && lactation) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);

      const query: any = {
        price: { $gte: minPrice, $lte: maxPrice },
        lactation: lactation,
      };
      return this.saleAnimals.find(query).exec();
    } else if (milkRange && lactation) {
      const [minMilk, maxMilk] = milkRange.split('-').map(Number);

      const query: any = {
        lactation: lactation,

        currentMilk: { $gte: minMilk, $lte: maxMilk },
      };
      return this.saleAnimals.find(query).exec();
    } else if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);

      const query: any = {
        price: { $gte: minPrice, $lte: maxPrice },
      };
      return this.saleAnimals.find(query).exec();
    } else if (milkRange) {
      const [minMilk, maxMilk] = milkRange.split('-').map(Number);

      const query: any = {
        currentMilk: { $gte: minMilk, $lte: maxMilk },
      };
      return this.saleAnimals.find(query).exec();
    } else if (lactation) {
      const query: any = {
        lactation: lactation,
      };
      return this.saleAnimals.find(query).exec();
    } else {
      return 'Filter Not Match';
    }
  }

  update(id: number, updateSaleAnimalDto: UpdateSaleAnimalDto) {
    return `This action updates a #${id} saleAnimal`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleAnimal`;
  }
}
