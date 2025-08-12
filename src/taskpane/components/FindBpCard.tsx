import * as React from "react";
import { useState } from "react";
import {
  makeStyles,
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Dropdown,
  Option,
  tokens,
} from "@fluentui/react-components";

const FindBpCard: React.FC = (_props: any) => {
  const styles = useStyles();
  const [cardCode, setCardCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  return (
    <Card className={styles.cardButtonGroup}>
      <Text weight="semibold" size={400} style={{ marginBottom: tokens.spacingVerticalS }}>
        Find Business Partner
      </Text>

      <div className={styles.cardContent}>
        <div className={styles.inputGroup}>
          <Label htmlFor="card-code-input" size="medium">
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
          <Label htmlFor="name-input" size="medium">
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
          <Label htmlFor="email-input" size="medium">
            Email:
          </Label>
          <Input
            id="email-input"
            value={name}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            size="small"
          />
        </div>

        <div className={styles.cardButtonGroup}>
          <Button appearance="outline" size="small" onClick={() => console.log("find clicked")}>
            Find
          </Button>

          <Button appearance="outline" size="small" onClick={() => console.log("browse clicked")}>
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
