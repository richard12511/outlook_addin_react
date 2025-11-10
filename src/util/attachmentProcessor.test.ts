import { processAttachments } from "./attachmentProcessor";
import { getEmailAttachments, getAttachmentContent, getEmailMsgContent } from "./emailUtils";
import { uploadFile } from "../api/uploadAttachments";
import { generateUniqueId } from "./fileUtils";
import {
  mockAttachmentContents,
  mockOfficeContext,
  mockOfficeContextWithAttachments,
} from "../test-utils/officeMocks";
import { TextEncoder, TextDecoder } from "util";
import { time } from "console";

jest.mock("../api/uploadAttachments");

const mockUploadFile = uploadFile as jest.MockedFunction<typeof uploadFile>;

describe("processAttachments - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOfficeContext();

    mockUploadFile.mockResolvedValue({
      originalName: "test.msg",
      uniqueFilename: "unique_test.msg",
      fullPath: "\\\\server\\share\\unique_test.msg",
    });
  });

  it("uploads email message and returns path when saveEmailMessage is true", async () => {
    const result = await processAttachments("Test Subject", true, false);

    expect(result).toBeTruthy(); //make sure it returns something
    expect(result).toContain("\\\\server\\share\\");
    expect(result).toContain(".msg");
  });

  it("returns an empty string when saveEmailMessage and saveAttachment are both unchecked", async () => {
    const result = await processAttachments("Test Subject", false, false);

    expect(result).toBe("");
    expect(mockUploadFile).not.toHaveBeenCalled();
  });

  it("throws an error when email upload fails", async () => {
    mockUploadFile.mockRejectedValueOnce(new Error("Network Error"));

    await expect(processAttachments("Test Subject", true, false)).rejects.toThrow("Network Error");
  });

  it("throws an error if the second attachment upload fails", async () => {
    mockOfficeContextWithAttachments([
      { id: "att1", name: "file1.pdf", size: 1024, contentType: "application/pdf" },
      { id: "att2", name: "file2.pdf", size: 2048, contentType: "application/pdf" },
    ]);

    mockAttachmentContents({
      att1: "content1",
      att2: "content2",
    });
    //The below code sets up the uploadFile() function to succeed the first time
    // it's called(with the .msg file), succeed the second time it's
    // called(with the first .pdf attachment), and then fail the third time
    // it's called(with the second .pdf attachment)
    mockUploadFile
      .mockResolvedValueOnce({
        originalName: "Test.msg",
        uniqueFilename: "unique_Test.msg",
        fullPath: "\\\\server\\share\\unique_Test.msg",
      })
      .mockResolvedValueOnce({
        originalName: "file1.pdf",
        uniqueFilename: "unique_file1.pdf",
        fullPath: "\\\\server\\share\\unique_file1.pdf",
      })
      .mockRejectedValueOnce(new Error("Second attachment failed"));

    await expect(processAttachments("Test", true, true)).rejects.toThrow(
      "Second attachment failed"
    );
  });
});
