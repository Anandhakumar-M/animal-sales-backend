import { Module } from '@nestjs/common';
import { SaleAnimalsService } from './sale-animals.service';
import { SaleAnimalsController } from './sale-animals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleAnimalSchema } from 'src/schemas/sale-animals.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SaleAnimal', schema: SaleAnimalSchema },
    ]),
  ],
  controllers: [SaleAnimalsController],
  providers: [SaleAnimalsService],
})
export class SaleAnimalsModule {}
