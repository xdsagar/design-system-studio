import { saveAs } from 'file-saver';
import { defaultTokens } from './tokens';

// All scalar keys that appear in the template (in display order)
export const SCALAR_KEYS = [
  // Brand
  'brand', 'brandDm', 'brandDark', 'brandLight', 'neutral',
  // Semantic — light mode
  'secondary', 'tertiary', 'ghost', 'success', 'caution', 'error', 'info',
  // Semantic — dark mode
  'secondaryDm', 'tertiaryDm', 'ghostDm', 'successDm', 'cautionDm', 'errorDm', 'infoDm',
  // Hover colors — light
  'brandHover', 'secondaryHover', 'tertiaryHover', 'ghostHover',
  'successHover', 'cautionHover', 'errorHover', 'infoHover',
  // Hover colors — dark
  'brandHoverDm', 'secondaryHoverDm', 'tertiaryHoverDm', 'ghostHoverDm',
  'successHoverDm', 'cautionHoverDm', 'errorHoverDm', 'infoHoverDm',
  // Typography
  'fontDisplay', 'fontBody',
  // Shape
  'radiusSm', 'radiusMd', 'radiusLg', 'radiusPill',
  // Border & shadow
  'borderStyle', 'shadow',
  // Mode
  'darkMode',
];

export const TOTAL_TOKEN_COUNT = SCALAR_KEYS.length + defaultTokens.coreColors.length;

export function downloadTemplate() {
  const template = {
    _meta: {
      generator: 'Design System Studio',
      version: '1.0',
      instructions: [
        'Fill in the values below, then import this file into Design System Studio.',
        'Hex colors must be 6-digit format: #RRGGBB',
        'borderStyle options: solid | dashed | dotted',
        'shadow options: none | sm | md',
        'darkMode: true | false',
      ],
    },
    ...Object.fromEntries(SCALAR_KEYS.map(k => [k, defaultTokens[k]])),
    coreColors: defaultTokens.coreColors,
    customColors: [],
  };

  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  saveAs(blob, 'design-system-template.json');
}

export function exportTokens(tokens) {
  const payload = {
    _meta: {
      generator: 'Design System Studio',
      version: '1.0',
      exportedAt: new Date().toISOString(),
    },
    ...Object.fromEntries(SCALAR_KEYS.map(k => [k, tokens[k] ?? defaultTokens[k]])),
    coreColors:   tokens.coreColors   ?? defaultTokens.coreColors,
    customColors: tokens.customColors ?? [],
    typeScalePreset:   tokens.typeScalePreset,
    spacingScale:      tokens.spacingScale,
    motionPersonality: tokens.motionPersonality,
    elevationStyle:    tokens.elevationStyle,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  saveAs(blob, 'my-design-system.json');
}

export async function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const found = [];
        const missing = [];
        const applied = {};

        SCALAR_KEYS.forEach(k => {
          if (data[k] !== undefined && data[k] !== null) {
            applied[k] = data[k];
            found.push(k);
          } else {
            missing.push(k);
          }
        });

        let coreColors = defaultTokens.coreColors;
        if (Array.isArray(data.coreColors) && data.coreColors.length > 0) {
          coreColors = data.coreColors;
          data.coreColors.forEach(c => found.push(`core:${c.id}`));
        } else {
          defaultTokens.coreColors.forEach(c => missing.push(`core:${c.id}`));
        }

        const customColors = Array.isArray(data.customColors) ? data.customColors : [];

        resolve({
          tokens: { ...applied, coreColors, customColors },
          found: found.length,
          total: TOTAL_TOKEN_COUNT,
          missing,
        });
      } catch {
        reject(new Error('Invalid JSON. Please use the downloaded template file.'));
      }
    };

    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsText(file);
  });
}
