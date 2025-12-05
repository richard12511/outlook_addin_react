export const generateUniqueId = (): string => {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);

  //convert random bytes to string
  let binaryString = "";
  for (let i = 0; i < randomBytes.length; i++) {
    binaryString += String.fromCharCode(randomBytes[i]);
  }

  return btoa(binaryString)
    .replace(/[/+=]/g, "") // Remove URL-unsafe characters
    .substring(0, 22);
};

export const createUniqueFilename = (originalName: string, uniqueId: string): string => {
  console.log(`Inside createUniqueFilename, originalName: ${originalName}`);

  const lastDotIndex = originalName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return `${originalName}${uniqueId}`;
  }

  const nameWithoutExt = originalName.substring(0, lastDotIndex);
  const truncatedName = nameWithoutExt.substring(0, 50);
  const extension = originalName.substring(lastDotIndex);
  return `${truncatedName}${uniqueId}${extension}`;
};

export const buildAttachmentPath = (filename: string): string => {
  return `\\\\hanatools\\hanadata\\Attachments\\SBOHTRI\\${filename.replace(/[/+=]/g, "")}`;
};
