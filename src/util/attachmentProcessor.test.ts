import { processAttachments } from "./attachmentProcessor";
import { getEmailAttachments, getAttachmentContent, getEmailMsgContent } from "./emailUtils";
import { uploadFile } from "../api/uploadAttachments";
import { generateUniqueId } from "./fileUtils";

// jest.mock("./emailUtils");
jest.mock("../api/uploadAttachments");
// jest.mock("./fileUtils");

const mockUploadFile = uploadFile as jest.MockedFunction<typeof uploadFile>;

const mockOfficeContext = () => {
  const mockItem = {
    subject: "Test Subject",
    body: {
      getAsync: jest.fn((coercionType: any, callback: any) => {
        callback({
          status: Office.AsyncResultStatus.Succeeded,
          value: "<html><body>Test email body</body></html>",
        });
      }),
    },
    attachments: [],
    getAttachmentsAsync: jest.fn((callback: any) => {
      callback({
        status: Office.AsyncResultStatus.Succeeded,
        value: [],
      });
    }),
  };

  // @ts-ignore - Mocking Office global
  //   (global.Office = {
  //     context: {
  //       mailbox: {
  //         item: mockItem,
  //       },
  //     },
  //     CoercionType: {
  //       Text: "text",
  //       Html: "html",
  //     },
  //     AsyncResultStatus: {
  //       Succeeded: "succeeded",
  //       Failed: "failed",
  //     },
  //   };
};

// const mockGetEmailAttachments = getEmailAttachments as jest.MockedFunction<
//   typeof getEmailAttachments
// >;
// const mockGetAttachmentContent = getAttachmentContent as jest.MockedFunction<
//   typeof getAttachmentContent
// >;
// const mockGetEmailMsgContent = getEmailMsgContent as jest.MockedFunction<typeof getEmailMsgContent>;
// const mockUploadFile = uploadFile as jest.MockedFunction<typeof uploadFile>;
// const mockGenerateUniqueId = generateUniqueId as jest.MockedFunction<typeof generateUniqueId>;

// const createMockArrayBuffer = (content: string): ArrayBuffer => {
//   return new ArrayBuffer(content.length);
// };

// describe("processAttachments", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();

//     mockGenerateUniqueId.mockReturnValue("unique-123");
//     mockGetEmailMsgContent.mockResolvedValue(createMockArrayBuffer("mock-email-content"));
//     mockUploadFile.mockResolvedValue({
//       originalName: "Test Subject.msg",
//       uniqueFilename: "unique-123_Test Subject.msg",
//       fullPath: "\\\\server\\share\\unique-123_original.ext",
//     });
//     mockGetAttachmentContent.mockResolvedValue(createMockArrayBuffer("mock-attachment-content"));
//   });

//   describe("Email message only", () => {
//     it("uploads only email message when saveEmailMessage is true", async () => {
//       const result = await processAttachments(
//         "Test Subject",
//         true, //saveEmailMessage
//         false //saveEmailAttachments
//       );

//       expect(mockGetEmailMsgContent).toHaveBeenCalledTimes(1);
//       expect(mockUploadFile).toHaveBeenCalledTimes(1);
//       expect(mockUploadFile).toHaveBeenCalledWith(
//         expect.any(ArrayBuffer), // It's an ArrayBuffer, not a string
//         "Test Subject.msg",
//         "unique-123"
//       );
//       expect(result).toBe("\\\\server\\share\\unique-123_original.ext");
//     });
//   });
// });
