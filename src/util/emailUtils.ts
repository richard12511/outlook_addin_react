export const getEmailAttachments = async (): Promise<Office.AttachmentDetails[]> => {
  return new Promise((resolve, _reject) => {
    //Update to handle reject better
    const item = Office.context.mailbox.item;
    if (!item || !item.attachments) {
      resolve([]);
      return;
    }

    // Get attachment details
    resolve(item.attachments);
  });
};

export const getAttachmentContent = async (attachmentId: string): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item;
    if (!item) {
      reject(new Error("No email item available"));
      return;
    }

    item.getAttachmentContentAsync(attachmentId, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const base64String = result.value.content;
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        resolve(bytes.buffer);
      } else {
        reject(new Error(result.error?.message || "Failed to get attachment content"));
      }
    });
  });
};

// Get email as .msg file content
export const getEmailMsgContent = async (): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item;
    if (!item) {
      reject(new Error("No email item available"));
      return;
    }

    // to get a more complex representation of the email we might need to use EWS or Graph API
    // this is just a simple representation for now - richard.schmidt
    item.body.getAsync(Office.CoercionType.Html, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const msgContent = `Subject: ${item.subject}\nBody: ${result.value}`;
        const encoder = new TextEncoder();
        resolve(encoder.encode(msgContent).buffer);
      } else {
        reject(new Error("Failed to get email content"));
      }
    });
  });
};
