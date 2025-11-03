# Outlook Add-in - Save Email Activity

A Microsoft Outlook add-in that allows users to save email activities directly to SAP Business One, linking them to Business Partners, Projects, and optionally creating follow-up tasks.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Building and Deployment](#building-and-deployment)
- [Installing the Add-in](#installing-the-add-in)
- [Project Structure](#project-structure)
- [Features](#features)

## Prerequisites

- **Node.js** (v20 or higher. It was developed with 22.17.1)
- **npm** (I used 10.9.2)
- **Outlook Desktop** (works now) **Outlook on the Web**(in the future)
- Access to the https://saponline.htri.net (on the htri network)

## Development Setup

### 1. Clone the Repository
```bash
get the zip from \\files\SWShelf\SAPOutlookAddon\New Outlook Addin
unzip it
cd save_email_addin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following variables:
```env
API_BASE_URL
API_BACKUP_URL
API_USERNAME
API_PASSWORD
```

For production, create a `.env.production` file with the same variables.

### 4. Configure manifest.xml for Development

Ensure `manifest.xml` points to localhost:
```xml
<SourceLocation DefaultValue="https://localhost:3000/taskpane.html"/>
```

### 5. Start the Development Server
```bash
npm start
```

This will:
- Start the webpack dev server on `https://localhost:3000`
- Generate/install SSL certificates for localhost (you may be prompted to approve)
- Enable hot module reloading for live updates
- This should automatically start outlook and sideload the addin, but if it doesn't you can manually install it, see step 6

### 6. Sideload the Add-in in Outlook

**Outlook Desktop (Windows):**
1. Open Outlook
2. Go to **File → Manage Add-ins** (this will open the web version of outlook)
3. Click **My add-ins**
4. Under **Custom Add-ins**, click **Add a custom add-in → Add from File**
5. Browse to your `manifest.xml` file and select it
6. Click **OK** to install

**Outlook on the Web(not ready yet):**
7. Open Outlook on the web
8. Click the Settings gear → **View all Outlook settings**
9. Go to **General → Manage add-ins** 
11. Click **+ Add a custom add-in → Add from file**
12. Upload your `manifest.xml` file

### 7. Access the Add-in

- Open any email in Outlook
- Click the **Save Activity** button in the ribbon
- The add-in task pane will appear on the right side

## Building and Deployment

### 1. Update manifest.xml for Production

Ensure all URLs point to your production server:
```xml
<SourceLocation DefaultValue="https://saponline.htri.net/OutlookAddin/taskpane.html"/>
<IconUrl DefaultValue="https://saponline.htri.net/OutlookAddin/assets/icon-64.png"/>
<!-- Update all other URLs similarly -->
```

### 2. Build the Production Bundle
```bash
npm run build:prod
```

This creates optimized files in the `dist/` folder.

### 3. Deploy to IIS Server

1. **Stop IIS (or just the app pool):**
```cmd
   iisreset /stop
```

2. **Copy files to the server:**
   - Copy the **contents** of the `dist/` folder to:
```
     C:\inetpub\customersites\saponline\OutlookAddin\
```

3. **Verify files are in place:**
```
   OutlookAddin/
   ├── taskpane.html
   ├── taskpane.js
   ├── taskpane.css
   ├── commands.html
   ├── commands.js
   ├── assets/
   │   ├── SAPIcon16.png
   │   ├── SAPIcon32.png
   │   └── SAPIcon80.png
   └── manifest.xml
```

4. **Restart IIS:**
```cmd
   iisreset /start
```

5. **Test the deployment:**
   - Visit: `https://saponline.bpi.net/OutlookAddin/taskpane.html`
   - Verify icons are accessible: `https://saponline.bpi.net/OutlookAddin/assets/SAPIcon80.png`

### 4. Clear Office Add-in Cache (Important!)

After deployment, users may need to clear their Office add-in cache:

**Windows:**
```
%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\
```
1. Close Outlook completely
2. Delete all files in the `Wef` folder
3. Restart Outlook


## Installing the Add-in

### For Individual Users (Sideloading)
1. Open Outlook
2. Go to **File → Manage Add-ins** (this will open the web version of outlook)
3. Click **My add-ins**
4. Under **Custom Add-ins**, click **Add a custom add-in → Add from File**
5. Browse to your `manifest.xml` file and select it
6. Click **OK** to install
Follow the steps in [Development Setup - Step 6](#6-sideload-the-add-in-in-outlook).

## Project Structure
```
save_email_addin/
├── src/
│   ├── api/                      # API communication layer
│   │   ├── apiConstants.ts       # Environment variables and base URLs
│   │   ├── createActivity.ts     # POST activity to SAP
│   │   ├── searchBusinessPartners.ts  # Search BPs
│   │   ├── searchProjects.ts     # Search projects
│   │   ├── uploadAttachments.ts  # Upload files to network share
│   │   ├── getInvolvements.ts    # Get activity types
│   │   └── getBpForProject.ts    # Get BP linked to project
│   │
│   ├── taskpane/                 # Main UI components
│   │   ├── components/
│   │   │   ├── App.tsx           # Main application component
│   │   │   ├── Tabs.tsx          # Tab navigation (Search/Results/Selected)
│   │   │   ├── FindBpCard.tsx    # Business Partner search form
│   │   │   ├── FindProjectCard.tsx    # Project search form
│   │   │   ├── BpModal.tsx   # Search results display for bp search
│   │   │   ├── ProjectModal.tsx   # Search results display for project search
│   │   │   ├── SelectedBpCard.tsx     # Selected BP/Project details
│   │   │   ├── FollowUpCard.tsx  # Follow-up task configuration
│   │   │   └── AttachmentsCard.tsx    # Attachment options
│   │   │
│   │   ├── index.tsx             # Entry point
│   │   └── taskpane.html         # HTML template
│   │
│   ├── commands/                 # Ribbon button commands
│   │   ├── commands.ts           # Command handlers
│   │   └── commands.html         # Commands HTML
│   │
│   ├── types/                    # TypeScript interfaces
│   │   └── index.ts              # All type definitions
│   │
│   └── utils/                    # Utility functions
│       ├── activityUtils.ts      # Build activity objects
│       ├── dateUtils.ts          # Date/time formatting and calculations
│       ├── fileUtils.ts          # File naming and path utilities
│       ├── invoiceUtils.ts       # Invoice number extraction
│       └── httpUtils.ts          # HTTP request helpers (retry logic)
│
├── assets/                       # Icons and images
│   ├── SAPIcon16.png
│   ├── SAPIcon32.png
│   └── SAPIcon80.png
│
├── manifest.xml                  # Add-in manifest
├── webpack.config.js             # Webpack configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── .env                          # Development environment variables
└── .env.production               # Production environment variables
```

### Key Components

#### UI Components (`src/taskpane/components/`)
- **App.tsx**: Main orchestrator, manages state and coordinates between components
- **Tabs.tsx**: Breaks up most of the below components into tabs
- **FindBpCard.tsx**: Search for Business Partners by CardCode, Name, or Email
- **FindProjectCard.tsx**: Search for Projects by Code, Name, or Path
- **ResultsCard.tsx**: Displays search results in a modal table format
- **SelectedBpCard.tsx**: Shows selected Business Partner and associated projects
- **FollowUpCard.tsx**: Configure follow-up tasks with due dates and reminders
- **AttachmentsCard.tsx**: Options to save email message and/or attachments

#### API Methods (`src/api/`)
All API methods include automatic retry logic to a backup server if the primary fails.

- **searchBusinessPartners**: Search against bps(OCRD) with CardCode, Name, and/or Email
- **searchProjects**: Search against @HTR_PROJECTS with Code, Name, and/or Path
- **getBpForProject**: Get the Business Partner associated with a project
- **getInvolvements**: Fetch a distinct list of involvements for the bp that the user selected on the results card
- **createActivity**: POST activity data to SAP Business One activity table(OCLG)
- **uploadAttachments**: Upload email message (.msg) and attachments to network share defined by sap b1

#### Utilities (`src/utils/`)
- **activityUtils.ts**: Builds the activity object for POST requests
- **dateUtils.ts**: Date/time conversion, formatting, and reminder calculations
- **fileUtils.ts**: Generates unique filenames and attachment paths
- **invoiceUtils.ts**: Extracts invoice numbers from email subjects (pattern: "Invoice 5XXXXXX")
- **httpUtils.ts**: Wrapper functions for HTTP requests with retry logic

## Troubleshooting

### Add-in Won't Load
1. Clear Office add-in cache (see deployment section)
2. Verify manifest.xml URLs are correct
3. Hard refresh the add-in: `Ctrl+Shift+R or Ctrl+f5` in the task pane
4. Check browser console for errors (F12 in Outlook Desktop)

### CORS Errors
- Ensure `Global.asax.cs` in saponline has correct CORS headers
- Verify `Access-Control-Allow-Origin` matches your environment (localhost vs production)

### Authentication Failures
- Verify `.env` file has correct credentials
- Check that Basic Auth is configured correctly in saponline `Global.asax.cs`
- May need to change format based on environment: `HTRI\username` vs `username` (if applicable)
- Check the server logs on entweb64(this is a special file for basic_auth failures at: `~/App_Data/basic_auth_debug.log`

### SSL Certificate Issues (Development)
- Run `npm start` as Administrator to install certificates
- Approve certificate installation prompts
- Trust the "Developer CA for Microsoft Office Add-ins" certificate

## Scripts
```bash
npm start          # Start development server on https://localhost:3000
npm run build      # Build for development
npm run build:prod # Build for production with optimizations
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Primary API server URL | `https://saponline.bpi.net` |
| `API_BACKUP_URL` | Backup API server URL | `https://saponlinejr.bpi.net` |
| `API_USERNAME` | Service account username | `a hana db user` |
| `API_PASSWORD` | Service account password | `a hana db user password` |

## Support

For issues or questions, contact an sap administrator 