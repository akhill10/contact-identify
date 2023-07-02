import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class IdentifyContactDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
