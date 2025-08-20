import * as React from "react";
import {
  makeStyles,
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  Text,
  Card,
  CardHeader,
  Badge,
  Avatar,
  tokens,
  Divider,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Table,
} from "@fluentui/react-components";
import {
  Dismiss24Regular,
  Person24Regular,
  Mail24Regular,
  Building24Regular,
} from "@fluentui/react-icons";
import { BusinessPartner } from "../../api/searchBusinessPartners";

export interface BpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bp: BusinessPartner) => void;
  searchResults: BusinessPartner[];
  searchQuery: string;
}

const BpModal: React.FC<BpModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  searchResults,
  searchQuery,
}) => {
  const styles = useStyles();
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(null);

  const handleBpSelect = (bp: BusinessPartner, index: number) => {
    console.log("Selected bp: ", bp);
    setSelectedRowIndex(index);
    onSelect(bp);
    onClose();
  };

  const formatLocation = (city?: string, country?: string): string => {
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (country) return country;
    return "-";
  };

  const formatEmail = (email: string | null): string => {
    return email && email.trim() !== "" ? email : "-";
  };

  return (
    <Dialog open={isOpen}>
      <DialogSurface className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <DialogTitle>
            <Text size={500} weight="semibold">
              Select Business Partner
            </Text>
          </DialogTitle>
          <Button
            appearance="subtle"
            aria-label="close"
            icon={<Dismiss24Regular />}
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.searchInfo}>
            <Text size={300}>
              Found{" "}
              <Badge appearance="filled" color="brand">
                {searchResults.length}
              </Badge>{" "}
              results for "{searchQuery}"
            </Text>
          </div>

          <div className={styles.tableContainer}>
            <Table
              aria-label="Business Partner Results"
              className={styles.table}
              size="extra-small"
            >
              <TableHeader>
                <TableRow className={styles.tableHeaderRow}>
                  <TableHeaderCell className={`${styles.tableHeaderCell} ${styles.cardCodeCell}`}>
                    CardCode
                  </TableHeaderCell>
                  <TableHeaderCell
                    className={`${styles.tableHeaderCell} ${styles.companyNameCell}`}
                  >
                    Company Name
                  </TableHeaderCell>
                  <TableHeaderCell className={`${styles.tableHeaderCell} ${styles.emailCell}`}>
                    Email Address
                  </TableHeaderCell>
                  <TableHeaderCell className={`${styles.tableHeaderCell} ${styles.locationCell}`}>
                    Location
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((partner, index) => (
                  <TableRow
                    key={partner.CardCode}
                    className={`${styles.tableRow} ${
                      selectedRowIndex === index ? styles.selectedRow : ""
                    }`}
                    onClick={() => handleBpSelect(partner, index)}
                  >
                    <TableCell className={styles.cardCodeCell}>
                      <TableCellLayout>{partner.CardCode}</TableCellLayout>
                    </TableCell>
                    <TableCell className={styles.companyNameCell}>
                      <TableCellLayout title={partner.CardName}>{partner.CardName}</TableCellLayout>
                    </TableCell>
                    <TableCell className={styles.emailCell}>
                      <TableCellLayout
                        className={
                          !partner.Email || partner.Email.trim() === "" ? styles.noEmailText : ""
                        }
                        title={formatEmail(partner.Email)}
                      >
                        {formatEmail(partner.Email)}
                      </TableCellLayout>
                    </TableCell>
                    <TableCell className={styles.locationCell}>
                      <TableCellLayout title={formatLocation(partner.City, partner.Country)}>
                        {formatLocation(partner.City, partner.Country)}
                      </TableCellLayout>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
            Please select a business partner
          </Text>
          <Button appearance="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogSurface>
    </Dialog>
  );
};

export default BpModal;

const useStyles = makeStyles({
  modal: {
    width: "1000px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column", // Essential for footer positioning
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0, // Prevent header from shrinking
  },
  content: {
    flex: 1, // Take up remaining space
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: tokens.spacingVerticalM,
  },
  searchInfo: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalM,
    textAlign: "center",
    flexShrink: 0,
  },
  tableContainer: {
    flex: 1,
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  // FIXED: Force table layout and column widths
  table: {
    tableLayout: "fixed", // This is key!
    width: "100%",
  },
  tableRow: {
    cursor: "pointer",
    height: "32px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selectedRow: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  // Column widths as percentages (must add up to 100%)
  cardCodeCell: {
    width: "12%", // Small for card codes
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  companyNameCell: {
    width: "35%", // Largest for company names
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  emailCell: {
    width: "33%", // Good space for emails
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  locationCell: {
    width: "20%", // Remaining space
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noEmailText: {
    fontStyle: "italic",
    color: tokens.colorNeutralForeground3,
  },
  tableHeaderRow: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
  },
  tableHeaderCell: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0, // Prevent footer from shrinking
    marginTop: "auto", // Push to bottom
  },
});
