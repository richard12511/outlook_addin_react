import * as React from "react";
import { useState } from "react";
import { makeStyles, Button, Input, Label, Card, Text, tokens } from "@fluentui/react-components";
import { ChevronDown20Regular, ChevronUp20Regular } from "@fluentui/react-icons";

export interface FindProjectProps {
  onFind: (projectCode: string, projectName: string, projectPath: string) => void;
  // disabled?: boolean;
}

const FindProjectCard: React.FC<FindProjectProps> = ({ onFind }: FindProjectProps) => {
  const styles = useStyles();
  const [projectCode, setProjectCode] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectPath, setProjectPath] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFindClicked = () => {
    console.log("Find clicked with: ", projectCode);
    onFind(projectCode, projectName, projectPath);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log("handleKeyDown, e.key: ", e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      handleFindClicked();
    }
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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by project code, ex: '15876'"
            size="small"
            // disabled={disabled}
          />
        </div>

        <Button
          appearance="subtle"
          icon={isExpanded ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        ></Button>

        {/* Collapsable Section */}
        {isExpanded && (
          <div className={styles.collapsibleSection}>
            <div className={styles.inputGroup}>
              <Label htmlFor="project-name">Project Name:</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by project name, ex: '2025'"
                // disabled={disabled}
              />
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="project-path">Project Path:</Label>
              <Input
                id="project-path"
                value={projectPath}
                onChange={(e) => setProjectPath(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by project path, ex: 'Training->Training Events'"
                // disabled={disabled}
              />
            </div>
          </div>
        )}

        <div className={styles.cardButtonGroup}>
          <Button
            appearance={isFocused ? "primary" : "outline"}
            size="small"
            onClick={handleFindClicked}
            data-appearance={isFocused ? "primary" : "outline"}
          >
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
  expandButton: {
    width: "fit-content",
    paddingLeft: 0,
  },
  collapsibleSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
});
