import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(
    createUserDto: CreateUserDto,
    OTP: string,
    otp: String,
  ): Promise<any> {
    const checkMobile = await this.userModel.findOne({
      mobile: createUserDto.mobile,
    });
    if (checkMobile) {
      throw new NotFoundException('This number is already taken');
    }
    if (createUserDto.email) {
      const checkEmail = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (checkEmail) {
        throw new NotFoundException('This Mail is already taken');
      }
    }
    const createUser = await this.userModel.create({
      name: createUserDto.name,
      mobile: createUserDto.mobile,
      email: createUserDto.email,
      password: createUserDto.password,
      language: createUserDto.language,
      location: createUserDto.location,
      image: createUserDto.image,
      mobileVerificationToken: OTP,
      emailVerificationToken: otp,
    });

    const { _id, name, email, mobile } = createUser;

    return { _id, name, email, mobile };
  }

  async findAll(query: Query): Promise<any> {
    const resPerPage = 1000;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const users = await this.userModel.find().limit(resPerPage).skip(skip);

    return users;
  }

  async findId(id: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid user ID format');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findUser(id: string, mobile: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid user ID format');
    }

    const user = await this.userModel.findOne({ id, mobile });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findOne(mobile: string): Promise<User> {
    return await this.userModel.findOne({ mobile });
  }

  async findEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid user ID format');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.updatedAt = Date.now();
    await user.save();

    const updatedUser = await this.userModel.findOneAndUpdate({
      id,
      updateUserDto,
    });

    const { _id, name, email, mobile } = updatedUser;
    return { _id, name, email, mobile };
  }

  async deleteById(id: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid user ID format');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.userModel.findByIdAndDelete(id);
    return 'Delete Successfully';
  }
}
