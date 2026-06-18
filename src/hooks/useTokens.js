import { useState, useCallback, useLayoutEffect } from 'react';
import {
  defaultTokens, deriveBrandTokens, shadowValues, darkOverrides,
  generateColorScale, lighten, rgbToHex,
  SPACING_SCALES, SPACE_STEP_KEYS,
  TYPE_SCALE_PRESETS,
  MOTION_PRESETS,
  ELEVATION_PRESETS,
} from '../utils/tokens';

function toVarName(name) {
  return '--ds-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildCssVars(tokens) {
  const isDark = tokens.darkMode;
  const m = (lk, dk) => isDark ? (tokens[dk] ?? tokens[lk]) : tokens[lk];

  const activeBrand = m('brand', 'brandDm');
  const derived = deriveBrandTokens(activeBrand);

  const findCore = (id) => {
    const c = tokens.coreColors.find(c => c.id === id);
    return (c && /^#[0-9a-fA-F]{6}$/.test(c.hex)) ? c.hex : null;
  };

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

  const successHex = m('success', 'successDm');
  const warnHex    = m('caution', 'cautionDm');
  const dangerHex  = m('error',   'errorDm');
  const infoHex    = m('info',    'infoDm');

  // Text on semantic colors always tracks the core text token, not a stored white/black value.
  const textOnColor = isDark
    ? (findCore('text-primary-dark') || '#F5F5F5')
    : (findCore('text-primary')      || '#1E1E1E');

  const bgDarkHex   = findCore('bg-dark') || darkOverrides.surface;
  const surfaceHex  = isDark ? bgDarkHex                              : (findCore('surface')  || '#fff');
  const surface1Hex = isDark ? rgbToHex(lighten(bgDarkHex, 0.065))   : (findCore('bg-light') || '#F5F5F5');
  const surface2Hex = isDark ? rgbToHex(lighten(bgDarkHex, 0.12))    : '#EEEEEE';
  const n100Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.04))    : '#F0F0F0';
  const n200Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.13))    : (findCore('border')         || '#E6E6E6');
  const n300Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.26))    : (findCore('neutral')        || '#C8C8C8');
  const n400Hex     = isDark ? rgbToHex(lighten(bgDarkHex, 0.39))    : (findCore('disabled')       || '#B3B3B3');
  const n600Hex     = isDark ? '#9A9A9A' : (findCore('text-secondary') || '#6F6F6F');
  const n800Hex     = isDark ? (findCore('text-primary-dark') || '#E0E0E0') : (findCore('text-primary') || '#1E1E1E');
  const n900Hex     = isDark ? (findCore('text-primary-dark') || '#F5F5F5') : (findCore('text-primary') || '#1E1E1E');

  const vars = {
    // ── Color: interactive
    '--ds-brand':                activeBrand,
    '--ds-brand-dark':           derived.brandDark,
    '--ds-brand-light':          derived.brandLight,
    '--ds-brand-hover':          m('brandHover',         'brandHoverDm'),
    '--ds-brand-hover-text':     textOnColor,
    '--ds-secondary':            m('secondary',          'secondaryDm'),
    '--ds-secondary-hover':      m('secondaryHover',     'secondaryHoverDm'),
    '--ds-secondary-hover-text': textOnColor,
    '--ds-tertiary':             m('tertiary',           'tertiaryDm'),
    '--ds-tertiary-hover':       m('tertiaryHover',      'tertiaryHoverDm'),
    '--ds-tertiary-hover-text':  textOnColor,
    '--ds-ghost':                m('ghost',              'ghostDm'),
    '--ds-ghost-hover':          m('ghostHover',         'ghostHoverDm'),

    // ── Color: semantic
    '--ds-success':              successHex,
    '--ds-success-hover':        m('successHover',       'successHoverDm'),
    '--ds-success-hover-text':   textOnColor,
    '--ds-warning':              warnHex,
    '--ds-warning-hover':        m('cautionHover',       'cautionHoverDm'),
    '--ds-warning-hover-text':   textOnColor,
    '--ds-danger':               dangerHex,
    '--ds-danger-hover':         m('errorHover',         'errorHoverDm'),
    '--ds-danger-hover-text':    textOnColor,
    '--ds-info':                 infoHex,
    '--ds-info-hover':           m('infoHover',          'infoHoverDm'),
    '--ds-info-hover-text':      textOnColor,

    // ── Color: semantic tints (badges, alerts, callouts)
    '--ds-success-subtle':       subtle(successHex),
    '--ds-success-on-subtle':    onSubtle(successHex),
    '--ds-warning-subtle':       subtle(warnHex),
    '--ds-warning-on-subtle':    onSubtle(warnHex),
    '--ds-danger-subtle':        subtle(dangerHex),
    '--ds-danger-on-subtle':     onSubtle(dangerHex),
    '--ds-info-subtle':          subtle(infoHex),
    '--ds-info-on-subtle':       onSubtle(infoHex),

    // ── Color: surfaces & neutrals
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

    // ── Typography: families
    '--ds-font-display':  tokens.fontDisplay,
    '--ds-font-body':     tokens.fontBody,
    '--ds-font-mono':     tokens.fontMono || "'Fira Code', 'Cascadia Code', monospace",

    // ── Typography: weights (static scale, not user-configurable)
    '--ds-weight-light':    '300',
    '--ds-weight-regular':  '400',
    '--ds-weight-medium':   '500',
    '--ds-weight-semibold': '600',
    '--ds-weight-bold':     '700',
    '--ds-weight-black':    '900',

    // ── Typography: line heights
    '--ds-leading-none':    '1',
    '--ds-leading-tight':   '1.2',
    '--ds-leading-snug':    '1.35',
    '--ds-leading-normal':  '1.5',
    '--ds-leading-relaxed': '1.65',
    '--ds-leading-loose':   '2',

    // ── Typography: letter spacing
    '--ds-tracking-tighter': '-0.04em',
    '--ds-tracking-tight':   '-0.02em',
    '--ds-tracking-normal':  '0em',
    '--ds-tracking-wide':    '0.03em',
    '--ds-tracking-wider':   '0.07em',
    '--ds-tracking-widest':  '0.12em',

    // ── Shape
    '--ds-radius-sm':    tokens.radiusSm,
    '--ds-radius-md':    tokens.radiusMd,
    '--ds-radius-lg':    tokens.radiusLg,
    '--ds-radius-pill':  tokens.radiusPill,
    '--ds-border-style': tokens.borderStyle,

    // Legacy single shadow var
    '--ds-shadow': shadowValues[tokens.shadow] || shadowValues.sm,

    // ── Z-index scale (static — not user-configurable)
    '--ds-z-base':     '0',
    '--ds-z-raised':   '10',
    '--ds-z-dropdown': '100',
    '--ds-z-sticky':   '200',
    '--ds-z-overlay':  '300',
    '--ds-z-modal':    '400',
    '--ds-z-popover':  '500',
    '--ds-z-toast':    '600',
    '--ds-z-tooltip':  '700',
  };

  // ── Type scale (fixed 4pt-grid preset)
  const typeScale = TYPE_SCALE_PRESETS[tokens.typeScalePreset] || TYPE_SCALE_PRESETS.default;
  Object.entries(typeScale).forEach(([name, size]) => {
    vars[`--ds-text-${name}`] = size + 'px';
  });

  // ── Spacing scale (density preset → 12 concrete pixel values)
  const spaceVals = SPACING_SCALES[tokens.spacingScale] || SPACING_SCALES.default;
  SPACE_STEP_KEYS.forEach((key, i) => {
    vars[`--ds-space-${key}`] = spaceVals[i] + 'px';
  });
  // Semantic aliases
  vars['--ds-space-xs']  = spaceVals[0]  + 'px'; // step 1
  vars['--ds-space-sm']  = spaceVals[1]  + 'px'; // step 2
  vars['--ds-space-md']  = spaceVals[3]  + 'px'; // step 4
  vars['--ds-space-lg']  = spaceVals[5]  + 'px'; // step 6
  vars['--ds-space-xl']  = spaceVals[7]  + 'px'; // step 10
  vars['--ds-space-2xl'] = spaceVals[9]  + 'px'; // step 16
  vars['--ds-space-3xl'] = spaceVals[11] + 'px'; // step 24

  // ── Motion (personality preset → durations + easing curves)
  const motion = MOTION_PRESETS[tokens.motionPersonality] || MOTION_PRESETS.fluid;
  vars['--ds-duration-instant']    = '50ms';
  vars['--ds-duration-fast']       = motion.fast        + 'ms';
  vars['--ds-duration-base']       = motion.base        + 'ms';
  vars['--ds-duration-slow']       = motion.slow        + 'ms';
  vars['--ds-duration-deliberate'] = motion.deliberate  + 'ms';
  vars['--ds-ease-standard']       = motion.ease;
  vars['--ds-ease-enter']          = motion.easeEnter;
  vars['--ds-ease-exit']           = motion.easeExit;
  vars['--ds-transition-base']     = `${motion.base}ms ${motion.ease}`;
  vars['--ds-transition-fast']     = `${motion.fast}ms ${motion.easeEnter}`;
  vars['--ds-transition-slow']     = `${motion.slow}ms ${motion.ease}`;

  // ── Elevation (style preset → 6 shadow levels 0–5)
  const elevPreset = ELEVATION_PRESETS[tokens.elevationStyle] || ELEVATION_PRESETS.subtle;
  const elevShadows = isDark ? elevPreset.dark : elevPreset.light;
  ['0','1','2','3','4','5'].forEach((level, i) => {
    vars[`--ds-shadow-${level}`] = elevShadows[i];
  });

  // ── Core color scale generation
  tokens.coreColors.forEach(({ id, hex }) => {
    if (id && /^#[0-9a-fA-F]{6}$/.test(hex)) {
      const scale = generateColorScale(hex);
      if (scale) [10,20,30,40,50,60,70,80,90].forEach(s => { vars[`--ds-${id}-${s}`] = scale[s]; });
    }
  });

  // ── Custom colors
  tokens.customColors.forEach(({ name, hex }) => {
    if (name && /^#[0-9a-fA-F]{6}$/.test(hex)) vars[toVarName(name)] = hex;
  });

  return vars;
}

