// Content script for Transcript & Text Extractor Pro

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping") {
    sendResponse({ status: "pong" });
    return;
  }

  // Handle actions asynchronously
  (async () => {
    try {
      let result = "";
      switch (message.action) {
        case "EXTRACT_AUTO":
          result = extractReadableText();
          sendResponse({ text: result });
          break;
        case "EXTRACT_SELECTION":
          result = window.getSelection().toString().trim();
          sendResponse({ text: result });
          break;
        case "EXTRACT_SELECTOR":
          result = extractSelectorText(message.selector);
          sendResponse({ text: result });
          break;
        case "EXTRACT_YOUTUBE":
          result = await extractYouTubeTranscript(message.options || {});
          sendResponse(result); // Sends { text, status, error }
          break;
        default:
          sendResponse({ error: "Unknown action: " + message.action });
      }
    } catch (err) {
      console.error("Error in content script:", err);
      sendResponse({ error: err.message });
    }
  })();

  return true; // Keep channel open for async responses
});

/**
 * Extracts the main readable content of the webpage using heuristics.
 * Excludes headers, footers, sidebars, ads, and navigation blocks.
 */
function extractReadableText() {
  // Selectors of elements we definitely want to skip
  const skipSelectors = [
    'nav', 'header', 'footer', 'aside', 'noscript', 'iframe', 'svg', 'style', 'script',
    '#sidebar', '.sidebar', '#navigation', '.navigation', '.menu', '#menu',
    '.ad-container', '.ads', '.comments', '#comments', '.cookie-banner', '#cookie-consent',
    '.social-share', '.share-buttons', '.footer-links'
  ];

  // Create a clone of the body so we can manipulate it without affecting the original page
  const bodyClone = document.body.cloneNode(true);

  // Remove skip elements from our clone
  skipSelectors.forEach(selector => {
    const elements = bodyClone.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  // Common selectors for main content areas
  const mainContentSelectors = [
    'article', '[role="main"]', '.post', '.article-body', '.entry-content',
    '.main-content', '#main-content', '#content', 'main'
  ];

  let mainContainer = null;
  // Try to find a good container
  for (const selector of mainContentSelectors) {
    const containers = bodyClone.querySelectorAll(selector);
    if (containers.length === 1) {
      mainContainer = containers[0];
      break;
    } else if (containers.length > 1) {
      // Find the one with the most text
      let maxLen = 0;
      containers.forEach(c => {
        const len = c.innerText.trim().length;
        if (len > maxLen) {
          maxLen = len;
          mainContainer = c;
        }
      });
      break;
    }
  }

  // If no container found, use the whole cleaned body clone
  const targetRoot = mainContainer || bodyClone;

  // Walk the DOM tree and collect text with basic formatting
  let paragraphs = [];
  
  function walk(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      // Skip hidden elements
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return;
      }

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const text = node.innerText.trim();
        if (text) {
          // Format headers with markdown-like symbols
          const level = tagName.charAt(1);
          const prefix = '#'.repeat(parseInt(level)) + ' ';
          paragraphs.push(`\n${prefix}${text}\n`);
        }
        return; // Don't descend into headers
      }

      if (tagName === 'p') {
        const text = node.innerText.trim();
        // Only add if it has a reasonable length or is non-empty
        if (text) {
          paragraphs.push(text);
        }
        return;
      }

      if (tagName === 'pre' || tagName === 'code') {
        const text = node.innerText.trim();
        if (text) {
          paragraphs.push(`\n\`\`\`\n${text}\n\`\`\`\n`);
        }
        return;
      }

      if (tagName === 'li') {
        const text = node.innerText.trim();
        if (text) {
          paragraphs.push(`• ${text}`);
        }
        return;
      }
    }

    // Traverse children
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  }

  walk(targetRoot);

  // Filter out adjacent duplicate whitespace and join paragraphs nicely
  const resultText = paragraphs.join('\n\n')
    .replace(/\n{3,}/g, '\n\n') // Limit max consecutive newlines to 2
    .trim();

  // If the result is very short, fallback to raw body text
  if (resultText.length < 150) {
    return document.body.innerText.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
  }

  return resultText;
}

/**
 * Extracts text from a specific CSS selector.
 */
