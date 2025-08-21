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

export interface FindProjectProps {
  onFind: (projectCode: string) => void;
}

const FindProjectCard: React.FC<FindProjectProps> = ({ onFind }: FindProjectProps) => {
  const styles = useStyles();
  const [projectCode, setProjectCode] = useState<string>("");

  const handleFindClicked = () => {
    console.log("Find clicked with: ", projectCode);
    onFind(projectCode);
  };

  return (
    <Card className={styles.projectCard}>
      <Text weight="semibold" size={400} style={{ marginBottom: tokens.spacingVerticalS }}>
        Find Project
      </Text>

      <div className={styles.cardContent}>
        <div className={styles.inputGroup}>
          <Label htmlFor="project-code-input" size="medium">
            Project Code:
          </Label>
          <Input
            id="project-code-input"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            placeholder="Project Code"
            size="small"
          />
        </div>

        <div className={styles.cardButtonGroup}>
          <Button appearance="outline" size="small" onClick={handleFindClicked}>
            Find
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FindProjectCard;

const useStyles = makeStyles({
  projectCard: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: tokens.spacingVerticalM,
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
