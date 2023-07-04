import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export const ApiResponse = <T>(
  message: string,
  data?: T,
) => {
  return { message, data };
};