function extractSelectorText(selector) {
  if (!selector) return "";
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) {
      return `No elements found matching selector: "${selector}"`;
    }
    
    let textList = [];
    elements.forEach(el => {
      const txt = el.innerText.trim();
      if (txt) textList.push(txt);
    });
    
    return textList.join("\n\n");
  } catch (err) {
    return `Error querying selector "${selector}": ${err.message}`;
  }
}

/**
 * Smart extractor for YouTube transcripts.
 * Looks for open transcripts, and tries to click-open them if closed.
 */
async function extractYouTubeTranscript(options) {
  // Check if we are actually on a YouTube video page
  if (!window.location.hostname.includes("youtube.com") || !window.location.pathname.includes("/watch")) {
    return { error: "Not on a YouTube video page. Make sure you are watching a video." };
  }

  // 1. Try to extract directly if already open
  let transcript = getYouTubeTranscriptDOM();
  if (transcript) {
    return { text: transcript, status: "extracted" };
  }

  // If option "autoOpen" is false, we stop and ask to open
  if (options.autoOpen === false) {
    return { status: "not_open", error: "Transcript panel is not open. Please click 'Show transcript' in the video description or click Auto-Open." };
  }

  // 2. Attempt to automatically open the transcript panel
  try {
    // A. Expand description if needed
    const descriptionExpandBtn = document.querySelector('ytd-watch-metadata #description-inline-expander, ytd-video-secondary-info-renderer #more, #description #expand');
    if (descriptionExpandBtn && descriptionExpandBtn.getAttribute('aria-expanded') !== 'true') {
      descriptionExpandBtn.click();
      await sleep(500);
    }

    // B. Find the transcript button and click it
    // Check all buttons/renderers inside the description metadata
    const buttons = Array.from(document.querySelectorAll('ytd-video-description-transcript-section-renderer button, ytd-video-description-transcript-section-renderer ytd-button-renderer, #primary-button button'));
    
    let showTranscriptBtn = buttons.find(btn => btn.textContent.toLowerCase().includes('transcript'));
    
    if (!showTranscriptBtn) {
      // Fallback: search for any element containing "show transcript" inside the description container
      const descriptionContainer = document.querySelector('#description, ytd-watch-metadata #description-inline-expander');
      if (descriptionContainer) {
        const allTextElements = Array.from(descriptionContainer.querySelectorAll('button, tp-yt-paper-button, yt-formatted-string, span'));
        showTranscriptBtn = allTextElements.find(el => el.textContent.trim().toLowerCase().includes('show transcript'));
      }
    }

    if (showTranscriptBtn) {
      showTranscriptBtn.click();
      
      // Wait for panel to load (poll up to 3 seconds)
      for (let i = 0; i < 15; i++) {
        await sleep(200);
        transcript = getYouTubeTranscriptDOM();
        if (transcript) {
          return { text: transcript, status: "extracted" };
        }
      }
      return { status: "loading", error: "Clicked 'Show transcript' but the panel is taking too long to load. Please try again in a moment." };
    } else {
      return { status: "not_found", error: "Could not locate 'Show transcript' button. Please open the transcript manually in the video description." };
    }
  } catch (err) {
    console.error("Failed to auto-open YouTube transcript:", err);
    return { error: "Failed to automatically open transcript: " + err.message };
  }
}

/**
 * Helper to parse the YouTube Transcript from DOM.
 */
function getYouTubeTranscriptDOM() {
  // Selectors for YouTube transcript segments
  const segments = document.querySelectorAll('ytd-transcript-segment-renderer, ytd-transcript-body-renderer ytd-transcript-segment-renderer');
  
  if (!segments || segments.length === 0) {
    return null;
  }

  let transcriptLines = [];
  segments.forEach(seg => {
    const timestampEl = seg.querySelector('.segment-timestamp, #timestamp, yt-formatted-string.segment-timestamp');
    const textEl = seg.querySelector('.segment-text, #text, .segment-text-content');
    
    if (textEl) {
      const timestamp = timestampEl ? timestampEl.innerText.trim() : "";
      const text = textEl.innerText.trim();
      
      if (timestamp) {
        transcriptLines.push(`[${timestamp}] ${text}`);
      } else {
        transcriptLines.push(text);
      }
    }
  });

  return transcriptLines.join("\n");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
