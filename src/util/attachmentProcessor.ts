import { getEmailAttachments, getAttachmentContent, getEmailMsgContent } from "./emailUtils";
import { uploadFile } from "../api/uploadAttachments";
import { generateUniqueId, createUniqueFilename, buildAttachmentPath } from "./fileUtils";

export const processAttachments = async (
  subject: string,
  saveEmailMessage: boolean,
  saveEmailAttachments: boolean
): Promise<string> => {
  const uploadedPaths: string[] = [];
  console.log("Processing attachments");
  try {
    if (saveEmailMessage) {
      const uniqueId = generateUniqueId();
      const emailContent = await getEmailMsgContent();

      const uploadedMsg = await uploadFile(emailContent, `${subject}.msg`, uniqueId);
      uploadedPaths.push(uploadedMsg.fullPath);
      console.log("uploadedPaths: ", uploadedPaths);
    }

    if (saveEmailAttachments) {
      const attachments = await getEmailAttachments();
      console.log("Saving email attachments, attachments: ", attachments);

      for (const attachment of attachments) {
        console.log("Processing attachment: ", attachment);
        const uniqueId = generateUniqueId();
        const { content: attachmentContent, format } = await getAttachmentContent(attachment.id);
        console.log(`format: ${format}, attachmentContent: ${attachmentContent}`);

        let filename = attachment.name;
        if (format === "eml") {
          filename = `${filename}.eml`;
        }

        const uploadedFile = await uploadFile(attachmentContent, filename, uniqueId);
        console.log("File uploaded, uploadedFile: ", uploadedFile);
        uploadedPaths.push(uploadedFile.fullPath);
        console.log("uploadedPaths: ", uploadedPaths);
      }
    }

    return uploadedPaths.join(";");
  } catch (error) {
    console.error("Error processing attachments: ", error);
    throw error;
  }
};
