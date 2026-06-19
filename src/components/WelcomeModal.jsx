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
            Your design system,<br />
            <span>beautifully built.</span>
          </h1>
          <p className="welcome-sub">
            Configure tokens, preview across real product layouts, and export to CSS, Tailwind, or Figma — with automatic WCAG AA contrast on every button.
          </p>
        </div>

        <div className="welcome-actions">
          <button className="welcome-cta-primary" onClick={onClose}>
            <Layers size={15} />
            Start building
          </button>

          <div className="welcome-divider">or</div>

          <div className="welcome-cta-secondary-row">
            <button className="welcome-cta-secondary" onClick={onAnalyze}>
              <Sparkles size={13} />
              Analyze brand
              <span className="beta-badge">Beta</span>
            </button>
            <button className="welcome-cta-secondary" onClick={onImport}>
              <Upload size={13} />
              Import tokens
            </button>
          </div>

          <button className="welcome-dl-template" onClick={downloadTemplate}>
            Download token template to import next time
          </button>
        </div>

      </div>
    </div>
  );
}
