export interface FollowUpData {
  createFollowUp: boolean;
  activity: string;
  dueDate: string;
  dueTime: string;
  reminder: boolean;
  reminderValue: string;
  reminderUnit: string;
}

export interface AttachmentsData {
  saveEmailMessage: boolean;
  saveEmailAttachments: boolean;
}

export interface BusinessPartner {
  CardCode: string;
  CardName: string;
  Email: string | null;
  City?: string;
  Country?: string;
}
