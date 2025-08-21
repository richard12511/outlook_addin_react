import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { makeStyles, Tab, TabList, TabValue, tokens } from "@fluentui/react-components";
import FindBpCard from "./FindBpCard";
import SelectedBpCard from "./SelectedBpCard";
import FindProjectCard from "./FindProjectCard";
import FollowUpCard, { FollowUpData } from "./FollowUpCard";

export interface TabsProps {
  onFindClick: (cardCode: string, name: string, email: string) => void;
  onBrowse: (cardCode: string, name: string, email: string) => void;
  onProjectFindClick: (projectCode: string) => void;
  selectedBP: {
    cardCode: string;
    name: string;
    city: string;
    country: string;
    involvements: string[];
    projectCode: string;
  } | null;
  activeTab?: TabValue;
  onTabChange?: (tabValue: TabValue) => void;
  followUpData: FollowUpData;
  onFollowUpChange: (data: FollowUpData) => void;
}

const Tabs: React.FC<TabsProps> = ({
  onFindClick,
  onBrowse,
  onProjectFindClick,
  selectedBP,
  activeTab,
  onTabChange,
  followUpData,
  onFollowUpChange,
}) => {
  const styles = useStyles();

  const handleTabSelect = (_event: any, data: { value: TabValue }) => {
    if (onTabChange) {
      onTabChange(data.value);
    }
  };

  return (
    <div className={styles.tabContainer}>
      <TabList selectedValue={activeTab} onTabSelect={handleTabSelect} className={styles.tabList}>
        <Tab value="search">Search</Tab>
        <Tab value="selected" disabled={!selectedBP}>
          Selected BP
        </Tab>
        <Tab value="followup">Follow-Up</Tab>
        <Tab value="attachments">Attachments</Tab>
      </TabList>

      <div className={styles.tabContent}>
        {activeTab === "search" && (
          <div>
            <FindBpCard onFind={onFindClick} onBrowse={onBrowse} />
            <FindProjectCard onFind={onProjectFindClick} />
          </div>
        )}

        {activeTab === "selected" && selectedBP && (
          <SelectedBpCard
            cardCode={selectedBP.cardCode}
            name={selectedBP.name}
            city={selectedBP.city}
            country={selectedBP.country}
            involvements={selectedBP.involvements}
            projectCode={selectedBP.projectCode}
          />
        )}

        {activeTab === "followup" && (
          <FollowUpCard data={followUpData} onChange={onFollowUpChange} />
        )}
      </div>
    </div>
  );
};

export default Tabs;

const useStyles = makeStyles({
  tabContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  tabList: {
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXS,
  },
  tabContent: {
    paddingTop: tokens.spacingVerticalS,
  },
  findProjectCard: {
    marginTop: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  projectContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  projectButtonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
});
