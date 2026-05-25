// Helper utilities for Transcript & Text Extractor Pro

const ExtractorHelpers = {
  /**
   * Calculates character and word statistics for a given text.
   */
  getStats(text) {
    if (!text) {
      return { characters: 0, words: 0, lines: 0 };
    }
    const cleanStr = text.trim();
    const characters = cleanStr.length;
    const words = cleanStr === "" ? 0 : cleanStr.split(/\s+/).filter(w => w.length > 0).length;
    const lines = cleanStr === "" ? 0 : cleanStr.split("\n").length;
    
    return { characters, words, lines };
  },

  /**
   * Cleans text based on user options.
   */
  cleanText(text, options = {}) {
    if (!text) return "";
    
    let result = text;

    // 1. Strip timestamps (e.g., [1:23] or [12:34:56])
    if (options.stripTimestamps) {
      // Matches [1:23], [12:34], [12:34:56], [01:23] at the beginning of lines or anywhere
      result = result.replace(/\[\d{1,2}:?\d{2}(?::\d{2})?\]\s*/g, '');
      // Also match YouTube timestamp text format if it leaks as raw text: "0:23 " or "12:34 "
      // result = result.replace(/^\d{1,2}:\d{2}\s+/gm, ''); // uncomment if needed
    }

    // 2. Remove extra spaces
    if (options.removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
    }

    // 3. Remove empty lines / limit consecutive line breaks
    if (options.removeEmptyLines) {
      result = result.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    } else {
      // Normalize line breaks to standard single/double line breaks
      result = result.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    }

    return result.trim();
  },

  /**
   * Sanitizes a string for use as a filename.
   */
  sanitizeFilename(title, suffix = "-transcript") {
    if (!title) return `transcript-${Date.now()}`;
    
    // Replace invalid characters with hyphens
    let safeName = title
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-') // Replace non-alphanumeric with hyphen
      .replace(/-+/g, '-')          // Collapse multiple hyphens
      .replace(/^-|-$/g, '');       // Trim leading/trailing hyphens

    // Truncate to reasonable size
    if (safeName.length > 50) {
      safeName = safeName.substring(0, 50);
    }
    
    return `${safeName || 'transcript'}${suffix}`;
  },

  /**
   * Helper to download text content as a file from the extension popup context.
   */
  downloadTextFile(filename, content, extension = 'txt') {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // In Extension contexts, we can use the chrome.downloads API if we have permission,
    // OR we can create a temporary <a> tag and click it, which is lightweight and requires no extra permissions!
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
};
