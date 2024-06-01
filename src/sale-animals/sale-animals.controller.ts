import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SaleAnimalsService } from './sale-animals.service';
import { CreateSaleAnimalDto } from './dto/create-sale-animal.dto';
import { UpdateSaleAnimalDto } from './dto/update-sale-animal.dto';
import { AuthGuard } from '@nestjs/passport';
import { AppLogger } from 'src/common/helpers/app.logger';
import { ErrorFilter } from 'src/common/helpers/errors';

@UseGuards(AuthGuard('jwt'))
@UseFilters(new ErrorFilter(new AppLogger()))
@Controller('sale-animals')
export class SaleAnimalsController {
  constructor(private readonly saleAnimalsService: SaleAnimalsService) {}

  @Post()
  create(@Body() createSaleAnimalDto: CreateSaleAnimalDto, @Request() req) {
    const user = req.user;
    return this.saleAnimalsService.create(createSaleAnimalDto, user);
  }

  @Get()
  findAll() {
    return this.saleAnimalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleAnimalsService.findOne(id);
  }

  @Get('get/list')
  findList(@Body() body) {
    const priceRange = body.priceRange;
    const milkRange = body.milkRange;
    const lactation = body.lactation;

    return this.saleAnimalsService.getAnimalFilter(
      priceRange,
      lactation,
      milkRange,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleAnimalDto: UpdateSaleAnimalDto,
  ) {
    return this.saleAnimalsService.update(+id, updateSaleAnimalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleAnimalsService.remove(+id);
  }
}
