import { FollowUpData, AttachmentsData, OutlookActivity } from "../types";
import { calculateReminderDate, timeStringToInteger } from "./dateUtils";
import { extractInvoiceNumber, shouldLinkInvoice } from "./invoiceUtils";

const ACTIVITY_TYPE_MAP: Record<string, number> = {
  conversation: 1,
  meeting: 2,
  task: 3,
  other: 4,
  note: 5,
};

const REMINDER_TYPE_MAP: Record<string, string> = {
  minutes: "M",
  hours: "H",
  days: "D",
};

// Build OutlookActivity object from form data
export const buildOutlookActivity = (
  subject: string,
  selectedCategory: string,
  selectedBP: { cardCode: string; projectCode: string } | null,
  followUpData: FollowUpData,
  attachmentsData: AttachmentsData,
  emailBody?: string,
  attachmentPaths?: string,
  outlookUser?: string
): OutlookActivity => {
  if (!selectedBP) {
    throw new Error("No business partner selected");
  }

  // THIS MIGHT NEED TO CHANGE! REMEMBER TO CHECK HOW IT'S DONE IN CURRENT ADDIN
  // Calculate follow-up end date (for now, same as start date, I may want to make this configurable(not sure if it is currently))
  const followUpEndDate = followUpData.dueDate;

  // Calculate reminder date if reminder is enabled
  const reminderDate = followUpData.reminder
    ? calculateReminderDate(
        followUpData.dueDate,
        parseInt(followUpData.reminderValue),
        followUpData.reminderUnit
      )
    : followUpData.dueDate;

  //Check if subject contains an invoice pattern
  const invoiceNum = extractInvoiceNumber(subject);
  const linkInvoice = shouldLinkInvoice(subject);

  console.log("inside buildActivity inside activityUtils.ts, invoiceNum = ", invoiceNum);

  return {
    CardCode: selectedBP.cardCode,
    Subject: subject,
    Body: emailBody || `Email saved from Outlook Add-in\nSubject: ${subject}`,
    ProjectCode: selectedBP.projectCode || "",
    ShouldCreateFollowUp: followUpData.createFollowUp,
    ShouldCreateReminder: followUpData.createFollowUp && followUpData.reminder,
    ShouldSaveMessage: attachmentsData.saveEmailMessage,
    ShouldSaveAttachments: attachmentsData.saveEmailAttachments,
    AttachmentPaths: attachmentPaths,
    // ActivityTypeId: ACTIVITY_TYPE_MAP[followUpData.activity] || ACTIVITY_TYPE_MAP["other"],
    ActivityTypeId: parseInt(selectedCategory) || -1,
    ActivityTypeName: followUpData.activity,
    FollowUpStartDate: followUpData.dueDate,
    FollowUpEndDate: followUpEndDate,
    ReminderDate: reminderDate,
    ReminderTime: timeStringToInteger(followUpData.dueTime),
    ReminderType: REMINDER_TYPE_MAP[followUpData.reminderUnit] || "M",
    ReminderQuantity: parseInt(followUpData.reminderValue) || 15,
    OutlookUser: outlookUser || "",
    ShouldLinkInvoice: linkInvoice,
    InvoiceNumber: invoiceNum || undefined,
  };
};
