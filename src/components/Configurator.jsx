import { useState, useRef, useEffect } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import {
  defaultTokens,
  radiusPresets,
  fontDisplayOptions, fontBodyOptions, fontMonoOptions,
  typeSizeOptions, typeScaleRatioOptions, computeTypeScale,
  spacingScaleOptions, SPACING_SCALES, SPACE_STEP_KEYS,
  MOTION_PRESETS,
  ELEVATION_PRESETS,
  computeHoverColor, shadowValues, wcagContrast, generateColorScale,
} from '../utils/tokens';
import { exportSkillFile, exportComponentsCss } from '../utils/exportSkill';

const STEPS = ['Colors', 'Type', 'Space', 'Motion', 'Shape', 'Export'];

const COLOR_GROUPS = [
  { key: 'brand',     label: 'Primary',   tokenKey: 'brand',     dmKey: 'brandDm',     hoverTextKey: 'brandHoverText',     dmHoverTextKey: 'brandHoverTextDm',     cssVar: '--ds-brand',     hoverVar: '--ds-brand-hover',     hoverTextVar: '--ds-brand-hover-text'     },
  { key: 'secondary', label: 'Secondary', tokenKey: 'secondary', dmKey: 'secondaryDm', hoverTextKey: 'secondaryHoverText', dmHoverTextKey: 'secondaryHoverTextDm', cssVar: '--ds-secondary', hoverVar: '--ds-secondary-hover', hoverTextVar: '--ds-secondary-hover-text' },
  { key: 'tertiary',  label: 'Tertiary',  tokenKey: 'tertiary',  dmKey: 'tertiaryDm',  hoverTextKey: 'tertiaryHoverText',  dmHoverTextKey: 'tertiaryHoverTextDm',  cssVar: '--ds-tertiary',  hoverVar: '--ds-tertiary-hover',  hoverTextVar: '--ds-tertiary-hover-text'  },
  { key: 'success',   label: 'Success',   tokenKey: 'success',   dmKey: 'successDm',   hoverTextKey: 'successHoverText',   dmHoverTextKey: 'successHoverTextDm',   cssVar: '--ds-success',   hoverVar: '--ds-success-hover',   hoverTextVar: '--ds-success-hover-text'   },
  { key: 'caution',   label: 'Warning',   tokenKey: 'caution',   dmKey: 'cautionDm',   hoverTextKey: 'cautionHoverText',   dmHoverTextKey: 'cautionHoverTextDm',   cssVar: '--ds-warning',   hoverVar: '--ds-warning-hover',   hoverTextVar: '--ds-warning-hover-text'   },
  { key: 'error',     label: 'Danger',    tokenKey: 'error',     dmKey: 'errorDm',     hoverTextKey: 'errorHoverText',     dmHoverTextKey: 'errorHoverTextDm',     cssVar: '--ds-danger',    hoverVar: '--ds-danger-hover',    hoverTextVar: '--ds-danger-hover-text'    },
  { key: 'info',      label: 'Info',      tokenKey: 'info',      dmKey: 'infoDm',      hoverTextKey: 'infoHoverText',      dmHoverTextKey: 'infoHoverTextDm',      cssVar: '--ds-info',      hoverVar: '--ds-info-hover',      hoverTextVar: '--ds-info-hover-text'      },
  { key: 'ghost',     label: 'Ghost',     tokenKey: 'ghost',     dmKey: 'ghostDm',     hoverTextKey: null,                 dmHoverTextKey: null,                   cssVar: '--ds-ghost',     hoverVar: '--ds-ghost-hover',     hoverTextVar: null                         },
];

const SCALE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const TYPE_SCALE_NAMES = ['2xs','xs','sm','base','md','lg','xl','2xl','3xl','4xl','5xl'];

