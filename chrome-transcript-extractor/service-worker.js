// Service worker for Transcript & Text Extractor Pro

// Register context menu items synchronously at the top level
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extract-selection",
    title: "Send selection to Extractor",
    contexts: ["selection"]
  });
});

// Listen for context menu click events
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "extract-selection" && info.selectionText) {
    const textToExtract = info.selectionText.trim();
    if (!textToExtract) return;

    try {
      // 1. Get existing text from storage
      const { extractedText = "" } = await chrome.storage.local.get("extractedText");
      
      // 2. Append new selection (with separation if text already exists)
      const newText = extractedText 
        ? `${extractedText}\n\n[Snippet from: ${tab.title || "Webpage"}]\n${textToExtract}` 
        : textToExtract;

      // 3. Save back to storage
      await chrome.storage.local.set({ extractedText: newText });

      // 4. If auto-copy is enabled, write to clipboard
      // Note: Clipboard write from Service Worker is not natively supported without a document context, 
      // so we write it to storage and let the user copy from the popup, OR we can inject a script to 
      // copy it directly using the tab's document context! Let's inject a copy-to-clipboard command.
      const { autoCopy = true } = await chrome.storage.local.get("autoCopy");
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: performSelectionActions,
        args: [textToExtract, autoCopy]
      });

    } catch (err) {
      console.error("Failed to process context menu selection:", err);
    }
  }
});

// Function injected into the active tab to copy selection and display a beautiful toast
function performSelectionActions(text, shouldCopy) {
  // 1. Copy to clipboard if enabled
  if (shouldCopy) {
    try {
      // Create a temporary textarea to perform copy in the page context
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (e) {
      console.error("In-page clipboard copy failed:", e);
    }
  }

  // 2. Display a beautiful glassmorphic toast
  const existing = document.getElementById('ext-transcript-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ext-transcript-toast';
  
  const statusMsg = shouldCopy ? 'Snippet copied to clipboard & Extractor!' : 'Snippet sent to Extractor!';
  toast.textContent = statusMsg;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 20px',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    color: '#38BDF8', // Cyan accent
    borderRadius: '12px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    backdropFilter: 'blur(8px)',
    zIndex: '9999999',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    opacity: '0',
    transform: 'translateY(15px)',
    pointerEvents: 'none'
  });

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Fade out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-15px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
