import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Repository, EntityManager } from 'typeorm';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { Users } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AttendeeService', () => {
  const attendee = {
    last_name: '',
    first_name: '',
  };

  let service: UsersService;
  let repositoryMock: MockType<Repository<Users>>;
  let entityManagerMock: MockType<EntityManager>;
  let productsRepository: Repository<Users>;
  -beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        EntityManager,
        {
          provide: EntityManager,
          useValue: { ...repositoryMock, save: jest.fn() },
        },
        {
          provide: UsersService,
          useValue: repositoryMock,
        },
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(Users));
    productsRepository = module.get<Repository<Users>>(
      getRepositoryToken(Users),
    );
    entityManagerMock = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(productsRepository).toBeDefined();
  });
});
