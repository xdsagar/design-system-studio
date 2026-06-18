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

  const { images, brandDescription } = req.body ?? {};
  if (!images?.length && !brandDescription?.trim()) return res.status(400).json({ error: 'Provide at least one image or a brand description' });
  if (images?.length > 5) return res.status(400).json({ error: 'Maximum 5 images allowed' });

  const PROMPT = `You are a senior UI/brand designer generating a complete design token set from brand images and/or a written description.${brandDescription?.trim() ? `

━━━ BRAND CONTEXT FROM USER ━━━
The user has provided this description of their brand — treat it as high-priority signal that overrides inferences from imagery alone:

"${brandDescription.trim()}"

Use this to calibrate tone (premium vs. friendly), personality (bold vs. minimal), preferred mode (dark vs. light), industry conventions, and color palette direction.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━` : ''}

You are a senior UI/brand designer generating a complete design token set.

━━━ CRITICAL RULE — TEXT ON COLOR (WCAG AA) ━━━
Semantic colors (brand, secondary, tertiary, success, caution, error, info) are used as SOLID FILL
backgrounds for buttons. The text sitting on top of those fills comes from the text token — NOT white:
  • Light mode buttons: text-primary (#1E1E1E, near-black) sits on the semantic color background
  • Dark mode buttons:  text-primary-dark (#F5F5F5, near-white) sits on the semantic color background

WCAG AA requires a contrast ratio of at least 4.5:1. The mathematical thresholds are:
  • LIGHT MODE: button background luminance must be ≥ 0.24  (i.e. the color must be "medium" or brighter)
  • DARK MODE:  button background luminance must be ≤ 0.17  (i.e. the color must be "deep" or darker)

━━━ LIGHT MODE — FORBIDDEN COLORS (will always fail with dark text) ━━━
These are the MOST COMMON AI MISTAKES. Do NOT use these in light mode:
  ✗ Dark reds / maroon:  #8B0000, #7B2D2D, #800020, #8B2020, #C0392B, #922B21
  ✗ Deep navy / blue:    #0A1628, #003366, #0D1B2A, #1B2A4A
  ✗ Forest / dark green: #1A5C35, #155724, #14532D, #1A3A1A, #0F3D0F
  ✗ Dark purple:         #3D1A8B, #4A0080, #2D0A5C
  ✗ Any color you'd describe as "dark", "deep", "muted", "rich", or "moody"
  ✗ Any color where ALL hex digits are below ~90 (e.g. #556655, #885544, #445566)

CORRECT APPROACH when the brand uses dark colors:
  → Take the brand hue and LIGHTEN it for light mode. Keep the dark original for dark mode.
  → Dark navy #0A2040 → light mode use #3B82F6 or #60A5FA (same hue, raised luminance)
  → Dark maroon #800020 → light mode use #E53E3E or #F87171 (same hue, raised luminance)
  → Forest green #1A5C35 → light mode use #22C55E or #4ADE80 (same hue, raised luminance)
  → Deep purple #3D1A8B → light mode use #818CF8 or #A78BFA (same hue, raised luminance)

PASSING LIGHT MODE EXAMPLES (contrast ≥ 4.5:1 with #1E1E1E):
  ✓ Amber / gold:   #F59E0B, #D97706, #B45309
  ✓ Green:          #22C55E, #16A34A, #15803D, #4ADE80
  ✓ Blue:           #3B82F6, #2563EB, #60A5FA
  ✓ Purple:         #818CF8, #A78BFA, #C084FC
  ✓ Red/orange:     #EF4444, #F87171, #FB923C, #F97316
  ✓ Teal:           #14B8A6, #0D9488, #2DD4BF
  ✓ Neutral:        #777777 (barely passes), #888888, #999999

Dark mode — your semantic colors must have contrast ≥ 4.5:1 against #F5F5F5:
  This means the color needs LOW luminance (L ≤ 0.17). Avoid bright or pastel tones in dark mode.
  Good dark-mode range: deep, saturated hues — navy, forest green, deep amber, dark crimson.

  • NEVER use near-white (#CCCCCC–#FFFFFF) as a dark mode semantic color — text becomes invisible.
  • NEVER use near-black (#000000–#111111) as a dark mode semantic color — disappears on dark backgrounds.
  • NEVER use mid-luminance "pop" colors (#0D99FF-style bright blue, #9B80FF light purple) as dark mode
    semantic colors — they look vibrant but fail WCAG with the light text token.

━━━ SELF-CHECK — run this before finalising your JSON ━━━
For every light-mode color you picked: would a non-designer describe it as "dark"? → Lighten it.
For every dark-mode color you picked: would a non-designer describe it as "bright" or "colourful"? → Darken it.
If you are unsure about a light-mode color, go one step lighter. Accessible + slightly lighter > inaccessible + on-brand.

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
            ...(images ?? []).map(img => ({
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
