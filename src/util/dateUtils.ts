export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

export const getDefaultDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

//Convert time string (HH:MM) to integer(HHMM)
export const timeStringToInteger = (timeString: string): number => {
  if (!timeString || typeof timeString !== "string") {
    return 0; //default to midnight
  }

  const parts = timeString.split(":");
  if (parts.length != 2) {
    return 0;
  }

  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);

  if (isNaN(hours) || isNaN(minutes)) {
    return 0;
  }

  return hours * 100 + minutes;
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
