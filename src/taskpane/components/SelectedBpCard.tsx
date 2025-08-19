import * as React from "react";
import { makeStyles, Input, Label, Card, Text, tokens } from "@fluentui/react-components";

export interface SelectedBpCardProps {
  cardCode: string;
  name: string;
  city: string;
  country: string;
  involvements: string[];
  projectCode: string;
}

const SelectedBpCard: React.FC<SelectedBpCardProps> = ({
  cardCode,
  name,
  city,
  country,
  involvements,
  projectCode,
}: SelectedBpCardProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.bpCard}>
      <Text weight="semibold" size={300} style={{ marginBottom: tokens.spacingVerticalS }}>
        Selected Business Partner
      </Text>

      <div className={styles.cardContent}>
        <div className={styles.inputGroup}>
          <Label htmlFor="card-code-input" size="small">
            CardCode:
          </Label>
          <Input id="card-code-input" value={cardCode} size="small" />
        </div>

        <div className={styles.inputGroup}>
          <Label htmlFor="name-input" size="small">
            Name:
          </Label>
          <Input id="name-input" value={name} size="small" />
        </div>

        <div className={styles.inputGroup}>
          <Label htmlFor="city-input" size="small">
            City:
          </Label>
          <Input id="city-input" value={city} size="small" />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="country-input" size="small">
            Country:
          </Label>
          <Input id="country-input" value={country} size="small" />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="involvements-input" size="small">
            Involvements:
          </Label>
          <Input id="involvements-input" value={involvements.toString()} size="small" />
        </div>
        <div className={styles.inputGroup}>
          <Label htmlFor="project-code-input" size="small">
            Project Code:
          </Label>
          <Input id="project-code-input" value={projectCode} size="small" />
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

export default SelectedBpCard;
