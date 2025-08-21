import * as React from "react";
import { useState } from "react";
import {
  makeStyles,
  Card,
  Text,
  Checkbox,
  Label,
  Dropdown,
  Option,
  Input,
  tokens,
} from "@fluentui/react-components";

const activityOptions = [
  { key: "conversation", text: "Conversation" },
  { key: "meeting", text: "Meeting" },
  { key: "task", text: "Task" },
  { key: "other", text: "Other" },
  { key: "note", text: "Note" },
];

const reminderOptions = [
  { key: "minutes", text: "Minutes" },
  { key: "hours", text: "Hours" },
  { key: "days", text: "Days" },
];

export interface FollowUpData {
  createFollowUp: boolean;
  activity?: string;
  dueDate?: string;
  dueTime?: string;
  reminder?: boolean;
  reminderValue?: string;
  reminderUnit?: string;
}

export interface FollowUpCardProps {
  data: FollowUpData;
  onChange: (data: FollowUpData) => void;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({ data, onChange }) => {
  const styles = useStyles();

  const handleChange = (field: keyof FollowUpData, value: any) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
  };

  const handleActivityChange = (_event: any, optionData: any) => {
    handleChange("activity", optionData.optionValue || "");
  };

  const handleReminderUnitChange = (_event: any, optionData: any) => {
    handleChange("reminderUnit", optionData.optionValue || "");
  };

  //Get the current date in YYYY-MM-DD format for data input
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  //Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  return (
    <Card className={styles.card}>
      <Text weight="semibold" size={400} style={{ marginBottom: tokens.spacingVerticalS }}>
        Follow-Up
      </Text>

      <div className={styles.cardContent}>
        {/* Create Follow-Up Activity Checkbox*/}
        <div className={styles.checkboxRow}>
          <Checkbox
            checked={data.createFollowUp}
            onChange={(_e, data) => handleChange("createFollowUp", data.checked)}
            label="Create Follow-Up Activity"
          />
        </div>

        {/* Activty Type Dropdown */}
        <div className={styles.inputRow}>
          <Label className={styles.label}>Activity</Label>
          <Dropdown
            className={styles.dropdown}
            placeholder="Select activity type"
            value={data.activity}
            selectedOptions={data.activity ? [data.activity] : []}
            onOptionSelect={handleActivityChange}
            disabled={!data.createFollowUp}
          >
            {activityOptions.map((option) => (
              <Option key={option.key} value={option.key}>
                option.text
              </Option>
            ))}
          </Dropdown>
        </div>

        {/* Due Date and Time */}
        <div className={styles.dateTimeRow}>
          <Label className={styles.label}>Due Date</Label>
          <Input
            type="date"
            className={styles.dateInput}
            value={data.dueDate || getCurrentDate()}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            disabled={!data.createFollowUp}
          />
          <Input
            type="time"
            className={styles.timeInput}
            value={data.dueTime || getCurrentTime()}
            onChange={(e) => handleChange("dueTime", e.target.value)}
            disabled={!data.createFollowUp}
          />
        </div>

        {/* Reminder */}
        <div className={styles.reminderRow}>
          <Checkbox
            checked={data.reminder}
            onChange={(_e, checkBoxData) => handleChange("reminder", checkBoxData.checked)}
            disabled={!data.createFollowUp}
            label="Reminder?"
          />
          <Input
            type="number"
            className={styles.reminderNumber}
            value={data.reminderValue}
            onChange={(e) => handleChange("reminderValue", e.target.value)}
            disabled={!data.createFollowUp || !data.reminder}
            placeholder="15"
          />
          <Dropdown
            className={styles.reminderDropdown}
            placeholder="Minutes"
            value={data.reminderUnit}
            selectedOptions={data.reminderUnit ? [data.reminderUnit] : []}
            onOptionSelect={handleReminderUnitChange}
            disabled={!data.createFollowUp || !data.reminder}
          >
            {reminderOptions.map((option) => (
              <Option key={option.key} value={option.key}>
                {option.text}
              </Option>
            ))}
          </Dropdown>
        </div>
      </div>
    </Card>
  );
};

export default FollowUpCard;

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
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
  inputRow: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    marginLeft: tokens.spacingHorizontalL, // Indent under checkbox
  },
  dateTimeRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    marginLeft: tokens.spacingHorizontalL,
  },
  reminderRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginLeft: tokens.spacingHorizontalL,
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    minWidth: "70px",
  },
  dropdown: {
    minWidth: "120px",
  },
  dateInput: {
    width: "120px",
  },
  timeInput: {
    width: "100px",
  },
  reminderNumber: {
    width: "60px",
  },
  reminderDropdown: {
    width: "100px",
  },
});
