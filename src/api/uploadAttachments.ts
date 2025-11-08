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

  const tryUpload = async (url: string) => {
    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: createFormData(),
    });
  };

  const url = `${API_BASE_URL}/OutlookAddin/UploadAttachment`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/UploadAttachment`;

  let response = await tryUpload(url);

  if (!response.ok) {
    console.log("Upload Attachment failed to primary server response object: ", response);
    response = await tryUpload(backupUrl);
  }

  if (!response.ok) {
    throw new Error(`Upload failed on both servers: ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Result of /OutlookAddin/UploadAttachment: ", result);
  const actualFilename = result.cleanedFilename || uniqueFilename;

  return {
    originalName: originalFilename,
    uniqueFilename: actualFilename,
    fullPath: buildAttachmentPath(actualFilename),
  };
};
