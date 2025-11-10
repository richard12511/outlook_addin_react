import { processAttachments } from "./attachmentProcessor";
import { getEmailAttachments, getAttachmentContent, getEmailMsgContent } from "./emailUtils";
import { uploadFile } from "../api/uploadAttachments";
import { generateUniqueId } from "./fileUtils";
import { mockOfficeContext } from "../test-utils/officeMocks";
import { TextEncoder, TextDecoder } from "util";

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
});
