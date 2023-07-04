import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { IdentifyContactResponse } from './ro/identify-contact.ro';
import { IdentifyContactDto } from './dto/identify-contact.dto';
import { ApiResponse } from 'src/common/config/apiresponse';

@Controller('api/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @HttpCode(200)
  getAll() {
    return this.contactService.getAll();
  }

  @Post('/identify')
  @HttpCode(200)
  identify(
    @Body() dto: IdentifyContactDto,
  ): Promise<ApiResponse<IdentifyContactResponse>> {
    return this.contactService.identify(dto);
  }
}
