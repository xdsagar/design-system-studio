import { useState, useCallback } from 'react';
import { defaultTokens, deriveBrandTokens, shadowValues, darkOverrides, generateColorScale, lighten, rgbToHex } from '../utils/tokens';

function toVarName(name) {
  return '--ds-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildCssVars(tokens) {
  const isDark = tokens.darkMode;
  const m = (lk, dk) => isDark ? (tokens[dk] ?? tokens[lk]) : tokens[lk];

  const activeBrand = m('brand', 'brandDm');
  const derived = deriveBrandTokens(activeBrand);

  // Look up a core color by ID
  const findCore = (id) => {
    const c = tokens.coreColors.find(c => c.id === id);
    return (c && /^#[0-9a-fA-F]{6}$/.test(c.hex)) ? c.hex : null;
  };

  // Semantic tint helpers — used for badges, alerts, callouts
  const subtle = (hex) => {
    const scale = generateColorScale(hex);
    if (!scale) return isDark ? '#222' : '#f5f5f5';
    return isDark ? scale[80] : scale[10];
  };
  const onSubtle = (hex) => {
    const scale = generateColorScale(hex);
    if (!scale) return hex;
    return isDark ? scale[30] : scale[80];
  };

  // Active semantic colors (respects dark mode variants)
  const successHex = m('success', 'successDm');
  const warnHex    = m('caution', 'cautionDm');
  const dangerHex  = m('error',   'errorDm');
  const infoHex    = m('info',    'infoDm');

  // Structural canvas vars — in dark mode, derive all surface tiers from bg-dark proportionally
  const bgDarkHex   = findCore('bg-dark') || darkOverrides.surface;
  const surfaceHex  = isDark ? bgDarkHex                              : (findCore('surface')  || '#fff');
  const surface1Hex = isDark ? rgbToHex(lighten(bgDarkHex, 0.065))   : (findCore('bg-light') || '#F5F5F5');
  const surface2Hex = isDark ? rgbToHex(lighten(bgDarkHex, 0.12))    : '#EEEEEE';
  const n100Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.04))    : '#F0F0F0';
  // border: light mode uses core 'border' color; dark mode derives from bg-dark (light-mode value would be too bright)
  const n200Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.13))    : (findCore('border')         || '#E6E6E6');
  const n300Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.26))    : (findCore('neutral')        || '#C8C8C8');
  const n400Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.39))    : (findCore('disabled')       || '#B3B3B3');
  // text-secondary core color is a light-mode value; don't apply to dark mode (too low contrast)
  const n600Hex     = isDark ? '#9A9A9A' : (findCore('text-secondary') || '#6F6F6F');
  const n800Hex     = isDark ? (findCore('text-primary-dark') || '#E0E0E0') : (findCore('text-primary') || '#1E1E1E');
  const n900Hex     = isDark ? (findCore('text-primary-dark') || '#F5F5F5') : (findCore('text-primary') || '#1E1E1E');

  const vars = {
    '--ds-brand':                activeBrand,
    '--ds-brand-dark':           derived.brandDark,
    '--ds-brand-light':          derived.brandLight,
    '--ds-brand-hover':          m('brandHover',         'brandHoverDm'),
    '--ds-brand-hover-text':     m('brandHoverText',     'brandHoverTextDm'),
    '--ds-secondary':            m('secondary',          'secondaryDm'),
    '--ds-secondary-hover':      m('secondaryHover',     'secondaryHoverDm'),
    '--ds-secondary-hover-text': m('secondaryHoverText', 'secondaryHoverTextDm'),
    '--ds-tertiary':             m('tertiary',           'tertiaryDm'),
    '--ds-tertiary-hover':       m('tertiaryHover',      'tertiaryHoverDm'),
    '--ds-tertiary-hover-text':  m('tertiaryHoverText',  'tertiaryHoverTextDm'),
    '--ds-ghost':                m('ghost',              'ghostDm'),
    '--ds-ghost-hover':          m('ghostHover',         'ghostHoverDm'),
    '--ds-success':              successHex,
    '--ds-success-hover':        m('successHover',       'successHoverDm'),
    '--ds-success-hover-text':   m('successHoverText',   'successHoverTextDm'),
    '--ds-warning':              warnHex,
    '--ds-warning-hover':        m('cautionHover',       'cautionHoverDm'),
    '--ds-warning-hover-text':   m('cautionHoverText',   'cautionHoverTextDm'),
    '--ds-danger':               dangerHex,
    '--ds-danger-hover':         m('errorHover',         'errorHoverDm'),
    '--ds-danger-hover-text':    m('errorHoverText',     'errorHoverTextDm'),
    '--ds-info':                 infoHex,
    '--ds-info-hover':           m('infoHover',          'infoHoverDm'),
    '--ds-info-hover-text':      m('infoHoverText',      'infoHoverTextDm'),
    '--ds-font-display':         tokens.fontDisplay,
    '--ds-font-body':            tokens.fontBody,
    '--ds-radius-sm':            tokens.radiusSm,
    '--ds-radius-md':            tokens.radiusMd,
    '--ds-radius-lg':            tokens.radiusLg,
    '--ds-radius-pill':          tokens.radiusPill,
    '--ds-border-style':         tokens.borderStyle,
    '--ds-shadow':               shadowValues[tokens.shadow] || shadowValues.sm,
    '--ds-surface':              surfaceHex,
    '--ds-surface-1':            surface1Hex,
    '--ds-surface-2':            surface2Hex,
    '--ds-neutral-100':          n100Hex,
    '--ds-neutral-200':          n200Hex,
    '--ds-neutral-300':          n300Hex,
    '--ds-neutral-400':          n400Hex,
    '--ds-neutral-600':          n600Hex,
    '--ds-neutral-800':          n800Hex,
    '--ds-neutral-900':          n900Hex,
    // Semantic tints — used by badges, alerts, callouts
    '--ds-success-subtle':       subtle(successHex),
    '--ds-success-on-subtle':    onSubtle(successHex),
    '--ds-warning-subtle':       subtle(warnHex),
    '--ds-warning-on-subtle':    onSubtle(warnHex),
    '--ds-danger-subtle':        subtle(dangerHex),
    '--ds-danger-on-subtle':     onSubtle(dangerHex),
    '--ds-info-subtle':          subtle(infoHex),
    '--ds-info-on-subtle':       onSubtle(infoHex),
  };

  tokens.coreColors.forEach(({ id, hex }) => {
    if (id && /^#[0-9a-fA-F]{6}$/.test(hex)) {
      const scale = generateColorScale(hex);
      if (scale) [10,20,30,40,50,60,70,80,90].forEach(s => { vars[`--ds-${id}-${s}`] = scale[s]; });
    }
  });

  tokens.customColors.forEach(({ name, hex }) => {
    if (name && /^#[0-9a-fA-F]{6}$/.test(hex)) vars[toVarName(name)] = hex;
  });

  return vars;
}

