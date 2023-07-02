import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from '../contact.service';
import { Repository, EntityManager } from 'typeorm';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { Contact, ContactLinkPrecedence } from '../entities/contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/config/apiresponse';
import { IdentifyContactResponse } from '../ro/identify-contact.ro';
import { HttpStatus } from '@nestjs/common';

describe('contactService', () => {
  let service: ContactService;
  let repositoryMock: MockType<Repository<Contact>>;
  let entityManagerMock: MockType<EntityManager>;
  let contactsRepository: Repository<Contact>;
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
    contactsRepository = module.get<Repository<Contact>>(
      getRepositoryToken(Contact),
    );
    entityManagerMock = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(contactsRepository).toBeDefined();
  });

  it('should create primary contact if not exists', async () => {
    repositoryMock.find.mockReturnValue([]);

    const contact: Contact = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: null,
      linked: null,
      linkPrecedence: ContactLinkPrecedence.PRIMARY,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repositoryMock.save.mockReturnValue(contact);

    const identify = await service.identify({ email: 'test@test.com' });

    const expectedValue: ApiResponse<IdentifyContactResponse> = {
      statusCode: HttpStatus.OK,
      message: 'Contact identify sucessfully',
      data: {
        contact: {
          primaryContactId: contact.id,
          emails: [contact.email],
          phoneNumbers: [],
          secondaryContactIds: [],
        },
      },
    };

    expect(identify).toEqual(expectedValue);
  });

  it('should create secondary contact who has different phoneNumber than primary contact', async () => {
    const primaryContact: Contact = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: null,
      linked: null,
      linkPrecedence: ContactLinkPrecedence.PRIMARY,
      linkedContacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repositoryMock.find.mockReturnValue([primaryContact]);

    const newContact: Contact = {
      id: 2,
      email: 'test@test.com',
      phoneNumber: '+918888888888',
      linked: primaryContact,
      linkPrecedence: ContactLinkPrecedence.SECONDARY,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.save.mockReturnValue(newContact);

    const identify = await service.identify({
      email: 'test@test.com',
      phoneNumber: newContact.phoneNumber,
    });

    const expectedValue: ApiResponse<IdentifyContactResponse> = {
      statusCode: HttpStatus.OK,
      message: 'Contact identify sucessfully',
      data: {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [primaryContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: [newContact.id],
        },
      },
    };
    expect(identify).toEqual(expectedValue);
  });

  it('should create secondary contact who has different email than primary contact', async () => {
    const primaryContact: Contact = {
      id: 1,
      email: 'test@test.com',
      phoneNumber: '+918888888888',
      linked: null,
      linkPrecedence: ContactLinkPrecedence.PRIMARY,
      linkedContacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repositoryMock.find.mockReturnValue([primaryContact]);

    const newContact: Contact = {
      id: 2,
      email: 'test2@test.com',
      phoneNumber: '+918888888888',
      linked: primaryContact,
      linkPrecedence: ContactLinkPrecedence.SECONDARY,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.save.mockReturnValue(newContact);

    const identify = await service.identify({
      email: 'test2@test.com',
      phoneNumber: newContact.phoneNumber,
    });

    const expectedValue: ApiResponse<IdentifyContactResponse> = {
      statusCode: HttpStatus.OK,
      message: 'Contact identify sucessfully',
      data: {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [primaryContact.email, newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: [newContact.id],
        },
      },
    };
    expect(identify).toEqual(expectedValue);
  });

  it('should convert primary contact into secondary contact', async () => {
    const primaryContacts: Contact[] = [
      {
        id: 1,
        email: 'george@hillvalley.edu',
        phoneNumber: '+919191',
        linked: null,
        linkPrecedence: ContactLinkPrecedence.PRIMARY,
        linkedContacts: [],
        createdAt: new Date('2023-04-11 00:00:00.374+00 '),
        updatedAt: new Date('2023-04-11 00:00:00.374+00 '),
      },
      {
        id: 2,
        email: 'biffsucks@hillvalley.edu',
        phoneNumber: '+717171',
        linked: null,
        linkPrecedence: ContactLinkPrecedence.PRIMARY,
        linkedContacts: [],
        createdAt: new Date('2023-04-21 05:30:00.11+00'),
        updatedAt: new Date('2023-04-21 05:30:00.11+00'),
      },
    ];

    repositoryMock.find.mockReturnValue(primaryContacts);

    const updatedContact = {
      id: 2,
      email: 'biffsucks@hillvalley.edu',
      phoneNumber: '+717171',
      linked: primaryContacts[0],
      linkPrecedence: ContactLinkPrecedence.SECONDARY,
      linkedContacts: [],
      createdAt: new Date('2023-04-21 05:30:00.11+00'),
      updatedAt: new Date('2023-04-21 05:30:00.11+00'),
    };

    repositoryMock.update.mockReturnValue(updatedContact);

    const identify = await service.identify({
      email: 'george@hillvalley.edu',
      phoneNumber: '717171',
    });

    const expectedValue: ApiResponse<IdentifyContactResponse> = {
      statusCode: HttpStatus.OK,
      message: 'Contact identify sucessfully',
      data: {
        contact: {
          primaryContactId: primaryContacts[0].id,
          emails: [primaryContacts[0].email, updatedContact.email],
          phoneNumbers: [
            primaryContacts[0].phoneNumber,
            updatedContact.phoneNumber,
          ],
          secondaryContactIds: [updatedContact.id],
        },
      },
    };
    expect(identify).toEqual(expectedValue);
  });
});
