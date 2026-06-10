import { useState } from 'react';
import { Download, Upload, Sun, Moon, Sparkles } from 'lucide-react';
import { useTokens } from './hooks/useTokens';
import { deriveBrandTokens } from './utils/tokens';
import Configurator from './components/Configurator';
import Canvas from './components/Canvas';
import ImportModal from './components/ImportModal';
import BrandAnalyzer from './components/BrandAnalyzer';
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
        cursor:'pointer', outline:'none', padding:0, color:ic,
      }}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
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
  const [shellDark, setShellDark]           = useState(true);
  const [showImport, setShowImport]         = useState(false);
  const [showAnalyzer, setShowAnalyzer]     = useState(false);
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
    if (incoming.darkMode !== undefined) setShellDark(incoming.darkMode);
  }

  function handleBrandAnalysis(suggestion) {
    const { reasoning, brand, ...rest } = suggestion;
    // Apply brand color with derived hover/light variants
    if (brand) {
      const derived = deriveBrandTokens(brand);
      setAllTokens({ brand, ...derived, ...rest });
    } else {
      setAllTokens(rest);
    }
    // Sync shell dark mode with suggestion
    if (suggestion.darkMode !== undefined) setShellDark(suggestion.darkMode);
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

          <button
            className="header-analyze-btn"
            onClick={() => setShowAnalyzer(true)}
            title="Analyze brand images with AI"
          >
            <Sparkles size={13} />
            Analyze brand
          </button>

          <HeaderIconBtn onClick={downloadTemplate} title="Download token template">
            <Download size={14} />
          </HeaderIconBtn>

          <HeaderIconBtn onClick={() => setShowImport(true)} title="Import token template">
            <Upload size={14} />
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

      {showAnalyzer && (
        <BrandAnalyzer
          onClose={() => setShowAnalyzer(false)}
          onApply={handleBrandAnalysis}
        />
      )}
    </div>
  );
}
