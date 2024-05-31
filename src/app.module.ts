import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import AppConfiguration from './config/app.config';
import DatabaseConfiguration from './config/database.config';
import AuthConfiguration from './config/auth.config';
import { LoggerModule } from './logger/logger.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './exceptions/http-exception.filter';
import { QuestionModule } from './question/question.module';
import { GameModule } from './game/game.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, AuthConfiguration],
      ignoreEnvFile: false,
      isGlobal: true,
      envFilePath: `.env.${process.env.APP_ENV}`,
    }),
    DatabaseModule,
    LoggerModule,
    QuestionModule,
    GameModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
