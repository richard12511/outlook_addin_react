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
