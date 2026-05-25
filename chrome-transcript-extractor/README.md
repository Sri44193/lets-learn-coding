# Transcript & Text Extractor Pro (with AI Layer)

An elegant, premium Manifest V3 Chrome Extension designed to help users extract transcripts, article text, and custom DOM selections from any webpage and instantly generate rigorous study guides using Chrome's built-in, on-device AI (**Gemini Nano**).

---

## 🌟 Key Features

*   **Auto-Extract (Readability Mode)**: Analyzes page DOM structure to isolate primary text content, removing distracting sidebars, ads, cookie banners, and footers.
*   **YouTube Transcript Automation**: Automatically detects YouTube video pages, opens the caption drawer, extracts time-coded scripts, and formats them in **one click**.
*   **Built-in On-Device AI (Gemini Nano)**: Swaps to the "AI Study Guide" tab to stream structured study resources (Executive Overviews, Core Definitions, Chronological Notes, and Active-Recall Flashcards) locally.
    *   *Zero Server Costs / API Keys*
    *   *100% Offline & Private (no data leaves your machine)*
*   **Advanced Clean-up Tools**: Strip timestamps, collapse empty lines, and remove double spaces in bulk.
*   **Custom CSS Selector**: Query specific class or ID nodes directly.
*   **Context Menu Integration**: Highlight any text selection, right-click, and select *"Send selection to Extractor"* to collect snippets into the workspace with in-page success toasts.
*   **Local State Persistence**: All extractions and study guides persist automatically in `chrome.storage.local` to prevent loss of work on popup close.

---

## 📁 Repository Structure

```
chrome-transcript-extractor/
├── manifest.json         # Extension Manifest V3 configuration
├── service-worker.js     # Background lifecycle & context menus
├── .gitignore            # Git ignore list
├── README.md             # Project documentation
├── CHROMEWEBSTORE.md     # Web Store submission metadata
├── content/
│   └── content.js        # DOM extraction script injected into tabs
├── popup/
│   ├── popup.html        # Glassmorphic user interface structure
│   ├── popup.css         # Modern dark theme styles & animations
│   └── popup.js          # App coordinator & Prompt API wrapper
├── utils/
│   └── helper.js         # Text statistics, cleaning, and downloads
└── icons/
    ├── icon-16.png       # Extension icons in pixel dimensions
    ├── icon-48.png
    └── icon-128.png
```

---

## 🚀 Setup & Installation

### Step 1: Clone and Load the Extension
1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in the URL bar.
3. Turn on **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** (top-left button).
5. Choose this repository folder: `/Users/srikanth/coding/chrome-transcript-extractor`.
6. Pin the extension icon to your toolbar.

### Step 2: Configure On-Device AI Flags (Gemini Nano)
Because the Prompt API runs fully locally on your device, you need to enable the experimental flags:
1. Navigate to `chrome://flags/` in Chrome.
2. Search for **"Optimization Guide On-Device Model"** and set it to **Enabled BypassPrefRequirement**.
3. Search for **"Prompt API for Gemini Nano"** (or **"Prompt API"**) and set it to **Enabled**.
4. Click **Relaunch** to restart the browser.
5. Go to `chrome://on-device-internals` and click the **Model Status** tab to verify that the foundational model is downloaded. If it shows *No On-device Feature Used*, open the extension popup and click **Generate Study Guide** to start the download.

---

## 📖 How to Use

1. **Auto-Extract**: Navigate to an article, click the extension icon, and click **Auto-Extract**. The parsed text will load in the textbox.
2. **YouTube**: Watch a video, open the popup, and click the red **YouTube Extract** button. The extension will automatically open, parse, and load the transcript.
3. **Generate Guide**: Switch to the **AI Study Guide** tab and click **Generate Study Guide**. Gemini Nano will stream the structured guide in real-time.
4. **Export**: Click **Download .md** to export a clean Markdown file ready for Notion or Obsidian, or **Copy** it to your clipboard.
5. **Context Select**: Highlight text on any page, right-click, and click **Send selection to Extractor**.

---

## 🔒 Privacy & Security

This extension is built with absolute privacy in mind:
*   No tracking, no analytics, no external servers.
*   All text parsing, clipboard copies, and AI guide processing happen locally on your hardware.

---

## 📄 License

This project is licensed under the MIT License.
