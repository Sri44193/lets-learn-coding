# Chrome Web Store Listing — Transcript & Text Extractor Pro

> Last Updated: 2026-05-25

## Store Listing

**Extension Name**
Transcript & Text Extractor Pro

**Short Description**
Extract transcripts, article text, and custom selections from any web page and copy them to the clipboard.

**Detailed Description**
Extract transcripts, reading articles, and text snippets from any website with a single click.

Transcript & Text Extractor Pro provides an elegant, premium utility dashboard to grab text content from web pages, parse articles into a clean reading format, capture selections, or extract YouTube transcripts automatically.

Key Features:
- Auto-Extract: Analyzes page structures to pull out headers, articles, and lists while removing distracting sidebars, ads, cookie notices, and footers.
- AI Study Guide Generator: Converts any extracted text or transcript into a rigorous, well-structured study guide using Chrome's built-in on-device AI (Gemini Nano) with executive overviews, key concepts, detailed notes, and quick-review flashcards.
- YouTube Transcript Extraction: Automatically detects YouTube video pages, opens the transcript drawer, and extracts time-coded captions or plain-text transcripts.
- Custom CSS Selector Extraction: Enter any class or ID to target specific parts of a page dynamically.
- Clipboard Auto-Sync: Set up the extension to copy extracted text or study guides to your clipboard automatically.
- Format Utilities: Quickly clean up extracted text by stripping timestamps, removing empty lines, or cleaning up extra spaces.
- Local Storage Persistence: Extracted transcripts and generated study guides are saved automatically so you won't lose your work when closing the extension.
- Context Menu: Right-click any text selection on a webpage to send it directly to the extractor.

How to Use:
1. Navigate to any web page containing text, articles, or a YouTube video.
2. Click the extension icon to open the workspace.
3. Click "Auto-Extract" to extract the main article text, or "YouTube Extract" if you are watching a YouTube video.
4. Switch to the "AI Study Guide" tab.
5. Click "Generate Study Guide" to trigger the on-device AI model. Watch the structured guide stream in real-time.
6. Click "Copy" or "Download .md" to save your guide.

Privacy & Security Note:
This extension operates entirely locally. Text extraction, AI study guide generation, clipboard writes, and formatting are processed on your device. We do not transmit your browsing history, page contents, or text extractions off-device. (Built-in AI uses Chrome's LanguageModel API running locally on your hardware).

**Category**
Productivity

**Single Purpose**
Extracts text, transcripts, and custom selections from web pages and copies them to the clipboard.

**Primary Language**
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Not created | |

### Screenshot Notes
- Screenshot 1: Active extension popup on a blog article showing clean extracted text, stats, and the "Copied to Clipboard!" success toast.
- Screenshot 2: Extension popup on a YouTube video watch page displaying the parsed YouTube transcript with time codes.
- Screenshot 3: Right-click context menu active on text selection, showing the option "Send selection to Extractor".

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `activeTab` | permissions | Grants temporary script execution permissions on the current tab when the user opens the popup or triggers the context menu. |
| `scripting` | permissions | Required to execute the content extraction script within the tab DOM environment. |
| `storage` | permissions | Required to persist the extracted text, user configuration settings (e.g. auto-copy state), and custom selectors between popup views. |
| `contextMenus` | permissions | Allows the user to highlight text and right-click to extract/copy the selection without opening the popup first. |
| `tabs` | permissions | Required to safely read the tab's URL and title for YouTube page detection and file naming. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
https://github.com/srikanth/chrome-transcript-extractor/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

## Developer Info

**Publisher Name**
Srikanth

**Contact Email**
srikanth@example.com

**Support URL / Email**
https://github.com/srikanth/chrome-transcript-extractor/issues

**Homepage URL**
https://github.com/srikanth/chrome-transcript-extractor

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.1.0 | 2026-05-25 | Redesigned popup with tabbed navigation. Added built-in on-device AI layer (Gemini Nano Prompt API) to generate structured Study Guides with streaming outputs, cancellation support, and Markdown downloads. | Draft |
| 1.0.0 | 2026-05-25 | Initial release of Transcript & Text Extractor Pro. | Published |

## Review Notes

### Known Issues / Limitations
- None. Runs fully client-side.
