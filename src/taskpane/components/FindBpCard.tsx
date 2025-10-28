import * as React from "react";
import { useEffect, useRef, useState } from "react";
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

  console.log("Component rendering"); // Add this at the top

  const cardCodeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("=== useEffect is running ===");
  }, []);

  const handleFindClicked = () => {
    console.log("Find clicked with:", { cardCode, name, email });
    onFind(cardCode, name, email);
  };

  const handleBrowseClicked = () => {
    onBrowse(cardCode, name, email);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted!");
    e.preventDefault();
    handleFindClicked();
  };

  // Add native keydown listener to each input
  useEffect(() => {
    console.log("useEffect running");
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("Enter pressed!");
        e.preventDefault();
        handleFindClicked();
      }
    };

    // Get the actual input elements inside Fluent UI components
    const cardCodeInput = cardCodeRef.current?.querySelector("input");
    const nameInput = nameRef.current?.querySelector("input");
    const emailInput = emailRef.current?.querySelector("input");

    console.log("cardCodeRef.current:", cardCodeRef.current);
    console.log("cardCodeInput:", cardCodeInput);
    console.log("nameInput:", nameInput);
    console.log("emailInput:", emailInput);

    if (cardCodeInput) {
      console.log("Adding listener to cardCodeInput");
      cardCodeInput.addEventListener("keydown", handleEnterKey);
    }
    if (nameInput) {
      console.log("Adding listener to nameInput");
      nameInput.addEventListener("keydown", handleEnterKey);
    }
    if (emailInput) {
      console.log("Adding listener to emailInput");
      emailInput.addEventListener("keydown", handleEnterKey);
    }

    return () => {
      console.log("Cleanup running");
      if (cardCodeInput) cardCodeInput.removeEventListener("keydown", handleEnterKey);
      if (nameInput) nameInput.removeEventListener("keydown", handleEnterKey);
      if (emailInput) emailInput.removeEventListener("keydown", handleEnterKey);
    };
  }, [cardCode, name, email]); // Re-attach when values change

  return (
    <Card className={styles.bpCard}>
      <Text weight="semibold" size={300}>
        Find Business Partner TEST
      </Text>

      <form className={styles.cardContent} onSubmit={handleFormSubmit}>
        <div className={styles.inputGroup} ref={cardCodeRef}>
          <Label htmlFor="card-code-input" size="small">
            CardCode:
          </Label>
          <Input
            id="card-code-input"
            value={cardCode}
            onChange={(e) => setCardCode(e.target.value)}
            // onKeyUpCapture={handleKeyPress}
            placeholder="Enter CardCode"
            size="small"
          />
        </div>

        <div className={styles.inputGroup} ref={nameRef}>
          <Label htmlFor="name-input" size="small">
            Name:
          </Label>
          <Input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // onKeyDown={handleKeyDown}
            placeholder="Enter Name"
            size="small"
          />
        </div>

        <div className={styles.inputGroup} ref={emailRef}>
          <Label htmlFor="email-input" size="small">
            Email:
          </Label>
          <Input
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // onKeyDown={handleKeyDown}
            placeholder="Enter Email"
            size="small"
          />
        </div>

        <div className={styles.cardButtonGroup}>
          <Button appearance="outline" size="small" type="submit" onClick={handleFindClicked}>
            Find
          </Button>

          <Button appearance="outline" size="small" type="button" onClick={handleBrowseClicked}>
            Browse
          </Button>
        </div>
      </form>
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
