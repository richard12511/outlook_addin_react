import { getEmailAttachments, getAttachmentContent, getEmailMsgContent } from "./emailUtils";
import { uploadFile } from "../api/uploadAttachments";
import { generateUniqueId, createUniqueFilename, buildAttachmentPath } from "./fileUtils";

export const processAttachments = async (
  subject: string,
  saveEmailMessage: boolean,
  saveEmailAttachments: boolean
): Promise<string> => {
  const uploadedPaths: string[] = [];

  try {
    if (saveEmailMessage) {
      const uniqueId = generateUniqueId();
      const emailContent = await getEmailMsgContent();

      const uploadedMsg = await uploadFile(emailContent, `${subject}.msg`, uniqueId);
      uploadedPaths.push(uploadedMsg.fullPath);
    }

    if (saveEmailAttachments) {
      const attachments = await getEmailAttachments();

      for (const attachment of attachments) {
        const uniqueId = generateUniqueId();
        const attachmentContent = await getAttachmentContent(attachment.id);

        const uploadedFile = await uploadFile(attachmentContent, attachment.name, uniqueId);
        uploadedPaths.push(uploadedFile.fullPath);
      }
    }

    return uploadedPaths.join(";");
  } catch (error) {
    console.error("Error processing attachments: ", error);
    throw error;
  }
};
