import { unescape } from "querystring";

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

export const getAttachmentContent = (
  attachmentId: string
): Promise<{ content: ArrayBuffer; format: string }> => {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item;
    if (!item) {
      reject(new Error("No email item available"));
      return;
    }

    item.getAttachmentContentAsync(attachmentId, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        try {
          const format = result.value.format;
          const content = result.value.content;
          console.log("format: ", format);

          let arrayBuffer: ArrayBuffer;

          switch (format) {
            case "base64":
            case Office.MailboxEnums?.AttachmentContentFormat?.Base64:
              console.log("result.value.content: ", result.value.content);
              const base64String = result.value.content;
              const binaryString = atob(base64String);
              console.log("binaryString: ", binaryString);
              const bytes = new Uint8Array(binaryString.length);

              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }

              arrayBuffer = bytes.buffer;
              resolve({ content: arrayBuffer, format: format });
              return;

            case "eml":
            case Office.MailboxEnums?.AttachmentContentFormat?.Eml:
              const encoder = new TextEncoder();
              arrayBuffer = encoder.encode(content).buffer;
              resolve({ content: arrayBuffer, format: format });
              return;

            case "url":
            case Office.MailboxEnums?.AttachmentContentFormat?.Url:
              fetch(content)
                .then((r) => r.arrayBuffer())
                .then((arrayBuffer) => resolve({ content: arrayBuffer, format: format }))
                .catch(reject);
              return;
            default:
              const textEncoder = new TextEncoder();
              arrayBuffer = textEncoder.encode(content).buffer;
              resolve({ content: arrayBuffer, format: format });
          }
        } catch (error) {
          reject(
            new Error(
              `Failed to process attachment: ${error instanceof Error ? error.message : "Unknown error"}`
            )
          );
        }
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

export interface EmailRecipient {
  displayName: string;
  emailAddress: string;
}

export const extractEmailAddresses = async (): Promise<EmailRecipient[]> => {
  const emails: EmailRecipient[] = [];
  const seen = new Set<string>();

  try {
    const item = Office.context.mailbox.item;
    if (!item) return emails;

    //Get From address
    if (item.from) {
      const from = await getEmailAddress(item.from);
      if (from && !seen.has(from.emailAddress)) {
        seen.add(from.emailAddress);
        emails.push(from);
      }
    }

    // Get To addresses
    if (item.to) {
      const toAddresses = await getEmailAddresses(item.to);
      toAddresses.forEach((addr) => {
        if (!seen.has(addr.emailAddress)) {
          seen.add(addr.emailAddress);
          emails.push(addr);
        }
      });
    }

    // Get CC addresses
    if (item.cc) {
      const ccAddresses = await getEmailAddresses(item.cc);
      ccAddresses.forEach((addr) => {
        if (!seen.has(addr.emailAddress)) {
          seen.add(addr.emailAddress);
          emails.push(addr);
        }
      });
    }
  } catch (error) {
    console.error("Error extracting email addresses: ", error);
  }

  return emails;
};

const getEmailAddress = (recipient: Office.EmailAddressDetails): Promise<EmailRecipient> => {
  return new Promise((resolve) => {
    resolve({
      displayName: recipient.displayName || recipient.emailAddress.toLowerCase(),
      emailAddress: recipient.emailAddress.toLowerCase(),
    });
  });
};

/**
 * Get multiple email addresses (for To/CC fields)
 */
const getEmailAddresses = (recipients: Office.EmailAddressDetails[]): Promise<EmailRecipient[]> => {
  return new Promise((resolve) => {
    const addresses = recipients.map((r) => ({
      displayName: r.displayName || r.emailAddress.toLowerCase(),
      emailAddress: r.emailAddress.toLowerCase(),
    }));
    resolve(addresses);
  });
};
