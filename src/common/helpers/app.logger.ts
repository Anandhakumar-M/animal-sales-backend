import { Module } from '@nestjs/common';
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    //console.info(message);
  }
  info(message: any, ...optionalParams: any[]) {
    // console.info(message);
  }
  error(message: any, ...optionalParams: any[]) {
    // console.error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    // console.warn(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    // console.debug(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    //console.debug(message);
  }
}

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
