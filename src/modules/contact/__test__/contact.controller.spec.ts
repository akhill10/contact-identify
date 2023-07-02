import { Test, TestingModule } from '@nestjs/testing';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { ContactController } from '../contact.controller';
import { ContactService } from '../contact.service';
import { Repository, EntityManager } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiResponse } from '../../../common/config/apiresponse';
import { HttpStatus } from '@nestjs/common';

describe('contactController', () => {
  let controller: ContactController;
  let service: ContactService;
  let repositoryMock: MockType<Repository<Contact>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        ContactService,
        EntityManager,
        {
          provide: ContactService,
          useValue: { ...repositoryMock, getAll: jest.fn() },
        },
        {
          provide: getRepositoryToken(Contact),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);
    repositoryMock = module.get(getRepositoryToken(Contact));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(service).toBeDefined();
  });
});
