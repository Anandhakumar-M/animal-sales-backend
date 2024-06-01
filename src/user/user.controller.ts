import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AppLogger } from 'src/common/helpers/app.logger';
import { ErrorFilter } from 'src/common/helpers/errors';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@UseFilters(new ErrorFilter(new AppLogger()))
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: ExpressQuery): Promise<any> {
    return this.usersService.findAll(query);
  }

  @Patch('/:id')
  updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateById(id, updateUserDto);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
