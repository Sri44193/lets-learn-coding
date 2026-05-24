import { useState, useEffect, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null);
  const [selectedEngVoiceIndex, setSelectedEngVoiceIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [charLength, setCharLength] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [text, setText] = useState('');

  const utteranceRef = useRef(null);
  const sessionRef = useRef(0);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      const findVoice = (predicate) => {
        const localMatch = availableVoices.findIndex(v => predicate(v) && v.localService);
        if (localMatch !== -1) return localMatch;
        return availableVoices.findIndex(predicate);
      };

      // Try to find a Telugu voice by default, prefer local
      if (selectedVoiceIndex === null) {
        const teluguVoiceIndex = findVoice(v => v.lang.includes('te'));
        if (teluguVoiceIndex !== -1) {
          setSelectedVoiceIndex(teluguVoiceIndex);
        } else if (availableVoices.length > 0) {
          setSelectedVoiceIndex(0);
        }
      }
    };

    handleVoicesChanged();
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const forceCancel = () => {
    window.speechSynthesis.resume(); // Vital for Safari/Chrome to clear paused/stuck state
    window.speechSynthesis.cancel();
  };

  const speak = (startIndex = 0) => {
    // Prevent React MouseEvent from being passed as startIndex
    if (typeof startIndex !== 'number') {
      startIndex = 0;
    }

    if (!text) return;
    
    // If it's paused and we're not forcefully starting from an index, just resume
    if (isPaused && startIndex === 0) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      setIsPaused(false);
      return;
    }

    // Cancel any ongoing speech
    forceCancel();
    
    // Increment session ID to invalidate callbacks from previous utterances
    sessionRef.current += 1;
    const currentSessionId = sessionRef.current;
    
    // Split text into chunks of English and Telugu to prevent TTS voice trembling/stuttering
    const textToSpeak = text.substring(startIndex);
    if (!textToSpeak) return;

    const chunks = [];
    let currentChunk = '';
    let currentLang = 'te-IN'; // default to Telugu

    for (let i = 0; i < textToSpeak.length; i++) {
      const char = textToSpeak[i];
      let charLang = currentLang;
      
      // Basic detection
      if (char.match(/[\u0C00-\u0C7F]/)) {
        charLang = 'te-IN';
      } else if (char.match(/[a-zA-Z]/)) {
        charLang = 'en-US';
      }

      if (charLang === currentLang) {
        currentChunk += char;
      } else {
        if (currentChunk.trim().length > 0) {
          chunks.push({ text: currentChunk, lang: currentLang });
          currentChunk = char;
        } else {
          // If previous chunk was just whitespace/punctuation, merge it
          currentChunk += char;
        }
        currentLang = charLang;
      }
    }
    if (currentChunk) {
      chunks.push({ text: currentChunk, lang: currentLang });
    }

    let globalOffset = startIndex;
    
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk.text);
      
      if (chunk.lang === 'te-IN') {
        if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
          utterance.voice = voices[selectedVoiceIndex];
        }
      } else {
        // Use user-selected English voice, or fallback to Telugu voice, or auto-detect
        if (selectedEngVoiceIndex !== null && voices[selectedEngVoiceIndex]) {
           utterance.voice = voices[selectedEngVoiceIndex];
        } else if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
           utterance.voice = voices[selectedVoiceIndex];
        } else {
          const engVoice = voices.find(v => v.lang.startsWith('en-US') && v.default) 
                        || voices.find(v => v.lang.startsWith('en'));
          if (engVoice) {
             utterance.voice = engVoice;
          }
        }
      }
      
      utterance.lang = chunk.lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      const chunkStartOffset = globalOffset;
      globalOffset += chunk.text.length;

      utterance.onboundary = (event) => {
        if (currentSessionId !== sessionRef.current) return;
        // We removed event.name check as some browsers omit it, and we want any boundary
        setCharIndex(chunkStartOffset + event.charIndex);
        
        let length = event.charLength || 0;
        if (!length) {
           const remainingText = chunk.text.substring(event.charIndex);
           const nonSpaceMatch = remainingText.match(/[^\s\n\r\.\,\!\?]/);
           if (nonSpaceMatch) {
              const startWord = nonSpaceMatch.index;
              const nextSpace = remainingText.substring(startWord).match(/[\s\n\r\.\,\!\?]/);
              length = startWord + (nextSpace ? nextSpace.index : remainingText.length - startWord);
           } else {
              length = remainingText.length;
           }
        }
        setCharLength(Math.max(1, length));
      };

      if (index === chunks.length - 1) {
        utterance.onend = () => {
          if (currentSessionId !== sessionRef.current) return;
          setIsSpeaking(false);
          setIsPaused(false);
          setCharIndex(0);
          setCharLength(0);
        };
      }

      utterance.onerror = (e) => {
        if (currentSessionId !== sessionRef.current) return;
        // Only log actual errors, ignore cancellation errors when stopping
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.error('SpeechSynthesis Error:', e);
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setCharIndex(0);
        setCharLength(0);
      };

      window.speechSynthesis.speak(utterance);
    });

    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
    setIsPaused(true);
  };

  const stop = () => {
    sessionRef.current += 1; // Invalidate any active callbacks
    forceCancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCharIndex(0);
    setCharLength(0);
  };

  const applySettings = () => {
    if (isSpeaking && !isPaused) {
      speak(charIndex);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      sessionRef.current += 1; // Invalidate active callbacks
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    voices,
    selectedVoiceIndex,
    setSelectedVoiceIndex,
    selectedEngVoiceIndex,
    setSelectedEngVoiceIndex,
    isSpeaking,
    isPaused,
    charIndex,
    charLength,
    rate,
    setRate,
    pitch,
    setPitch,
    text,
    setText,
    speak,
    pause,
    stop,
    applySettings
  };
};
