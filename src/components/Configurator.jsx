import { useState, useRef, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, Info, Sparkles } from 'lucide-react';
import {
  defaultTokens,
  radiusPresets,
  fontDisplayOptions, fontBodyOptions, fontMonoOptions,
  typeScalePresetOptions, TYPE_SCALE_PRESETS,
  spacingScaleOptions, SPACING_SCALES, SPACE_STEP_KEYS,
  MOTION_PRESETS,
  ELEVATION_PRESETS,
  computeHoverColor, shadowValues, wcagContrast, generateColorScale,
} from '../utils/tokens';
import { buildExportZip } from '../utils/generateExport';
import { buildCssVars } from '../hooks/useTokens';
import { STYLE_PRESETS } from '../utils/stylePresets';

const STEPS = ['Intro', 'Colors', 'Type', 'Space', 'Motion', 'Shape', 'Export'];

const COLOR_GROUPS = [
  { key: 'brand',     label: 'Primary',   tokenKey: 'brand',     dmKey: 'brandDm',     cssVar: '--ds-brand',     hoverVar: '--ds-brand-hover',     hoverTextVar: '--ds-brand-hover-text'     },
  { key: 'secondary', label: 'Secondary', tokenKey: 'secondary', dmKey: 'secondaryDm', cssVar: '--ds-secondary', hoverVar: '--ds-secondary-hover', hoverTextVar: '--ds-secondary-hover-text' },
  { key: 'tertiary',  label: 'Tertiary',  tokenKey: 'tertiary',  dmKey: 'tertiaryDm',  cssVar: '--ds-tertiary',  hoverVar: '--ds-tertiary-hover',  hoverTextVar: '--ds-tertiary-hover-text'  },
  { key: 'success',   label: 'Success',   tokenKey: 'success',   dmKey: 'successDm',   cssVar: '--ds-success',   hoverVar: '--ds-success-hover',   hoverTextVar: '--ds-success-hover-text'   },
  { key: 'caution',   label: 'Warning',   tokenKey: 'caution',   dmKey: 'cautionDm',   cssVar: '--ds-warning',   hoverVar: '--ds-warning-hover',   hoverTextVar: '--ds-warning-hover-text'   },
  { key: 'error',     label: 'Danger',    tokenKey: 'error',     dmKey: 'errorDm',     cssVar: '--ds-danger',    hoverVar: '--ds-danger-hover',    hoverTextVar: '--ds-danger-hover-text'    },
  { key: 'info',      label: 'Info',      tokenKey: 'info',      dmKey: 'infoDm',      cssVar: '--ds-info',      hoverVar: '--ds-info-hover',      hoverTextVar: '--ds-info-hover-text'      },
  { key: 'ghost',     label: 'Ghost',     tokenKey: 'ghost',     dmKey: 'ghostDm',     cssVar: '--ds-ghost',     hoverVar: '--ds-ghost-hover',     hoverTextVar: null                         },
];

const SCALE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90];


