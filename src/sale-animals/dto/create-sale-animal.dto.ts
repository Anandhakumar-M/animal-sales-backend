import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AssetDto {
  @IsString()
  path: string;

  @IsString()
  type: 'image' | 'video' | 'pdf';

  @IsNumber()
  order: number;
}

export class CreateSaleAnimalDto {
  @IsString()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetDto)
  assets: AssetDto[];

  @IsNumber()
  lactation: number;

  @IsNumber()
  currentMilk: number;

  @IsNumber()
  maxMilk: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  isPriceNegotiable: boolean;

  @IsString()
  details: string;

  @IsString()
  location: string;

  @IsString()
  qualityVerification: string;
}
