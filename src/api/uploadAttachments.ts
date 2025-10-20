import { createUniqueFilename, buildAttachmentPath } from "../util/fileUtils";
import { PASSWORD, USERNAME, API_BASE_URL, API_BACKUP_URL } from "./apiConstants";

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

  const createFormData = () => {
    const formData = new FormData();
    formData.append("file", new Blob([fileData]), uniqueFilename);
    formData.append("originalName", originalFilename);
    return formData;
  };

  const formData = new FormData();
  formData.append("file", new Blob([fileData]), uniqueFilename);
  formData.append("originalName", originalFilename);

  const url = `${API_BASE_URL}/OutlookAddin/UploadAttachment`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/UploadAttachment`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    body: createFormData(),
  });

  if (!response.ok) {
    console.log("Upload Attachment failed response object: ", response);
    const retry = await fetch(backupUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: createFormData(),
    });

    if (!retry.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await retry.json();
    const actualFilename = result.cleanedFilename || uniqueFilename;

    return {
      originalName: originalFilename,
      uniqueFilename: actualFilename,
      fullPath: buildAttachmentPath(actualFilename),
    };
  }

  const result = await response.json();
  const actualFilename = result.cleanedFilename || uniqueFilename;

  return {
    originalName: originalFilename,
    uniqueFilename: actualFilename,
    fullPath: buildAttachmentPath(actualFilename),
  };
};
