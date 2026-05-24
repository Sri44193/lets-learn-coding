import React, { useEffect, useRef } from 'react';

const ReaderView = ({ text, charIndex, charLength }) => {
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [charIndex, charLength]);

  if (!text) {
    return (
      <div className="reader-view-empty">
        <p>మీ తెలుగు వచనాన్ని ఇక్కడ చదవవచ్చు. కింద వచనాన్ని నమోదు చేసి ప్లే నొక్కండి.</p>
        <p className="subtitle">(Your text will appear here. Paste some Telugu text below and click play.)</p>
      </div>
    );
  }

  if (charLength === 0 && charIndex === 0) {
    return <div className="reader-view">{text}</div>;
  }

  const beforeText = text.substring(0, charIndex);
  const activeWord = text.substring(charIndex, charIndex + charLength);
  const afterText = text.substring(charIndex + charLength);

  return (
    <div className="reader-view">
      <span>{beforeText}</span>
      <span ref={highlightRef} className="highlighted-word">{activeWord}</span>
      <span>{afterText}</span>
    </div>
  );
};

export default ReaderView;
