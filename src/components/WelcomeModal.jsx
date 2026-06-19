import { Sparkles, Upload, Layers } from 'lucide-react';
import { downloadTemplate } from '../utils/tokenTemplate';

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="3" width="22" height="8" rx="2.5" fill="white" fillOpacity="0.9"/>
      <rect x="3" y="14" width="10" height="11" rx="2.5" fill="white" fillOpacity="0.6"/>
      <rect x="15" y="14" width="10" height="11" rx="2.5" fill="white" fillOpacity="0.4"/>
    </svg>
  );
}

export default function WelcomeModal({ onClose, onAnalyze, onImport }) {
  return (
    <div className="welcome-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={e => e.stopPropagation()}>

        <div className="welcome-hero">
          <div className="welcome-mark">
            <LogoIcon />
          </div>
          <h1 className="welcome-headline">
            Design your app<br />
            <span>before you build it.</span>
          </h1>
          <p className="welcome-sub">
            Pick the colors, fonts, and style for your app — then give your style guide to Claude so everything it builds looks exactly the way you want.
          </p>
        </div>

        <div className="welcome-actions">
          <button className="welcome-cta-primary" onClick={onClose}>
            <Layers size={15} />
            Let's start
          </button>

          <div className="welcome-divider">or</div>

          <div className="welcome-cta-secondary-row">
            <button className="welcome-cta-secondary" onClick={onAnalyze}>
              <Sparkles size={13} />
              Analyze my brand with AI
              <span className="beta-badge">Beta</span>
            </button>
            <button className="welcome-cta-secondary" onClick={onImport}>
              <Upload size={13} />
              I have a style file
            </button>
          </div>

          <button className="welcome-dl-template" onClick={downloadTemplate}>
            Download a blank style template
          </button>
        </div>

      </div>
    </div>
  );
}
