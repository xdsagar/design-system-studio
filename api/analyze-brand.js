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

  const PROMPT = `You are a design system expert analyzing brand images to suggest UI design tokens.

Analyze the provided images and return ONLY a valid JSON object — no markdown fences, no explanation outside the JSON.

{
  "brand": "#RRGGBB",
  "secondary": "#RRGGBB",
  "tertiary": "#RRGGBB",
  "success": "#RRGGBB",
  "caution": "#RRGGBB",
  "error": "#RRGGBB",
  "radiusSm": "Npx",
  "radiusMd": "Npx",
  "radiusLg": "Npx",
  "radiusPill": "999px",
  "shadow": "none|sm|md",
  "fontDisplay": "...",
  "fontBody": "...",
  "darkMode": true,
  "reasoning": "One sentence explaining your interpretation."
}

Rules:
- Extract actual colors visible in the images, not generic guesses
- Radius: edgy/athletic = 0–3px; professional/neutral = 4–8px; friendly/consumer = 10–20px
- Shadow: flat/minimal brand = "none"; standard = "sm"; dramatic/layered = "md"
- fontDisplay must be exactly one of: "Georgia, serif" | "'Playfair Display', serif" | "'DM Serif Display', serif" | "system-ui, sans-serif" | "'DM Sans', sans-serif" | "'Space Grotesk', sans-serif" | "'Fraunces', serif"
- fontBody must be exactly one of: "system-ui, sans-serif" | "'DM Sans', sans-serif" | "'Inter', sans-serif" | "'IBM Plex Sans', sans-serif"
- success / caution / error should be semantic colors that harmonise with the brand palette
- darkMode: true if the brand leans dark or high-contrast; false for light`;

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
        max_tokens: 1024,
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

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```(?:json)?/g, '').trim();
    const suggestion = JSON.parse(cleaned);

    return res.status(200).json({ suggestion });
  } catch (err) {
    return res.status(500).json({ error: err.message ?? 'Unexpected error' });
  }
}
