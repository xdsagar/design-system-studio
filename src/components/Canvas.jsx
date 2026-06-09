import { useState } from 'react';
import { ButtonsPreview, FormsPreview, DataPreview, FeedbackPreview, NavigationPreview, LayoutPreview, TypographyPreview } from './Previews';

const TABS = [
  { id: 'buttons',    label: 'Buttons',    Component: ButtonsPreview    },
  { id: 'forms',      label: 'Forms',      Component: FormsPreview      },
  { id: 'data',       label: 'Data',       Component: DataPreview       },
  { id: 'feedback',   label: 'Feedback',   Component: FeedbackPreview   },
  { id: 'navigation', label: 'Navigation', Component: NavigationPreview },
  { id: 'layout',     label: 'Layout',     Component: LayoutPreview     },
  { id: 'typography', label: 'Typography', Component: TypographyPreview },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="2.3" fill="currentColor"/>
      <line x1="6.5" y1="0.5" x2="6.5" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="6.5" y1="11" x2="6.5" y2="12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="0.5" y1="6.5" x2="2" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="11" y1="6.5" x2="12.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="2.4" y1="2.4" x2="3.4" y2="3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="9.6" y1="9.6" x2="10.6" y2="10.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10.6" y1="2.4" x2="9.6" y2="3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="3.4" y1="9.6" x2="2.4" y2="10.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
      <path d="M9 2.5A5 5 0 1 1 2.5 9 4 4 0 0 0 9 2.5Z" fill="currentColor"/>
    </svg>
  );
}

export default function Canvas({ cssVars, darkMode, setDarkMode }) {
  const [active, setActive] = useState('buttons');
  const activeTab = TABS.find(t => t.id === active);

  return (
    <div className="canvas-panel">
      <nav className="canvas-sidenav">
        <div className="canvas-sidenav-header">Components</div>
        <div className="canvas-sidenav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`canvas-sidenav-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="canvas-content">
        <div className="canvas-content-header">
          <span className="canvas-header-icon">⊞</span>
          <span>Live preview — {activeTab.label}</span>
          <button
            className="canvas-mode-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch canvas to light' : 'Switch canvas to dark'}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <div
          className="canvas-body"
          style={cssVars}
          data-dark={darkMode ? 'true' : undefined}
        >
          <activeTab.Component />
        </div>
      </div>
    </div>
  );
}
