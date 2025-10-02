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
import { Dismiss24Regular } from "@fluentui/react-icons";
import { Project } from "../../types";

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (project: Project) => void;
  searchResults: Project[];
  searchQuery: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  searchResults,
  searchQuery,
}) => {
  const styles = useStyles();
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(null);

  const handleProjectSelect = (project: Project, index: number) => {
    console.log("Selected project: ", project);
    setSelectedRowIndex(index);
    onSelect(project);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogSurface className={styles.modal} style={{ width: "100%" }}>
        <div className={styles.header}>
          <DialogTitle>
            <Text size={500} weight="semibold">
              Select Project
            </Text>
          </DialogTitle>
          <Button
            appearance="subtle"
            aria-label="close"
            icon={<Dismiss24Regular />}
            onClick={onClose}
          />
        </div>

        <div className={styles.content}>
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
            <Table
              aria-label="Project Search Results"
              size="extra-small"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <TableHeader>
                <TableRow className={styles.tableHeaderRow}>
                  <TableHeaderCell className={styles.tableHeaderCell}>Code</TableHeaderCell>
                  <TableHeaderCell className={styles.tableHeaderCell}>Project Name</TableHeaderCell>
                  <TableHeaderCell className={styles.tableHeaderCell}>Project Path</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((project, index) => (
                  <TableRow
                    key={project.Code}
                    className={`${styles.tableRow} ${
                      selectedRowIndex === index ? styles.selectedRow : ""
                    }`}
                    onClick={() => handleProjectSelect(project, index)}
                  >
                    <TableCell className={styles.codeCell}>
                      <TableCellLayout>{project.Code}</TableCellLayout>
                    </TableCell>

                    <TableCell className={styles.projectNameCell}>
                      <TableCellLayout>{project.ProjectName}</TableCellLayout>
                    </TableCell>

                    <TableCell className={styles.projectPathCell}>
                      <TableCellLayout>{project.ProjectPath}</TableCellLayout>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className={styles.footer}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
            Please select a project
          </Text>
          <Button appearance="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogSurface>
    </Dialog>
  );
};

const useStyles = makeStyles({
  modal: {
    width: "2000px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: tokens.spacingVerticalM,
  },
  searchInfo: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalM,
    textAlign: "center",
    flexShrink: 0,
  },
  tableContainer: {
    flex: 1,
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  tableRow: {
    cursor: "pointer",
    height: "32px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selectedRow: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  codeCell: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  projectNameCell: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  projectPathCell: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  tableHeaderRow: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
  },
  tableHeaderCell: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
    marginTop: "auto",
  },
});

export default ProjectModal;
