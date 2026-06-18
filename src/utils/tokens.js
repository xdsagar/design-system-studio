// ─────────────────────────────────────────────────────────────────────────────
// Design token primitives
// Tier 1: raw values with no semantic meaning (spacing steps, scale ratios, etc.)
// Tier 2: semantic aliases that map to primitives (xs, sm, md, lg…)
// ─────────────────────────────────────────────────────────────────────────────

export const defaultTokens = {
  // ── Primary — chosen so dark text (#1E1E1E) on bg passes WCAG AA in light mode
  brand:              '#0D99FF',  // 5.74:1 with #1E1E1E ✓
  brandDark:          '#0B7FD4',
  brandLight:         '#E5F4FF',
  brandDm:            '#005FA3',  // 6.01:1 with #F5F5F5 ✓
  neutral:            '#1E293B',

  // ── Semantic – light mode (all ≥ 4.5:1 with text-primary #1E1E1E)
  secondary:          '#9575FF',  // 5.02:1 ✓  (was #7B61FF = 4.0 — failed)
  tertiary:           '#1BC47D',  // 7.41:1 ✓
  ghost:              '#666666',
  success:            '#14AE5C',  // 5.82:1 ✓
  caution:            '#FFA629',  // 8.59:1 ✓
  error:              '#F24822',  // 4.66:1 ✓
  info:               '#0D99FF',  // 5.74:1 ✓

  // ── Semantic – dark mode (all ≥ 4.5:1 with text-primary-dark #F5F5F5)
  secondaryDm:        '#5527B8',  // 8.03:1 ✓  (was #9B80FF — failed)
  tertiaryDm:         '#0D7A47',  // 4.90:1 ✓  (was #34D47E — failed)
  ghostDm:            '#9A9A9A',
  successDm:          '#0D7A47',  // 4.90:1 ✓  (was #1BC47D — failed)
  cautionDm:          '#854600',  // 6.64:1 ✓  (was #FFB74D — failed)
  errorDm:            '#AE2020',  // 6.33:1 ✓  (was #FF6B4A — failed)
  infoDm:             '#005FA3',  // 6.01:1 ✓  (was #3BAFF5 — failed)

  // ── Hover – light mode (scale[70]: dark hover recommended in light mode)
  brandHover:         '#0a77c7',
  secondaryHover:     '#745bc7',
  tertiaryHover:      '#159962',
  ghostHover:         '#505050',
  successHover:       '#108848',
  cautionHover:       '#c78120',
  errorHover:         '#bd381b',
  infoHover:          '#0a77c7',

  // ── Hover – dark mode (scale[70]: dark hover recommended — deep colors stay deep on hover)
  brandHoverDm:       '#004a7f',
  secondaryHoverDm:   '#421e90',
  tertiaryHoverDm:    '#0a5f37',
  ghostHoverDm:       '#787878',
  successHoverDm:     '#0a5f37',
  cautionHoverDm:     '#683700',
  errorHoverDm:       '#881919',
  infoHoverDm:        '#004a7f',

  // ── Hover text (overridden in buildCssVars from core text token — kept for export compat)
  brandHoverText:     '#1E1E1E',
  secondaryHoverText: '#1E1E1E',
  tertiaryHoverText:  '#1E1E1E',
  successHoverText:   '#1E1E1E',
  cautionHoverText:   '#1E1E1E',
  errorHoverText:     '#1E1E1E',
  infoHoverText:      '#1E1E1E',

  // ── Hover text – dark mode
  brandHoverTextDm:     '#F5F5F5',
  secondaryHoverTextDm: '#F5F5F5',
  tertiaryHoverTextDm:  '#F5F5F5',
  successHoverTextDm:   '#F5F5F5',
  cautionHoverTextDm:   '#F5F5F5',
  errorHoverTextDm:     '#F5F5F5',
  infoHoverTextDm:      '#F5F5F5',

  coreColors: [
    { id: 'neutral',           label: 'Neutral',           hex: '#808080' },
    { id: 'bg-light',          label: 'Background Light',  hex: '#F5F5F5' },
    { id: 'bg-dark',           label: 'Background Dark',   hex: '#1E1E1E' },
    { id: 'surface',           label: 'Surface',           hex: '#FFFFFF' },
    { id: 'text-primary',      label: 'Text Primary',      hex: '#1E1E1E' },
    { id: 'text-primary-dark', label: 'Text Primary Dark', hex: '#F5F5F5' },
    { id: 'text-secondary',    label: 'Text Secondary',    hex: '#6F6F6F' },
    { id: 'border',            label: 'Border',            hex: '#E6E6E6' },
    { id: 'base-black',        label: 'Base Black',        hex: '#000000' },
    { id: 'base-white',        label: 'Base White',        hex: '#FFFFFF' },
    { id: 'disabled',          label: 'Disabled',          hex: '#B3B3B3' },
    { id: 'overlay',           label: 'Overlay',           hex: '#1E1E1E' },
  ],
  customColors: [],

  // ── Typography
  fontDisplay:      "'Plus Jakarta Sans', sans-serif",
  fontBody:         "'Inter', sans-serif",
  fontMono:         "'JetBrains Mono', monospace",

  // ── Type scale (4pt-grid preset)
  typeScalePreset:  'default',

  // ── Shape
  radiusSm:    '6px',
  radiusMd:    '10px',
  radiusLg:    '16px',
  radiusPill:  '999px',
  borderStyle: 'solid',

  // ── Spacing
  spacingScale: 'default',   // 'compact' | 'default' | 'comfortable' | 'spacious'

  // ── Motion
  motionPersonality: 'fluid', // 'instant' | 'snappy' | 'fluid' | 'playful' | 'cinematic'

  // ── Elevation
  elevationStyle: 'subtle',  // 'flat' | 'subtle' | 'layered' | 'deep'

  // Legacy single-shadow key kept for backward compat with Shape step
  shadow: 'sm',

  darkMode: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// SPACING — four density presets, each with 12 concrete pixel values
// Index maps to step name: 1,2,3,4,5,6,8,10,12,16,20,24
// ─────────────────────────────────────────────────────────────────────────────
export const SPACING_SCALES = {
  compact:     [2,  4,  6,  8,  12, 16, 24, 32, 40, 48, 64,  80 ],
  default:     [4,  8,  12, 16, 20, 24, 32, 40, 48, 64, 80,  96 ],
  comfortable: [4,  8,  16, 20, 24, 32, 40, 48, 64, 80, 96,  128],
  spacious:    [8,  12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160],
};

export const SPACE_STEP_KEYS = ['1','2','3','4','5','6','8','10','12','16','20','24'];

export const spacingScaleOptions = [
  { id: 'compact',     label: 'Compact',     desc: 'Dense — information-rich tools',  ref: 'Linear, Figma' },
  { id: 'default',     label: 'Default',     desc: 'Balanced — most SaaS products',   ref: 'Stripe, GitHub' },
  { id: 'comfortable', label: 'Comfortable', desc: 'Generous — modern B2B SaaS',      ref: 'Notion, Vercel' },
  { id: 'spacious',    label: 'Spacious',    desc: 'Editorial — premium breathing room', ref: 'Apple, Miro' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPE SCALE — fixed 4pt-grid presets
// Steps: 2xs / xs / sm / base / md / lg / xl / 2xl / 3xl / 4xl / 5xl
// ─────────────────────────────────────────────────────────────────────────────
export const TYPE_SCALE_PRESETS = {
  compact:     { '2xs': 10, 'xs': 11, 'sm': 12, 'base': 14, 'md': 16, 'lg': 20, 'xl': 24, '2xl': 28, '3xl': 32, '4xl': 40, '5xl': 48 },
  default:     { '2xs': 10, 'xs': 12, 'sm': 14, 'base': 16, 'md': 20, 'lg': 24, 'xl': 28, '2xl': 32, '3xl': 40, '4xl': 48, '5xl': 56 },
  comfortable: { '2xs': 12, 'xs': 14, 'sm': 16, 'base': 18, 'md': 20, 'lg': 24, 'xl': 32, '2xl': 40, '3xl': 48, '4xl': 56, '5xl': 64 },
  editorial:   { '2xs': 12, 'xs': 14, 'sm': 16, 'base': 20, 'md': 24, 'lg': 32, 'xl': 40, '2xl': 48, '3xl': 56, '4xl': 64, '5xl': 72 },
};

export const typeScalePresetOptions = [
  { id: 'compact',     label: 'Compact',     desc: 'Dense labels and data-heavy UIs',     ref: 'Figma, Linear'    },
  { id: 'default',     label: 'Default',     desc: 'Balanced hierarchy for most products', ref: 'Stripe, GitHub'   },
  { id: 'comfortable', label: 'Comfortable', desc: 'Generous spacing, modern B2B SaaS',   ref: 'Notion, Vercel'   },
  { id: 'editorial',   label: 'Editorial',   desc: 'Large expressive display hierarchy',   ref: 'Apple, Awwwards'  },
];

export function computeTypeScale(baseSize, ratioOrPreset) {
  const preset = TYPE_SCALE_PRESETS[ratioOrPreset];
  if (preset) return preset;
  // Legacy fallback — keep backward compat if a ratio key was stored
  const scale = TYPE_SCALE_PRESETS.default;
  return scale;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTION — five personality presets
// Each defines durations (ms) and easing curves for enter/exit/standard motion
// ─────────────────────────────────────────────────────────────────────────────
export const MOTION_PRESETS = {
  instant: {
    fast: 50, base: 80, slow: 120, deliberate: 150,
    ease:      'cubic-bezier(0.4, 0, 0.2, 1)',
    easeEnter: 'cubic-bezier(0, 0, 0.2, 1)',
    easeExit:  'cubic-bezier(0.4, 0, 1, 1)',
    label: 'Instant', ref: 'Figma, Linear',
    desc: 'Near-zero latency. For tools where speed is the entire product.',
  },
  snappy: {
    fast: 80, base: 150, slow: 250, deliberate: 350,
    ease:      'cubic-bezier(0.4, 0, 0.2, 1)',
    easeEnter: 'cubic-bezier(0, 0, 0.2, 1)',
    easeExit:  'cubic-bezier(0.4, 0, 1, 1)',
    label: 'Snappy', ref: 'Notion, Vercel',
    desc: 'Fast and direct. Responsive and decisive without rushing.',
  },
  fluid: {
    fast: 120, base: 200, slow: 350, deliberate: 500,
    ease:      'cubic-bezier(0.4, 0, 0.2, 1)',
    easeEnter: 'cubic-bezier(0, 0, 0.2, 1)',
    easeExit:  'cubic-bezier(0.4, 0, 1, 1)',
    label: 'Fluid', ref: 'Stripe, GitHub',
    desc: 'Natural and balanced. The trusted choice for most professional products.',
  },
  playful: {
    fast: 150, base: 280, slow: 500, deliberate: 700,
    ease:      'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeEnter: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeExit:  'cubic-bezier(0.4, 0, 1, 1)',
    label: 'Playful', ref: 'Loom, Framer',
    desc: 'Spring physics and overshoot. Friendly, expressive, and alive.',
  },
  cinematic: {
    fast: 200, base: 450, slow: 750, deliberate: 1100,
    ease:      'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeEnter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeExit:  'cubic-bezier(0.4, 0, 1, 1)',
    label: 'Cinematic', ref: 'Apple, Miro',
    desc: 'Deliberate and editorial. Every transition earns its time.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ELEVATION — four shadow style presets, each with 6 levels (0 = none → 5 = max)
// Dark-mode shadows are intentionally lighter (elevation expressed via surface
// lightness in dark UIs, not just shadow depth)
// ─────────────────────────────────────────────────────────────────────────────
export const ELEVATION_PRESETS = {
  flat: {
    label: 'Flat', desc: 'No depth — all surfaces at the same layer',
    light: [
      'none',
      '0 1px 2px rgba(0,0,0,.05)',
      '0 2px 4px rgba(0,0,0,.06)',
      '0 4px 8px rgba(0,0,0,.07)',
      '0 8px 16px rgba(0,0,0,.08)',
      '0 16px 32px rgba(0,0,0,.09)',
    ],
    dark: [
      'none',
      '0 1px 2px rgba(0,0,0,.20)',
      '0 2px 4px rgba(0,0,0,.25)',
      '0 4px 8px rgba(0,0,0,.30)',
      '0 8px 16px rgba(0,0,0,.35)',
      '0 16px 32px rgba(0,0,0,.40)',
    ],
  },
  subtle: {
    label: 'Subtle', desc: 'Gentle depth — professional and restrained',
    light: [
      'none',
      '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)',
      '0 4px 8px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06)',
      '0 8px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.08)',
      '0 16px 40px rgba(0,0,0,.14), 0 8px 16px rgba(0,0,0,.10)',
      '0 24px 64px rgba(0,0,0,.16), 0 12px 24px rgba(0,0,0,.12)',
    ],
    dark: [
      'none',
      '0 1px 3px rgba(0,0,0,.30)',
      '0 4px 8px rgba(0,0,0,.36)',
      '0 8px 20px rgba(0,0,0,.42)',
      '0 16px 40px rgba(0,0,0,.48)',
      '0 24px 64px rgba(0,0,0,.54)',
    ],
  },
  layered: {
    label: 'Layered', desc: 'Clear depth hierarchy — most SaaS products',
    light: [
      'none',
      '0 2px 4px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.08)',
      '0 4px 12px rgba(0,0,0,.14), 0 2px 6px rgba(0,0,0,.10)',
      '0 8px 24px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.12)',
      '0 16px 48px rgba(0,0,0,.22), 0 8px 20px rgba(0,0,0,.16)',
      '0 32px 80px rgba(0,0,0,.28), 0 16px 32px rgba(0,0,0,.18)',
    ],
    dark: [
      'none',
      '0 2px 4px rgba(0,0,0,.40)',
      '0 4px 12px rgba(0,0,0,.48)',
      '0 8px 24px rgba(0,0,0,.56)',
      '0 16px 48px rgba(0,0,0,.64)',
      '0 32px 80px rgba(0,0,0,.72)',
    ],
  },
  deep: {
    label: 'Deep', desc: 'Dramatic depth — premium and dimensional',
    light: [
      'none',
      '0 2px 6px rgba(0,0,0,.14), 0 1px 3px rgba(0,0,0,.10)',
      '0 6px 16px rgba(0,0,0,.20), 0 3px 8px rgba(0,0,0,.14)',
      '0 12px 32px rgba(0,0,0,.28), 0 6px 16px rgba(0,0,0,.18)',
      '0 24px 64px rgba(0,0,0,.36), 0 12px 28px rgba(0,0,0,.22)',
      '0 40px 100px rgba(0,0,0,.44), 0 20px 40px rgba(0,0,0,.28)',
    ],
    dark: [
      'none',
      '0 2px 6px rgba(0,0,0,.50)',
      '0 6px 16px rgba(0,0,0,.58)',
      '0 12px 32px rgba(0,0,0,.66)',
      '0 24px 64px rgba(0,0,0,.74)',
      '0 40px 100px rgba(0,0,0,.82)',
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Radius presets
// ─────────────────────────────────────────────────────────────────────────────
export const radiusPresets = [
  { label: 'Sharp',   sm: '0px',  md: '0px',   lg: '0px',   pill: '4px'   },
  { label: 'Subtle',  sm: '3px',  md: '5px',   lg: '8px',   pill: '999px' },
  { label: 'Rounded', sm: '6px',  md: '10px',  lg: '16px',  pill: '999px' },
  { label: 'Soft',    sm: '8px',  md: '14px',  lg: '22px',  pill: '999px' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Font options
// ─────────────────────────────────────────────────────────────────────────────
export const brandSwatches = [
  '#6366F1', '#3B82F6', '#0EA5E9', '#14B8A6',
  '#10B981', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#F97316',
];

export const neutralSwatches = [
  { hex: '#2a2924', label: 'Warm black' },
  { hex: '#1a2332', label: 'Navy'       },
  { hex: '#1e1b2e', label: 'Deep ink'   },
  { hex: '#1a2420', label: 'Forest'     },
  { hex: '#2a1f1f', label: 'Mahogany'  },
];

// ── Sans-serif options (display + body use the same pool; body omits purely decorative picks)
const SANS = [
  { label: 'Inter',             value: "'Inter', sans-serif"             },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'DM Sans',           value: "'DM Sans', sans-serif"           },
  { label: 'Space Grotesk',     value: "'Space Grotesk', sans-serif"     },
  { label: 'Outfit',            value: "'Outfit', sans-serif"            },
  { label: 'Poppins',           value: "'Poppins', sans-serif"           },
  { label: 'Work Sans',         value: "'Work Sans', sans-serif"         },
  { label: 'Figtree',           value: "'Figtree', sans-serif"           },
  { label: 'Manrope',           value: "'Manrope', sans-serif"           },
  { label: 'Sora',              value: "'Sora', sans-serif"              },
  { label: 'Nunito',            value: "'Nunito', sans-serif"            },
  { label: 'Lexend',            value: "'Lexend', sans-serif"            },
  { label: 'Be Vietnam Pro',    value: "'Be Vietnam Pro', sans-serif"    },
  { label: 'Open Sans',         value: "'Open Sans', sans-serif"         },
  { label: 'Source Sans 3',     value: "'Source Sans 3', sans-serif"     },
  { label: 'IBM Plex Sans',     value: "'IBM Plex Sans', sans-serif"     },
  { label: 'System UI',         value: 'system-ui, sans-serif'           },
];

const SERIFS = [
  { label: 'Playfair Display',  value: "'Playfair Display', serif"       },
  { label: 'DM Serif Display',  value: "'DM Serif Display', serif"       },
  { label: 'Fraunces',          value: "'Fraunces', serif"               },
  { label: 'Lora',              value: "'Lora', serif"                   },
  { label: 'Georgia',           value: 'Georgia, serif'                  },
];

export const fontDisplayOptions = [...SANS, ...SERIFS];

export const fontBodyOptions = SANS; // serifs excluded for body by convention

export const fontMonoOptions = [
  { label: 'JetBrains Mono',    value: "'JetBrains Mono', monospace"                      },
  { label: 'Fira Code',         value: "'Fira Code', monospace"                           },
  { label: 'IBM Plex Mono',     value: "'IBM Plex Mono', monospace"                       },
  { label: 'Source Code Pro',   value: "'Source Code Pro', monospace"                     },
  { label: 'Roboto Mono',       value: "'Roboto Mono', monospace"                         },
  { label: 'Space Mono',        value: "'Space Mono', monospace"                          },
  { label: 'System Mono',       value: "'Menlo', 'Monaco', 'Courier New', monospace"      },
];

// ─────────────────────────────────────────────────────────────────────────────
// Color math utilities
// ─────────────────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function mixColors(hex1, hex2, t) {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  const clamp = n => Math.max(0, Math.min(255, Math.round(n)));
  return '#' + [
    clamp(c1.r + (c2.r - c1.r) * t),
    clamp(c1.g + (c2.g - c1.g) * t),
    clamp(c1.b + (c2.b - c1.b) * t),
  ].map(n => n.toString(16).padStart(2, '0')).join('');
}

export function generateColorScale(hex) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    10: mixColors('#ffffff', hex, 0.06),
    20: mixColors('#ffffff', hex, 0.18),
    30: mixColors('#ffffff', hex, 0.34),
    40: mixColors('#ffffff', hex, 0.54),
    50: mixColors('#ffffff', hex, 0.76),
    60: hex,
    70: mixColors(hex, '#000000', 0.22),
    80: mixColors(hex, '#000000', 0.48),
    90: mixColors(hex, '#000000', 0.73),
  };
}

export function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, r + Math.round((255 - r) * amount))}, ${Math.min(255, g + Math.round((255 - g) * amount))}, ${Math.min(255, b + Math.round((255 - b) * amount))})`;
}

export function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0, r - Math.round(r * amount))}, ${Math.max(0, g - Math.round(g * amount))}, ${Math.max(0, b - Math.round(b * amount))})`;
}

export function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match) return '#000000';
  return '#' + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const c = n => { const s = n / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}

export function wcagContrast(hex1, hex2) {
  if (!hex1 || !hex2 || !hex1.startsWith('#') || !hex2.startsWith('#')) return 1;
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function computeHoverColor(hex, mode) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return hex || '#000000';
  const scale = generateColorScale(hex);
  if (!scale) return hex;
  if (mode === 'dark')  return scale[70];
  if (mode === 'light') return scale[20];
  return hex;
}

export function deriveBrandTokens(hex) {
  return {
    brand: hex,
    brandDark: rgbToHex(darken(hex, 0.25)),
    brandLight: rgbToHex(lighten(hex, 0.88)),
  };
}

// Legacy single-shadow map kept for backward compat
export const shadowValues = {
  none: 'none',
  sm:   '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)',
  md:   '0 4px 12px rgba(0,0,0,.1)',
};

export const darkOverrides = {
  surface:        '#1E1E1E',
  surface1:       '#2C2C2C',
  surface2:       '#383838',
  neutral100:     '#2C2C2C',
  neutral200:     '#3C3C3C',
  neutral800_inv: '#E0E0E0',
};
