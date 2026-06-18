export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not configured. Add it to your Vercel environment variables.',
    });
  }

  const { images } = req.body ?? {};
  if (!images?.length) return res.status(400).json({ error: 'No images provided' });
  if (images.length > 5) return res.status(400).json({ error: 'Maximum 5 images allowed' });

  const PROMPT = `You are a senior UI/brand designer generating a complete design token set from brand images.

━━━ CRITICAL RULE — TEXT ON COLOR (WCAG AA) ━━━
Semantic colors (brand, secondary, tertiary, success, caution, error, info) are used as SOLID FILL
backgrounds for buttons. The text sitting on top of those fills comes from the text token — NOT white:
  • Light mode buttons: text-primary (#1E1E1E, near-black) sits on the semantic color background
  • Dark mode buttons:  text-primary-dark (#F5F5F5, near-white) sits on the semantic color background

WCAG AA requires a contrast ratio of at least 4.5:1 between the button background and the text token.

Light mode — your semantic colors must have contrast ≥ 4.5:1 against #1E1E1E:
  This means the color needs sufficient luminance (L ≥ 0.23). Avoid deep dark tones.
  Good light-mode range: medium-to-bright saturated hues that read as a clear CTA on a white page.

Dark mode — your semantic colors must have contrast ≥ 4.5:1 against #F5F5F5:
  This means the color needs LOW luminance (L ≤ 0.16). Avoid bright or pastel tones in dark mode.
  Good dark-mode range: deep, saturated hues — navy, forest green, deep amber, dark crimson.

  • NEVER use near-white (#CCCCCC–#FFFFFF) as a dark mode semantic color — text becomes invisible.
  • NEVER use near-black (#000000–#111111) as a dark mode semantic color — disappears on dark backgrounds.
  • NEVER use mid-luminance "pop" colors (#0D99FF-style bright blue, #9B80FF light purple) as dark mode
    semantic colors — they look vibrant but fail WCAG with the light text token.

━━━ HOVER DIRECTION RULE ━━━
  • Both modes: darken the semantic color ~20% for hover (mix ~22% toward black)
  • Light mode: darker hover = "pressed into" the surface — natural interactive feedback
  • Dark mode: our accessible darks have low luminance; lightening them on hover goes near-white
    and destroys contrast with the light text token. Keep hover dark — deeper, not lighter.

━━━ HOW TO PICK ACTION COLORS ━━━

1. First look for an ACCENT in the images — something used on buttons, icons, gradients, or logo ring marks
   that is NOT the plain background or plain body text. Even a subtle warm or cool hue qualifies.

2. If the brand uses a real accent (e.g. orange, gold, electric blue, red):
   - light mode: use it directly, ensuring it passes 4.5:1 with #1E1E1E
   - dark mode: use a deeper/darker variant of the same hue that passes 4.5:1 with #F5F5F5

3. If the brand is FULLY MONOCHROMATIC (only black, white, grey):
   LOOK HARDER first: logo gradient rings, photographic warm skin tones, cool steel tones, highlight
   colors in lifestyle imagery. A warm sand or cool slate found in photos is a valid accent.

   If truly nothing exists beyond black/white/grey:
   - brand (light mode): medium charcoal #444444 — passes with dark text, readable on white page
   - brandDm (dark mode): deep neutral like #2A3A4A (slate) or #3A2A1A (warm dark) — passes with light text

4. secondary / secondaryDm = the next most important interactive color, same luminance rules apply.

5. tertiary / tertiaryDm = a supporting accent, same luminance rules apply.

━━━ SURFACE & BACKGROUND (coreColors) ━━━
Return a coreColors array that sets the actual page/surface colors.
For dark brands: bg-dark ≈ #0A0A0A–#141414, bg-light ≈ #F5F5F5–#FFFFFF
For light brands: bg-dark ≈ #18181B, bg-light ≈ #FAFAFA
text-primary (light mode body text): #1E1E1E or similar near-black
text-primary-dark (dark mode body text): #F5F5F5 or similar near-white

━━━ SEMANTIC COLORS ━━━
success / successDm, caution / cautionDm, error / errorDm, info / infoDm
— same luminance rules apply (≥ 4.5:1 with respective text token for each mode).
— harmonise hue warmth/coolness with the brand palette, but prioritise contrast compliance.

━━━ RADIUS & SHADOW ━━━
Radius: angular/athletic/luxury = 0px; subtle = 2–4px; modern/professional = 6–10px; friendly/consumer = 12–20px
Shadow: flat minimal = "none"; standard product = "sm"; dramatic layered = "md"

━━━ TYPOGRAPHY ━━━
fontDisplay: read any visible headlines/wordmarks and match the style.
Options: "Georgia, serif" | "'Playfair Display', serif" | "'DM Serif Display', serif" | "system-ui, sans-serif" | "'DM Sans', sans-serif" | "'Space Grotesk', sans-serif" | "'Fraunces', serif"
fontBody options: "system-ui, sans-serif" | "'DM Sans', sans-serif" | "'Inter', sans-serif" | "'IBM Plex Sans', sans-serif"

━━━ OUTPUT FORMAT ━━━
Return ONLY valid JSON — no markdown fences, no text outside the JSON object.

{
  "brand":        "#RRGGBB",
  "brandDm":      "#RRGGBB",
  "secondary":    "#RRGGBB",
  "secondaryDm":  "#RRGGBB",
  "tertiary":     "#RRGGBB",
  "tertiaryDm":   "#RRGGBB",
  "success":      "#RRGGBB",
  "successDm":    "#RRGGBB",
  "caution":      "#RRGGBB",
  "cautionDm":    "#RRGGBB",
  "error":        "#RRGGBB",
  "errorDm":      "#RRGGBB",
  "info":         "#RRGGBB",
  "infoDm":       "#RRGGBB",
  "radiusSm":     "Npx",
  "radiusMd":     "Npx",
  "radiusLg":     "Npx",
  "radiusPill":   "999px",
  "shadow":       "none",
  "fontDisplay":  "'Space Grotesk', sans-serif",
  "fontBody":     "'Inter', sans-serif",
  "darkMode":     true,
  "coreColors": [
    { "id": "bg-dark",           "label": "Background Dark",   "hex": "#RRGGBB" },
    { "id": "bg-light",          "label": "Background Light",  "hex": "#RRGGBB" },
    { "id": "surface",           "label": "Surface",           "hex": "#RRGGBB" },
    { "id": "text-primary",      "label": "Text Primary",      "hex": "#RRGGBB" },
    { "id": "text-primary-dark", "label": "Text Primary Dark", "hex": "#RRGGBB" },
    { "id": "text-secondary",    "label": "Text Secondary",    "hex": "#RRGGBB" },
    { "id": "border",            "label": "Border",            "hex": "#RRGGBB" },
    { "id": "neutral",           "label": "Neutral",           "hex": "#RRGGBB" }
  ],
  "reasoning": "One sentence explaining the interpretation and key design decisions."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: [
            ...images.map(img => ({
              type: 'image',
              source: { type: 'base64', media_type: img.mediaType, data: img.data },
            })),
            { type: 'text', text: PROMPT },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message ?? 'Claude API error' });
    }

    const claude = await response.json();
    const raw = claude.content?.[0]?.text ?? '';
    const cleaned = raw.replace(/```(?:json)?/g, '').trim();
    const suggestion = JSON.parse(cleaned);

    return res.status(200).json({ suggestion });
  } catch (err) {
    return res.status(500).json({ error: err.message ?? 'Unexpected error' });
  }
}
