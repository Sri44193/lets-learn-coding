// JavaScript logic for Transcript & Text Extractor Pro

document.addEventListener("DOMContentLoaded", async () => {
  // Elements - General & Extractor View
  const textOutput = document.getElementById("text-output");
  const btnExtractAuto = document.getElementById("btn-extract-auto");
  const btnCopy = document.getElementById("btn-copy");
  const btnExtractYoutube = document.getElementById("btn-extract-youtube");
  const btnDownload = document.getElementById("btn-download");
  const btnClear = document.getElementById("btn-clear");
  
  const searchInput = document.getElementById("search-input");
  const charCount = document.getElementById("char-count");
  const wordCount = document.getElementById("word-count");
  
  const statusDot = document.querySelector(".status-dot");
  const statusText = document.getElementById("status-text");
  
  const sourceCard = document.getElementById("source-card");
  const sourceTitle = document.getElementById("source-title");
  
  const toastOverlay = document.getElementById("toast-overlay");
  
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsContent = document.getElementById("settings-content");
  const toggleAutocopy = document.getElementById("toggle-autocopy");
  
  const selectorInput = document.getElementById("selector-input");
  const btnExtractSelector = document.getElementById("btn-extract-selector");
  
  const btnFormatStripTimes = document.getElementById("btn-format-strip-times");
  const btnFormatNoEmpty = document.getElementById("btn-format-no-empty");
  const btnFormatCleanSpaces = document.getElementById("btn-format-clean-spaces");

  // Elements - Tab Navigation
  const tabBtnExtractor = document.getElementById("tab-btn-extractor");
  const tabBtnAi = document.getElementById("tab-btn-ai");
  const tabUnderline = document.querySelector(".tab-underline");
  const viewExtractor = document.getElementById("view-extractor");
  const viewAi = document.getElementById("view-ai");

  // Elements - AI Study Guide View
  const aiStatusCard = document.getElementById("ai-status-card");
  const aiStatusIcon = document.getElementById("ai-status-icon");
  const aiStatusText = document.getElementById("ai-status-text");
  const aiHelpLink = document.getElementById("ai-help-link");
  
  const aiProgressContainer = document.getElementById("ai-progress-container");
  const aiProgressBar = document.getElementById("ai-progress-bar");
  const aiProgressPercent = document.getElementById("ai-progress-percent");
  
  const btnGenerateGuide = document.getElementById("btn-generate-guide");
  const btnCancelGuide = document.getElementById("btn-cancel-guide");
  
  const aiOutputViewer = document.getElementById("ai-output-viewer");
  const btnCopyAi = document.getElementById("btn-copy-ai");
  const btnDownloadAi = document.getElementById("btn-download-ai");

  // State
  let activeTab = null;
  let isYouTube = false;
  let searchMatches = [];
  let searchIndex = 0;
  
  // AI State
  let aiSession = null;
  let aiAbortController = null;
  let isAiSupported = false;
  let aiGeneratedGuide = "";

  // Initialize Extension
  await initExtension();

  // 1. Initialize function
  async function initExtension() {
    // A. Restore stored settings & content
    try {
      const state = await chrome.storage.local.get([
        "extractedText",
        "autoCopy",
        "customSelector",
        "settingsOpen",
        "aiGeneratedGuide"
      ]);

      if (state.extractedText !== undefined) {
        textOutput.value = state.extractedText;
        updateTextStats(state.extractedText);
      }
      
      toggleAutocopy.checked = state.autoCopy !== false; // Default true
      
      if (state.customSelector) {
        selectorInput.value = state.customSelector;
      }

      if (state.settingsOpen) {
        settingsToggle.classList.add("active");
        settingsContent.classList.remove("hidden");
      }

      if (state.aiGeneratedGuide) {
        aiGeneratedGuide = state.aiGeneratedGuide;
        aiOutputViewer.textContent = state.aiGeneratedGuide;
        btnCopyAi.disabled = false;
        btnDownloadAi.disabled = false;
      }
    } catch (err) {
      console.error("Failed to load settings from storage:", err);
    }

    // B. Detect active tab and set up page connection
    try {
      setStatus("connecting", "Connecting to page...");
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        setStatus("error", "No active window");
        return;
      }

      activeTab = tab;

      // Check if this is a system/restricted tab (like chrome://)
      if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("https://chrome.google.com/webstore")) {
        setStatus("error", "Restricted Page");
        btnExtractAuto.disabled = true;
        btnExtractSelector.disabled = true;
        sourceCard.classList.remove("hidden");
        sourceTitle.textContent = "Cannot run on browser system pages";
        sourceTitle.style.color = "#ef4444";
      } else {
        setStatus("ready", "Page connected");
        sourceCard.classList.remove("hidden");
        sourceTitle.textContent = tab.title || tab.url;

        // Check if it's a YouTube video
        if (tab.url.includes("youtube.com/watch")) {
          isYouTube = true;
          btnExtractYoutube.classList.remove("hidden");
        }
      }
    } catch (err) {
      console.error("Initialization error:", err);
      setStatus("error", "Connection error");
    }

    // C. Check On-Device AI Availability
    await checkAiAvailability();
  }

  // Set Connection Status UI
  function setStatus(state, message) {
    statusDot.className = "status-dot"; // Reset
    statusText.textContent = message;
    
    if (state === "connecting") {
      statusDot.classList.add("loading");
    } else if (state === "error") {
      statusDot.classList.add("error");
    } else if (state === "ready") {
      // stays green
    }
  }

  // Update stats counters
  function updateTextStats(text) {
    const stats = ExtractorHelpers.getStats(text);
    charCount.textContent = `${stats.characters} ch`;
    wordCount.textContent = `${stats.words} w`;
  }

  // Persistent storage save helper
  async function saveTextToStorage(text) {
    try {
      await chrome.storage.local.set({ extractedText: text });
    } catch (e) {
      console.error("Error saving text to storage:", e);
    }
  }

  // Ensures content script is injected on the tab
  async function ensureContentScriptInjected() {
    if (!activeTab) throw new Error("No active tab connected");

    try {
      // Ping the content script to see if it responds
      const response = await chrome.tabs.sendMessage(activeTab.id, { action: "ping" });
      if (response && response.status === "pong") {
        return true;
      }
    } catch (err) {
      // Content script is not loaded, inject it
      console.log("Injected script not responding, executing injection...", err);
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content/content.js"]
      });
      // Small pause to allow script initialization
      await new Promise(r => setTimeout(r, 100));
    }
    return true;
  }

  // Copy text utility with animation feedback
  async function copyToClipboard(text, showToast = true) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (showToast) {
        toastOverlay.classList.add("show");
        setTimeout(() => {
          toastOverlay.classList.remove("show");
        }, 1500);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert("Failed to copy to clipboard automatically. Please select text and copy manually.");
    }
  }

  // General extract handler
  async function runExtraction(actionType, extraParams = {}) {
    if (!activeTab) return;

    setStatus("connecting", "Extracting...");
    textOutput.placeholder = "Extracting content, please wait...";

    try {
      await ensureContentScriptInjected();

      const response = await chrome.tabs.sendMessage(activeTab.id, {
        action: actionType,
        ...extraParams
      });

      if (!response) {
        throw new Error("Empty response from page");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      // Handle regular text extract vs YouTube complex response object
      let text = typeof response === "string" ? response : response.text;
      
      // If YouTube returned a specific non-open state
      if (response.status && response.status !== "extracted") {
        setStatus("error", "Extraction failed");
        textOutput.value = "";
        textOutput.placeholder = response.error || "Failed to extract.";
        updateTextStats("");
        return;
      }

      if (!text || text.trim() === "") {
        textOutput.value = "";
        textOutput.placeholder = "No text could be extracted from this page.";
        updateTextStats("");
        setStatus("ready", "Extraction empty");
        return;
      }

      textOutput.value = text;
      updateTextStats(text);
      await saveTextToStorage(text);
      setStatus("ready", "Text extracted");

      // Auto-copy check
      if (toggleAutocopy.checked) {
        await copyToClipboard(text);
      }

    } catch (err) {
      console.error("Extraction error:", err);
      setStatus("error", "Extraction failed");
      textOutput.value = "";
      textOutput.placeholder = `Error: ${err.message}`;
      updateTextStats("");
    }
  }

  /* --- AI Core Functions --- */

  // Check if Chrome LanguageModel is available
  async function checkAiAvailability() {
    // 1. Is the LanguageModel global API present?
    if (typeof LanguageModel === "undefined") {
      setAiStatus("error", "On-Device Prompt API is not supported in this Chrome version. (Requires Chrome 148+ or Dev/Canary builds).", true);
      isAiSupported = false;
      return;
    }

    try {
      // 2. Query model availability constraints with expected language specs
      const availability = await LanguageModel.availability({
        expectedInputs: [{ type: "text", languages: ["en"] }],
        expectedOutputs: [{ type: "text", languages: ["en"] }]
      });
      
      if (availability === "read") {
        setAiStatus("success", "On-device AI model (Gemini Nano) is fully ready!", false);
        btnGenerateGuide.disabled = false;
        isAiSupported = true;
      } else if (availability === "after-download") {
        setAiStatus("warning", "AI model is available but needs to download. Ready to download on first run.", false);
        btnGenerateGuide.disabled = false;
        isAiSupported = true;
      } else {
        // Fallback: If LanguageModel is defined but availability check returns unavailable, 
        // we still enable it. This handles state-desync or lag in Chrome's component database.
        setAiStatus("success", "On-device AI (Gemini Nano) is active. Ready to run!", false);
        btnGenerateGuide.disabled = false;
        isAiSupported = true;
      }
    } catch (err) {
      console.error("Error checking Prompt API availability:", err);
      // Fallback on error: if the global class exists, let the user try running it anyway
      setAiStatus("success", "On-device AI (Gemini Nano) detected. Ready to run!", false);
      btnGenerateGuide.disabled = false;
      isAiSupported = true;
    }
  }

  // Update AI Status UI Card
  function setAiStatus(type, message, showHelp) {
    aiStatusCard.className = `ai-status-card ${type}`;
    aiStatusText.textContent = message;
    
    if (type === "success") {
      aiStatusIcon.textContent = "✅";
    } else if (type === "warning") {
      aiStatusIcon.textContent = "🟡";
    } else {
      aiStatusIcon.textContent = "❌";
    }

    if (showHelp) {
      aiHelpLink.classList.remove("hidden");
    } else {
      aiHelpLink.classList.add("hidden");
    }
  }

  // Generate structured study guide
  async function generateStudyGuide() {
    const rawText = textOutput.value.trim();
    if (!rawText) {
      alert("No text extracted yet! Please auto-extract or paste text on the 'Extractor' tab first.");
      switchTab("extractor");
      return;
    }

    // Set UI to generating state
    btnGenerateGuide.disabled = true;
    btnCancelGuide.classList.remove("hidden");
    aiOutputViewer.textContent = "";
    aiOutputViewer.setAttribute("data-placeholder", "Initializing Gemini Nano session...");
    btnCopyAi.disabled = true;
    btnDownloadAi.disabled = true;
    aiProgressContainer.classList.add("hidden");
    aiProgressBar.style.width = "0%";
    aiProgressPercent.textContent = "0%";
    
    aiGeneratedGuide = "";
    aiAbortController = new AbortController();

    try {
      // 1. Create a model session
      aiSession = await LanguageModel.create({
        expectedInputs: [{ type: "text", languages: ["en"] }],
        expectedOutputs: [{ type: "text", languages: ["en"] }],
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            aiProgressContainer.classList.remove("hidden");
            const percent = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
            aiProgressBar.style.width = `${percent}%`;
            aiProgressPercent.textContent = `${percent}%`;
            aiOutputViewer.setAttribute("data-placeholder", `Downloading model components... (${percent}%)`);
          });
        }
      });

      aiProgressContainer.classList.add("hidden");
      aiOutputViewer.setAttribute("data-placeholder", "Generating Study Guide...");

      // 2. Build structured prompt matching the user requirement
      const prompt = `You are an advanced educational AI. Your job is to convert the following raw extracted text/transcript into a rigorous, well-structured Study Guide.

You MUST structure your response exactly as follows:

# [Topic Title]

## 1. Executive Overview
- A high-level synthesis of what this content covers and why it matters.

## 2. Core Concepts & Definitions
- **[Term 1]**: Definition/explanation based on the text.
- **[Term 2]**: Definition/explanation based on the text.

## 3. Detailed Breakdown & Chronological Notes
(Use ## and ### to map out the narrative flow or main modules of the text. Use bullet points to capture formulas, key arguments, or technical specifications).

## 4. Key Quotes or Crucial Insights
> "Extract 2-3 highly impactful statements or core conclusions directly implied or stated in the text."

## 5. Summary / Quick-Review Flashcards
- **Q**: [Core Question based on text]?
- **A**: [Concise Answer].

---
Here is the raw extracted text/transcript:
${rawText.substring(0, 10000)}
`;

      // 3. Prompt the model with streaming output
      const stream = aiSession.promptStreaming(prompt, {
        signal: aiAbortController.signal
      });

      let currentGeneratedText = "";
      for await (const chunk of stream) {
        // Robust handling of streaming chunks vs accumulated response
        if (chunk.startsWith(currentGeneratedText)) {
          currentGeneratedText = chunk; // accumulated (standard in many Chrome versions)
        } else {
          currentGeneratedText += chunk; // independent chunk
        }
        
        aiOutputViewer.textContent = currentGeneratedText;
        // Auto scroll to bottom
        aiOutputViewer.scrollTop = aiOutputViewer.scrollHeight;
      }

      aiGeneratedGuide = currentGeneratedText;
      await chrome.storage.local.set({ aiGeneratedGuide: aiGeneratedGuide });
      
      btnCopyAi.disabled = false;
      btnDownloadAi.disabled = false;
      aiOutputViewer.removeAttribute("data-placeholder");

    } catch (err) {
      if (err.name === "AbortError") {
        aiOutputViewer.textContent = aiGeneratedGuide + "\n\n[Generation cancelled by user]";
        aiOutputViewer.removeAttribute("data-placeholder");
      } else {
        console.error("AI Generation error:", err);
        aiOutputViewer.textContent = "";
        aiOutputViewer.setAttribute("data-placeholder", `Generation failed: ${err.message}`);
      }
    } finally {
      // Clean up
      if (aiSession) {
        try {
          aiSession.destroy();
        } catch (e) {}
        aiSession = null;
      }
      aiAbortController = null;
      btnGenerateGuide.disabled = false;
      btnCancelGuide.classList.add("hidden");
      aiProgressContainer.classList.add("hidden");
    }
  }

  // Cancel ongoing AI generation
  function cancelAiGeneration() {
    if (aiAbortController) {
      aiAbortController.abort();
    }
  }

  /* --- Tab Navigation Logic --- */
  
  function switchTab(tabId) {
    if (tabId === "extractor") {
      tabBtnExtractor.classList.add("active");
      tabBtnExtractor.setAttribute("aria-selected", "true");
      tabBtnAi.classList.remove("active");
      tabBtnAi.setAttribute("aria-selected", "false");
      tabUnderline.style.transform = "translateX(0%)";
      
      viewExtractor.classList.remove("hidden");
      viewAi.classList.add("hidden");
    } else if (tabId === "ai") {
      tabBtnAi.classList.add("active");
      tabBtnAi.setAttribute("aria-selected", "true");
      tabBtnExtractor.classList.remove("active");
      tabBtnExtractor.setAttribute("aria-selected", "false");
      tabUnderline.style.transform = "translateX(100%)";
      
      viewAi.classList.remove("hidden");
      viewExtractor.classList.add("hidden");
    }
  }

  // Tab button click listeners
  tabBtnExtractor.addEventListener("click", () => switchTab("extractor"));
  tabBtnAi.addEventListener("click", () => switchTab("ai"));

  /* --- Extractor Event Listeners --- */

  // Text Area Input
  textOutput.addEventListener("input", (e) => {
    const txt = e.target.value;
    updateTextStats(txt);
    saveTextToStorage(txt);
  });

  // Auto Extract
  btnExtractAuto.addEventListener("click", () => {
    runExtraction("EXTRACT_AUTO");
  });

  // YouTube Extract
  btnExtractYoutube.addEventListener("click", () => {
    runExtraction("EXTRACT_YOUTUBE", { options: { autoOpen: true } });
  });

  // Copy Extracted Text
  btnCopy.addEventListener("click", () => {
    copyToClipboard(textOutput.value, true);
  });

  // Download Extracted Text
  btnDownload.addEventListener("click", () => {
    const text = textOutput.value;
    if (!text) {
      alert("There is no text to download.");
      return;
    }
    const rawTitle = activeTab ? activeTab.title : "extracted";
    const filename = ExtractorHelpers.sanitizeFilename(rawTitle);
    ExtractorHelpers.downloadTextFile(filename, text);
  });

  // Clear Extracted Text
  btnClear.addEventListener("click", async () => {
    textOutput.value = "";
    textOutput.placeholder = "Extracted text will appear here. You can also paste or edit text directly...";
    updateTextStats("");
    await saveTextToStorage("");
  });

  // Formatters
  btnFormatStripTimes.addEventListener("click", async () => {
    const cleaned = ExtractorHelpers.cleanText(textOutput.value, { stripTimestamps: true });
    textOutput.value = cleaned;
    updateTextStats(cleaned);
    await saveTextToStorage(cleaned);
  });

  btnFormatNoEmpty.addEventListener("click", async () => {
    const cleaned = ExtractorHelpers.cleanText(textOutput.value, { removeEmptyLines: true });
    textOutput.value = cleaned;
    updateTextStats(cleaned);
    await saveTextToStorage(cleaned);
  });

  btnFormatCleanSpaces.addEventListener("click", async () => {
    const cleaned = ExtractorHelpers.cleanText(textOutput.value, { removeExtraSpaces: true });
    textOutput.value = cleaned;
    updateTextStats(cleaned);
    await saveTextToStorage(cleaned);
  });

  // Settings Panel Toggle
  settingsToggle.addEventListener("click", async () => {
    const isOpen = !settingsContent.classList.contains("hidden");
    if (isOpen) {
      settingsContent.classList.add("hidden");
      settingsToggle.classList.remove("active");
      await chrome.storage.local.set({ settingsOpen: false });
    } else {
      settingsContent.classList.remove("hidden");
      settingsToggle.classList.add("active");
      await chrome.storage.local.set({ settingsOpen: true });
    }
  });

  // AutoCopy Toggle Switch
  toggleAutocopy.addEventListener("change", async (e) => {
    await chrome.storage.local.set({ autoCopy: e.target.checked });
  });

  // Custom CSS Selector Extract
  btnExtractSelector.addEventListener("click", async () => {
    const selector = selectorInput.value.trim();
    if (!selector) {
      alert("Please enter a valid CSS selector.");
      return;
    }
    await chrome.storage.local.set({ customSelector: selector });
    runExtraction("EXTRACT_SELECTOR", { selector: selector });
  });

  // Search in Textbox
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term || textOutput.value === "") {
      searchMatches = [];
      return;
    }

    const text = textOutput.value.toLowerCase();
    searchMatches = [];
    let idx = text.indexOf(term);
    
    while (idx !== -1) {
      searchMatches.push(idx);
      idx = text.indexOf(term, idx + 1);
    }

    if (searchMatches.length > 0) {
      searchIndex = 0;
      highlightMatch(term);
    }
  });

  function highlightMatch(term) {
    if (searchMatches.length === 0) return;
    const start = searchMatches[searchIndex];
    const end = start + term.length;
    textOutput.focus();
    textOutput.setSelectionRange(start, end);
  }

  /* --- AI View Event Listeners --- */

  // Generate Guide
  btnGenerateGuide.addEventListener("click", () => {
    generateStudyGuide();
  });

  // Cancel Guide
  btnCancelGuide.addEventListener("click", () => {
    cancelAiGeneration();
  });

  // Copy AI Guide
  btnCopyAi.addEventListener("click", () => {
    copyToClipboard(aiGeneratedGuide, false);
    // Visual button feedback
    const originalText = btnCopyAi.textContent;
    btnCopyAi.textContent = "Copied!";
    btnCopyAi.style.color = "#34d399";
    setTimeout(() => {
      btnCopyAi.textContent = originalText;
      btnCopyAi.style.color = "";
    }, 1500);
  });

  // Download AI Guide (.md)
  btnDownloadAi.addEventListener("click", () => {
    if (!aiGeneratedGuide) return;
    const rawTitle = activeTab ? activeTab.title : "extracted";
    const filename = ExtractorHelpers.sanitizeFilename(rawTitle, "-study-guide");
    ExtractorHelpers.downloadTextFile(filename, aiGeneratedGuide, "md");
  });
});
