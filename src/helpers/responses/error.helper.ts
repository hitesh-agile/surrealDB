import { HttpStatus } from '@nestjs/common';

export function errorResponse(
  status: HttpStatus.BAD_REQUEST,
  message: string,
  data: any,
) {
  return { status, message, data };
}
