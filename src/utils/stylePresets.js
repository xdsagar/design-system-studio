// Style presets — aesthetic starting points for the design system builder.
// Each preset overrides only what differs from defaultTokens.
// Applied via: setAllTokens({ ...defaultTokens, ...preset.tokens })

const CORE_COLORS_TEMPLATE = (overrides) => [
  { id: 'neutral',           label: 'Neutral',           hex: overrides.neutral           ?? '#808080' },
  { id: 'bg-light',          label: 'Background Light',  hex: overrides.bgLight           ?? '#F5F5F5' },
  { id: 'bg-dark',           label: 'Background Dark',   hex: overrides.bgDark            ?? '#1E1E1E' },
  { id: 'surface',           label: 'Surface',           hex: overrides.surface           ?? '#FFFFFF' },
  { id: 'text-primary',      label: 'Text Primary',      hex: overrides.textPrimary       ?? '#1E1E1E' },
  { id: 'text-primary-dark', label: 'Text Primary Dark', hex: overrides.textPrimaryDark   ?? '#F5F5F5' },
  { id: 'text-secondary',    label: 'Text Secondary',    hex: overrides.textSecondary      ?? '#6F6F6F' },
  { id: 'border',            label: 'Border',            hex: overrides.border            ?? '#E6E6E6' },
  { id: 'base-black',        label: 'Base Black',        hex: '#000000' },
  { id: 'base-white',        label: 'Base White',        hex: '#FFFFFF' },
  { id: 'disabled',          label: 'Disabled',          hex: overrides.disabled          ?? '#B3B3B3' },
  { id: 'overlay',           label: 'Overlay',           hex: overrides.overlay           ?? '#1E1E1E' },
];

// ── Studio (default — clean modern SaaS) ────────────────────────────────────
const studio = {
  id:      'studio',
  name:    'Studio',
  tagline: 'Clean, modern, versatile',
  tags:    ['Light', 'Rounded', 'Professional'],
  bgColor:  '#0D99FF',
  bgColor2: '#9575FF',
  swatches: ['#0D99FF', '#9575FF', '#1BC47D', '#F5F5F5', '#1E1E1E'],
  tokens: {
    elevationStyle: 'flat',
  },
};

// ── Warmth (inviting, residential, consumer) ─────────────────────────────────
const warmth = {
  id:      'warmth',
  name:    'Warmth',
  tagline: 'Inviting, human, residential',
  tags:    ['Light', 'Rounded', 'Friendly'],
  bgColor:  '#E5614C',
  bgColor2: '#F5905E',
  swatches: ['#E5614C', '#F5905E', '#8B7355', '#FFF8F5', '#2A1810'],
  tokens: {
    brand:               '#E5614C',
    brandDark:           '#C9503B',
    brandLight:          '#FEF0ED',
    brandDm:             '#E8725F',
    brandHover:          '#C9503B',
    brandHoverDm:        '#C9503B',

    secondary:           '#F5905E',
    secondaryDm:         '#D97848',
    secondaryHover:      '#DB7A4E',
    secondaryHoverDm:    '#BA6338',

    tertiary:            '#8B7355',
    tertiaryDm:          '#6D5940',
    tertiaryHover:       '#775F44',
    tertiaryHoverDm:     '#5A4832',

    ghost:               '#C4A99E',
    ghostDm:             '#9A8078',
    ghostHover:          '#B09088',
    ghostHoverDm:        '#7A6055',

    success:             '#3DA05A',
    successDm:           '#2E7D43',
    successHover:        '#318A4A',
    successHoverDm:      '#246035',

    caution:             '#E8A230',
    cautionDm:           '#B87D18',
    cautionHover:        '#CA8A18',
    cautionHoverDm:      '#8F6012',

    error:               '#D63B28',
    errorDm:             '#C43828',
    errorHover:          '#CC3B2B',
    errorHoverDm:        '#A82B1E',

    info:                '#4A90D9',
    infoDm:              '#3070B3',
    infoHover:           '#3A7AC3',
    infoHoverDm:         '#24588F',

    fontDisplay:     "'DM Sans', sans-serif",
    fontBody:        "'DM Sans', sans-serif",

    radiusSm:    '8px',
    radiusMd:    '14px',
    radiusLg:    '22px',
    radiusPill:  '999px',
    borderStyle: 'solid',
    shadow:      'sm',

    darkMode:          false,
    motionPersonality: 'playful',
    elevationStyle:    'flat',
    spacingScale:      'comfortable',
    typeScalePreset:   'default',

    coreColors: CORE_COLORS_TEMPLATE({
      neutral:         '#B09080',
      bgLight:         '#FFF8F5',
      bgDark:          '#1A0F0C',
      surface:         '#FFFFFF',
      textPrimary:     '#2A1810',
      textPrimaryDark: '#F5EBE7',
      textSecondary:   '#8B5E52',
      border:          '#F0D0C4',
      disabled:        '#D4B0A6',
      overlay:         '#2A1810',
    }),
  },
};

