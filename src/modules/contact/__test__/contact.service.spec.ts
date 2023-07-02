import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from '../contact.service';
import { Repository, EntityManager } from 'typeorm';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { Contact } from '../entities/contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('contactService', () => {

  let service: ContactService;
  let repositoryMock: MockType<Repository<Contact>>;
  let entityManagerMock: MockType<EntityManager>;
  let productsRepository: Repository<Contact>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        EntityManager,
        {
          provide: EntityManager,
          useValue: { ...repositoryMock, save: jest.fn() },
        },
        {
          provide: ContactService,
          useValue: repositoryMock,
        },
        ContactService,
        {
          provide: getRepositoryToken(Contact),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    repositoryMock = module.get(getRepositoryToken(Contact));
    productsRepository = module.get<Repository<Contact>>(
      getRepositoryToken(Contact),
    );
    entityManagerMock = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(productsRepository).toBeDefined();
  });
});
