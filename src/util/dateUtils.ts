export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};
