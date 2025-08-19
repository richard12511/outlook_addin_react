import * as React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import Progress from "./Progress";
import {
  makeStyles,
  Button,
  Input,
  Label,
  Spinner,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Dropdown,
  MessageBar,
  Option,
  tokens,
  TabValue,
} from "@fluentui/react-components";
import FindBpCard from "./FindBpCard";
import FindProjectCard from "./FindProjectCard";
import BpModal, { BusinessPartner } from "./BpModal";
import Tabs from "./Tabs";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const categoryOptions = [
  { key: "discussion", text: "Discussion" },
  { key: "mail", text: "Mail" },
  { key: "member", text: "Member" },
  { key: "prospect", text: "Prospect" },
];

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
  const styles = useStyles();
  const [subject, setSubject] = useState<string>("");
  const [selectedCategory, setSeclectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"info" | "success" | "warning" | "error">("info");

  //Results Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<BusinessPartner[]>([]);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");

  //Selected BP state
  const [selectedBP, setSelectedBP] = useState<{
    cardCode: string;
    name: string;
    city: string;
    country: string;
    involvements: string[];
    projectCode: string;
  } | null>(null);

  //Tab state
  const [activeTab, setActiveTab] = useState<TabValue>("search");

  const handleSave = () => {
    console.log("Save clicked with subject:", subject);
    alert("Save clicked");
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    alert("Cancel clicked");
  };

  const handleCategoryChange = (_event: any, data: any) => {
    setSeclectedCategory(data.optionValue || "");
  };

  const handleFind = async (cardCode: string, name: string, email: string) => {
    console.log("Find clicked in parent with: ", { cardCode, name, email });

    try {
      const username = "SAP-Online-Tasker";
      const password = "33-wretch-z*yWv-%z&AhkS";

      //Create Basic Auth Header
      const credentials = btoa(`${username}:${password}`);
      // console.log(credentials);
      console.log("Base64 credentials:", credentials);
      const authHeader = `Basic ${credentials}`;

      // Debug: Decode it back to verify
      const decoded = atob(credentials);
      console.log("Decoded back:", decoded);

      //Build the query string
      const params = new URLSearchParams();
      if (cardCode) params.append("cardCode", cardCode);
      if (name) params.append("name", name);
      if (email) params.append("email", email);

      const baseUrl = "http://localhost:1025/OutlookAddin/SearchBps";
      const fullUrl = `${baseUrl}?${params.toString()}`;
      // const fullUrl = `http://localhost:1025/Countries`;

      console.log("Making http request to:", fullUrl);

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("BP found: ", data);

        setSearchResults(data.bps || []);
        setLastSearchQuery(name || cardCode || email || "search");
        setIsModalOpen(true);

        setMessage(`Found ${data.bps?.length || 0} results`);
        setMessageType("success");
        //Handle success
      } else {
        console.error("HTTP Error: ", response.status, response.statusText);
        setMessage("Network error: Unable to connect to server");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    //make api call to search for bp
  };

  const handleBpSelect = (bp: BusinessPartner) => {
    console.log("BP selected in App:", bp);
    const selectedBPData = {
      cardCode: bp.CardCode,
      name: bp.CardName,
      city: "", //todo
      country: "", //todo
      involvements: [], //todo
      projectCode: "", //todo
    };
    //Fill the SelectedBpCard data with results and switch tabs
    setSelectedBP(selectedBPData);

    console.log("bp selected:", selectedBPData);
    setActiveTab("selected");

    setMessage(`Selected: ${bp.CardName} (${bp.CardCode})`);
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);
  };

  const handleTabChange = (tabValue: TabValue) => {
    setActiveTab(tabValue);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchResults([]);
    setLastSearchQuery("");
  };

  const handleBrowse = (cardCode: string, name: string, email: string) => {
    console.log("Browse clicked in parent with:", { cardCode, name, email });

    //make browse call
  };

  const handleProjectFind = (projectCode: string) => {
    console.log("Project Find clicked with: ", { projectCode });
  };

  useEffect(() => {
    if (isOfficeInitialized) {
      loadEmailSubject();
    }
  }, [isOfficeInitialized]);

  const loadEmailSubject = async () => {
    try {
      const item = Office.context.mailbox.item;
      if (item && item.subject) {
        if (item.subject.getAsync) {
          //For compose mode
          item.subject.getAsync((result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              setSubject(result.value || "");
            }
            setIsLoading(false);
          });
        } else {
          //For read mode
          setSubject(item.subject || "");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading email subject:", error);
      setIsLoading(false);
    }
  };

  if (!isOfficeInitialized) {
    return (
      <Progress
        title={title}
        logo={require("../../../assets/logo-filled.png")}
        message="Please sideload your add-in to see app body."
      />
    );
  }

  return (
    <div className={styles.root}>
      {/* <Header logo={"../../../assets/logo-filled.png"} title="Save Email" message="" /> */}

      {/* Show a message if one exists */}
      {message && (
        <MessageBar intent={messageType} style={{ marginBottom: tokens.spacingVerticalS }}>
          {message}
        </MessageBar>
      )}
      <Card className={styles.header}>
        <CardHeader
          header={
            <Text weight="semibold" size={400}>
              {title}
            </Text>
          }
          description={<Text size={200}>Save email to external database</Text>}
        />
      </Card>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <Label htmlFor="subject-input" weight="semibold">
            Subject:
          </Label>

          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Spinner size="tiny" />
              <Text size={200}>Loading email subject...</Text>
            </div>
          ) : (
            <Input
              id="subject-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          )}
        </div>

        {/*Mail Type Dropdown */}
        <div className={styles.inputGroup}>
          <Label htmlFor="category-dropdown" weight="semibold">
            Type:
          </Label>
          <Dropdown
            id="category-dropdown"
            placeholder="Select a type"
            value={selectedCategory}
            selectedOptions={selectedCategory ? [selectedCategory] : []}
            onOptionSelect={handleCategoryChange}
          >
            {categoryOptions.map((option) => (
              <Option key={option.key} value={option.key}>
                {option.text}
              </Option>
            ))}
          </Dropdown>
        </div>
        <Tabs
          onFindClick={handleFind}
          onBrowse={handleBrowse}
          onProjectFindClick={handleProjectFind}
          selectedBP={selectedBP}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        {/* <FindBpCard onFind={handleFind} onBrowse={handleBrowse} />

        <FindProjectCard onFind={handleProjectFind} /> */}

        <div className={styles.buttonGroup}>
          <Button appearance="primary" onClick={handleSave} disabled={isLoading}>
            Save
          </Button>
          <Button appearance="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Business Partner Modal */}
      <BpModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleBpSelect}
        searchResults={searchResults}
        searchQuery={lastSearchQuery}
      />
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: tokens.spacingVerticalM,
    gap: tokens.spacingVerticalM,
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: tokens.spacingVerticalM,
    textAlign: "center",
    borderRadius: tokens.borderRadiusMedium,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    flex: 1,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    marginTop: "auto",
    paddingTop: tokens.spacingVerticalM,
  },
});

export default App;
