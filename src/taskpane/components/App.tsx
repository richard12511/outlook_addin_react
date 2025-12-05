import * as React from "react";
import { useState, useEffect } from "react";
import Progress from "./Progress";
import {
  makeStyles,
  Button,
  Input,
  Label,
  Spinner,
  Card,
  CardHeader,
  Text,
  Dropdown,
  MessageBar,
  Option,
  tokens,
  TabValue,
} from "@fluentui/react-components";
import BpModal from "./BpModal";
import Tabs from "./Tabs";
import { searchBusinessPartners } from "../../api/searchBusinessPartners";
import { getInvolvements } from "../../api/getInvolvements";
import { getCurrentTime, getDefaultDate } from "../../util/dateUtils";
import { buildOutlookActivity } from "../../util/activityUtils";
import { createActivity } from "../../api/createActivity";
import { AttachmentsData, BusinessPartner, FollowUpData, Project } from "../../types";
import { processAttachments } from "../../util/attachmentProcessor";
import ProjectModal from "./ProjectModal";
import { getBpForProject } from "../../api/getBpForProject";
import { searchProjects } from "../../api/searchProjects";
import { extractInvoiceNumber } from "../../util/invoiceUtils";
import { removeParentheses } from "../../util/stringUtils";
import { EmailRecipient, extractEmailAddresses } from "../../util/emailUtils";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const categoryOptions = [
  { key: "6", text: "Closing" },
  { key: "7", text: "Currency Conversion" },
  { key: "18", text: "Discussion" },
  { key: "11", text: "Do Not Use(Cus Vis)" },
  { key: "16", text: "Do Not Use(Phone)" },
  { key: "19", text: "Error" },
  { key: "21", text: "Educational" },
  { key: "15", text: "Exhibition" },
  { key: "8", text: "Export Check" },
  { key: "3", text: "Follow Up: E-mail" },
  { key: "-1", text: "General" },
  { key: "14", text: "Mail" },
  { key: "13", text: "Member" },
  { key: "25", text: "Other" },
  { key: "22", text: "Pay. Term: Fixed" },
  { key: "23", text: "Pay. Term: Milestone" },
  { key: "24", text: "Pay. Term: Reimburse" },
  { key: "17", text: "Phone Call" },
  { key: "5", text: "Product Order Form" },
  { key: "12", text: "Prospect" },
  { key: "9", text: "Quote" },
  { key: "2", text: "Received E-mail" },
  { key: "26", text: "Send Email Membership" },
  { key: "4", text: "Sent E-mail" },
  { key: "1", text: "Short Term Key" },
  { key: "10", text: "Trial" },
  { key: "20", text: "WebEx session" },
];

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
  const styles = useStyles();
  const [subject, setSubject] = useState<string>("");
  const [selectedCategory, setSeclectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [didAttachmentUpload, setDidAttachmentUpload] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"info" | "success" | "warning" | "error">("info");
  const [detectedInvoice, setDetectedInvoice] = useState<number | null>(null);
  const [emailOptions, setEmailOptions] = useState<EmailRecipient[]>([]);

  //Results Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<BusinessPartner[]>([]);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");

  //Projects Results Modal
  const [isProjModalOpen, setIsProjModalOpen] = useState<boolean>(false);
  const [projSearchResults, setProjSearchResults] = useState<Project[]>([]);
  const [lastProjSearchQuery, setLastProjSearchQuery] = useState<string>("");

  //Follow-Up Tab data
  const [followUpData, setFollowUpData] = useState<FollowUpData>({
    createFollowUp: false,
    dueDate: getDefaultDate(),
    dueTime: getCurrentTime(),
    activity: "other",
    reminder: false,
    reminderUnit: "minutes",
    reminderValue: "15",
  });

  //Attachments Data
  const [attachmentsData, setAttachmentsData] = useState<AttachmentsData>({
    saveEmailMessage: true,
    saveEmailAttachments: true,
  });

  //Selected BP state
  const [selectedBP, setSelectedBP] = useState<{
    cardCode: string;
    name: string;
    city: string;
    country: string;
    involvements: string[];
    projectCode: string;
    projectName: string;
    projectPath: string;
  } | null>(null);

  //Tab state
  const [activeTab, setActiveTab] = useState<TabValue>("search");

  const handleSave = async () => {
    console.log("Starting to SAVE!!!");

    if (!selectedBP) {
      setMessage("Please select a business partner before saving");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (!subject.trim()) {
      setMessage("Please enter a subject before saving.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Saving activity, please wait...");
      setMessageType("info");

      const userEmail = getUserEmail();
      console.log("Current user email: ", userEmail);

      //Process attachments
      let attachmentPaths = "";
      if (attachmentsData.saveEmailMessage || attachmentsData.saveEmailAttachments) {
        console.log("Inside App.tsx, about to start processing attachments");
        try {
          attachmentPaths = await processAttachments(
            subject,
            attachmentsData.saveEmailMessage,
            attachmentsData.saveEmailAttachments
          );

          console.log("Uploaded files: ", attachmentPaths);
          setDidAttachmentUpload(true);
        } catch (error) {
          console.error("Attachment process failed: ", error);
          setDidAttachmentUpload(false);
          setMessage("Failed to upload attachment");
          setTimeout(() => setMessage(""), 5000);
          setMessageType("error");
          return;
        }
      }

      let emailBody = "Email content not available";

      //Extract the email body from message
      try {
        const item = Office.context.mailbox.item;
        if (item && item.body) {
          if (item.body.getAsync) {
            //This is async, so just testing weith placeholder for now
            emailBody = await new Promise<string>((resolve, reject) => {
              item.body.getAsync(Office.CoercionType.Text, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                  resolve(result.value || "");
                } else {
                  reject(new Error(result.error?.message || "Failed to get email body"));
                }
              });
            });
          }
        }
      } catch (error) {
        console.log("Could not extract email body: ", error);
      }

      console.log("SelectedCategory: ", selectedCategory);

      //Build the activity data object
      const activityData = buildOutlookActivity(
        subject,
        selectedCategory,
        selectedBP,
        followUpData,
        attachmentsData,
        emailBody,
        attachmentPaths,
        userEmail
      );

      // activityData.AttachmentPaths = attachmentPaths;
      console.log("Activity data to POST: ", activityData);

      //Send POST request to API
      const result = await createActivity(activityData);
      console.log("Save result: ", result);

      if (result.didSave) {
        let successMessage = "Email activity saved successfully! \nClgCode: " + result.clgCode;

        if (followUpData.createFollowUp && result.didFollowUpSave) {
          successMessage += " Follow-up activity also created.";
        } else if (followUpData.createFollowUp && !result.didFollowUpSave) {
          successMessage += " However, follow-up activity failed to save.";
        }

        setMessage(successMessage);
        setMessageType("success");
        setTimeout(() => {
          if (Office.context.ui) {
            Office.context.ui.closeContainer();
          } else {
            window.close();
          }
        }, 4000);
      } else {
        var message = "Failed to save activity: " + result.error;
        setMessage(message);
        setMessageType("error");
      }
    } catch (error) {
      console.log("Save error: ", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setMessage(`Save Failed: ${errorMessage}`);
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  const handleCancel = () => {
    if (Office.context.ui) {
      Office.context.ui.closeContainer();
    } else {
      window.close();
    }
  };

  const handleCategoryChange = (_event: any, data: any) => {
    setSeclectedCategory(data.optionValue || "");
  };

  const getCategoryText = (key: string): string => {
    const option = categoryOptions.find((opt) => opt.key === key);
    return option ? option.text : "";
  };

  const handleFind = async (cardCode: string, name: string, email: string) => {
    try {
      setIsSaving(true);
      setMessage("Searching for Business Partners...");
      setMessageType("info");

      const results = await searchBusinessPartners(cardCode, name, email);

      //If we have just a single result, auto select it for user convenience
      if (results.length === 1) {
        console.log("Single result found, auto-selecting: ", results[0]);
        await handleBpSelect(results[0]);
        setMessage(`Auto-selected: ${results[0].CardName}`);
        setMessageType("success");
        return; //Exit early, don't show modal
      }

      setSearchResults(results);
      setLastSearchQuery(name || cardCode || email || "search");
      setIsModalOpen(true);

      setMessage(`Found ${results.length} results`);
      setMessageType("success");
    } catch (error) {
      console.error("Search error:", error);
      setMessage(error instanceof Error ? error.message : "Search failed");
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleBpSelect = async (bp: BusinessPartner) => {
    console.log("BP selected in App:", bp);
    const selectedBPData = {
      cardCode: bp.CardCode,
      name: bp.CardName,
      city: bp.City,
      country: bp.Country,
      involvements: [],
      projectCode: "",
      projectName: "",
      projectPath: "",
    };

    const results = await getInvolvements(selectedBPData.cardCode);
    console.log("results of getInvolvements: ", results);
    selectedBPData.involvements = results;
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

  const handleFollowUpDataChanged = (data: FollowUpData) => {
    console.log("FollowUpData: ", data);
    setFollowUpData(data);
  };

  const handleAttachmentsDataChanged = (data: AttachmentsData) => {
    console.log("Attachments Data changed: ", data);
    setAttachmentsData(data);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchResults([]);
    setLastSearchQuery("");
  };

  const handleBrowse = async () => {
    try {
      setIsSaving(true);
      setMessage("Getting all BPs, this might take awhile...");
      setMessageType("info");

      const results = await searchBusinessPartners(null, null, null);
      console.log("Browsed bps, results.length: ", results.length);

      setSearchResults(results);
      setLastSearchQuery("browse");
      setIsModalOpen(true);

      setMessage(`Found ${results.length} results`);
      setMessageType("success");
    } catch (error) {
      console.error("Search error:", error);
      setMessage(error instanceof Error ? error.message : "Search failed");
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleProjectFind = async (
    projectCode: string,
    projectName: string,
    projectPath: string
  ) => {
    console.log("Project Find clicked with: ", { projectCode, projectName, projectPath });
    try {
      setIsSaving(true);
      setMessage("Searching for Projects...");
      setMessageType("info");
      const results = await searchProjects(projectCode, projectName, projectPath);

      if (results.length === 1) {
        await handleProjectSelect(results[0]);
        // setMessage(`Auto-selected: ${results[0].ProjectName}`);
        setMessageType("success");
        return; //Exit early, don't even show the modal
      }

      setProjSearchResults(results);
      setLastProjSearchQuery(projectCode || projectName || projectPath || "search");
      setIsProjModalOpen(true);
      setMessage(`Found ${results.length} results`);
      setMessageType("success");
    } catch (error) {
      console.error("Search Projects error: ", error);
      setMessage(error instanceof Error ? error.message : "Search Projects failed");
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCloseProjectModal = () => {
    setIsProjModalOpen(false);
    setProjSearchResults([]);
    setLastProjSearchQuery("");
  };

  const handleProjectSelect = async (project: Project) => {
    const bpForProjResults = await getBpForProject(project.Code);
    const bp = bpForProjResults.bp;
    const selectedBPData = {
      cardCode: bp.CardCode,
      name: bp.CardName,
      city: bp.City,
      country: bp.Country,
      involvements: bpForProjResults.involvements,
      projectCode: project.Code,
      projectName: project.ProjectName,
      projectPath: project.ProjectPath,
    };

    setSelectedBP(selectedBPData);
    console.log("bp selected: ", selectedBPData);

    setActiveTab("selected");
    setMessage(`Selected: Project: ${project.Code}, ${bp.CardName} (${bp.CardCode})`);
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    if (isOfficeInitialized) {
      loadEmailSubject();
      loadEmailAddresses();
    }
  }, [isOfficeInitialized]);

  useEffect(() => {
    const invoiceNum = extractInvoiceNumber(subject);
    setDetectedInvoice(invoiceNum);
  }, [subject]);

  const loadEmailSubject = async () => {
    try {
      const item = Office.context.mailbox.item;
      if (item) {
        // Check if we're in compose mode by checking if subject has getAsync method
        // In compose mode, properties use async getters; in read mode, they're direct properties
        const isComposeMode = typeof item.subject.getAsync === "function";

        if (isComposeMode) {
          // Composing/sending an email
          setSeclectedCategory("4"); // Sent E-mail

          item.subject.getAsync((result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              const rawSubject = result.value || "";
              const cleanedSubject = removeParentheses(rawSubject);
              console.log("Raw subject: ", rawSubject);
              console.log("Cleaned subject: ", cleanedSubject);
              setSubject(cleanedSubject);
            }
            setIsLoading(false);
          });
        } else {
          // Reading a received email
          setSeclectedCategory("2"); // Received E-mail

          const rawSubject = item.subject || "";
          const cleanedSubject = removeParentheses(rawSubject);
          console.log("Raw subject: ", rawSubject);
          console.log("Cleaned subject: ", cleanedSubject);
          setSubject(cleanedSubject);
          setIsLoading(false);
        }
      } else {
        setSeclectedCategory("-1"); // General
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading email subject:", error);
      setSeclectedCategory("-1");
      setIsLoading(false);
    }
  };

  const loadEmailAddresses = async () => {
    try {
      const addresses = await extractEmailAddresses();
      setEmailOptions(addresses);
    } catch (error) {
      console.log("Error loading email addresses: ", error);
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

  const getUserEmail = (): string => {
    try {
      const userProfile = Office.context.mailbox.userProfile;
      return userProfile.emailAddress;
    } catch (error) {
      console.error("Error getting the user email: ", error);
      return "";
    }
  };

  return (
    <div className={styles.root}>
      {message && (
        <MessageBar intent={messageType} style={{ marginBottom: tokens.spacingVerticalS }}>
          {message}
          {isSaving && <Spinner size="tiny" style={{ marginRight: tokens.spacingHorizontalXS }} />}
        </MessageBar>
      )}

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
              disabled={isSaving}
            />
          )}
        </div>

        {/* Show invoice detection indicator */}
        {detectedInvoice && (
          <div className={styles.invoiceDetected}>
            ℹ️ Invoice {detectedInvoice} detected - will be linked to activity
          </div>
        )}

        {/*Mail Type Dropdown */}
        <div className={styles.inputGroup}>
          <Label htmlFor="category-dropdown" weight="semibold">
            Type:
          </Label>
          <Dropdown
            id="category-dropdown"
            placeholder="Select a type"
            value={getCategoryText(selectedCategory)}
            selectedOptions={selectedCategory ? [selectedCategory] : []}
            onOptionSelect={handleCategoryChange}
            disabled={isSaving}
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
          followUpData={followUpData}
          onFollowUpChange={handleFollowUpDataChanged}
          attachmentsData={attachmentsData}
          onAttachmentsChange={handleAttachmentsDataChanged}
          emailOptions={emailOptions}
          disabled={isSaving}
        />

        <div className={styles.buttonGroup}>
          <Button appearance="primary" onClick={handleSave} disabled={isSaving || !selectedBP}>
            Save
          </Button>
          <Button appearance="secondary" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Results Modals */}
      <BpModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleBpSelect}
        searchResults={searchResults}
        searchQuery={lastSearchQuery}
      />
      <ProjectModal
        isOpen={isProjModalOpen}
        onClose={handleCloseProjectModal}
        onSelect={handleProjectSelect}
        searchResults={projSearchResults}
        searchQuery={lastProjSearchQuery}
      />
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: tokens.spacingVerticalXS,
    gap: tokens.spacingVerticalXS,
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: tokens.spacingVerticalXS,
    textAlign: "center",
    borderRadius: tokens.borderRadiusMedium,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    // flex: 1,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    // marginTop: "auto",
    marginTop: tokens.spacingVerticalXS,
    paddingTop: tokens.spacingVerticalXS,
  },
  invoiceDetected: {
    fontSize: "12px",
    color: tokens.colorBrandForeground1,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    marginTop: tokens.spacingVerticalXXS,
  },
});

export default App;