// ── Clarity (precise, minimal, system-level) ─────────────────────────────────
const clarity = {
  id:      'clarity',
  name:    'Clarity',
  tagline: 'Precise, minimal, trusted',
  tags:    ['Light', 'Sharp', 'System'],
  bgColor:  '#2563EB',
  bgColor2: '#7C3AED',
  swatches: ['#2563EB', '#7C3AED', '#059669', '#F5F5F7', '#1D1D1F'],
  tokens: {
    brand:               '#2563EB',
    brandDark:           '#1D4ED8',
    brandLight:          '#EFF6FF',
    brandDm:             '#3B82F6',
    brandHover:          '#1D4ED8',
    brandHoverDm:        '#2563EB',

    secondary:           '#7C3AED',
    secondaryDm:         '#6D28D9',
    secondaryHover:      '#6D28D9',
    secondaryHoverDm:    '#5B21B6',

    tertiary:            '#059669',
    tertiaryDm:          '#047857',
    tertiaryHover:       '#047857',
    tertiaryHoverDm:     '#065F46',

    ghost:               '#6B7280',
    ghostDm:             '#9CA3AF',
    ghostHover:          '#4B5563',
    ghostHoverDm:        '#6B7280',

    success:             '#16A34A',
    successDm:           '#22C55E',
    successHover:        '#15803D',
    successHoverDm:      '#16A34A',

    caution:             '#D97706',
    cautionDm:           '#F59E0B',
    cautionHover:        '#B45309',
    cautionHoverDm:      '#D97706',

    error:               '#DC2626',
    errorDm:             '#E03030',
    errorHover:          '#B91C1C',
    errorHoverDm:        '#DC2626',

    info:                '#2563EB',
    infoDm:              '#3B82F6',
    infoHover:           '#1D4ED8',
    infoHoverDm:         '#2563EB',

    fontDisplay:     "'Inter', sans-serif",
    fontBody:        "'Inter', sans-serif",

    radiusSm:    '4px',
    radiusMd:    '8px',
    radiusLg:    '14px',
    radiusPill:  '999px',
    borderStyle: 'solid',
    shadow:      'none',

    darkMode:          false,
    motionPersonality: 'snappy',
    elevationStyle:    'flat',
    spacingScale:      'default',
    typeScalePreset:   'default',

    coreColors: CORE_COLORS_TEMPLATE({
      neutral:         '#C7C7CC',
      bgLight:         '#F5F5F7',
      bgDark:          '#1C1C1E',
      surface:         '#FFFFFF',
      textPrimary:     '#1D1D1F',
      textPrimaryDark: '#F5F5F7',
      textSecondary:   '#6E6E73',
      border:          '#D2D2D7',
      disabled:        '#AEAEB2',
      overlay:         '#1D1D1F',
    }),
  },
};

