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
} from "@fluentui/react-components";
import {
  Dismiss24Regular,
  Person24Regular,
  Mail24Regular,
  Building24Regular,
} from "@fluentui/react-icons";

export interface BusinessPartner {
  CardCode: string;
  CardName: string;
  Email: string | null;
}

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

  const handleBpSelect = (bp: BusinessPartner) => {
    console.log("Selected bp: ", bp);

    onSelect(bp);
    onClose();
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const hasEmail = (email: string | null): boolean => {
    return email !== null && email !== "" && email.trim() !== "";
  };

  return (
    <Dialog open={isOpen}>
      <DialogSurface className={styles.modal}>
        <DialogBody>
          <div className={styles.header}>
            <DialogTitle>
              <Text size={300} weight="semibold">
                Business Partner Search Results
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

            <div className={styles.resultsContainer}>
              {searchResults.map((partner, _index) => (
                <Card
                  key={partner.CardCode}
                  className={styles.resultCard}
                  onClick={() => handleBpSelect(partner)}
                >
                  <div className={styles.cardContent}>
                    <Avatar
                      className={styles.avatar}
                      name={partner.CardName}
                      size={48}
                      color="brand"
                      initials={getInitials(partner.CardName)}
                      icon={<Building24Regular />}
                    />

                    <div className={styles.businessInfo}>
                      <div className={styles.businessName} title={partner.CardName}>
                        {partner.CardName}
                      </div>

                      <div className={styles.cardCode}>
                        <Person24Regular fontSize={16} />
                        <Badge appearance="outline" size="small">
                          {partner.CardCode}
                        </Badge>
                      </div>

                      <div className={styles.email}>
                        <Mail24Regular fontSize={16} />
                        {hasEmail(partner.Email) ? (
                          <Text size={200}>{partner.Email}</Text>
                        ) : (
                          <Text size={200} className={styles.noEmail}>
                            No email available
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default BpModal;

const useStyles = makeStyles({
  modal: {
    width: "600px",
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
  resultsContainer: {
    maxHeight: "400px",
    overflowY: "auto",
    padding: tokens.spacingVerticalXS,
  },
  resultCard: {
    marginBottom: tokens.spacingVerticalS,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      //   borderColor: tokens.colorBrandStroke1,
      transform: "translateY(-1px)",
      boxShadow: tokens.shadow4,
    },
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
  },
  avatar: {
    flexShrink: 0,
  },
  businessInfo: {
    flex: 1,
    minWidth: 0, // Allows text truncation
  },
  businessName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalXXS,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cardCode: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    marginBottom: tokens.spacingVerticalXXS,
  },
  email: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  noEmail: {
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  closeButton: {
    marginLeft: "auto",
  },
});
