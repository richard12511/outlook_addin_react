import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { makeStyles, Tab, TabList, TabValue, tokens } from "@fluentui/react-components";
import FindBpCard from "./FindBpCard";
import SelectedBpCard from "./SelectedBpCard";
import FindProjectCard from "./FindProjectCard";

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
}

const Tabs: React.FC<TabsProps> = ({
  onFindClick,
  onBrowse,
  onProjectFindClick,
  selectedBP,
  activeTab,
  onTabChange,
}) => {
  const styles = useStyles();
  //   const [currentTab, setCurrentTab] = useState<TabValue>(activeTab);

  const handleTabSelect = (_event: any, data: { value: TabValue }) => {
    // setCurrentTab(data.value);
    if (onTabChange) {
      onTabChange(data.value);
    }
  };

  //Whenever active tab changes in our parent, we need to set the state here too
  //   useEffect(() => {
  //     setCurrentTab(activeTab);
  //   }, [activeTab]);

  return (
    <div className={styles.tabContainer}>
      <TabList selectedValue={activeTab} onTabSelect={handleTabSelect} className={styles.tabList}>
        <Tab value="search">Search</Tab>
        <Tab value="selected" disabled={!selectedBP}>
          Selected BP
        </Tab>
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
