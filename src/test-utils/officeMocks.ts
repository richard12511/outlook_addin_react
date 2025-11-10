import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

export const mockOfficeContext = () => {
  const mockItem = {
    subject: "Test Subject",
    body: {
      getAsync: jest.fn((_coercionType: any, callback: any) => {
        callback({
          status: "succeeded",
          value: "<html><body>Test email body</body></html>",
        });
      }),
    },
    attachments: [],
    getAttachmentsAsync: jest.fn((callback: any) => {
      callback({
        status: "succeeded",
        value: [],
      });
    }),
  };

  const win = global as any;
  win.Office = {
    context: {
      mailbox: {
        item: mockItem,
      },
    },
    CoercionType: {
      Text: "text",
      Html: "html",
    },
    AsyncResultStatus: {
      Succeeded: "succeeded",
      Failed: "failed",
    },
  };

  return mockItem;
};

export const mockOfficeContextWithAttachments = (attachments: any[]) => {
  const mockItem = mockOfficeContext();
  mockItem.attachments = attachments;
  mockItem.getAttachmentsAsync = jest.fn((callback: any) => {
    callback({
      status: "succeeded",
      value: attachments,
    });
  });

  return mockItem;
};

export const mockAttachmentContent = (attachmentId: string, content: string) => {
  const win = global as any;
  const mockItem = win.Office.context.mailbox.item;

  if (!mockItem.getAttachmentContentAsync) {
    mockItem.getAttachmentContentAsync = jest.fn();
  }

  mockItem.getAttachmentContentAsync.mockImplementation((id: string, callback: any) => {
    if (id === attachmentId) {
      const encoder = new TextEncoder();
      const arrayBuffer = encoder.encode(content).buffer;

      callback({
        status: "succeeded",
        value: {
          content: arrayBuffer,
          format: "base64",
        },
      });
    }
  });
};
