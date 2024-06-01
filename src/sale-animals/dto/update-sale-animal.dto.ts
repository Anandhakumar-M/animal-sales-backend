import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleAnimalDto } from './create-sale-animal.dto';

export class UpdateSaleAnimalDto extends PartialType(CreateSaleAnimalDto) {}
