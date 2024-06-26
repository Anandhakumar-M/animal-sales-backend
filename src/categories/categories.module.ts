import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesSchema } from 'src/schemas/categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Categories',
        schema: CategoriesSchema,
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
