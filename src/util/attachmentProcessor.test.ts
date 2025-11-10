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

  it("returns semicolon-separated paths for multiple attachments", async () => {
    mockOfficeContextWithAttachments([
      {
        id: "att1",
        name: "document.pdf",
        size: 1024,
        contentType: "application/pdf",
        isInline: false,
      },
      {
        id: "att2",
        name: "spreadsheet.xlsx",
        size: 2048,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        isInline: false,
      },
      { id: "att3", name: "image.png", size: 512, contentType: "image/png", isInline: false },
    ]);

    mockAttachmentContents({
      att1: "PDF file content",
      att2: "Excel file content",
      att3: "PNG image data",
    });

    mockUploadFile.mockImplementation(async (_data, filename, _uniqueId) => {
      return {
        originalName: filename,
        uniqueFilename: `unique_${filename}`,
        fullPath: `\\\\server\\share\\unique_${filename}`,
      };
    });

    const result = await processAttachments("Test Subject", false, true);
    const paths = result.split(";");

    expect(paths).toHaveLength(3);
    expect(paths[0]).toContain("document.pdf");
    expect(paths[1]).toContain("spreadsheet.xlsx");
    expect(paths[2]).toContain("image.png");
    paths.forEach((path) => {
      expect(path).toContain("\\\\server\\share\\");
    });
    expect(mockUploadFile).toHaveBeenCalledTimes(3);
  });

  it("returns semicolon-separated paths for email and multiple attachments", async () => {
    mockOfficeContextWithAttachments([
      { id: "att1", name: "doc1.pdf", size: 1024, contentType: "application/pdf", isInline: false },
      { id: "att2", name: "doc2.pdf", size: 2048, contentType: "application/pdf", isInline: false },
    ]);

    mockAttachmentContents({
      att1: "PDF 1 content",
      att2: "PDF 2 content",
    });

    mockUploadFile.mockImplementation(async (_data, filename, _uniqueId) => {
      return {
        originalName: filename,
        uniqueFilename: `unique_${filename}`,
        fullPath: `\\\\server\\share\\unique_${filename}`,
      };
    });

    const result = await processAttachments("Test Subject", true, true);
    const paths = result.split(";");

    expect(paths).toHaveLength(3);
    expect(paths[0]).toContain(".msg");
    expect(paths[1]).toContain("doc1.pdf");
    expect(paths[2]).toContain("doc2.pdf");
    expect(mockUploadFile).toHaveBeenCalledTimes(3);
  });

  it("handles attachments with special characters in the filename", async () => {
    mockOfficeContextWithAttachments([
      {
        id: "att1",
        name: "Invoice #5025716 (Final) - Q4'2024 [APPROVED].pdf",
        size: 1024,
        contentType: "application/pdf",
        isInline: false,
      },
      {
        id: "att2",
        name: "Report & Analysis: 50% Complete?.docx",
        size: 2048,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        isInline: false,
      },
    ]);

    mockAttachmentContents({
      att1: "Invoice PDF content",
      att2: "Report DOCX content",
    });

    mockUploadFile.mockImplementation(async (_data, filename, _uniqueId) => {
      return {
        originalName: filename,
        uniqueFilename: `unique_${filename}`,
        fullPath: `\\\\server\\share\\unique_${filename}`,
      };
    });

    const result = await processAttachments("Test Subject", false, true);
    expect(result).toBeTruthy(); //It should be able to handle special characters
    const paths = result.split(";");

    // We want to make sure that the uploadFile() call happened with the original filenames
    expect(mockUploadFile).toHaveBeenNthCalledWith(
      1,
      expect.any(ArrayBuffer),
      "Invoice #5025716 (Final) - Q4'2024 [APPROVED].pdf",
      expect.any(String)
    );

    expect(mockUploadFile).toHaveBeenNthCalledWith(
      2,
      expect.any(ArrayBuffer),
      "Report & Analysis: 50% Complete?.docx",
      expect.any(String)
    );

    expect(mockUploadFile).toHaveBeenCalledTimes(2);
  });
});
