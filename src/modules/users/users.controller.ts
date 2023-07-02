import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createAttendeeDto: CreateUserDto) {
    return this.usersService.create(createAttendeeDto);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }
}