// ── Amplified (dark-first, energetic, music/media) ────────────────────────────
const amplified = {
  id:      'amplified',
  name:    'Amplified',
  tagline: 'Bold, dark, high-energy',
  tags:    ['Dark', 'Pill buttons', 'Bold type'],
  bgColor:  '#121212',
  bgColor2: '#1A1A1A',
  swatches: ['#0EA86A', '#A855F7', '#F97316', '#121212', '#FFFFFF'],
  tokens: {
    brand:               '#0EA86A',
    brandDark:           '#0A7A4E',
    brandLight:          '#E6F7F1',
    brandDm:             '#17C577',
    brandHover:          '#0A7A4E',
    brandHoverDm:        '#0EA86A',

    secondary:           '#A855F7',
    secondaryDm:         '#9333EA',
    secondaryHover:      '#9333EA',
    secondaryHoverDm:    '#7E22CE',

    tertiary:            '#F97316',
    tertiaryDm:          '#EA6B0A',
    tertiaryHover:       '#EA6B0A',
    tertiaryHoverDm:     '#C4580A',

    ghost:               '#6B7280',
    ghostDm:             '#9CA3AF',
    ghostHover:          '#4B5563',
    ghostHoverDm:        '#6B7280',

    success:             '#0EA86A',
    successDm:           '#17C577',
    successHover:        '#0A7A4E',
    successHoverDm:      '#0EA86A',

    caution:             '#FBBF24',
    cautionDm:           '#F59E0B',
    cautionHover:        '#F59E0B',
    cautionHoverDm:      '#D97706',

    error:               '#E03030',
    errorDm:             '#F87171',
    errorHover:          '#DC2626',
    errorHoverDm:        '#F06060',

    info:                '#38BDF8',
    infoDm:              '#7DD3FC',
    infoHover:           '#0EA5E9',
    infoHoverDm:         '#38BDF8',

    fontDisplay:     "'Montserrat', sans-serif",
    fontBody:        "'DM Sans', sans-serif",

    radiusSm:    '4px',
    radiusMd:    '8px',
    radiusLg:    '16px',
    radiusPill:  '999px',
    borderStyle: 'solid',
    shadow:      'md',

    darkMode:          true,
    motionPersonality: 'fluid',
    elevationStyle:    'flat',
    spacingScale:      'default',
    typeScalePreset:   'comfortable',

    coreColors: CORE_COLORS_TEMPLATE({
      neutral:         '#B3B3B3',
      bgLight:         '#F0F0F0',
      bgDark:          '#121212',
      surface:         '#FFFFFF',
      textPrimary:     '#121212',
      textPrimaryDark: '#FFFFFF',
      textSecondary:   '#6B6B6B',
      border:          '#E0E0E0',
      disabled:        '#B3B3B3',
      overlay:         '#000000',
    }),
  },
};

// ── Precision (industrial, sharp, tech-forward) ───────────────────────────────
const precision = {
  id:      'precision',
  name:    'Precision',
  tagline: 'Sharp, industrial, uncompromising',
  tags:    ['Light', 'Square', 'Minimal'],
  bgColor:  '#CC1616',
  bgColor2: '#A50E0E',
  swatches: ['#CC1616', '#404040', '#737373', '#F4F4F4', '#171717'],
  tokens: {
    brand:               '#CC1616',
    brandDark:           '#A50E0E',
    brandLight:          '#FCE8E8',
    brandDm:             '#E03030',
    brandHover:          '#A50E0E',
    brandHoverDm:        '#CC1616',

    secondary:           '#404040',
    secondaryDm:         '#606060',
    secondaryHover:      '#2A2A2A',
    secondaryHoverDm:    '#4A4A4A',

    tertiary:            '#737373',
    tertiaryDm:          '#8F8F8F',
    tertiaryHover:       '#5C5C5C',
    tertiaryHoverDm:     '#737373',

    ghost:               '#737373',
    ghostDm:             '#9A9A9A',
    ghostHover:          '#5C5C5C',
    ghostHoverDm:        '#787878',

    success:             '#16A34A',
    successDm:           '#22C55E',
    successHover:        '#15803D',
    successHoverDm:      '#16A34A',

    caution:             '#D97706',
    cautionDm:           '#F59E0B',
    cautionHover:        '#B45309',
    cautionHoverDm:      '#D97706',

    error:               '#CC1616',
    errorDm:             '#E03030',
    errorHover:          '#A50E0E',
    errorHoverDm:        '#CC1616',

    info:                '#404040',
    infoDm:              '#606060',
    infoHover:           '#2A2A2A',
    infoHoverDm:         '#4A4A4A',

    fontDisplay:     "'Roboto', sans-serif",
    fontBody:        "'Roboto', sans-serif",

    radiusSm:    '2px',
    radiusMd:    '4px',
    radiusLg:    '6px',
    radiusPill:  '6px',
    borderStyle: 'solid',
    shadow:      'none',

    darkMode:          false,
    motionPersonality: 'snappy',
    elevationStyle:    'flat',
    spacingScale:      'compact',
    typeScalePreset:   'compact',

    coreColors: CORE_COLORS_TEMPLATE({
      neutral:         '#BFBFBF',
      bgLight:         '#F4F4F4',
      bgDark:          '#0D0D0D',
      surface:         '#FFFFFF',
      textPrimary:     '#171717',
      textPrimaryDark: '#F4F4F4',
      textSecondary:   '#737373',
      border:          '#DCDCDC',
      disabled:        '#C4C4C4',
      overlay:         '#171717',
    }),
  },
};

