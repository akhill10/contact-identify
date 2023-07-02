import { Test, TestingModule } from '@nestjs/testing';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Repository, EntityManager } from 'typeorm';
import { Users } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiResponse } from '../../../common/config/apiresponse';
import { HttpStatus } from '@nestjs/common';

describe('AttendeeController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repositoryMock: MockType<Repository<Users>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        EntityManager,
        {
          provide: UsersService,
          useValue: { ...repositoryMock, getAll: jest.fn() },
        },
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(service).toBeDefined();
  });
});
