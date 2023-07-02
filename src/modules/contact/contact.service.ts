import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async getAll(): Promise<ApiResponse<Contact[]>> {
    const result = await this.contactRepository.find();
    return ApiResponse(HttpStatus.OK, 'Data retrieved successfully', result);
  }

}
