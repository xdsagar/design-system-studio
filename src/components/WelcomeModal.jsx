import { Sparkles, Upload, Layers } from 'lucide-react';

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
            Build systems that<br />
            <span>compete.</span>
          </h1>
          <p className="welcome-sub">
            The professional token builder for founding teams who believe design is a competitive advantage.
          </p>
        </div>

        <div className="welcome-actions">
          <button className="welcome-cta-primary" onClick={onAnalyze}>
            <Sparkles size={15} />
            Analyze your brand with AI
          </button>

          <div className="welcome-divider">or</div>

          <div className="welcome-cta-secondary-row">
            <button className="welcome-cta-secondary" onClick={onClose}>
              <Layers size={13} />
              Start from scratch
            </button>
            <button className="welcome-cta-secondary" onClick={onImport}>
              <Upload size={13} />
              Import tokens
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