export function useTokens() {
  const [tokens, setTokens] = useState(defaultTokens);

  const cssVars = buildCssVars(tokens);

  const setBrand = useCallback((hex) => {
    setTokens(t => ({ ...t, ...deriveBrandTokens(hex) }));
  }, []);

  const setNeutral = useCallback((hex) => {
    setTokens(t => ({ ...t, neutral: hex }));
  }, []);

  const setFont = useCallback((type, value) => {
    setTokens(t => ({ ...t, [type === 'display' ? 'fontDisplay' : 'fontBody']: value }));
  }, []);

  const setRadius = useCallback((preset) => {
    setTokens(t => ({ ...t, radiusSm: preset.sm, radiusMd: preset.md, radiusLg: preset.lg, radiusPill: preset.pill }));
  }, []);

  const setBorderStyle = useCallback((style) => {
    setTokens(t => ({ ...t, borderStyle: style }));
  }, []);

  const setShadow = useCallback((shadow) => {
    setTokens(t => ({ ...t, shadow }));
  }, []);

  const setDarkMode = useCallback((darkMode) => {
    setTokens(t => ({ ...t, darkMode }));
  }, []);

  const setSemanticColor = useCallback((key, value) => {
    setTokens(t => ({ ...t, [key]: value }));
  }, []);

  const setCustomColors = useCallback((customColors) => {
    setTokens(t => ({ ...t, customColors }));
  }, []);

  const setCoreColors = useCallback((coreColors) => {
    setTokens(t => ({ ...t, coreColors }));
  }, []);

  const setAllTokens = useCallback((incoming) => {
    setTokens(t => ({ ...t, ...incoming }));
  }, []);

  return {
    tokens, cssVars,
    setBrand, setNeutral, setFont, setRadius, setBorderStyle,
    setShadow, setDarkMode, setSemanticColor, setCustomColors, setCoreColors,
    setAllTokens,
  };
}
