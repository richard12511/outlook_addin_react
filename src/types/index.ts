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

export interface OutlookActivity {
  CardCode: string;
  Subject: string;
  Body: string;
  ProjectCode: string;
  ShouldCreateFollowUp: boolean;
  ShouldCreateReminder: boolean;
  ShouldSaveMessage: boolean;
  ShouldSaveAttachments: boolean;
  ActivityTypeId: number;
  ActivityTypeName?: string; // Optional since it's not always needed
  FollowUpStartDate: string;
  FollowUpEndDate: string;
  ReminderDate: string;
  ReminderTime: number; // Time as HHMM (like 1605 for 4:05 PM)
  ReminderType: string; // "M" for Minutes, "H" for Hours, "D" for Days
  ReminderQuantity: number;
}

export interface CreateActivityResponse {
  didSave: boolean;
  didFollowUpSave: boolean;
}
