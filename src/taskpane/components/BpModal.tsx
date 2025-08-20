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
        <DialogBody>
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

          <DialogContent>
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
              <Table arial-label="Business Partner Results" size="extra-small">
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>CardCode</TableHeaderCell>
                    <TableHeaderCell>Company Name</TableHeaderCell>
                    <TableHeaderCell>Email Address</TableHeaderCell>
                    <TableHeaderCell>Location</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((bp, index) => (
                    <TableRow
                      key={bp.CardCode}
                      className={`${styles.tableRow} ${
                        selectedRowIndex === index ? styles.selectedRow : ""
                      }`}
                      onClick={() => handleBpSelect(bp, index)}
                    >
                      <TableCell>
                        <TableCellLayout className={styles.cardCodeCell}>
                          {bp.CardCode}
                        </TableCellLayout>
                      </TableCell>
                      <TableCell>
                        <TableCellLayout className={styles.companyNameCell}>
                          {bp.CardName}
                        </TableCellLayout>
                      </TableCell>
                      <TableCell>
                        <TableCellLayout
                          className={`${styles.emailCell} ${
                            !bp.Email || bp.Email.trim() === "" ? styles.noEmailText : ""
                          }`}
                        >
                          {formatEmail(bp.Email)}
                        </TableCellLayout>
                      </TableCell>
                      <TableCell>
                        <TableCellLayout className={styles.locationCell}>
                          {formatLocation(bp.City, bp.Country)}
                        </TableCellLayout>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>

          <div className={styles.footer}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
              Please select a business partner
            </Text>
            <div>
              <Button appearance="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

// const BpModal: React.FC<BpModalProps> = ({
//   isOpen,
//   onClose,
//   onSelect,
//   searchResults,
//   searchQuery,
// }) => {
//   const styles = useStyles();

//   const handleBpSelect = (bp: BusinessPartner) => {
//     console.log("Selected bp: ", bp);

//     onSelect(bp);
//     onClose();
//   };

//   const getInitials = (name: string): string => {
//     return name
//       .split(" ")
//       .map((word) => word.charAt(0))
//       .join("")
//       .substring(0, 2)
//       .toUpperCase();
//   };

//   const hasEmail = (email: string | null): boolean => {
//     return email !== null && email !== "" && email.trim() !== "";
//   };

//   return (
//     <Dialog open={isOpen}>
//       <DialogSurface className={styles.modal}>
//         <DialogBody>
//           <div className={styles.header}>
//             <DialogTitle>
//               <Text size={300} weight="semibold">
//                 Business Partner Search Results
//               </Text>
//             </DialogTitle>
//             <Button
//               appearance="subtle"
//               aria-label="close"
//               icon={<Dismiss24Regular />}
//               onClick={onClose}
//             />
//           </div>

//           <DialogContent>
//             <div className={styles.searchInfo}>
//               <Text size={300}>
//                 Found{" "}
//                 <Badge appearance="filled" color="brand">
//                   {searchResults.length}
//                 </Badge>{" "}
//                 results for "{searchQuery}"
//               </Text>
//             </div>

//             <div className={styles.resultsContainer}>
//               {searchResults.map((partner, _index) => (
//                 <Card
//                   key={partner.CardCode}
//                   className={styles.resultCard}
//                   onClick={() => handleBpSelect(partner)}
//                 >
//                   <div className={styles.cardContent}>
//                     <Avatar
//                       className={styles.avatar}
//                       name={partner.CardName}
//                       size={48}
//                       color="brand"
//                       initials={getInitials(partner.CardName)}
//                       icon={<Building24Regular />}
//                     />

//                     <div className={styles.businessInfo}>
//                       <div className={styles.businessName} title={partner.CardName}>
//                         {partner.CardName}
//                       </div>

//                       <div className={styles.cardCode}>
//                         <Person24Regular fontSize={16} />
//                         <Badge appearance="outline" size="small">
//                           {partner.CardCode}
//                         </Badge>
//                       </div>

//                       <div className={styles.email}>
//                         <Mail24Regular fontSize={16} />
//                         {hasEmail(partner.Email) ? (
//                           <Text size={200}>{partner.Email}</Text>
//                         ) : (
//                           <Text size={200} className={styles.noEmail}>
//                             No email available
//                           </Text>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </DialogContent>
//         </DialogBody>
//       </DialogSurface>
//     </Dialog>
//   );
// };

export default BpModal;

const useStyles = makeStyles({
  modal: {
    width: "800px", // Wider to accommodate table
    maxHeight: "80vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  searchInfo: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalM,
    textAlign: "center",
  },
  tableContainer: {
    maxHeight: "500px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  tableRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selectedRow: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  cardCodeCell: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
  companyNameCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
  emailCell: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  noEmailText: {
    fontStyle: "italic",
    color: tokens.colorNeutralForeground3,
  },
  locationCell: {
    fontSize: tokens.fontSizeBase200,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

// const useStyles = makeStyles({
//   modal: {
//     width: "600px",
//     maxHeight: "80vh",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: tokens.spacingVerticalM,
//     borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
//   },
//   searchInfo: {
//     padding: tokens.spacingVerticalS,
//     backgroundColor: tokens.colorNeutralBackground2,
//     borderRadius: tokens.borderRadiusMedium,
//     marginBottom: tokens.spacingVerticalM,
//     textAlign: "center",
//   },
//   resultsContainer: {
//     maxHeight: "400px",
//     overflowY: "auto",
//     padding: tokens.spacingVerticalXS,
//   },
//   resultCard: {
//     marginBottom: tokens.spacingVerticalS,
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     "&:hover": {
//       backgroundColor: tokens.colorNeutralBackground1Hover,
//       //   borderColor: tokens.colorBrandStroke1,
//       transform: "translateY(-1px)",
//       boxShadow: tokens.shadow4,
//     },
//   },
//   cardContent: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalM,
//     padding: tokens.spacingVerticalM,
//   },
//   avatar: {
//     flexShrink: 0,
//   },
//   businessInfo: {
//     flex: 1,
//     minWidth: 0, // Allows text truncation
//   },
//   businessName: {
//     fontSize: tokens.fontSizeBase300,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//     marginBottom: tokens.spacingVerticalXXS,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   cardCode: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalXS,
//     marginBottom: tokens.spacingVerticalXXS,
//   },
//   email: {
//     display: "flex",
//     alignItems: "center",
//     gap: tokens.spacingHorizontalXS,
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground2,
//   },
//   noEmail: {
//     color: tokens.colorNeutralForeground3,
//     fontStyle: "italic",
//   },
//   footer: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: tokens.spacingVerticalM,
//     borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
//     backgroundColor: tokens.colorNeutralBackground2,
//   },
//   closeButton: {
//     marginLeft: "auto",
//   },
// });
