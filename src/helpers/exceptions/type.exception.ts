import { HttpException, HttpStatus } from '@nestjs/common';

export const TypeExceptions = {
  UserNotFound(msg): any {
    return new HttpException(
      {
        message: 'User not found',
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  UserAlreadyExists(): any {
    return new HttpException(
      {
        message: 'User already exists',
        error: 'UserAlreadyExists',
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  },

  InvalidFile(): any {
    return new HttpException(
      {
        message: 'Uploaded file is invalid',
        error: 'InvalidFile',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  /*Common error msg throw function*/
  NotFoundCommMsg(msg) {
    return new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: msg,
        data: {},
      },
      HttpStatus.NOT_FOUND,
    );
  },

  BadReqCommMsg(msg) {
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: msg,
        data: {},
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  InvalidIdPassword(): HttpException {
    return new HttpException(
      {
        message: 'Invalid Username or Password',
        error: 'InvalidIdPassword',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  InvalidIdCurrentPassword(): HttpException {
    return new HttpException(
      {
        message: 'Invalid current password',
        error: 'InvalidIdPassword',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  Unauthorized(message) {
    return new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: message,
        data: {},
      },
      HttpStatus.UNAUTHORIZED,
    );
  },

  AlreadyExistsCommon(msg): any {
    return new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: msg,
        data: {},
      },
      HttpStatus.CONFLICT,
    );
  },
};