// ── Cinema (dark, dramatic, editorial) ───────────────────────────────────────
const cinema = {
  id:      'cinema',
  name:    'Cinema',
  tagline: 'Cinematic, editorial, dramatic',
  tags:    ['Dark', 'Bold type', 'Square'],
  bgColor:  '#141414',
  bgColor2: '#1F1F1F',
  swatches: ['#DC2626', '#737373', '#F5F5F5', '#141414', '#E5E5E5'],
  tokens: {
    brand:               '#DC2626',
    brandDark:           '#B91C1C',
    brandLight:          '#FEF2F2',
    brandDm:             '#E03030',
    brandHover:          '#B91C1C',
    brandHoverDm:        '#DC2626',

    secondary:           '#404040',
    secondaryDm:         '#D4D4D4',
    secondaryHover:      '#2A2A2A',
    secondaryHoverDm:    '#E5E5E5',

    tertiary:            '#737373',
    tertiaryDm:          '#9CA3AF',
    tertiaryHover:       '#5C5C5C',
    tertiaryHoverDm:     '#737373',

    ghost:               '#737373',
    ghostDm:             '#9CA3AF',
    ghostHover:          '#5C5C5C',
    ghostHoverDm:        '#787878',

    success:             '#16A34A',
    successDm:           '#22C55E',
    successHover:        '#15803D',
    successHoverDm:      '#16A34A',

    caution:             '#D97706',
    cautionDm:           '#FBBF24',
    cautionHover:        '#B45309',
    cautionHoverDm:      '#D97706',

    error:               '#DC2626',
    errorDm:             '#E03030',
    errorHover:          '#B91C1C',
    errorHoverDm:        '#DC2626',

    info:                '#737373',
    infoDm:              '#9CA3AF',
    infoHover:           '#5C5C5C',
    infoHoverDm:         '#737373',

    fontDisplay:     "'Oswald', sans-serif",
    fontBody:        "'Roboto', sans-serif",

    radiusSm:    '2px',
    radiusMd:    '4px',
    radiusLg:    '8px',
    radiusPill:  '4px',
    borderStyle: 'solid',
    shadow:      'md',

    darkMode:          true,
    motionPersonality: 'cinematic',
    elevationStyle:    'flat',
    spacingScale:      'default',
    typeScalePreset:   'editorial',

    coreColors: CORE_COLORS_TEMPLATE({
      neutral:         '#C8C8C8',
      bgLight:         '#F0F0F0',
      bgDark:          '#141414',
      surface:         '#FFFFFF',
      textPrimary:     '#141414',
      textPrimaryDark: '#E5E5E5',
      textSecondary:   '#6D6D6D',
      border:          '#E0E0E0',
      disabled:        '#B3B3B3',
      overlay:         '#000000',
    }),
  },
};

export const STYLE_PRESETS = [studio, warmth, clarity, amplified, precision, cinema];
