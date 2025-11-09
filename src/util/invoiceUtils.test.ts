import { extractInvoiceNumber, shouldLinkInvoice } from "./invoiceUtils";

describe("extractInvoiceNumber", () => {
  it("extracts invoice number from standard format", () => {
    const subject = "RE: Invoice 5025716 - Purchase Order pending";
    expect(extractInvoiceNumber(subject)).toBe(5025716);
  });

  it("extracts invoice number case-insensitively", () => {
    expect(extractInvoiceNumber("invoice 5025716")).toBe(5025716);
    expect(extractInvoiceNumber("INVOICE 5025716")).toBe(5025716);
    expect(extractInvoiceNumber("Invoice 5025716")).toBe(5025716);
  });

  it("returns null when no invoice number is present", () => {
    expect(extractInvoiceNumber("No invoice here")).toBe(null);
  });

  it("returns null for invoice numbers not starting with 5", () => {
    expect(extractInvoiceNumber("invoice 2025716")).toBe(null);
    expect(extractInvoiceNumber("invoice 4025716")).toBe(null);
    expect(extractInvoiceNumber("invoice 3025716")).toBe(null);
  });

  it("returns null for invoice numbers that are not 7 digits", () => {
    expect(extractInvoiceNumber("invoice 50257167")).toBe(null);
    expect(extractInvoiceNumber("invoice 502576")).toBe(null);
  });
});

describe("shouldLinkInvoice", () => {
  it("returns true when invoice number is present", () => {
    expect(shouldLinkInvoice("Invoice 5025716")).toBe(true);
  });

  it("returns false when there is no invoice number in the string", () => {
    expect(shouldLinkInvoice("No invoice here")).toBe(false);
  });
});
