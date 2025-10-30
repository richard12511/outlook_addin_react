/**
 * Extracts invoice number from email subject if it matches the pattern "Invoice {7-digit number starting with 5}"
 * Examples:
 * - "RE: Invoice 5025716 - Purchase Order pending" -> 5025716
 * - "Re: Invoice 5025739" -> 5025739
 * - "Past Due Invoice 5024948 - payment received" -> 5024948
 * - "No invoice here" -> null
 */

export const extractInvoiceNumber = (subject: string): number | null => {
  if (!subject) {
    return null;
  }

  //Match "Invoice" followed by a 7 digit number starting with 5. /i at the end is to make it case insensitive
  const invoicePattern = /\bInvoice\s+5\d{6}\b/i;
  const match = subject.match(invoicePattern);

  if (!match) {
    return null;
  }

  const numberPattern = /5\d{6}/;
  const numberMatch = match[0].match(numberPattern);

  if (numberMatch) {
    return parseInt(numberMatch[0], 10);
  }

  return null;
};

export const shouldLinkInvoice = (subject: string): boolean => {
  return extractInvoiceNumber(subject) !== null;
};
