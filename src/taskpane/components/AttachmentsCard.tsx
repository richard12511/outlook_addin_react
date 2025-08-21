import * as React from "react";
import { makeStyles, Card, Text, Checkbox, tokens } from "@fluentui/react-components";

export interface AttachmentsData {
  saveEmailMessage: boolean;
  saveEmailAttachments: boolean;
}

export interface AttachmentsCardProps {
  data: AttachmentsData;
  onChange: (data: AttachmentsData) => void;
}

const AttachmentsCard: React.FC<AttachmentsCardProps> = ({ data, onChange }) => {
  const styles = useStyles();

  const handleChange = (field: keyof AttachmentsData, value: any) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
  };

  return (
    <Card className={styles.card}>
      <Text weight="semibold" size={400} style={{ marginBottom: tokens.spacingVerticalS }}>
        Attachments
      </Text>

      <div className={styles.cardContent}>
        <div className={styles.checkboxRow}>
          <Checkbox
            checked={data.saveEmailMessage}
            onChange={(_e, checkboxData) =>
              handleChange("saveEmailMessage", checkboxData.checked || false)
            }
            label="Save E-mail Message"
          />
        </div>

        <div className={styles.checkboxRow}>
          <Checkbox
            checked={data.saveEmailAttachments}
            onChange={(e, checkboxData) =>
              handleChange("saveEmailAttachments", checkboxData.checked || false)
            }
            label="Save E-mail Attachments"
          />
        </div>
      </div>
    </Card>
  );
};

export default AttachmentsCard;

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: tokens.spacingVerticalM,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
});
