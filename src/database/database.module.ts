import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [DatabaseService, LoggerService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
