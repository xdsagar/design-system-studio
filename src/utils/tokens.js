export const defaultTokens = {
  // ── Primary (Figma Blue)
  brand:              '#0D99FF',
  brandDark:          '#0B7FD4',
  brandLight:         '#E5F4FF',
  brandDm:            '#0D99FF',
  neutral:            '#1E293B',

  // ── Semantic – light mode
  secondary:          '#7B61FF',
  tertiary:           '#1BC47D',
  ghost:              '#666666',
  success:            '#14AE5C',
  caution:            '#FFA629',
  error:              '#F24822',
  info:               '#0D99FF',

  // ── Semantic – dark mode
  secondaryDm:        '#9B80FF',
  tertiaryDm:         '#34D47E',
  ghostDm:            '#9A9A9A',
  successDm:          '#1BC47D',
  cautionDm:          '#FFB74D',
  errorDm:            '#FF6B4A',
  infoDm:             '#3BAFF5',

  // ── Hover – light mode
  brandHover:         '#0B7FD4',
  secondaryHover:     '#604CC7',
  tertiaryHover:      '#0F9E63',
  ghostHover:         '#F5F5F5',
  successHover:       '#0D9150',
  cautionHover:       '#E8891A',
  errorHover:         '#C83A1C',
  infoHover:          '#0B7FD4',

  // ── Hover – dark mode
  brandHoverDm:       '#50B7FF',
  secondaryHoverDm:   '#8A70FF',
  tertiaryHoverDm:    '#1BC47D',
  ghostHoverDm:       '#333333',
  successHoverDm:     '#14AE5C',
  cautionHoverDm:     '#FFA629',
  errorHoverDm:       '#F24822',
  infoHoverDm:        '#0D99FF',

  // ── Hover text – light mode
  brandHoverText:     '#ffffff',
  secondaryHoverText: '#ffffff',
  tertiaryHoverText:  '#ffffff',
  successHoverText:   '#ffffff',
  cautionHoverText:   '#ffffff',
  errorHoverText:     '#ffffff',
  infoHoverText:      '#ffffff',

  // ── Hover text – dark mode
  brandHoverTextDm:     '#ffffff',
  secondaryHoverTextDm: '#ffffff',
  tertiaryHoverTextDm:  '#ffffff',
  successHoverTextDm:   '#ffffff',
  cautionHoverTextDm:   '#1A1A1A',
  errorHoverTextDm:     '#ffffff',
  infoHoverTextDm:      '#ffffff',
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
  customColors:   [],
  fontDisplay: 'Georgia, serif',
  fontBody: 'system-ui, sans-serif',
  radiusSm: '6px',
  radiusMd: '10px',
  radiusLg: '16px',
  radiusPill: '999px',
  borderStyle: 'solid',
  shadow: 'sm',
  darkMode: true,
};

export const radiusPresets = [
  { label: 'Sharp',   sm: '0px',   md: '0px',   lg: '0px',   pill: '4px'   },
  { label: 'Subtle',  sm: '3px',   md: '5px',   lg: '8px',   pill: '999px' },
  { label: 'Rounded', sm: '6px',   md: '10px',  lg: '16px',  pill: '999px' },
  { label: 'Soft',    sm: '8px',   md: '14px',  lg: '22px',  pill: '999px' },
  { label: 'Pill',    sm: '999px', md: '999px', lg: '999px', pill: '999px' },
];

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

export const fontDisplayOptions = [
  { label: 'Georgia (serif)',         value: 'Georgia, serif'                 },
  { label: 'Playfair Display',        value: "'Playfair Display', serif"      },
  { label: 'DM Serif Display',        value: "'DM Serif Display', serif"      },
  { label: 'System UI (sans)',        value: 'system-ui, sans-serif'          },
  { label: 'DM Sans',                 value: "'DM Sans', sans-serif"          },
  { label: 'Space Grotesk',           value: "'Space Grotesk', sans-serif"    },
  { label: 'Fraunces',                value: "'Fraunces', serif"              },
  { label: 'Monospace',               value: 'monospace'                      },
];

export const fontBodyOptions = [
  { label: 'System UI',               value: 'system-ui, sans-serif'          },
  { label: 'DM Sans',                 value: "'DM Sans', sans-serif"          },
  { label: 'Inter',                   value: "'Inter', sans-serif"            },
  { label: 'IBM Plex Sans',           value: "'IBM Plex Sans', sans-serif"    },
  { label: 'Georgia',                 value: 'Georgia, serif'                 },
  { label: 'IBM Plex Mono',           value: "'IBM Plex Mono', monospace"     },
];

// --- Color math ---
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