export function useTokens() {
  const [tokens, setTokens] = useState(defaultTokens);

  const cssVars = buildCssVars(tokens);

  // Apply CSS custom properties directly via setProperty — this is the only
  // reliable way to update CSS vars from JS (React's style prop uses property
  // assignment which browsers silently ignore for custom properties starting with --).
  useLayoutEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, val]) => {
      if (val != null) root.style.setProperty(key, String(val));
    });
  });

  const setBrand = useCallback((hex) => {
    setTokens(t => ({ ...t, ...deriveBrandTokens(hex) }));
  }, []);

  const setNeutral = useCallback((hex) => {
    setTokens(t => ({ ...t, neutral: hex }));
  }, []);

  const setFont = useCallback((type, value) => {
    if (type === 'display') setTokens(t => ({ ...t, fontDisplay: value }));
    else if (type === 'body') setTokens(t => ({ ...t, fontBody: value }));
    else if (type === 'mono') setTokens(t => ({ ...t, fontMono: value }));
  }, []);

  const setTypeScale = useCallback((preset) => {
    setTokens(t => ({ ...t, typeScalePreset: preset }));
  }, []);

  const setSpacingScale = useCallback((scale) => {
    setTokens(t => ({ ...t, spacingScale: scale }));
  }, []);

  const setMotionPersonality = useCallback((personality) => {
    setTokens(t => ({ ...t, motionPersonality: personality }));
  }, []);

  const setElevationStyle = useCallback((style) => {
    setTokens(t => ({ ...t, elevationStyle: style }));
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
    setBrand, setNeutral, setFont, setTypeScale,
    setSpacingScale, setMotionPersonality, setElevationStyle,
    setRadius, setBorderStyle, setShadow, setDarkMode,
    setSemanticColor, setCustomColors, setCoreColors, setAllTokens,
  };
}
