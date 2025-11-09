import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  makeStyles,
  Button,
  Input,
  Label,
  Card,
  Text,
  tokens,
  Combobox,
  Option,
} from "@fluentui/react-components";
import { EmailRecipient } from "../../util/emailUtils";

export interface FindBpCardProps {
  onFind: (cardCode: string, name: string, email: string) => void;
  onBrowse: (cardCode: string, name: string, email: string) => void;
  emailOptions: EmailRecipient[];
}

const FindBpCard: React.FC<FindBpCardProps> = ({
  onFind,
  onBrowse,
  emailOptions,
}: FindBpCardProps) => {
  const styles = useStyles();
  const [cardCode, setCardCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFindClicked = () => {
    console.log("Find clicked with:", { cardCode, name, email });
    onFind(cardCode, name, email);
  };

  const handleBrowseClicked = () => {
    onBrowse(cardCode, name, email);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFindClicked();
    }
  };

  const handleEmailSelect = (_event: any, data: any) => {
    console.log("Inside handleEmailSelect");
    const selectedEmail = data.optionValue;
    if (selectedEmail) {
      setEmail(selectedEmail);
      setTimeout(() => {
        onFind(cardCode, name, selectedEmail);
      }, 100);
    }
  };

  return (
    <Card className={styles.bpCard}>
      <Text weight="semibold" size={300}>
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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by CardCode"
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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by CardName"
            size="small"
          />
        </div>

        <div className={styles.inputGroup}>
          <Label htmlFor="email-input" size="small">
            Email:
          </Label>
          <Combobox
            id="email-input"
            placeholder="Type or select an email"
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onOptionSelect={handleEmailSelect}
            size="small"
            freeform // Allows typing custom values
          >
            {emailOptions.map((recipient, _index) => (
              <Option
                key={recipient.emailAddress}
                value={recipient.emailAddress}
                text={recipient.emailAddress}
              >
                {recipient.displayName} ({recipient.emailAddress})
              </Option>
            ))}
          </Combobox>
        </div>

        <div className={styles.cardButtonGroup}>
          <Button
            appearance={isFocused ? "primary" : "outline"}
            size="small"
            type="submit"
            onClick={handleFindClicked}
            data-appearance={isFocused ? "primary" : "outline"}
          >
            Find
          </Button>

          <Button appearance="outline" size="small" type="button" onClick={handleBrowseClicked}>
            Browse
          </Button>
        </div>
      </div>
    </Card>
  );
};

const useStyles = makeStyles({
  bpCard: {
    padding: tokens.spacingVerticalXS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalS,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  cardButtonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    marginTop: "auto",
    paddingTop: tokens.spacingVerticalXS,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
});

export default FindBpCard;
