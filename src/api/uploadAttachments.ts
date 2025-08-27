import { createUniqueFilename, buildAttachmentPath } from "../util/fileUtils";
import { PASSWORD, USERNAME, API_BASE_URL } from "./apiConstants";

export interface UploadedFile {
  originalName: string;
  uniqueFilename: string;
  fullPath: string;
}

export const uploadFile = async (
  fileData: ArrayBuffer,
  originalFilename: string,
  uniqueId: string
): Promise<UploadedFile> => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  const uniqueFilename = createUniqueFilename(originalFilename, uniqueId);

  const formData = new FormData();
  formData.append("file", new Blob([fileData]), uniqueFilename);
  formData.append("originalName", originalFilename);

  const response = await fetch(`${API_BASE_URL}/OutlookAddin/UploadAttachment`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return {
    originalName: originalFilename,
    uniqueFilename,
    fullPath: buildAttachmentPath(uniqueFilename),
  };
};
