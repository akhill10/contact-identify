import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private attendeeRepository: Repository<Users>,
  ) {}

  async getAll(): Promise<ApiResponse<Users[]>> {
    const result = await this.attendeeRepository.find();
    return ApiResponse(HttpStatus.OK, 'Data retrieved successfully', result);
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<Users[]>> {
    try {
      this.attendeeRepository.save(createUserDto);
      return ApiResponse(HttpStatus.CREATED, 'User created successfully');
    } catch (error) {
      return ApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating user',
      );
    }
  }
}
