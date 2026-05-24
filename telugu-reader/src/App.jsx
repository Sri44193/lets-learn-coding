import React, { useState } from 'react';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import ReaderView from './components/ReaderView';
import Controls from './components/Controls';
import './index.css';

const DEFAULT_TEXT = 'నమస్కారం! ఇది తెలుగు వచనాన్ని చదివే ఒక అప్లికేషన్. మీరు ఈ పెట్టెలో ఏదైనా తెలుగు వచనాన్ని పేస్ట్ చేసి వినవచ్చు.';

function App() {
  const {
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
  } = useSpeechSynthesis();

  // Set default text once on mount if empty
  React.useEffect(() => {
    if (!text) {
      setText(DEFAULT_TEXT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>తెలుగు చదువరి <span>(Telugu Reader)</span></h1>
        <p>A beautiful, comfortable text-to-speech reading experience.</p>
      </header>

      <main className="app-main">
        <section className="glass-panel text-input-section">
          <label htmlFor="text-input" className="section-title">Enter Text to Read</label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              stop(); // Stop if text changes
            }}
            placeholder="Type or paste your text here..."
            className="modern-textarea"
            disabled={isSpeaking && !isPaused}
          />
        </section>

        <section className="glass-panel controls-section">
          <Controls 
            voices={voices}
            selectedVoiceIndex={selectedVoiceIndex}
            setSelectedVoiceIndex={setSelectedVoiceIndex}
            selectedEngVoiceIndex={selectedEngVoiceIndex}
            setSelectedEngVoiceIndex={setSelectedEngVoiceIndex}
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            rate={rate}
            setRate={setRate}
            pitch={pitch}
            setPitch={setPitch}
            speak={speak}
            pause={pause}
            stop={stop}
            applySettings={applySettings}
          />
        </section>

        <section className="glass-panel reader-section">
          <ReaderView 
            text={text} 
            charIndex={charIndex} 
            charLength={charLength} 
          />
        </section>
      </main>
    </div>
  );
}

export default App;
