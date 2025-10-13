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
import { Dismiss24Regular } from "@fluentui/react-icons";
import { BusinessPartner } from "../../types";

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

  const columnStyles = {
    cardCode: {
      width: "80px",
      minWidth: "80px",
      maxWidth: "80px",
      overflow: "hidden" as const,
      textOverflow: "ellipsis" as const,
      whiteSpace: "nowrap" as const,
    },
    companyName: {
      width: "150px",
      minWidth: "100px",
      maxWidth: "200px",
      overflow: "hidden" as const,
      textOverflow: "ellipsis" as const,
      whiteSpace: "nowrap" as const,
    },
    email: {
      width: "180",
      minWidth: "100px",
      maxWidth: "250px",
      overflow: "hidden" as const,
      textOverflow: "ellipsis" as const,
      whiteSpace: "nowrap" as const,
    },
    location: {
      width: "140px",
      minWidth: "100px",
      maxWidth: "180px",
      overflow: "hidden" as const,
      textOverflow: "ellipsis" as const,
      whiteSpace: "nowrap" as const,
    },
  };

  return (
    <Dialog open={isOpen}>
      <DialogSurface className={styles.modal} style={{ width: "100%" }}>
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
              size="extra-small"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <TableHeader>
                <TableRow className={styles.tableHeaderRow}>
                  <TableHeaderCell className={styles.tableHeaderCell} style={columnStyles.cardCode}>
                    CardCode
                  </TableHeaderCell>
                  <TableHeaderCell
                    className={styles.tableHeaderCell}
                    style={columnStyles.companyName}
                  >
                    Company Name
                  </TableHeaderCell>
                  <TableHeaderCell className={styles.tableHeaderCell} style={columnStyles.email}>
                    Email Address
                  </TableHeaderCell>
                  <TableHeaderCell className={styles.tableHeaderCell} style={columnStyles.location}>
                    Location
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((partner, index) => (
                  <TableRow
                    key={partner.CardCode + "-" + partner.City + "-" + partner.Country}
                    className={`${styles.tableRow} ${
                      selectedRowIndex === index ? styles.selectedRow : ""
                    }`}
                    onClick={() => handleBpSelect(partner, index)}
                  >
                    <TableCell className={styles.cardCodeCell} style={columnStyles.cardCode}>
                      <TableCellLayout>{partner.CardCode}</TableCellLayout>
                    </TableCell>

                    <TableCell className={styles.companyNameCell} style={columnStyles.companyName}>
                      <TableCellLayout title={partner.CardName}>{partner.CardName}</TableCellLayout>
                    </TableCell>

                    <TableCell className={styles.emailCell} style={columnStyles.email}>
                      <TableCellLayout
                        className={
                          !partner.Email || partner.Email.trim() === "" ? styles.noEmailText : ""
                        }
                        title={formatEmail(partner.Email)}
                      >
                        {formatEmail(partner.Email)}
                      </TableCellLayout>
                    </TableCell>

                    <TableCell className={styles.locationCell} style={columnStyles.location}>
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
    width: "2000px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  content: {
    flex: 1,
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
  // Keep the basic styling, widths are handled by inline styles
  cardCodeCell: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  companyNameCell: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  emailCell: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  locationCell: {
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
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
    flexShrink: 0,
    marginTop: "auto",
  },
});
