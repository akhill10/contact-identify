class IdentifyContact {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export class IdentifyContactResponse {
  contact: IdentifyContact;
}
