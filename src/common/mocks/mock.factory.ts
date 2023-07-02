import { Repository } from 'typeorm';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    create: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    update: jest.fn(),
    findAndCount: jest.fn((val) => val),
    createQueryBuilder: jest.fn((entity) => entity),
    remove: jest.fn(),
    delete: jest.fn(),
  }),
);
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
