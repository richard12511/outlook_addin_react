import * as React from "react";
import { useState } from "react";
import { makeStyles, Button, Input, Label, Card, Text, tokens } from "@fluentui/react-components";

export interface FindBpCardProps {
  onFind: (cardCode: string, name: string, email: string) => void;
  onBrowse: (cardCode: string, name: string, email: string) => void;
}

const FindBpCard: React.FC<FindBpCardProps> = ({ onFind, onBrowse }: FindBpCardProps) => {
  const styles = useStyles();
  const [cardCode, setCardCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleFindClicked = () => {
    console.log("Find clicked with:", { cardCode, name, email });
    onFind(cardCode, name, email);
  };

  const handleBrowseClicked = () => {
    onBrowse(cardCode, name, email);
  };

  return (
    <Card className={styles.bpCard}>
      <Text weight="semibold" size={400} style={{ marginBottom: tokens.spacingVerticalS }}>
        Find Business Partner
      </Text>

      <div className={styles.cardContent}>
        <div className={styles.inputGroup}>
          <Label htmlFor="card-code-input" size="small">
            CardCode:
          </Label>
          <Input
            id="card-code-input"
            value={cardCode}
            onChange={(e) => setCardCode(e.target.value)}
            placeholder="Enter CardCode"
            size="small"
          />
        </div>

        <div className={styles.inputGroup}>
          <Label htmlFor="name-input" size="small">
            Name:
          </Label>
          <Input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            size="small"
          />
        </div>

        <div className={styles.inputGroup}>
          <Label htmlFor="email-input" size="small">
            Email:
          </Label>
          <Input
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            size="small"
          />
        </div>

        <div className={styles.cardButtonGroup}>
          <Button appearance="outline" size="small" onClick={handleFindClicked}>
            Find
          </Button>

          <Button appearance="outline" size="small" onClick={handleBrowseClicked}>
            Browse
          </Button>
        </div>
      </div>
    </Card>
  );
};

const useStyles = makeStyles({
  bpCard: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  cardButtonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    marginTop: "auto",
    paddingTop: tokens.spacingVerticalM,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
});

export default FindBpCard;
