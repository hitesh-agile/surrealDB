import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database/database.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [DatabaseService, LoggerService, AuthService, JwtService],
  exports: [DatabaseService, LoggerService, AuthService, JwtService],
})
export class ShareModule {}
