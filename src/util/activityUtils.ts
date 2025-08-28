import { FollowUpData, AttachmentsData, OutlookActivity } from "../types";

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

//Convert time string (HH:MM) to integer(HHMM)
export const timeStringToInteger = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":");
  return parseInt(hours) * 100 + parseInt(minutes);
};

//Calculate reminder date based on due date, reminder quanitty, and type
export const calculateReminderDate = (
  dueDate: string,
  reminderQuantity: number,
  reminderType: string
): string => {
  const due = new Date(dueDate);

  switch (reminderType.toLowerCase()) {
    case "minutes":
      due.setMinutes(due.getMinutes() - reminderQuantity);
      break;
    case "hours":
      due.setHours(due.getHours() - reminderQuantity);
      break;
    case "days":
      due.setDate(due.getDate() - reminderQuantity);
      break;
  }

  const dateStr = due.toISOString().split("T")[0];
  return dateStr;
};

// Build OutlookActivity object from form data
export const buildOutlookActivity = (
  subject: string,
  _selectedCategory: string, //TODO
  selectedBP: { cardCode: string; projectCode: string } | null,
  followUpData: FollowUpData,
  attachmentsData: AttachmentsData,
  emailBody?: string,
  attachmentPaths?: string
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
    ActivityTypeId: ACTIVITY_TYPE_MAP[followUpData.activity] || ACTIVITY_TYPE_MAP["other"],
    ActivityTypeName: followUpData.activity,
    FollowUpStartDate: followUpData.dueDate,
    FollowUpEndDate: followUpEndDate,
    ReminderDate: reminderDate,
    ReminderTime: timeStringToInteger(followUpData.dueTime),
    ReminderType: REMINDER_TYPE_MAP[followUpData.reminderUnit] || "M",
    ReminderQuantity: parseInt(followUpData.reminderValue) || 15,
  };
};
