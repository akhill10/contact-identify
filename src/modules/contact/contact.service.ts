import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { Contact, ContactLinkPrecedence } from './entities/contact.entity';
import { IdentifyContactDto } from './dto/identify-contact.dto';
import { FindOneOptions } from 'typeorm';
import { IdentifyContactResponse } from './ro/identify-contact.ro';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async getAll(): Promise<ApiResponse<Contact[]>> {
    const result = await this.contactRepository.find();
    return ApiResponse('Data retrieved successfully', result);
  }

  async identify(dto: IdentifyContactDto) {
    const primaryContacts = await this.getContactsByCriteria({
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        linkPrecedence: true,
        linkedContacts: {
          id: true,
          email: true,
          phoneNumber: true,
          linkPrecedence: true,
        },
      },
      where: [
        {
          phoneNumber: dto.phoneNumber,
          linkPrecedence: ContactLinkPrecedence.PRIMARY,
        },
        {
          email: dto.email,
          linkPrecedence: ContactLinkPrecedence.PRIMARY,
        },
      ],
      order: {
        createdAt: 'ASC',
        linkedContacts: {
          createdAt: 'ASC',
        },
      },
    });

    // Create new contact as primary if there are no contacts in database.
    if (!primaryContacts.length) {
      const contact = await this.createContact({
        ...dto,
        linkPrecedence: ContactLinkPrecedence.PRIMARY,
      });
      return this.prepareIdentifyContactResponse([contact]);
    }

    /**
     * Create secondary contact if there is only one primary contact.
     */
    if (primaryContacts.length === 1) {
      const primaryContact = primaryContacts[0];
      if (
        (primaryContact.email === dto.email &&
          primaryContact.phoneNumber !== dto.phoneNumber) ||
        (primaryContact.email !== dto.email &&
          primaryContact.phoneNumber === dto.phoneNumber)
      ) {
        // create secondary contact.
        const secondaryContact = await this.createContact({
          ...dto,
          linkPrecedence: ContactLinkPrecedence.SECONDARY,
          linked: primaryContact,
        });

        const orderedContacts = [primaryContact];

        if (primaryContacts[0]?.linkedContacts?.length) 
          orderedContacts.push(...primaryContacts[0]?.linkedContacts)

        orderedContacts.push(secondaryContact);
        return this.prepareIdentifyContactResponse(orderedContacts);
      }
      else {
        const orderedContacts = [primaryContact];

        if (primaryContacts[0]?.linkedContacts?.length) 
          orderedContacts.push(...primaryContacts[0]?.linkedContacts);
        
        return this.prepareIdentifyContactResponse(orderedContacts);
      }
    } else {
      // convert newest primary contact into secondary.
      const newSecondaryContact = primaryContacts.pop();
      newSecondaryContact.linkPrecedence = ContactLinkPrecedence.SECONDARY;
      newSecondaryContact.linked = primaryContacts[0];

      // update in database
      await this.contactRepository.update(
        {
          id: newSecondaryContact.id,
        },
        newSecondaryContact,
      );

      const orderedContacts = [primaryContacts[0]];

      if (primaryContacts[0]?.linkedContacts?.length) 
        orderedContacts.push(...primaryContacts[0]?.linkedContacts)

      orderedContacts.push(newSecondaryContact);
      return this.prepareIdentifyContactResponse(orderedContacts);
    }
  }

  private async getContactsByCriteria(
    criteria: FindOneOptions<Contact>,
  ): Promise<Contact[]> {
    return this.contactRepository.find(criteria);
  }

  private async createContact(contact: Partial<Contact>): Promise<Contact> {
    if (!contact.email && !contact.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber is required');
    }
    return this.contactRepository.save(contact);
  }

  private prepareIdentifyContactResponse(
    orderedContacts: Contact[],
  ): ApiResponse<IdentifyContactResponse> {
    return ApiResponse('Contact identify sucessfull', {
      contact: {
        primaryContactId: orderedContacts[0].id,
        emails: [
          ...new Set(
            orderedContacts
              .map((contact) => contact.email)
              .filter((value) => value),
          ),
        ],
        phoneNumbers: [
          ...new Set(
            orderedContacts
              .map((contact) => contact.phoneNumber)
              .filter((value) => value),
          ),
        ],
        secondaryContactIds: orderedContacts
          .slice(1)
          .map((contact) => contact.id)
          .filter((value) => value),
      },
    });
  }
}