function toVarName(name) {
  return '--ds-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildAllTokenLines(tokens) {
  const lines = [
    { section: 'Brand' },
    { key: '--ds-brand',                value: tokens.brand },
    { key: '--ds-brand-dark',           value: tokens.brandDark },
    { key: '--ds-brand-light',          value: tokens.brandLight },
    { key: '--ds-brand-hover',          value: tokens.brandHover },
    { key: '--ds-brand-hover-text',     value: tokens.brandHoverText },
    { section: 'Semantic' },
    { key: '--ds-secondary',            value: tokens.secondary },
    { key: '--ds-secondary-hover',      value: tokens.secondaryHover },
    { key: '--ds-secondary-hover-text', value: tokens.secondaryHoverText },
    { key: '--ds-tertiary',             value: tokens.tertiary },
    { key: '--ds-tertiary-hover',       value: tokens.tertiaryHover },
    { key: '--ds-tertiary-hover-text',  value: tokens.tertiaryHoverText },
    { key: '--ds-success',              value: tokens.success },
    { key: '--ds-success-hover',        value: tokens.successHover },
    { key: '--ds-success-hover-text',   value: tokens.successHoverText },
    { key: '--ds-warning',              value: tokens.caution },
    { key: '--ds-warning-hover',        value: tokens.cautionHover },
    { key: '--ds-warning-hover-text',   value: tokens.cautionHoverText },
    { key: '--ds-danger',               value: tokens.error },
    { key: '--ds-danger-hover',         value: tokens.errorHover },
    { key: '--ds-danger-hover-text',    value: tokens.errorHoverText },
    { key: '--ds-info',                 value: tokens.info },
    { key: '--ds-info-hover',           value: tokens.infoHover },
    { key: '--ds-info-hover-text',      value: tokens.infoHoverText },
    { key: '--ds-ghost',                value: tokens.ghost },
    { key: '--ds-ghost-hover',          value: tokens.ghostHover },
    { section: 'Typography' },
    { key: '--ds-font-display',         value: tokens.fontDisplay },
    { key: '--ds-font-body',            value: tokens.fontBody },
    { key: '--ds-font-mono',            value: tokens.fontMono },
    { section: 'Shape' },
    { key: '--ds-radius-sm',            value: tokens.radiusSm },
    { key: '--ds-radius-md',            value: tokens.radiusMd },
    { key: '--ds-radius-lg',            value: tokens.radiusLg },
    { key: '--ds-radius-pill',          value: tokens.radiusPill },
    { key: '--ds-border-style',         value: tokens.borderStyle },
    { key: '--ds-shadow',               value: shadowValues[tokens.shadow] || shadowValues.sm },
  ];

  const validCore = tokens.coreColors.filter(c => /^#[0-9a-fA-F]{6}$/.test(c.hex));
  if (validCore.length > 0) {
    lines.push({ section: 'Core Colors' });
    validCore.forEach(c => {
      const scale = generateColorScale(c.hex);
      if (scale) SCALE_STEPS.forEach(s => lines.push({ key: `--ds-${c.id}-${s}`, value: scale[s] }));
    });
  }

  const customEntries = tokens.customColors.filter(c => c.name && /^#[0-9a-fA-F]{6}$/.test(c.hex));
  if (customEntries.length > 0) {
    lines.push({ section: 'Custom' });
    customEntries.forEach(c => lines.push({ key: toVarName(c.name), value: c.hex }));
  }

  return lines;
}

function WcagBadge({ hex }) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const ratio = wcagContrast(hex, '#ffffff');
  const aa  = ratio >= 4.5;
  const aaa = ratio >= 7;
  return (
    <div className="wcag-row">
      <span className="wcag-label">WCAG</span>
      <span className="wcag-ratio">{ratio.toFixed(2)}:1</span>
      <span className={`wcag-pill ${aa  ? 'pass' : 'fail'}`}>AA</span>
      <span className={`wcag-pill ${aaa ? 'pass' : 'fail'}`}>AAA</span>
    </div>
  );
}

function ColorScaleStrip({ hex, onSwatchClick }) {
  const scale = generateColorScale(hex);
  if (!scale) return null;
  return (
    <div className="color-scale-strip">
      {SCALE_STEPS.map(step => (
        <div key={step} className="color-scale-item">
          <div
            className={`color-scale-swatch ${step === 60 ? 'scale-base' : ''}`}
            style={{ background: scale[step], cursor: onSwatchClick ? 'pointer' : 'default' }}
            title={onSwatchClick ? `Copy ${scale[step]}` : `${step}: ${scale[step]}`}
            onClick={() => onSwatchClick?.(scale[step])}
          />
          <span className="color-scale-label">{step}</span>
        </div>
      ))}
    </div>
  );
}

function HowToUseAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="token-accordion">
      <button className="token-accordion-trigger" onClick={() => setOpen(o => !o)}>
        <span>How to use</span>
        <ChevronDown size={14} style={{color:'var(--shell-text-2)',transform:open?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0}} />
      </button>
      {open && (
        <div className="token-accordion-body how-to-use-body">
          <div className="htu-section">
            <div className="htu-file-label">
              <span className="htu-file-badge css">CSS</span>
              Component Library
            </div>
            <p className="htu-desc">
              Link the CSS file in your project to get all design tokens as CSS custom properties.
            </p>
            <pre className="htu-code">{`<!-- In your HTML <head> -->
<link rel="stylesheet" href="your-system-tokens.css" />

/* Or import in CSS */
@import './your-system-tokens.css';`}</pre>
            <p className="htu-desc">Then use the variables anywhere in your styles:</p>
            <pre className="htu-code">{`.button {
  background: var(--ds-brand);
  border-radius: var(--ds-radius-md);
  font-family: var(--ds-font-body);
  color: var(--ds-neutral-900);
  box-shadow: var(--ds-shadow);
}`}</pre>
          </div>

          <div className="htu-divider" />

          <div className="htu-section">
            <div className="htu-file-label">
              <span className="htu-file-badge skill">SKILL</span>
              Design System Skill File
            </div>
            <p className="htu-desc">
              The <code className="htu-inline-code">.skill</code> archive contains a Markdown reference of your full design system — tokens, usage notes, and component guidance.
            </p>
            <ol className="htu-steps">
              <li>Unzip the <code className="htu-inline-code">.skill</code> file</li>
              <li>Add the <code className="htu-inline-code">.md</code> file to your AI context (Cursor, Claude Code, ChatGPT, etc.)</li>
              <li>Ask your AI to build components that match your design system — it will use your exact colors, radii, and token names</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Configurator({ tokens, handlers, importedTokens }) {
  const [step, setStep]           = useState(0);
  const colorMode = tokens.darkMode ? 'dark' : 'light';
  const [radiusIdx, setRadiusIdx] = useState(2);
  const [openGroup, setOpenGroup] = useState('brand');
  const [openCoreGroup, setOpenCoreGroup] = useState(null);
  const [tokenSearch, setTokenSearch] = useState('');
  const [tokenAccordionOpen, setTokenAccordionOpen] = useState(false);
  const [dsName, setDsName] = useState('');

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [resetOpen, setResetOpen] = useState(false);
  const resetRef = useRef(null);

  useEffect(() => {
    if (!resetOpen) return;
    function onDown(e) { if (!resetRef.current?.contains(e.target)) setResetOpen(false); }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [resetOpen]);

  const {
    setBrand, setFont, setTypeScale, setSpacingScale,
    setMotionPersonality, setElevationStyle,
    setRadius, setBorderStyle, setShadow, setDarkMode,
    setSemanticColor, setCustomColors, setCoreColors, setAllTokens,
  } = handlers;

  function makeInitHex() {
    const init = {};
    COLOR_GROUPS.forEach(g => {
      init[`light:${g.tokenKey}`] = defaultTokens[g.tokenKey]    || '#000000';
      init[`dark:${g.tokenKey}`]  = defaultTokens[g.dmKey]       || defaultTokens[g.tokenKey] || '#000000';
    });
    return init;
  }

  function makeInitHoverHex() {
    const init = {};
    COLOR_GROUPS.forEach(g => {
      init[`light:${g.tokenKey}`] = defaultTokens[`${g.tokenKey}Hover`]   || '#000000';
      init[`dark:${g.tokenKey}`]  = defaultTokens[`${g.tokenKey}HoverDm`] || defaultTokens[`${g.tokenKey}Hover`] || '#000000';
    });
    return init;
  }

  function makeInitHoverModes() {
    const init = {};
    COLOR_GROUPS.forEach(g => {
      const def = g.tokenKey === 'ghost' ? 'custom' : 'dark';
      init[`light:${g.tokenKey}`] = def;
      init[`dark:${g.tokenKey}`]  = def;
    });
    return init;
  }

  function handleResetTab() {
    if (step === 0) {
      setBrand(defaultTokens.brand);
      COLOR_GROUPS.forEach(g => {
        if (g.tokenKey !== 'brand') setSemanticColor(g.tokenKey, defaultTokens[g.tokenKey]);
        if (defaultTokens[g.dmKey])           setSemanticColor(g.dmKey, defaultTokens[g.dmKey]);
        setSemanticColor(`${g.tokenKey}Hover`,   defaultTokens[`${g.tokenKey}Hover`]);
        setSemanticColor(`${g.tokenKey}HoverDm`, defaultTokens[`${g.tokenKey}HoverDm`]);
        if (g.hoverTextKey    && defaultTokens[g.hoverTextKey])    setSemanticColor(g.hoverTextKey,    defaultTokens[g.hoverTextKey]);
        if (g.dmHoverTextKey  && defaultTokens[g.dmHoverTextKey])  setSemanticColor(g.dmHoverTextKey,  defaultTokens[g.dmHoverTextKey]);
      });
      setCustomColors([]);
      setCoreColors(defaultTokens.coreColors);
      setHexInputs(makeInitHex());
      setHoverHexInputs(makeInitHoverHex());
      setHoverModes(makeInitHoverModes());
      setCoreHexInputsState(Object.fromEntries(defaultTokens.coreColors.map(c => [c.id, c.hex])));
    } else if (step === 1) {
      setFont('display', defaultTokens.fontDisplay);
      setFont('body', defaultTokens.fontBody);
      setFont('mono', defaultTokens.fontMono);
      setTypeScale(defaultTokens.typeBaseSize, defaultTokens.typeScaleRatio);
    } else if (step === 2) {
      setSpacingScale(defaultTokens.spacingScale);
    } else if (step === 3) {
      setMotionPersonality(defaultTokens.motionPersonality);
    } else if (step === 4) {
      setRadius({ sm: defaultTokens.radiusSm, md: defaultTokens.radiusMd, lg: defaultTokens.radiusLg, pill: defaultTokens.radiusPill });
      setBorderStyle(defaultTokens.borderStyle);
      setShadow(defaultTokens.shadow);
      setElevationStyle(defaultTokens.elevationStyle);
      setRadiusIdx(2);
    }
  }

  function handleResetAll() {
    setBrand(defaultTokens.brand);
    handlers.setNeutral(defaultTokens.neutral);
    setFont('display', defaultTokens.fontDisplay);
    setFont('body', defaultTokens.fontBody);
    setFont('mono', defaultTokens.fontMono);
    setTypeScale(defaultTokens.typeBaseSize, defaultTokens.typeScaleRatio);
    setSpacingScale(defaultTokens.spacingScale);
    setMotionPersonality(defaultTokens.motionPersonality);
    setRadius({ sm: defaultTokens.radiusSm, md: defaultTokens.radiusMd, lg: defaultTokens.radiusLg, pill: defaultTokens.radiusPill });
    setBorderStyle(defaultTokens.borderStyle);
    setShadow(defaultTokens.shadow);
    setElevationStyle(defaultTokens.elevationStyle);
    setDarkMode(defaultTokens.darkMode);
    COLOR_GROUPS.forEach(g => {
      if (g.tokenKey !== 'brand') setSemanticColor(g.tokenKey, defaultTokens[g.tokenKey]);
      if (defaultTokens[g.dmKey])           setSemanticColor(g.dmKey, defaultTokens[g.dmKey]);
      setSemanticColor(`${g.tokenKey}Hover`,   defaultTokens[`${g.tokenKey}Hover`]);
      setSemanticColor(`${g.tokenKey}HoverDm`, defaultTokens[`${g.tokenKey}HoverDm`]);
      if (g.hoverTextKey   && defaultTokens[g.hoverTextKey])   setSemanticColor(g.hoverTextKey,   defaultTokens[g.hoverTextKey]);
      if (g.dmHoverTextKey && defaultTokens[g.dmHoverTextKey]) setSemanticColor(g.dmHoverTextKey, defaultTokens[g.dmHoverTextKey]);
    });
    setCustomColors([]);
    setCoreColors(defaultTokens.coreColors);
    setHexInputs(makeInitHex());
    setHoverHexInputs(makeInitHoverHex());
    setHoverModes(makeInitHoverModes());
    setCoreHexInputsState(Object.fromEntries(defaultTokens.coreColors.map(c => [c.id, c.hex])));
    setRadiusIdx(2);
  }

  function copyHexToClipboard(hex) {
    navigator.clipboard.writeText(hex).then(() => {
      clearTimeout(toastTimer.current);
      setToast(hex);
      toastTimer.current = setTimeout(() => setToast(null), 2600);
    });
  }

  const [hexInputs, setHexInputs] = useState(makeInitHex);
  const [hoverHexInputs, setHoverHexInputs] = useState(makeInitHoverHex);
  const [hoverModes, setHoverModes] = useState(makeInitHoverModes);

  const [coreHexInputs, setCoreHexInputsState] = useState(() =>
    Object.fromEntries(tokens.coreColors.map(c => [c.id, c.hex]))
  );

  function toggleGroup(key) {
    setOpenGroup(prev => prev === key ? null : key);
  }

  function toggleCoreGroup(id) {
    setOpenCoreGroup(prev => prev === id ? null : id);
  }

  function handleColorInput(group, val) {
    const mk = `${colorMode}:${group.tokenKey}`;
    setHexInputs(h => ({ ...h, [mk]: val }));
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      if (colorMode === 'light') {
        if (group.tokenKey === 'brand') setBrand(val);
        else setSemanticColor(group.tokenKey, val);
      } else {
        setSemanticColor(group.dmKey, val);
      }
    }
  }

  function handleHoverInput(group, val) {
    const mk = `${colorMode}:${group.tokenKey}`;
    setHoverHexInputs(h => ({ ...h, [mk]: val }));
    setHoverModes(m => ({ ...m, [mk]: 'custom' }));
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      const hoverKey = colorMode === 'dark' ? `${group.tokenKey}HoverDm` : `${group.tokenKey}Hover`;
      setSemanticColor(hoverKey, val);
      const htKey = colorMode === 'dark' ? group.dmHoverTextKey : group.hoverTextKey;
      if (htKey) {
        const ratio = wcagContrast(val, '#ffffff');
        const baseKey = colorMode === 'dark' ? group.dmKey : group.tokenKey;
        setSemanticColor(htKey, ratio >= 4.5 ? '#ffffff' : (tokens[baseKey] || '#000000'));
      }
    }
  }

  function applyHoverMode(group, mode) {
    const mk = `${colorMode}:${group.tokenKey}`;
    if (mode === 'custom') {
      setHoverModes(m => ({ ...m, [mk]: 'custom' }));
      return;
    }
    const baseKey = colorMode === 'dark' ? group.dmKey : group.tokenKey;
    const base = tokens[baseKey] || tokens[group.tokenKey];
    const computed = computeHoverColor(base, mode);
    setHoverHexInputs(h => ({ ...h, [mk]: computed }));
    const hoverKey = colorMode === 'dark' ? `${group.tokenKey}HoverDm` : `${group.tokenKey}Hover`;
    setSemanticColor(hoverKey, computed);
    setHoverModes(m => ({ ...m, [mk]: mode }));
    const htKey = colorMode === 'dark' ? group.dmHoverTextKey : group.hoverTextKey;
    if (htKey) {
      setSemanticColor(htKey, mode === 'light' ? base : '#ffffff');
    }
  }

  function updateCoreColor(id, hex) {
    setCoreHexInputsState(h => ({ ...h, [id]: hex }));
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      setCoreColors(tokens.coreColors.map(c => c.id === id ? { ...c, hex } : c));
    }
  }

  function getTokenValue(group) {
    const key = colorMode === 'dark' ? group.dmKey : group.tokenKey;
    return tokens[key] || hexInputs[`${colorMode}:${group.tokenKey}`] || tokens[group.tokenKey];
  }

  function handleRadius(idx) {
    setRadiusIdx(idx);
    setRadius(radiusPresets[idx]);
  }

  function addCustomColor() {
    setCustomColors([...tokens.customColors, { id: `c-${Date.now()}`, name: '', hex: '#000000' }]);
  }

  function updateCustomColor(id, field, val) {
    setCustomColors(tokens.customColors.map(c => c.id === id ? { ...c, [field]: val } : c));
  }

  function removeCustomColor(id) {
    setCustomColors(tokens.customColors.filter(c => c.id !== id));
  }

  const [exportingSkill, setExportingSkill] = useState(false);
  const [exportingCss, setExportingCss]     = useState(false);
  const hasName = dsName.trim() !== '';

  async function handleExportSkill() {
    setExportingSkill(true);
    try { await exportSkillFile(tokens, dsName.trim()); }
    finally { setExportingSkill(false); }
  }

  function handleExportCss() {
    exportComponentsCss(tokens, dsName.trim());
  }

  const allTokenLines = buildAllTokenLines(tokens);
  const q = tokenSearch.trim().toLowerCase();
  const filteredLines = q
    ? allTokenLines.filter(t => t.key && (t.key.includes(q) || t.value.toLowerCase().includes(q)))
    : allTokenLines;

  // Derived type scale for preview
  const typeScale = computeTypeScale(
    tokens.typeBaseSize  || 16,
    tokens.typeScaleRatio || 'perfectFourth',
  );

  // Spacing scale values for selected preset
  const spaceVals = SPACING_SCALES[tokens.spacingScale] || SPACING_SCALES.default;
  const maxSpace  = Math.max(...spaceVals);

  // Motion preset for selected personality
  const motionPreset = MOTION_PRESETS[tokens.motionPersonality] || MOTION_PRESETS.fluid;

  // Elevation preset for selected style
  const elevPreset = ELEVATION_PRESETS[tokens.elevationStyle] || ELEVATION_PRESETS.subtle;
  const elevShadows = tokens.darkMode ? elevPreset.dark : elevPreset.light;

  return (
    <aside className="config-panel">
      <div className="step-tabs">
        {STEPS.map((s, i) => (
          <button
            key={s}
            className={`step-tab ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}
          >
            <span className="step-num">{i < step ? <Check size={13} /> : i + 1}</span>
            <span>{s}</span>
          </button>
        ))}
      </div>

      <div className="config-body">

        {/* ── Step 0: Colors ── */}
        {step === 0 && (
          <div className="config-section">

            <div className="color-mode-switch">
              <button
                className={`color-mode-tab ${colorMode === 'light' ? 'active' : ''}`}
                onClick={() => setDarkMode(false)}
              >
                Light
              </button>
              <button
                className={`color-mode-tab ${colorMode === 'dark' ? 'active' : ''}`}
                onClick={() => setDarkMode(true)}
              >
                Dark
              </button>
            </div>

            <div className="color-section">
              <div className="color-section-header">
                <span className="color-section-title">Semantic Colors</span>
              </div>
              <div className="color-group-list">
                {COLOR_GROUPS.map(group => {
                  const isOpen      = openGroup === group.key;
                  const currentVal  = getTokenValue(group);
                  const isGhost     = group.key === 'ghost';
                  const mk          = `${colorMode}:${group.tokenKey}`;
                  const activeHex   = hexInputs[mk]      || currentVal;
                  const activeHover = hoverHexInputs[mk] || '';
                  const activeHoverMode = hoverModes[mk];

                  return (
                    <div key={group.key} className={`color-group ${isOpen ? 'open' : ''}`}>
                      <button className="color-group-header" onClick={() => toggleGroup(group.key)}>
                        <span className="color-group-swatch" style={{ background: currentVal }} />
                        <span className="color-group-label">{group.label}</span>
                        <span className="color-group-hex">{currentVal}</span>
                        <span className="color-group-chevron">{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {isOpen && (
                        <div className="color-group-body">
                          <div className="config-row">
                            <input
                              type="color"
                              value={activeHex || '#000000'}
                              onInput={e => handleColorInput(group, e.target.value)}
                            />
                            <input
                              type="text"
                              className="hex-input"
                              value={activeHex}
                              onChange={e => handleColorInput(group, e.target.value)}
                              placeholder="#000000"
                              maxLength={7}
                            />
                          </div>

                          <WcagBadge hex={activeHex} />
                          <ColorScaleStrip hex={activeHex} onSwatchClick={copyHexToClipboard} />

                          <div>
                            <div className="config-label" style={{ marginBottom: 6 }}>Hover</div>
                            <div className="hover-radio-list">
                              {(isGhost ? ['custom'] : ['dark', 'light', 'custom']).map(mode => {
                                const isActive = activeHoverMode === mode;
                                const swatchColor = mode === 'dark'  ? generateColorScale(activeHex)?.[70]
                                                  : mode === 'light' ? generateColorScale(activeHex)?.[20]
                                                  : null;
                                return (
                                  <label key={mode} className={`hover-radio-item ${isActive ? 'checked' : ''}`}>
                                    <input
                                      type="radio"
                                      name={`hover-${group.key}-${colorMode}`}
                                      className="hover-radio-input"
                                      checked={isActive}
                                      onChange={() => applyHoverMode(group, mode)}
                                    />
                                    <span className={`hover-radio-dot ${isActive ? 'checked' : ''}`} />
                                    {swatchColor && (
                                      <span className="hover-radio-swatch" style={{ background: swatchColor }} />
                                    )}
                                    <span className="hover-radio-label">
                                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </span>
                                    {mode === 'custom' && (
                                      <span className="hover-radio-inputs">
                                        <input
                                          type="color"
                                          value={activeHover || '#000000'}
                                          onInput={e => handleHoverInput(group, e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="hex-input"
                                          value={activeHover}
                                          onChange={e => handleHoverInput(group, e.target.value)}
                                          placeholder="#000000"
                                          maxLength={7}
                                        />
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="color-section dashed">
              <div className="color-section-header">
                <span className="color-section-title">Core Colors</span>
              </div>
              <div className="color-group-list">
                {tokens.coreColors.map(color => {
                  const isOpen = openCoreGroup === color.id;
                  const hex    = coreHexInputs[color.id] || color.hex;

                  return (
                    <div key={color.id} className={`color-group ${isOpen ? 'open' : ''}`}>
                      <button className="color-group-header" onClick={() => toggleCoreGroup(color.id)}>
                        <span className="color-group-swatch" style={{ background: hex }} />
                        <span className="color-group-label">{color.label}</span>
                        <span className="color-group-hex">{hex}</span>
                        <span className="color-group-chevron">{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {isOpen && (
                        <div className="color-group-body">
                          <div className="config-row">
                            <input
                              type="color"
                              value={hex}
                              onInput={e => updateCoreColor(color.id, e.target.value)}
                            />
                            <input
                              type="text"
                              className="hex-input"
                              value={hex}
                              onChange={e => updateCoreColor(color.id, e.target.value)}
                              placeholder="#000000"
                              maxLength={7}
                            />
                            <span className="scale-base-tag">60</span>
                          </div>
                          <ColorScaleStrip hex={hex} onSwatchClick={copyHexToClipboard} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="color-section dashed">
              <div className="color-section-header">
                <span className="color-section-title">Custom / Data-Viz</span>
                <button className="custom-add-btn" onClick={addCustomColor}>+ Add color</button>
              </div>
              {tokens.customColors.length === 0 && (
                <p className="custom-empty">Add brand extensions or data visualisation colors.</p>
              )}
              {tokens.customColors.map(color => (
                <div key={color.id} className="custom-color-entry">
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(color.hex) ? color.hex : '#000000'}
                    onInput={e => updateCustomColor(color.id, 'hex', e.target.value)}
                  />
                  <input
                    type="text"
                    className="hex-input"
                    value={color.hex}
                    onChange={e => updateCustomColor(color.id, 'hex', e.target.value)}
                    placeholder="#000000"
                    maxLength={7}
                  />
                  <input
                    type="text"
                    className="custom-color-name"
                    value={color.name}
                    onChange={e => updateCustomColor(color.id, 'name', e.target.value)}
                    placeholder="Name (e.g. chart-blue)"
                  />
                  <button className="custom-remove-btn" onClick={() => removeCustomColor(color.id)}><X size={12} /></button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ── Step 1: Type ── */}
        {step === 1 && (
          <div className="config-section">

            {/* Font families */}
            <div className="config-group">
              <label className="config-label">Display font</label>
              <select value={tokens.fontDisplay} onChange={e => setFont('display', e.target.value)} className="config-select">
                {fontDisplayOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="font-preview display-preview" style={{ fontFamily: tokens.fontDisplay }}>
                The quick brown fox jumps
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">Body font</label>
              <select value={tokens.fontBody} onChange={e => setFont('body', e.target.value)} className="config-select">
                {fontBodyOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="font-preview body-preview" style={{ fontFamily: tokens.fontBody }}>
                The quick brown fox jumps over the lazy dog. 0123456789
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">Mono font</label>
              <select value={tokens.fontMono} onChange={e => setFont('mono', e.target.value)} className="config-select">
                {fontMonoOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="font-preview mono-preview" style={{ fontFamily: tokens.fontMono }}>
                const value = tokens['--ds-brand'];
              </div>
            </div>

            {/* Type scale */}
            <div className="config-group">
              <label className="config-label">Base size</label>
              <div className="type-size-row">
                {typeSizeOptions.map(sz => (
                  <button
                    key={sz}
                    className={`type-size-btn ${tokens.typeBaseSize === sz ? 'active' : ''}`}
                    onClick={() => setTypeScale(sz, null)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">Scale ratio</label>
              <div className="ratio-card-list">
                {typeScaleRatioOptions.map(o => (
                  <button
                    key={o.id}
                    className={`ratio-card ${tokens.typeScaleRatio === o.id ? 'active' : ''}`}
                    onClick={() => setTypeScale(null, o.id)}
                  >
                    <span className="ratio-card-label">{o.label}</span>
                    <span className="ratio-card-ratio">{o.ratio.toFixed(3)}</span>
                    <span className="ratio-card-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live type scale preview */}
            <div className="config-group">
              <label className="config-label">Scale preview</label>
              <div className="type-scale-preview">
                {TYPE_SCALE_NAMES.map(name => {
                  const px = typeScale[name];
                  return (
                    <div key={name} className="type-scale-row">
                      <span className="type-scale-name">{name}</span>
                      <span className="type-scale-px">{px}px</span>
                      <span
                        className="type-scale-sample"
                        style={{ fontFamily: tokens.fontBody, fontSize: Math.min(px, 20) }}
                      >
                        Aa
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── Step 2: Space ── */}
        {step === 2 && (
          <div className="config-section">

            <div className="config-group">
              <label className="config-label">Density preset</label>
              <p className="config-hint">Controls spacing across all components — from data-dense tools to editorial layouts.</p>
              <div className="density-card-list">
                {spacingScaleOptions.map(o => (
                  <button
                    key={o.id}
                    className={`density-card ${tokens.spacingScale === o.id ? 'active' : ''}`}
                    onClick={() => setSpacingScale(o.id)}
                  >
                    <div className="density-card-top">
                      <span className="density-card-label">{o.label}</span>
                      <span className="density-card-ref">{o.ref}</span>
                    </div>
                    <span className="density-card-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual spacing scale */}
            <div className="config-group">
              <label className="config-label">Space scale</label>
              <div className="space-scale-viz">
                {spaceVals.map((px, i) => (
                  <div key={i} className="space-scale-row">
                    <span className="space-scale-key">{SPACE_STEP_KEYS[i]}</span>
                    <div className="space-scale-bar-wrap">
                      <div
                        className="space-scale-bar"
                        style={{ width: `${Math.round((px / maxSpace) * 100)}%` }}
                      />
                    </div>
                    <span className="space-scale-val">{px}px</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Step 3: Motion ── */}
        {step === 3 && (
          <div className="config-section">

            <div className="config-group">
              <label className="config-label">Motion personality</label>
              <p className="config-hint">Sets the pacing and feel of all transitions — from instant feedback to cinematic reveals.</p>
              <div className="motion-card-list">
                {Object.entries(MOTION_PRESETS).map(([id, preset]) => (
                  <button
                    key={id}
                    className={`motion-card ${tokens.motionPersonality === id ? 'active' : ''}`}
                    onClick={() => setMotionPersonality(id)}
                  >
                    <div className="motion-card-top">
                      <span className="motion-card-label">{preset.label}</span>
                      <span className="motion-card-ref">{preset.ref}</span>
                    </div>
                    <span className="motion-card-desc">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration values for selected preset */}
            <div className="config-group">
              <label className="config-label">Durations</label>
              <div className="motion-durations">
                {[
                  ['Fast',       motionPreset.fast       ],
                  ['Base',       motionPreset.base       ],
                  ['Slow',       motionPreset.slow       ],
                  ['Deliberate', motionPreset.deliberate ],
                ].map(([name, ms]) => (
                  <div key={name} className="motion-dur-row">
                    <span className="motion-dur-name">{name}</span>
                    <div className="motion-dur-bar-wrap">
                      <div
                        className="motion-dur-bar"
                        style={{ width: `${Math.round((ms / 1100) * 100)}%` }}
                      />
                    </div>
                    <span className="motion-dur-ms">{ms}ms</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Easing preview */}
            <div className="config-group">
              <label className="config-label">Easing</label>
              <div className="motion-easing-list">
                {[
                  ['Standard', motionPreset.ease     ],
                  ['Enter',    motionPreset.easeEnter],
                  ['Exit',     motionPreset.easeExit ],
                ].map(([name, val]) => (
                  <div key={name} className="motion-ease-row">
                    <span className="motion-ease-name">{name}</span>
                    <code className="motion-ease-val">{val}</code>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Step 4: Shape ── */}
        {step === 4 && (
          <div className="config-section">

            <div className="config-group">
              <label className="config-label">Corner radius</label>
              <div className="radius-row">
                {radiusPresets.map((p, i) => (
                  <button
                    key={p.label}
                    className={`radius-box ${radiusIdx === i ? 'selected' : ''}`}
                    style={{ borderRadius: p.md, background: tokens.brand }}
                    onClick={() => handleRadius(i)}
                    title={p.label}
                  />
                ))}
              </div>
              <div className="radius-labels">
                {radiusPresets.map(p => <span key={p.label}>{p.label}</span>)}
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">Border style</label>
              <div className="btn-row">
                {['solid', 'dashed', 'dotted'].map(s => (
                  <button key={s} className={`shape-btn ${tokens.borderStyle === s ? 'active' : ''}`} onClick={() => setBorderStyle(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">Shadow depth</label>
              <div className="btn-row">
                {[['none', 'Flat'], ['sm', 'Subtle'], ['md', 'Raised']].map(([val, label]) => (
                  <button key={val} className={`shape-btn ${tokens.shadow === val ? 'active' : ''}`} onClick={() => setShadow(val)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Elevation style */}
            <div className="config-group">
              <label className="config-label">Elevation style</label>
              <p className="config-hint">Controls shadow depth across layers — from flat minimal to dramatic layered depth.</p>
              <div className="elev-card-list">
                {Object.entries(ELEVATION_PRESETS).map(([id, preset]) => (
                  <button
                    key={id}
                    className={`elev-card ${tokens.elevationStyle === id ? 'active' : ''}`}
                    onClick={() => setElevationStyle(id)}
                  >
                    <span className="elev-card-label">{preset.label}</span>
                    <span className="elev-card-desc">{preset.desc}</span>
                  </button>
                ))}
              </div>

              {/* 6 shadow level samples */}
              <div className="elev-samples">
                {elevShadows.map((shadow, i) => (
                  <div key={i} className="elev-sample-item">
                    <div className="elev-sample-box" style={{ boxShadow: shadow }} />
                    <span className="elev-sample-label">Level {i}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="shape-preview">
              <div className="shape-preview-card" style={{
                borderRadius: tokens.radiusLg,
                borderStyle: tokens.borderStyle,
                boxShadow: elevShadows[2],
              }}>
                <div className="shape-preview-label" style={{ fontFamily: tokens.fontDisplay }}>Preview</div>
                <button style={{
                  background: tokens.brand, borderRadius: tokens.radiusMd,
                  color: '#fff', padding: '7px 16px', border: 'none',
                  fontFamily: tokens.fontBody, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}>Button</button>
              </div>
            </div>

          </div>
        )}

        {/* ── Step 5: Export ── */}
        {step === 5 && (
          <div className="config-section">

            <div className="export-name-field">
              <label className="export-name-label">
                Design system name <span style={{color:'var(--shell-danger)'}}>*</span>
              </label>
              <input
                className="export-name-input"
                type="text"
                placeholder="e.g. Acme Design System"
                value={dsName}
                onChange={e => setDsName(e.target.value)}
              />
              {dsName.trim() === '' && (
                <span className="export-name-hint">Required — used in the exported files</span>
              )}
              <div className="export-download-links">
                <button
                  className={`export-dl-link${hasName ? '' : ' disabled'}`}
                  onClick={hasName ? handleExportCss : undefined}
                  disabled={!hasName || exportingCss}
                >
                  Download component library
                </button>
                <button
                  className={`export-dl-link${hasName ? '' : ' disabled'}`}
                  onClick={hasName ? handleExportSkill : undefined}
                  disabled={!hasName || exportingSkill}
                >
                  {exportingSkill ? 'Preparing…' : 'Download design system skill file'}
                </button>
              </div>
            </div>

            <HowToUseAccordion />

            {(() => {
              const tokenCount = allTokenLines.filter(t => t.key).length;
              return (
                <div className="token-accordion">
                  <button
                    className="token-accordion-trigger"
                    onClick={() => setTokenAccordionOpen(o => !o)}
                  >
                    <span>Token Output</span>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span className="token-count-pill">{tokenCount}</span>
                      <ChevronDown size={14} style={{color:'var(--shell-text-2)',transform:tokenAccordionOpen?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0}} />
                    </div>
                  </button>
                  {tokenAccordionOpen && (
                    <div className="token-accordion-body">
                      <input
                        type="search"
                        className="token-search"
                        placeholder="Search tokens…"
                        value={tokenSearch}
                        onChange={e => setTokenSearch(e.target.value)}
                      />
                      <pre className="token-code-pre">
                        {q
                          ? filteredLines.map(t => `${t.key}: ${t.value};`).join('\n') || '  — no matches —'
                          : `:root {\n${allTokenLines.map(t =>
                              t.section
                                ? `\n  /* ${t.section} */`
                                : `  ${t.key}: ${t.value};`
                            ).join('\n')}\n}`
                        }
                      </pre>
                    </div>
                  )}
                </div>
              );
            })()}

            <p className="export-desc">
              Exports a component file you can drop into any project, plus a markdown reference your team can use.
            </p>
          </div>
        )}
      </div>

      <div className="step-nav">
        <div className="reset-dropdown-wrap" ref={resetRef}>
          <button className="nav-btn reset-btn" onClick={() => setResetOpen(o => !o)}>
            Reset
          </button>
          {resetOpen && (
            <div className="reset-dropdown">
              <button
                className="reset-option"
                onClick={() => { handleResetTab(); setResetOpen(false); }}
              >
                Reset {STEPS[step]}
              </button>
              <button
                className="reset-option reset-option-danger"
                onClick={() => { handleResetAll(); setResetOpen(false); }}
              >
                Reset all
              </button>
              {importedTokens && (
                <button
                  className="reset-option"
                  onClick={() => { setAllTokens(importedTokens); setResetOpen(false); }}
                >
                  Reset to import
                </button>
              )}
            </div>
          )}
        </div>

        {step > 0 && (
          <button className="nav-btn" onClick={() => setStep(s => s - 1)}>Back</button>
        )}
        {step < 5 && (
          <button className="nav-btn primary" onClick={() => setStep(s => s + 1)} style={{ marginLeft: 'auto' }}>
            Next
          </button>
        )}
      </div>

      {toast && (
        <div className="shell-toast" role="status" key={toast}>
          <span className="shell-toast-check"><Check size={12} /></span>
          <div className="shell-toast-body">
            <span className="shell-toast-title">Copied to clipboard</span>
            <span className="shell-toast-hex">The hex color "{toast}" has been copied</span>
          </div>
          <span className="shell-toast-color" style={{ background: toast }} />
        </div>
      )}
    </aside>
  );
}
