import React from 'react';

const Controls = ({
  voices,
  selectedVoiceIndex,
  setSelectedVoiceIndex,
  selectedEngVoiceIndex,
  setSelectedEngVoiceIndex,
  isSpeaking,
  isPaused,
  rate,
  setRate,
  pitch,
  setPitch,
  speak,
  pause,
  stop,
  applySettings
}) => {
  return (
    <div className="controls-panel">
      <div className="controls-row main-buttons">
        {!isSpeaking || isPaused ? (
          <button className="btn btn-primary" onClick={speak} title="Play">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Play</span>
          </button>
        ) : (
          <button className="btn btn-warning" onClick={pause} title="Pause">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            <span>Pause</span>
          </button>
        )}
        
        <button className="btn btn-danger" onClick={stop} disabled={!isSpeaking && !isPaused} title="Stop">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
          <span>Stop</span>
        </button>
      </div>

      <div className="controls-row settings">
        <div className="setting-group">
          <label htmlFor="voice-select">Telugu Voice</label>
          <div className="select-wrapper">
            <select 
              id="voice-select" 
              value={selectedVoiceIndex !== null ? selectedVoiceIndex : ''}
              onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
              className="modern-select"
            >
              {voices.map((voice, index) => (
                <option key={voice.name + index} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
              {voices.length === 0 && <option value="">Loading voices...</option>}
            </select>
          </div>
        </div>

        <div className="setting-group">
          <label htmlFor="eng-voice-select">English Voice</label>
          <div className="select-wrapper">
            <select 
              id="eng-voice-select" 
              value={selectedEngVoiceIndex !== null ? selectedEngVoiceIndex : ''}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedEngVoiceIndex(val === '' ? null : Number(val));
              }}
              className="modern-select"
            >
              <option value="">Same as Telugu Voice</option>
              {voices.map((voice, index) => (
                <option key={voice.name + index} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
              {voices.length === 0 && <option value="">Loading voices...</option>}
            </select>
          </div>
        </div>

        <div className="setting-group">
          <label htmlFor="rate-range">Speed: {rate}x</label>
          <input 
            type="range" 
            id="rate-range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={rate} 
            onChange={(e) => setRate(parseFloat(e.target.value))}
            onMouseUp={applySettings}
            onTouchEnd={applySettings}
            className="modern-range"
          />
        </div>

        <div className="setting-group">
          <label htmlFor="pitch-range">Pitch: {pitch}</label>
          <input 
            type="range" 
            id="pitch-range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={pitch} 
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            onMouseUp={applySettings}
            onTouchEnd={applySettings}
            className="modern-range"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;
