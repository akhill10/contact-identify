import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  statusCode: HttpStatus;
  message: string;
  data?: T;
}

export const ApiResponse = <T>(
  statusCode: HttpStatus,
  message: string,
  data?: T,
) => {
  return { statusCode, message, data };
};
