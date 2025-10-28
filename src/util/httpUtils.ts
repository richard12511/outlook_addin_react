export const tryPOST = async (url: string, credentials: string, body: string) => {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: body,
  });
};
