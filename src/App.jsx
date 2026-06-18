import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Upload, Sun, Moon, Sparkles } from 'lucide-react';
import { useTokens } from './hooks/useTokens';
import { deriveBrandTokens } from './utils/tokens';
import Configurator from './components/Configurator';
import Canvas from './components/Canvas';
import ImportModal from './components/ImportModal';
import BrandAnalyzer from './components/BrandAnalyzer';
import WelcomeModal from './components/WelcomeModal';
import SaveModal from './components/SaveModal';
import { downloadTemplate } from './utils/tokenTemplate';
import './index.css';

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#0D0F14"/>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" stroke="url(#logo-border)" strokeWidth="0.75"/>
      {/* Top block — accent */}
      <rect x="6" y="6" width="20" height="7" rx="2.5" fill="url(#logo-top)"/>
      {/* Bottom left */}
      <rect x="6" y="16" width="9" height="10" rx="2.5" fill="url(#logo-bl)"/>
      {/* Bottom right */}
      <rect x="17" y="16" width="9" height="10" rx="2.5" fill="url(#logo-br)"/>
      <defs>
        <linearGradient id="logo-top" x1="6" y1="6" x2="26" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B7FFF"/>
          <stop offset="1" stopColor="#A78BFA"/>
        </linearGradient>
        <linearGradient id="logo-bl" x1="6" y1="16" x2="15" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B7FFF" stopOpacity="0.7"/>
          <stop offset="1" stopColor="#6B7FFF" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="logo-br" x1="17" y1="16" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" stopOpacity="0.6"/>
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="logo-border" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B7FFF" stopOpacity="0.4"/>
          <stop offset="0.5" stopColor="white" stopOpacity="0.06"/>
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="header-icon-btn"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
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

const HAS_VISITED_KEY = 'dss-onboarded';

export default function App() {
  const [shellDark, setShellDark]             = useState(true);
  const [showImport, setShowImport]           = useState(false);
  const [showAnalyzer, setShowAnalyzer]       = useState(false);
  const [showWelcome, setShowWelcome]         = useState(() => !localStorage.getItem(HAS_VISITED_KEY));
  const [importedTokens, setImportedTokens]   = useState(null);
  const [configCollapsed, setConfigCollapsed] = useState(() => window.innerWidth < 1149);
  const [showSave, setShowSave]               = useState(false);
  const [configWidth, setConfigWidth]         = useState(340);
  const [isDragging, setIsDragging]           = useState(false);
  const [windowWidth, setWindowWidth]         = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isSmallScreen  = windowWidth < 786;
  const isOverlayMode  = windowWidth >= 786 && windowWidth < 1149;

  const {
    tokens, cssVars,
    setBrand, setNeutral, setFont, setTypeScale, setSpacingScale,
    setMotionPersonality, setElevationStyle,
    setRadius, setBorderStyle,
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
    const { reasoning, brand, coreColors: suggestedCore, ...rest } = suggestion;

    const mergedCoreColors = suggestedCore?.length
      ? tokens.coreColors.map(existing => {
          const hit = suggestedCore.find(s => s.id === existing.id);
          return hit ? { ...existing, hex: hit.hex } : existing;
        })
      : undefined;

    const payload = {
      ...rest,
      ...(brand ? { brand, ...deriveBrandTokens(brand) } : {}),
      ...(mergedCoreColors ? { coreColors: mergedCoreColors } : {}),
    };

    setAllTokens(payload);
    setImportedTokens(payload);
    if (suggestion.darkMode !== undefined) setShellDark(suggestion.darkMode);
  }

  function handleWelcomeClose() {
    localStorage.setItem(HAS_VISITED_KEY, '1');
    setShowWelcome(false);
  }

  function handleWelcomeAnalyze() {
    handleWelcomeClose();
    setShowAnalyzer(true);
  }

  function handleWelcomeImport() {
    handleWelcomeClose();
    setShowImport(true);
  }

  const startResize = useCallback((e) => {
    e.preventDefault();
    const startX   = e.clientX;
    const startW   = configWidth;
    let   latestW  = startW;

    // Keep the handle at least MIN_CANVAS px from the viewport edge so it
    // never overlaps the browser's native window-resize grab zone.
    const RAIL       = 80;
    const HANDLE     = 6;
    const MIN_CANVAS = 48;
    const maxW = window.innerWidth - RAIL - HANDLE - MIN_CANVAS;

    setIsDragging(true);
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const delta = ev.clientX - startX;
      latestW = Math.max(240, Math.min(maxW, startW + delta));
      setConfigWidth(latestW);
    }

    function onUp() {
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      setIsDragging(false);

      // Snap to nearest of: compact (340), half viewport, wide (~full)
      const half  = Math.round((window.innerWidth - RAIL) / 2);
      const wide  = maxW; // largest safe width — canvas still has MIN_CANVAS px
      const snaps = [340, half, wide];
      const snapped = snaps.reduce((a, b) =>
        Math.abs(b - latestW) < Math.abs(a - latestW) ? b : a
      );
      setConfigWidth(snapped);

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [configWidth]);

  if (isSmallScreen) {
    return (
      <div className="small-screen-gate">
        <LogoMark />
        <div className="small-screen-title">Design System Studio</div>
        <p className="small-screen-msg">
          This tool needs a wider screen to work properly.<br />
          Open it on a desktop or rotate your tablet to landscape.
        </p>
      </div>
    );
  }

  return (
    <div className={`app${shellDark ? '' : ' shell-light'}${isOverlayMode ? ' overlay-mode' : ''}`}>
      <header className="app-header">
        <div className="app-logo">
          <LogoMark />
          <div className="logo-wordmark">
            <span className="logo-name">Design System Studio</span>
          </div>
        </div>

        <button className="save-progress-link" onClick={() => setShowSave(true)}>
          Save your progress?
        </button>

        <div className="app-meta">
          <button
            className="header-analyze-btn"
            onClick={() => setShowAnalyzer(true)}
            title="Analyze brand images with AI"
          >
            <Sparkles size={12} />
            Analyze brand
            <span className="beta-badge">Beta</span>
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
        {isOverlayMode && !configCollapsed && (
          <div className="overlay-backdrop" onClick={() => setConfigCollapsed(true)} />
        )}
        <Configurator
          tokens={tokens}
          importedTokens={importedTokens}
          configCollapsed={configCollapsed}
          onCollapseToggle={() => setConfigCollapsed(c => !c)}
          onShowAnalyzer={() => setShowAnalyzer(true)}
          configWidth={configWidth}
          isDragging={isDragging}
          handlers={{
            setBrand, setNeutral, setFont, setTypeScale, setSpacingScale,
            setMotionPersonality, setElevationStyle,
            setRadius, setBorderStyle,
            setShadow, setDarkMode, setSemanticColor, setCustomColors, setCoreColors,
            setAllTokens,
          }}
        />
        {!configCollapsed && (
          <div
            className={`config-resize-handle${isDragging ? ' is-dragging' : ''}`}
            onMouseDown={startResize}
            title="Drag to resize · snaps to compact / half / full"
          />
        )}
        <Canvas
          cssVars={cssVars}
          darkMode={tokens.darkMode}
          setDarkMode={setDarkMode}
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

      {showWelcome && (
        <WelcomeModal
          onClose={handleWelcomeClose}
          onAnalyze={handleWelcomeAnalyze}
          onImport={handleWelcomeImport}
        />
      )}

      {showSave && (
        <SaveModal
          tokens={tokens}
          onClose={() => setShowSave(false)}
          onImport={() => { setShowSave(false); setShowImport(true); }}
        />
      )}
    </div>
  );
}
