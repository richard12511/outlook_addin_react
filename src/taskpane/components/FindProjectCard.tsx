import * as React from "react";
import { useState } from "react";
import { makeStyles, Button, Input, Label, Card, Text, tokens } from "@fluentui/react-components";

export interface FindProjectProps {
  onFind: (projectCode: string, projectName: string, projectPath: string) => void;
}

const FindProjectCard: React.FC<FindProjectProps> = ({ onFind }: FindProjectProps) => {
  const styles = useStyles();
  const [projectCode, setProjectCode] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectPath, setProjectPath] = useState<string>("");

  const handleFindClicked = () => {
    console.log("Find clicked with: ", projectCode);
    onFind(projectCode, projectName, projectPath);
  };

  return (
    <Card className={styles.projectCard}>
      <Text weight="semibold" size={300}>
        Find Project
      </Text>

      <div className={styles.cardContent}>
        <div className={styles.inputGroup}>
          <Label htmlFor="project-code-input" size="small">
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

        <div className={styles.inputGroup}>
          <Label htmlFor="project-name-input" size="small">
            Project Name:
          </Label>
          <Input
            id="project-name-input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            size="small"
          />
        </div>

        <div className={styles.inputGroup}>
          <Label htmlFor="project-path-input" size="small">
            Project Path:
          </Label>
          <Input
            id="project-path-input"
            value={projectPath}
            onChange={(e) => setProjectPath(e.target.value)}
            placeholder="Project Path"
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
    padding: tokens.spacingVerticalXS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: tokens.spacingVerticalXS,
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
