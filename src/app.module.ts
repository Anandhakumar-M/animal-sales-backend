import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BaseController } from './base/base.controller';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './categories/categories.module';
import { SaleAnimalsModule } from './sale-animals/sale-animals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_URL),
    UserModule,
    AuthModule,
    CategoriesModule,
    SaleAnimalsModule,
  ],
  controllers: [BaseController],
  providers: [],
})
export class AppModule {}
