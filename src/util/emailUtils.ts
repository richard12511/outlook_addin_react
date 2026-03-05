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

export const getEmailMsgContent = (): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item;
    if (!item) {
      reject(new Error("No email item available"));
      return;
    }

    item.body.getAsync(Office.CoercionType.Html, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        // Create proper HTML with metadata
        const htmlContent = createEmailHTML(item, result.value);
        const encoder = new TextEncoder();
        resolve(encoder.encode(htmlContent).buffer);
      } else {
        reject(new Error("Failed to get email content"));
      }
    });
  });
};

function createEmailHTML(item: any, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${item.subject || "(No Subject)"}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
        }
        .email-header {
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .email-subject {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
        .email-meta {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }
        .email-meta-label {
            font-weight: 600;
            display: inline-block;
            width: 60px;
        }
        .email-body {
            padding-top: 20px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="email-subject">${escapeHtml(item.subject || "(No Subject)")}</div>
            <div class="email-meta">
                <div><span class="email-meta-label">From: </span>${formatEmailAddress(item.from)}</div>
                <div><span class="email-meta-label">To: </span>${formatEmailAddresses(item.to)}</div>
                ${item.cc && item.cc.length > 0 ? `<div><span class="email-meta-label">Cc: </span>${formatEmailAddresses(item.cc)}</div>` : ""}
                <div><span class="email-meta-label">Date: </span>${formatDate(item.dateTimeCreated || new Date())}</div>
            </div>
        </div>
        <div class="email-body">
            ${bodyHtml}
        </div>
    </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatEmailAddress(recipient: any): string {
  if (!recipient) return "Unknown";
  const name = recipient.displayName || "";
  const email = recipient.emailAddress || "";
  return name ? `${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;` : escapeHtml(email);
}

function formatEmailAddresses(recipients: any[]): string {
  if (!recipients || recipients.length === 0) return "";
  return recipients.map((r) => formatEmailAddress(r)).join(", ");
}

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
