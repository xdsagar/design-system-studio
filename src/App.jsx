import { useState } from 'react';
import { useTokens } from './hooks/useTokens';
import Configurator from './components/Configurator';
import Canvas from './components/Canvas';
import ImportModal from './components/ImportModal';
import { downloadTemplate } from './utils/tokenTemplate';
import './index.css';

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="7" fill="#252641"/>
      <rect x="5" y="5" width="18" height="11" rx="2.5" fill="#E96A47"/>
      <circle cx="10.5" cy="22" r="5" fill="#ECC94B"/>
      <rect x="16" y="17" width="9" height="9" rx="4.5" fill="#3B82F6"/>
    </svg>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  const bg     = isDark ? 'rgba(255,255,255,0.12)' : '#E4E4E7';
  const border  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';
  const ic      = isDark ? '#FFFFFF' : '#18171A';
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        width:34, height:34, borderRadius:8, flexShrink:0,
        background:bg, border:`1px solid ${border}`,
        cursor:'pointer', outline:'none', padding:0,
      }}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="2.3" fill={ic}/>
          <line x1="6.5" y1="0.5" x2="6.5" y2="2" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="6.5" y1="11" x2="6.5" y2="12.5" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="0.5" y1="6.5" x2="2" y2="6.5" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="11" y1="6.5" x2="12.5" y2="6.5" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="2.4" y1="2.4" x2="3.4" y2="3.4" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="9.6" y1="9.6" x2="10.6" y2="10.6" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="10.6" y1="2.4" x2="9.6" y2="3.4" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="3.4" y1="9.6" x2="2.4" y2="10.6" stroke={ic} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
          <path d="M9 2.5A5 5 0 1 1 2.5 9 4 4 0 0 0 9 2.5Z" fill={ic}/>
        </svg>
      )}
    </button>
  );
}

function HeaderIconBtn({ onClick, title, children }) {
  return (
    <button className="header-icon-btn" onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export default function App() {
  const [shellDark, setShellDark]         = useState(true);
  const [showImport, setShowImport]       = useState(false);
  const [importedTokens, setImportedTokens] = useState(null);

  const {
    tokens, cssVars,
    setBrand, setNeutral, setFont, setRadius, setBorderStyle,
    setShadow, setDarkMode, setSemanticColor, setCustomColors, setCoreColors,
    setAllTokens,
  } = useTokens();

  function toggleShell() {
    const next = !shellDark;
    setShellDark(next);
    setDarkMode(next);
  }

  function handleImport(incoming) {
    setAllTokens(incoming);
    setImportedTokens(incoming);
    // sync canvas dark mode if the template specifies one
    if (incoming.darkMode !== undefined) setShellDark(incoming.darkMode);
  }

  return (
    <div className={`app${shellDark ? '' : ' shell-light'}`}>
      <header className="app-header">
        <div className="app-logo">
          <LogoMark />
          <span className="logo-text">Design System Studio</span>
        </div>
        <div className="app-meta">
          <span className="app-badge">57 components</span>

          {/* Download template */}
          <HeaderIconBtn onClick={downloadTemplate} title="Download token template">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </HeaderIconBtn>

          {/* Import template */}
          <HeaderIconBtn onClick={() => setShowImport(true)} title="Import token template">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </HeaderIconBtn>

          <ThemeToggle isDark={shellDark} onToggle={toggleShell} />
        </div>
      </header>

      <main className="app-main">
        <Canvas cssVars={cssVars} darkMode={tokens.darkMode} setDarkMode={setDarkMode} />
        <Configurator
          tokens={tokens}
          importedTokens={importedTokens}
          handlers={{
            setBrand, setNeutral, setFont, setRadius, setBorderStyle,
            setShadow, setDarkMode, setSemanticColor, setCustomColors, setCoreColors,
            setAllTokens,
          }}
        />
      </main>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