function toVarName(name) {
  return '--ds-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildAllTokenLines(tokens) {
  const cv = buildCssVars(tokens);
  const lines = [
    { section: 'Brand' },
    { key: '--ds-brand',                value: tokens.brand },
    { key: '--ds-brand-dark',           value: tokens.brandDark },
    { key: '--ds-brand-light',          value: tokens.brandLight },
    { key: '--ds-brand-hover',          value: tokens.brandHover },
    { key: '--ds-brand-hover-text',     value: cv['--ds-brand-hover-text'] },
    { section: 'Semantic' },
    { key: '--ds-secondary',            value: tokens.secondary },
    { key: '--ds-secondary-hover',      value: tokens.secondaryHover },
    { key: '--ds-secondary-hover-text', value: cv['--ds-secondary-hover-text'] },
    { key: '--ds-tertiary',             value: tokens.tertiary },
    { key: '--ds-tertiary-hover',       value: tokens.tertiaryHover },
    { key: '--ds-tertiary-hover-text',  value: cv['--ds-tertiary-hover-text'] },
    { key: '--ds-success',              value: tokens.success },
    { key: '--ds-success-hover',        value: tokens.successHover },
    { key: '--ds-success-hover-text',   value: cv['--ds-success-hover-text'] },
    { key: '--ds-warning',              value: tokens.caution },
    { key: '--ds-warning-hover',        value: tokens.cautionHover },
    { key: '--ds-warning-hover-text',   value: cv['--ds-warning-hover-text'] },
    { key: '--ds-danger',               value: tokens.error },
    { key: '--ds-danger-hover',         value: tokens.errorHover },
    { key: '--ds-danger-hover-text',    value: cv['--ds-danger-hover-text'] },
    { key: '--ds-info',                 value: tokens.info },
    { key: '--ds-info-hover',           value: tokens.infoHover },
    { key: '--ds-info-hover-text',      value: cv['--ds-info-hover-text'] },
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

function WcagBadge({ hex, compareHex = '#ffffff', onInfoClick }) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const ratio = wcagContrast(hex, compareHex);
  const aa  = ratio >= 4.5;
  const aaa = ratio >= 7;
  return (
    <div className="wcag-row">
      <span className="wcag-label">WCAG</span>
      <span className="wcag-ratio">{ratio.toFixed(2)}:1</span>
      <span className={`wcag-pill ${aa  ? 'pass' : 'fail'}`}>AA</span>
      <span className={`wcag-pill ${aaa ? 'pass' : 'fail'}`}>AAA</span>
      {onInfoClick && (
        <button className="wcag-info-btn" onClick={onInfoClick} title="What does this mean?">
          <Info size={11} />
        </button>
      )}
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

export default function Configurator({ tokens, handlers, importedTokens, configCollapsed, onCollapseToggle, onShowAnalyzer, configWidth, isDragging }) {
  const [step, setStep]           = useState(0);
  const [activePreset, setActivePreset] = useState('studio');
  const [confirmPreset, setConfirmPreset] = useState(null);
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
  const coreColorsRef = useRef(null);
  const [wcagInfoData, setWcagInfoData] = useState(null);
  const [motionDemoPhase, setMotionDemoPhase] = useState('visible');

  function triggerMotionDemo() {
    setMotionDemoPhase('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => setMotionDemoPhase('visible')));
  }

  function goToTextColor() {
    const targetId = colorMode === 'dark' ? 'text-primary-dark' : 'text-primary';
    setOpenCoreGroup(targetId);
    setTimeout(() => coreColorsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

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
      if (g.tokenKey === 'ghost') {
        init[`light:${g.tokenKey}`] = 'custom';
        init[`dark:${g.tokenKey}`]  = 'custom';
        return;
      }
      const pairs = [
        ['light', defaultTokens[g.tokenKey],                             `${g.tokenKey}Hover`],
        ['dark',  defaultTokens[g.dmKey] || defaultTokens[g.tokenKey],  `${g.tokenKey}HoverDm`],
      ];
      for (const [prefix, base, hoverKey] of pairs) {
        const stored = defaultTokens[hoverKey] || '';
        const scaleDark  = computeHoverColor(base, 'dark');
        const scaleLight = computeHoverColor(base, 'light');
        init[`${prefix}:${g.tokenKey}`] =
          stored === scaleDark  ? 'dark'  :
          stored === scaleLight ? 'light' :
          stored                ? 'custom': 'dark';
      }
    });
    return init;
  }

  function syncUiFromTokens(merged) {
    const newHex = {};
    COLOR_GROUPS.forEach(g => {
      newHex[`light:${g.tokenKey}`] = merged[g.tokenKey]  || '#000000';
      newHex[`dark:${g.tokenKey}`]  = merged[g.dmKey] || merged[g.tokenKey] || '#000000';
    });
    setHexInputs(newHex);

    const newHoverHex = {};
    COLOR_GROUPS.forEach(g => {
      newHoverHex[`light:${g.tokenKey}`] = merged[`${g.tokenKey}Hover`]   || '#000000';
      newHoverHex[`dark:${g.tokenKey}`]  = merged[`${g.tokenKey}HoverDm`] || merged[`${g.tokenKey}Hover`] || '#000000';
    });
    setHoverHexInputs(newHoverHex);

    const newModes = {};
    COLOR_GROUPS.forEach(g => {
      if (g.tokenKey === 'ghost') {
        newModes[`light:${g.tokenKey}`] = 'custom';
        newModes[`dark:${g.tokenKey}`]  = 'custom';
        return;
      }
      const pairs = [
        ['light', merged[g.tokenKey],                          `${g.tokenKey}Hover`],
        ['dark',  merged[g.dmKey] || merged[g.tokenKey],       `${g.tokenKey}HoverDm`],
      ];
      for (const [prefix, base, hoverKey] of pairs) {
        const stored     = merged[hoverKey] || '';
        const scaleDark  = computeHoverColor(base, 'dark');
        const scaleLight = computeHoverColor(base, 'light');
        newModes[`${prefix}:${g.tokenKey}`] =
          stored === scaleDark  ? 'dark'  :
          stored === scaleLight ? 'light' :
          stored                ? 'custom': 'dark';
      }
    });
    setHoverModes(newModes);

    const coreSource = merged.coreColors?.length ? merged.coreColors : defaultTokens.coreColors;
    setCoreHexInputsState(Object.fromEntries(coreSource.map(c => [c.id, c.hex])));

    const mdVal = merged.radiusMd || '6px';
    const radiusStops = ['0px','2px','4px','6px','8px','12px','16px','24px','999px'];
    const idx = radiusStops.indexOf(mdVal);
    setRadiusIdx(idx >= 0 ? idx : 3);
  }

  function handleApplyPreset(preset) {
    const merged = { ...defaultTokens, ...preset.tokens };
    setAllTokens(merged);
    syncUiFromTokens(merged);
    setActivePreset(preset.id);
  }

  useEffect(() => {
    if (!importedTokens) return;
    const merged = { ...defaultTokens, ...importedTokens };
    syncUiFromTokens(merged);
    setActivePreset('custom');
  }, [importedTokens]);

  function handleResetTab() {
    if (step === 1) {
      setBrand(defaultTokens.brand);
      COLOR_GROUPS.forEach(g => {
        if (g.tokenKey !== 'brand') setSemanticColor(g.tokenKey, defaultTokens[g.tokenKey]);
        if (defaultTokens[g.dmKey])           setSemanticColor(g.dmKey, defaultTokens[g.dmKey]);
        setSemanticColor(`${g.tokenKey}Hover`,   defaultTokens[`${g.tokenKey}Hover`]);
        setSemanticColor(`${g.tokenKey}HoverDm`, defaultTokens[`${g.tokenKey}HoverDm`]);
      });
      setCustomColors([]);
      setCoreColors(defaultTokens.coreColors);
      setHexInputs(makeInitHex());
      setHoverHexInputs(makeInitHoverHex());
      setHoverModes(makeInitHoverModes());
      setCoreHexInputsState(Object.fromEntries(defaultTokens.coreColors.map(c => [c.id, c.hex])));
    } else if (step === 2) {
      setFont('display', defaultTokens.fontDisplay);
      setFont('body', defaultTokens.fontBody);
      setFont('mono', defaultTokens.fontMono);
      setTypeScale(defaultTokens.typeScalePreset);
    } else if (step === 3) {
      setSpacingScale(defaultTokens.spacingScale);
    } else if (step === 4) {
      setMotionPersonality(defaultTokens.motionPersonality);
    } else if (step === 5) {
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
    setTypeScale(defaultTokens.typeScalePreset);
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

  function getTextTokenHex(bgHex) {
    const lightCore = tokens.coreColors.find(c => c.id === 'text-primary-dark');
    const darkCore  = tokens.coreColors.find(c => c.id === 'text-primary');
    const lightHex  = lightCore?.hex || '#F5F5F5';
    const darkHex   = darkCore?.hex  || '#1E1E1E';
    // Mirror textOn() in useTokens: prefer white/light on any non-pastel background
    if (bgHex && wcagContrast(bgHex, '#FFFFFF') >= 4.5) return lightHex;
    return darkHex;
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

  const [exporting, setExporting] = useState(false);
  const hasName = dsName.trim() !== '';

  async function handleExport() {
    if (!hasName || exporting) return;
    setExporting(true);
    try {
      await buildExportZip(tokens, buildCssVars(tokens), dsName.trim());
    } finally {
      setExporting(false);
    }
  }

  const allTokenLines = buildAllTokenLines(tokens);
  const q = tokenSearch.trim().toLowerCase();
  const filteredLines = q
    ? allTokenLines.filter(t => t.key && (t.key.includes(q) || t.value.toLowerCase().includes(q)))
    : allTokenLines;

  // Derived type scale for preview
  const typeScale = TYPE_SCALE_PRESETS[tokens.typeScalePreset] || TYPE_SCALE_PRESETS.default;

  // Spacing scale values for selected preset
  const spaceVals = SPACING_SCALES[tokens.spacingScale] || SPACING_SCALES.default;
  const maxSpace  = Math.max(...spaceVals);

  // Motion preset for selected personality
  const motionPreset = MOTION_PRESETS[tokens.motionPersonality] || MOTION_PRESETS.fluid;

  // Elevation preset for selected style
  const elevPreset = ELEVATION_PRESETS[tokens.elevationStyle] || ELEVATION_PRESETS.subtle;
  const elevShadows = tokens.darkMode ? elevPreset.dark : elevPreset.light;

  return (
    <aside className={`config-panel${configCollapsed ? ' config-collapsed' : ''}`}>
      <nav className="step-nav-rail">
        {STEPS.map((s, i) => (
          <button
            key={s}
            className={`step-nav-item${!configCollapsed && i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
            onClick={() => {
              setStep(i);
              if (configCollapsed) onCollapseToggle();
            }}
          >
            <span className="step-nav-num">{i < step ? <Check size={11} /> : i + 1}</span>
            <span className="step-nav-label">{s}</span>
          </button>
        ))}
        <button
          className="nav-collapse-btn"
          onClick={onCollapseToggle}
          title={configCollapsed ? 'Show configurator' : 'Hide configurator'}
        >
          {configCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </nav>

      <div
        className="config-step-area"
        style={configCollapsed
          ? { width: 0 }
          : { width: configWidth ?? 340, transition: isDragging ? 'none' : undefined }
        }
      >
      <div className="config-body">

        {/* ── Step 0: Intro ── */}
        {step === 0 && (
          <div className="config-section intro-step">
            <div className="intro-header">
              <h2 className="intro-title">Choose a starting point</h2>
              <p className="intro-subtitle">
                Pick a style preset to set your colors, type, motion, and shape — then customize every detail in the following steps.
              </p>
            </div>

            {activePreset === 'custom' && (
              <div className="intro-custom-banner">
                <Sparkles size={13} />
                <span>Custom brand active — your analyzed brand is on the canvas. Pick a preset below to switch.</span>
              </div>
            )}

            <div className="preset-grid">
              {STYLE_PRESETS.map(preset => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    className={`preset-card${isActive ? ' preset-card--active' : ''}`}
                    onClick={() => activePreset === 'custom' ? setConfirmPreset(preset) : handleApplyPreset(preset)}
                    type="button"
                  >
                    <div
                      className="preset-preview"
                      style={{ background: `linear-gradient(135deg, ${preset.bgColor} 0%, ${preset.bgColor2} 100%)` }}
                    >
                      <div
                        className="preset-fake-btn"
                        style={{
                          borderRadius: preset.tokens.radiusMd ?? '6px',
                          fontFamily: preset.tokens.fontDisplay ?? 'inherit',
                          background: preset.bgColor,
                        }}
                      >
                        Button
                      </div>
                    </div>
                    <div className="preset-swatches">
                      {preset.swatches.map((sw, i) => (
                        <span key={i} className="preset-swatch" style={{ background: sw }} />
                      ))}
                    </div>
                    <div className="preset-info">
                      <span className="preset-name">{preset.name}</span>
                      <span className="preset-desc">{preset.tagline}</span>
                      <div className="preset-tags">
                        {preset.tags.map(t => <span key={t} className="preset-tag">{t}</span>)}
                      </div>
                    </div>
                    {isActive && <div className="preset-active-dot" />}
                  </button>
                );
              })}
            </div>

            <button className="intro-analyze-cta" onClick={onShowAnalyzer} type="button">
              <span className="intro-analyze-icon"><Sparkles size={15} /></span>
              <div className="intro-analyze-text">
                <span className="intro-analyze-title">
                  Analyze your brand
                  <span className="beta-badge">Beta</span>
                </span>
                <span className="intro-analyze-desc">Upload brand images or describe your brand — AI generates a matching token set</span>
              </div>
            </button>

          </div>
        )}

        {/* ── Step 1: Colors ── */}
        {step === 1 && (
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

                          {(() => {
                            const textHex   = getTextTokenHex(activeHex);
                            const lightCore = tokens.coreColors.find(c => c.id === 'text-primary-dark');
                            const lightHex  = lightCore?.hex || '#F5F5F5';
                            const usesLight = textHex === lightHex;
                            const textLabel = usesLight ? 'Light text' : 'Dark text';
                            const isLight   = wcagContrast(textHex, '#ffffff') < 3;
                            return (
                              <>
                                <WcagBadge
                                  hex={activeHex}
                                  compareHex={textHex}
                                  onInfoClick={() => setWcagInfoData({
                                    semanticHex: activeHex,
                                    semanticLabel: group.label,
                                    textHex,
                                    textLabel,
                                  })}
                                />

                                {!isGhost && (
                                  <div className="text-contrast-preview">
                                    <div className="text-contrast-chip" style={{ background: activeHex, color: textHex }}>
                                      <span className="text-contrast-aa">Aa</span>
                                      <span className="text-contrast-label">Text on this color</span>
                                    </div>
                                    <div className="tc-info">
                                      <span className="tc-info-label">
                                        Text color
                                        <span className="tc-auto-info-wrap">
                                          <Info size={11} className="tc-auto-info-icon" />
                                          <span className="tc-auto-info-popover">
                                            <strong>Auto-computed for WCAG AA</strong>
                                            <span>Light text is used when white (#FFF) reaches 4.5:1 contrast on this color. Otherwise dark text is used. Both options are WCAG AA checked.</span>
                                            <span>To override after export, edit the <code>color</code> value in <code>tokens.css</code> or ask your LLM: <em>"Change the primary button text to #000000."</em></span>
                                          </span>
                                        </span>
                                      </span>
                                      <div className="tc-info-value">
                                        <span className="tc-info-swatch" style={{
                                          background: textHex,
                                          border: isLight ? '1px solid rgba(128,128,128,.25)' : 'none',
                                        }} />
                                        <span>{textLabel}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}

                          <ColorScaleStrip hex={activeHex} onSwatchClick={copyHexToClipboard} />

                          <div>
                            {(() => {
                              // Light mode: always darken — preserves button character.
                              // Dark mode: pick whichever direction keeps text readable on the hover bg.
                              // Deep accessible darks (L ≤ 0.16) always win with dark hover here.
                              let rec = 'Dark';
                              if (colorMode === 'dark') {
                                const textHex    = getTextTokenHex(activeHex);
                                const scale      = generateColorScale(activeHex);
                                const darkRatio  = scale?.[70] ? wcagContrast(scale[70],  textHex) : 0;
                                const lightRatio = scale?.[20] ? wcagContrast(scale[20], textHex) : 0;
                                rec = darkRatio >= lightRatio ? 'Dark' : 'Light';
                              }
                              return (
                                <div className="hover-label-row">
                                  <span className="config-label">Hover</span>
                                  <span className="hover-guideline-chip">{rec} recommended</span>
                                </div>
                              );
                            })()}
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

            <div className="color-section dashed" ref={coreColorsRef}>
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

        {/* ── Step 2: Type ── */}
        {step === 2 && (
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
              <label className="config-label">Type scale</label>
              <p className="config-hint">Fixed 4pt-grid sizes — no irrational ratios, clean values across all steps.</p>
              <div className="density-card-list">
                {typeScalePresetOptions.map(o => (
                  <button
                    key={o.id}
                    className={`density-card ${tokens.typeScalePreset === o.id ? 'active' : ''}`}
                    onClick={() => setTypeScale(o.id)}
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

            {/* Heading preview */}
            <div className="config-group">
              <label className="config-label">Heading preview</label>
              <div className="heading-preview">
                {[
                  { tag: 'H1', step: '4xl', weight: 700 },
                  { tag: 'H2', step: '3xl', weight: 600 },
                  { tag: 'H3', step: '2xl', weight: 600 },
                  { tag: 'H4', step: 'xl',  weight: 600 },
                ].map(({ tag, step, weight }) => (
                  <div key={tag} className="heading-preview-row">
                    <span className="heading-preview-tag">{tag}</span>
                    <span className="heading-preview-px">{typeScale[step]}px</span>
                    <span
                      className="heading-preview-text"
                      style={{ fontFamily: tokens.fontDisplay, fontSize: typeScale[step], fontWeight: weight }}
                    >
                      The quick brown fox
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live type scale preview */}
            <div className="config-group">
              <label className="config-label">Scale preview</label>
              <div className="type-scale-preview">
                {Object.entries(typeScale).map(([name, px]) => (
                  <div key={name} className="type-scale-row">
                    <span className="type-scale-name">{name}</span>
                    <span className="type-scale-px">{px}px</span>
                    <span
                      className="type-scale-sample"
                      style={{ fontFamily: tokens.fontBody, fontSize: Math.min(px, 24) }}
                    >
                      Aa
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Step 3: Space ── */}
        {step === 3 && (
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

        {/* ── Step 4: Motion ── */}
        {step === 4 && (
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

            {/* Live interaction preview */}
            <div className="config-group">
              <label className="config-label">Live preview</label>

              {/* Hover demo — uses CSS custom props so :hover works */}
              <div className="motion-demo-block">
                <div className="motion-demo-row-label">
                  <span className="motion-demo-kind">Hover</span>
                  <span className="motion-demo-meta">{motionPreset.fast}ms</span>
                </div>
                <button
                  className="motion-demo-hover-btn"
                  style={{
                    '--mdur': `${motionPreset.fast}ms`,
                    '--mease': motionPreset.ease,
                  }}
                >
                  Hover me
                </button>
              </div>

              {/* Enter / stagger demo */}
              <div className="motion-demo-block">
                <div className="motion-demo-row-label">
                  <span className="motion-demo-kind">Enter</span>
                  <span className="motion-demo-meta">{motionPreset.slow}ms · stagger {motionPreset.fast}ms</span>
                </div>
                <div className="motion-demo-enter-row">
                  <div className="motion-demo-cards">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="motion-demo-card"
                        style={{
                          opacity:   motionDemoPhase === 'visible' ? 1 : 0,
                          transform: motionDemoPhase === 'visible' ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.94)',
                          transition: motionDemoPhase === 'hidden'
                            ? 'none'
                            : [
                                `opacity   ${motionPreset.slow}ms ${motionPreset.easeEnter} ${i * motionPreset.fast}ms`,
                                `transform ${motionPreset.slow}ms ${motionPreset.easeEnter} ${i * motionPreset.fast}ms`,
                              ].join(', '),
                        }}
                      />
                    ))}
                  </div>
                  <button className="motion-demo-play-btn" onClick={triggerMotionDemo} title="Replay">
                    ▶
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── Step 5: Shape ── */}
        {step === 5 && (
          <div className="config-section">

            <div className="config-group">
              <label className="config-label">Corner radius</label>
              <div className="radius-row">
                {radiusPresets.map((p, i) => (
                  <button
                    key={p.label}
                    className={`radius-swatch ${radiusIdx === i ? 'selected' : ''}`}
                    onClick={() => handleRadius(i)}
                    title={p.label}
                  >
                    <div className="radius-box" style={{ borderRadius: p.md, background: tokens.brand }} />
                    <span className="radius-swatch-label">{p.label}</span>
                  </button>
                ))}
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
              <div className="style-preview-strip">
                {['solid', 'dashed', 'dotted'].map(s => (
                  <div
                    key={s}
                    className={`style-preview-box ${tokens.borderStyle === s ? 'active' : ''}`}
                    style={{ borderStyle: s, borderRadius: tokens.radiusMd }}
                  />
                ))}
              </div>
            </div>

            <div className="config-group">
              <div className="config-label-row">
                <label className="config-label">Shadow depth</label>
                <span className="elev-mode-badge">Best in light mode</span>
              </div>
              <div className="btn-row">
                {[['none', 'Flat'], ['sm', 'Subtle'], ['md', 'Raised']].map(([val, label]) => (
                  <button key={val} className={`shape-btn ${tokens.shadow === val ? 'active' : ''}`} onClick={() => setShadow(val)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="style-preview-strip">
                {[['none', 'Flat'], ['sm', 'Subtle'], ['md', 'Raised']].map(([val]) => (
                  <div
                    key={val}
                    className={`style-preview-box ${tokens.shadow === val ? 'active' : ''}`}
                    style={{ borderRadius: tokens.radiusMd, boxShadow: shadowValues[val], border: 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Elevation style */}
            <div className="config-group">
              <div className="config-label-row">
                <label className="config-label">Elevation style</label>
                <span className="elev-mode-badge">Best in light mode</span>
              </div>
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

              {/* Layer depth scene */}
              <div className="elev-scene">
                {/* Page label */}
                <span className="elev-scene-page-tag">Page · L0</span>

                {/* Card — L1 */}
                <div className="elev-scene-card" style={{
                  borderRadius: tokens.radiusMd,
                  borderStyle: tokens.borderStyle,
                  boxShadow: elevShadows[1],
                }}>
                  <div className="elev-scene-row">
                    <div className="elev-scene-avatar" style={{ borderRadius: tokens.radiusSm, background: tokens.brand }} />
                    <div className="elev-scene-lines">
                      <div className="elev-scene-line" style={{ width: '70%' }} />
                      <div className="elev-scene-line" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <span className="elev-scene-tag">Card · L1</span>

                  {/* Dialog — L3 */}
                  <div className="elev-scene-dialog" style={{
                    borderRadius: tokens.radiusMd,
                    borderStyle: tokens.borderStyle,
                    boxShadow: elevShadows[3],
                  }}>
                    <div className="elev-scene-dialog-title" style={{ width: '55%' }} />
                    <div className="elev-scene-line" style={{ width: '85%', marginBottom: 8 }} />
                    <div className="elev-scene-dialog-actions">
                      <div className="elev-scene-dialog-btn ghost" style={{ borderRadius: tokens.radiusSm }} />
                      <div className="elev-scene-dialog-btn fill" style={{ borderRadius: tokens.radiusSm, background: tokens.brand }} />
                    </div>
                    <span className="elev-scene-tag">Dialog · L3</span>

                    {/* Tooltip — L5 */}
                    <div className="elev-scene-tooltip" style={{
                      borderRadius: tokens.radiusSm,
                      boxShadow: elevShadows[5],
                    }}>
                      Tooltip · L5
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Step 6: Export ── */}
        {step === 6 && (
          <div className="config-section">

            {/* Name field */}
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
                <span className="export-name-hint">Required — sets filenames and labels in the export</span>
              )}
            </div>

            {/* Export manifest */}
            <div className="export-manifest">
              <div className="export-manifest-title">What's included</div>
              <div className="export-manifest-files">
                <div className="export-manifest-group">
                  <span className="export-file-badge token">TOKEN</span>
                  <div className="export-manifest-file-list">
                    <span>tokens.css</span>
                    <span>tokens.js</span>
                  </div>
                </div>
                <div className="export-manifest-group">
                  <span className="export-file-badge css">CSS</span>
                  <div className="export-manifest-file-list">
                    <span>components.css</span>
                  </div>
                </div>
                <div className="export-manifest-group">
                  <span className="export-file-badge react">REACT</span>
                  <div className="export-manifest-file-list">
                    <span>Button · Input · Badge · Alert</span>
                    <span>Card · Tabs · Modal · Avatar</span>
                    <span>Table · Spinner · index.js</span>
                  </div>
                </div>
                <div className="export-manifest-group">
                  <span className="export-file-badge html">HTML</span>
                  <div className="export-manifest-file-list">
                    <span>examples.html</span>
                  </div>
                </div>
                <div className="export-manifest-group">
                  <span className="export-file-badge skill">AI</span>
                  <div className="export-manifest-file-list">
                    <span>CLAUDE.md</span>
                  </div>
                </div>
              </div>

              <button
                className={`export-dl-btn${hasName && !exporting ? '' : ' disabled'}`}
                onClick={handleExport}
                disabled={!hasName || exporting}
              >
                {exporting ? (
                  <>
                    <span className="export-btn-spinner" />
                    Building…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                    Download {hasName ? `"${dsName.trim()}"` : 'design system'} (.zip)
                  </>
                )}
              </button>
            </div>

            {/* Claude next-step hint */}
            <div className="export-claude-hint">
              <span className="export-claude-hint-label">Using Claude to build your app?</span>
              After downloading, open Claude and say: <em>"I've attached my design system — use it for everything you build for me."</em> Then attach the <strong>CLAUDE.md</strong> file from inside the ZIP. Claude will follow your exact colors, fonts, and style from that point on.
            </div>

            {/* Token output accordion */}
            {(() => {
              const tokenCount = allTokenLines.filter(t => t.key).length;
              return (
                <div className="token-accordion">
                  <button
                    className="token-accordion-trigger"
                    onClick={() => setTokenAccordionOpen(o => !o)}
                  >
                    <span>Token preview</span>
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
        {step < 6 && (
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
      </div>{/* /config-step-area */}

      {/* WCAG info modal */}
      {wcagInfoData && (() => {
        const ratio = wcagContrast(wcagInfoData.semanticHex, wcagInfoData.textHex);
        const aa    = ratio >= 4.5;
        const aaa   = ratio >= 7;
        const bgDarkness = wcagContrast(wcagInfoData.semanticHex, '#ffffff');
        const bgIsDark   = bgDarkness < wcagContrast(wcagInfoData.semanticHex, '#000000');
        const textIsLight = wcagContrast(wcagInfoData.textHex, '#ffffff') < 3;

        let fixes = [];
        if (!aa) {
          const deficit = (4.5 - ratio).toFixed(2);
          fixes.push({ icon: '↑', text: `You need ${deficit}:1 more to reach AA — the minimum for readable text.` });
          if (bgIsDark && textIsLight) {
            fixes.push({ icon: '✦', text: `Both colors are dark. Try a lighter brand color, or lighten your ${wcagInfoData.textLabel} token in Core Colors.` });
          } else if (!bgIsDark && !textIsLight) {
            fixes.push({ icon: '✦', text: `Both colors are light. Try a darker brand color, or darken your ${wcagInfoData.textLabel} token in Core Colors.` });
          } else {
            fixes.push({ icon: '✦', text: `Increase the contrast gap. Try a ${bgIsDark ? 'lighter' : 'darker'} ${wcagInfoData.semanticLabel} color, or adjust ${wcagInfoData.textLabel} in Core Colors.` });
          }
        } else if (!aaa) {
          const gap = (7 - ratio).toFixed(2);
          fixes.push({ icon: '↑', text: `Passes AA. ${gap}:1 more would reach AAA — the gold standard for accessibility.` });
          fixes.push({ icon: '✦', text: `To reach AAA, slightly ${bgIsDark ? 'lighten' : 'darken'} your ${wcagInfoData.semanticLabel} color or adjust ${wcagInfoData.textLabel} in Core Colors.` });
        } else {
          fixes.push({ icon: '✓', text: 'Excellent — this pairing exceeds the AAA standard. No changes needed.' });
        }

        return (
          <div className="wcag-modal-overlay" onClick={() => setWcagInfoData(null)}>
            <div className="wcag-modal" onClick={e => e.stopPropagation()}>
              <div className="wcag-modal-header">
                <span className="wcag-modal-title">Contrast Check</span>
                <button className="wcag-modal-close" onClick={() => setWcagInfoData(null)}>✕</button>
              </div>
              <div className="wcag-modal-body">

                {/* Score + preview */}
                <div className="wcag-modal-score-row">
                  <div className="wcag-modal-preview" style={{ background: wcagInfoData.semanticHex, color: wcagInfoData.textHex }}>
                    <span className="wcag-preview-aa">Aa</span>
                    <span className="wcag-preview-label">Sample text</span>
                  </div>
                  <div className="wcag-modal-score-block">
                    <div className={`wcag-modal-ratio ${aaa ? 'aaa' : aa ? 'aa' : 'fail'}`}>
                      {ratio.toFixed(2)}<span className="wcag-ratio-unit">:1</span>
                    </div>
                    <div className="wcag-modal-badges">
                      <span className={`wcag-pill ${aa  ? 'pass' : 'fail'}`}>AA</span>
                      <span className={`wcag-pill ${aaa ? 'pass' : 'fail'}`}>AAA</span>
                    </div>
                    <div className="wcag-auto-text-note">
                      → {textIsLight ? 'Light' : 'Dark'} text auto-selected
                    </div>
                  </div>
                </div>

                {/* Color pair */}
                <div className="wcag-modal-pair">
                  <div className="wcag-modal-swatch-row">
                    <span className="wcag-modal-swatch" style={{ background: wcagInfoData.semanticHex }} />
                    <div>
                      <div className="wcag-modal-swatch-label">{wcagInfoData.semanticLabel} (background)</div>
                      <div className="wcag-modal-swatch-value">{wcagInfoData.semanticHex}</div>
                    </div>
                  </div>
                  <div className="wcag-modal-swatch-row">
                    <span className="wcag-modal-swatch" style={{
                      background: wcagInfoData.textHex,
                      border: textIsLight ? '1px solid rgba(128,128,128,.25)' : 'none',
                    }} />
                    <div>
                      <div className="wcag-modal-swatch-label">{wcagInfoData.textLabel} (text)</div>
                      <div className="wcag-modal-swatch-value">{wcagInfoData.textHex}</div>
                    </div>
                  </div>
                </div>

                {/* Standards reference */}
                <div className="wcag-modal-levels">
                  <div className="wcag-modal-level">
                    <span className={`wcag-pill ${aa ? 'pass' : 'fail'}`}>AA</span>
                    <span>4.5:1 — minimum for normal text</span>
                  </div>
                  <div className="wcag-modal-level">
                    <span className={`wcag-pill ${aaa ? 'pass' : 'fail'}`}>AAA</span>
                    <span>7:1 — enhanced / gold standard</span>
                  </div>
                </div>

                {/* Actionable fixes */}
                <div className="wcag-modal-fix">
                  <div className="wcag-modal-fix-title">How to improve</div>
                  {fixes.map((f, i) => (
                    <div key={i} className="wcag-modal-fix-item">
                      <span className="wcag-fix-icon">{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {confirmPreset && (
        <div className="preset-confirm-overlay" onClick={() => setConfirmPreset(null)}>
          <div className="preset-confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="preset-confirm-title">Switch to {confirmPreset.name}?</div>
            <div className="preset-confirm-body">
              Your custom analyzed brand will be replaced. You can re-run the analyzer any time to restore it.
            </div>
            <div className="preset-confirm-actions">
              <button className="preset-confirm-cancel" onClick={() => setConfirmPreset(null)}>
                Keep custom brand
              </button>
              <button className="preset-confirm-ok" onClick={() => { handleApplyPreset(confirmPreset); setConfirmPreset(null); }}>
                Switch to {confirmPreset.name}
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}
