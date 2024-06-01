import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from 'src/schemas/categories.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categories')
    private readonly categoriesModel: Model<Categories>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoriesModel.find();
  }

  findOne(id: string) {
    return this.categoriesModel.findById(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
