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

  const PROMPT = `You are a senior UI/brand designer generating a complete design token set from brand images.

━━━ MOST IMPORTANT RULE ━━━
The "brand" and "brandDm" tokens are INTERACTIVE ACTION COLORS — used for buttons, links, and CTAs.
They MUST visually POP against their background. They are NOT the dominant brand color.

NEVER return black or near-black (#000–#333) as brandDm — it disappears on dark surfaces.
NEVER return white or near-white (#CCC–#FFF) as brand — it disappears on light surfaces.

━━━ HOW TO PICK ACTION COLORS ━━━

1. First look for an ACCENT color in the images — something used on buttons, icons, gradients, or logo marks that is NOT the background color and NOT plain black/white text.

2. If the brand uses a real accent (e.g. orange, gold, electric blue) — use that as both brand and brandDm, possibly adjusting lightness slightly for each mode.

3. If the brand is FULLY MONOCHROMATIC (only black, white, grey — like a premium athletic/luxury brand):
   - brand (light mode action) = deep charcoal, e.g. #111111 or #1A1A1A — readable on white
   - brandDm (dark mode action) = bright off-white, e.g. #F5F5F5 or #EEEEEE — readable on near-black
   - This high-contrast monochromatic approach is the correct design decision for such brands

4. secondary / secondaryDm = the next most important interactive color (slightly lighter/softer than brand)

5. tertiary / tertiaryDm = a supporting accent (can be a mid-tone or warm grey)

━━━ SURFACE & BACKGROUND (coreColors) ━━━
Return a coreColors array that sets the actual page/surface colors.
For dark brands: bg-dark ≈ #0A0A0A–#141414, bg-light ≈ #F5F5F5–#FFFFFF
For light brands: bg-dark ≈ #18181B, bg-light ≈ #FAFAFA

━━━ SEMANTIC COLORS ━━━
success / successDm, caution / cautionDm, error / errorDm, info / infoDm
— these should harmonise with the brand palette, not be generic. Adjust hue warmth/coolness to match.

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
        max_tokens: 1500,
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
