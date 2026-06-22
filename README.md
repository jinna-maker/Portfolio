# Jinna Student Portfolio Website

This is a production-ready static portfolio website for GitHub Pages.  
It reads public-safe project data from Google Sheets CSV links.

## Recommended architecture

```text
Google Drive = private file storage
Google Sheet = master index and public-safe links
GitHub Pages = public website
```

## Folder placement

Put this repository/package here in your portfolio storage:

```text
Jinna_Lifelong_Portfolio
└── 00_Master_Index
    ├── Jinna_00_Master_Index_Production_Template.xlsx
    └── Portfolio_Website_Data
        └── jinna_github_pages_portfolio
```

## Files

```text
index.html
assets/css/style.css
assets/js/config.js
assets/js/app.js
assets/img/default_project_cover.svg
README.md
.nojekyll
PRIVACY_CHECKLIST.md
```

## Setup steps

### 1. Upload the Excel template to Google Drive

Upload:

```text
Jinna_00_Master_Index_Production_Template.xlsx
```

Open it with Google Sheets.

### 2. Publish the safe tabs as CSV

In Google Sheets:

```text
File → Share → Publish to web
```

Publish these tabs as CSV:

```text
Website_Config
Profile
Projects
Achievements
Certificates
Skills
Education
Media
```

### 3. Paste CSV URLs into Website_Config

In the `Website_Config` tab, paste the published CSV URL for each tab.

### 4. Publish Website_Config as CSV

Copy the published CSV URL for `Website_Config`.

### 5. Edit `assets/js/config.js`

Replace:

```js
CONFIG_CSV_URL: "PASTE_WEBSITE_CONFIG_CSV_URL_HERE"
```

with your published `Website_Config` CSV URL.

Then change:

```js
USE_SAMPLE_DATA_IF_CONFIG_MISSING: false
```

### 6. Push to GitHub

Create a GitHub repository, for example:

```text
jinna-portfolio
```

Upload all website files.

### 7. Enable GitHub Pages

Go to:

```text
Repository → Settings → Pages
```

Choose:

```text
Deploy from a branch
Branch: main
Folder: /root
```

Your website will be available from GitHub Pages.

## Safety rule

The website filters data using:

```text
Publish = Yes
Visibility = Public
```

However, published CSV data itself is still public.  
Do not publish private tabs or private fields.

## Best practice

Keep private evidence in Google Drive.  
Use only selected public links in Google Sheet.  
Use GitHub Pages only for the public website.
