import { Controller, Get } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('api/contacts')
export class ContactController {
  constructor(private readonly usersService: ContactService) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }
}
