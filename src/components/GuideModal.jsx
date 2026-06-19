import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const SECTIONS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'presets',    label: 'Style Presets' },
  { id: 'colors',     label: 'Colors Step' },
  { id: 'type',       label: 'Typography Step' },
  { id: 'space',      label: 'Spacing Step' },
  { id: 'motion',     label: 'Motion Step' },
  { id: 'shape',      label: 'Shape & Shadow Step' },
  { id: 'export',     label: 'Export Step' },
  { id: 'canvas',     label: 'Canvas & Scenes' },
  { id: 'analyzer',   label: 'Brand Analyzer' },
  { id: 'importexport', label: 'Import & Export' },
  { id: 'tips',       label: 'Tips & Tricks' },
  { id: 'builder',    label: 'Meet the Builder' },
];

function Tip({ children }) {
  return <div className="guide-tip"><span className="guide-tip-label">Tip</span>{children}</div>;
}

function Note({ children }) {
  return <div className="guide-note"><span className="guide-note-label">Note</span>{children}</div>;
}

function Section({ id, title, children }) {
  return (
    <section className="guide-section" id={id}>
      <h2 className="guide-section-title">{title}</h2>
      {children}
    </section>
  );
}

export default function GuideModal({ onClose, onStartTour }) {
  const [active, setActive] = useState('overview');
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const sections = el.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { root: el, rootMargin: '-10% 0px -70% 0px' }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id) {
    const el = contentRef.current?.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="guide-overlay" onClick={onClose}>
      <div className="guide-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="guide-header">
          <div>
            <div className="guide-title">Design System Studio — Guide</div>
            <div className="guide-subtitle">Everything you need to know about the tool</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {onStartTour && (
              <button className="guide-tour-btn" onClick={onStartTour}>Take the tour</button>
            )}
            <button className="guide-close" onClick={onClose}><X size={15} /></button>
          </div>
        </div>

        <div className="guide-body">

          {/* Left nav */}
          <nav className="guide-nav">
            <div className="guide-nav-group-label">Contents</div>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`guide-nav-item${active === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="guide-content" ref={contentRef}>

            <Section id="overview" title="Overview">
              <div className="guide-audience-callout">
                <strong>New to this?</strong> A design system is simply a set of visual decisions for your app — what colors it uses, what fonts, how rounded the buttons are, how things move. This tool helps you make those decisions visually, then packages them into a file you (or Claude) can use directly. No coding required to get started.
              </div>
              <p>Design System Studio is a browser-based visual style configurator. You define the look and feel of your product — colors, typography, spacing, motion, shape — then preview it live across real product layouts before exporting a complete, production-ready style guide.</p>
              <p>The tool is split into two main areas:</p>
              <ul>
                <li><strong>Configurator panel</strong> (left) — 7 steps that walk you through every visual dimension of your design system</li>
                <li><strong>Canvas</strong> (right) — live preview of your style applied to real UI: components, a marketing page, a dashboard, and a mobile screen</li>
              </ul>
              <div className="guide-quickstart">
                <div className="guide-qs-step"><span className="guide-qs-num">1</span><span>Pick a style preset or analyze your brand with AI on the Intro step</span></div>
                <div className="guide-qs-step"><span className="guide-qs-num">2</span><span>Walk through each step to fine-tune colors, fonts, spacing, motion, and shape</span></div>
                <div className="guide-qs-step"><span className="guide-qs-num">3</span><span>Watch the canvas update live, then download your style guide as a ZIP</span></div>
              </div>
            </Section>

            <Section id="presets" title="Style Presets">
              <p>The Intro step offers six pre-built starting points that set your entire token set at once — colors, fonts, radius, shadow, and motion personality included.</p>
              <ul>
                <li><strong>Studio</strong> — Clean, modern, versatile. Light mode with rounded corners and a blue-violet palette. Good all-purpose starting point.</li>
                <li><strong>Warmth</strong> — Friendly and inviting. Warm amber and terracotta tones, rounded shapes. Great for residential, consumer, or lifestyle brands.</li>
                <li><strong>Clarity</strong> — Precise and minimal. Light mode, sharp corners, system fonts. Suits enterprise SaaS and data tools.</li>
                <li><strong>Amplified</strong> — Bold, dark, high-energy. Pill-shaped buttons, strong accent colors. Good for creative agencies and tech startups.</li>
                <li><strong>Precision</strong> — Industrial and uncompromising. Light mode with square corners and a confident red palette.</li>
                <li><strong>Cinema</strong> — Cinematic and editorial. Dark, dramatic, with bold type and square shapes.</li>
              </ul>
              <Tip>Click any preset card to apply it instantly — the canvas updates in real time so you can compare presets by clicking between them.</Tip>
              <Note>If you have a custom brand active (from the Brand Analyzer), switching to a preset will prompt a confirmation dialog so you don't lose your work.</Note>
            </Section>

            <Section id="colors" title="Colors Step">
              <p>The Colors step controls all semantic and interactive colors in your design system. Colors are split by mode — use the <strong>Light / Dark</strong> toggle at the top to switch between them.</p>
              <h3 className="guide-h3">Semantic colors</h3>
              <p>Each color group (Brand, Secondary, Tertiary, Ghost, Success, Caution, Error, Info, Danger) expands into an accordion when clicked. Inside you'll find:</p>
              <ul>
                <li><strong>Color picker + hex input</strong> — click the color dot to open the native picker, or type a hex code directly</li>
                <li><strong>WCAG AA badge</strong> — shows the contrast ratio between the color and the text token. Green = passes 4.5:1, red = fails</li>
                <li><strong>Hover color</strong> — set a distinct hover state for each semantic color. The <strong>Auto</strong> toggle calculates a darkened version automatically</li>
              </ul>
              <h3 className="guide-h3">Core colors</h3>
              <p>Scroll down past the semantic colors to find Core Colors — these set the foundational surfaces and text colors: Background Dark/Light, Surface, Text Primary, Text Secondary, Border, and Neutral.</p>
              <Tip>Click any hex value in the canvas to copy it to your clipboard — a brief "Copied!" indicator confirms it.</Tip>
              <Tip>The WCAG badge in the configurator matches what the Brand Analyzer enforces — every button color is automatically checked for 4.5:1 contrast with the text token.</Tip>
              <h3 className="guide-h3">Button text color — auto-computed</h3>
              <p>Button text color is set automatically using the same WCAG AA standard (4.5:1) shown in the contrast check. The tool checks whether white text clears 4.5:1 against the button background — if it does, white (light text) is used; otherwise dark text is applied. This applies to every brand-colored element in the canvas: buttons, badges, step indicators, avatars, cards, and more.</p>
              <Note>This is intentional. Design systems that hard-code button text colors break silently when brand colors change. Auto-computation keeps every element correct by default — and the contrast check will always agree with what you see.</Note>
              <p>To manually override after export, edit the <code>color</code> property on <code>.ds-btn.primary</code> in your exported <code>components.css</code>, or ask your LLM: <em>"Change the primary button text color to #000000 in components.css."</em></p>
            </Section>

            <Section id="type" title="Typography Step">
              <p>Controls display and body font families, plus the full type scale.</p>
              <ul>
                <li><strong>Display font</strong> — used for headings, hero text, and marketing copy. Choose from serif, sans-serif, and display options including Space Grotesk, Playfair Display, Fraunces, DM Serif, and more</li>
                <li><strong>Body font</strong> — used for paragraphs, UI labels, and body copy. Inter, DM Sans, IBM Plex Sans, and system-ui are available</li>
                <li><strong>Type scale</strong> — adjust base size and scale ratio. The preview shows all heading levels rendered live in your chosen fonts</li>
              </ul>
              <Tip>The canvas Marketing scene is the best place to evaluate display fonts — the hero headline and section titles use the display font at large sizes.</Tip>
            </Section>

            <Section id="space" title="Spacing Step">
              <p>The Spacing step controls the spatial rhythm of your design system using a fixed 4pt grid. All spacing values are multiples of 4px — this keeps layouts consistent and avoids irrational values.</p>
              <p>The <strong>scale factor</strong> slider compresses or expands the entire spacing system at once. A tighter scale suits dense data interfaces; a looser scale suits marketing and consumer products.</p>
              <Note>Spacing values are shown as tokens (xs, sm, md, lg, xl, 2xl) that map to CSS custom properties like <code>--ds-space-md</code>. Every component uses these tokens rather than hard-coded pixel values.</Note>
            </Section>

            <Section id="motion" title="Motion Step">
              <p>Sets the personality of all transitions and animations across your system.</p>
              <ul>
                <li><strong>Instant</strong> — no transitions. Suits accessibility-first or data-dense tools</li>
                <li><strong>Snappy</strong> — 100ms, linear. Fast and direct</li>
                <li><strong>Smooth</strong> — 200ms, ease-in-out. The standard default</li>
                <li><strong>Relaxed</strong> — 350ms, cubic-bezier. Fluid and considered</li>
                <li><strong>Expressive</strong> — 500ms, spring-like. Consumer apps, onboarding flows</li>
              </ul>
              <Tip>Switch between motion personalities while watching the canvas Components scene — hover over buttons and interactive elements to feel the difference.</Tip>
            </Section>

            <Section id="shape" title="Shape & Shadow Step">
              <p>Controls the border radius and shadow elevation across all components.</p>
              <h3 className="guide-h3">Border radius</h3>
              <p>Use the <strong>−/+</strong> stepper to move through the radius scale: Sharp (0px) → Subtle (2–4px) → Modern (6–8px) → Friendly (12–16px) → Pill (999px). The preview shows brand-colored boxes at each radius size.</p>
              <h3 className="guide-h3">Shadow elevation</h3>
              <p>Choose between <strong>Flat</strong> (no shadow), <strong>Subtle</strong>, and <strong>Raised</strong>. The preview card shows a white card on a light floor — the shadow is shown in realistic context rather than on a dark background.</p>
              <h3 className="guide-h3">Border style</h3>
              <p>Toggle between <strong>Solid</strong> and <strong>None</strong> borders. Removing borders pairs well with elevated shadow styles.</p>
            </Section>

            <Section id="export" title="Export Step">
              <p>The final step packages your complete style guide into a downloadable ZIP file.</p>
              <h3 className="guide-h3">Naming your system</h3>
              <p>Give your design system a name (e.g. "Acme Design System") — this sets the filenames and labels throughout the export.</p>
              <h3 className="guide-h3">Using your export with Claude</h3>
              <div className="guide-audience-callout">
                After downloading, open Claude and say: <em>"I've attached my design system — use it for everything you build for me."</em> Then attach the <strong>CLAUDE.md</strong> file from inside the ZIP. Claude will follow your exact colors, fonts, and style from that point on — every component it builds will match your visual choices.
              </div>
              <h3 className="guide-h3">What's in the ZIP</h3>
              <ul>
                <li><strong>CLAUDE.md</strong> — the most important file if you're using AI. Teaches Claude your exact style so it stays consistent across every screen it builds</li>
                <li><strong>tokens.css</strong> — all your style settings as CSS variables. Drop this into any web project and everything inherits your colors, fonts, and spacing automatically</li>
                <li><strong>tokens.js</strong> — the same settings as a JavaScript object, for use in React and Node projects</li>
                <li><strong>components.css</strong> — a full set of ready-to-use component styles (buttons, inputs, cards, tables, modals…) built on your tokens</li>
                <li><strong>react/</strong> — 10 ready-to-use React components (Button, Input, Badge, Alert, Card, Tabs, Modal, Avatar, Table, Spinner)</li>
                <li><strong>html-css/examples.html</strong> — open this file in any browser to see all your components rendered with your style — no setup needed</li>
              </ul>
              <h3 className="guide-h3">Token preview</h3>
              <p>Expand the <strong>Token preview</strong> accordion at the bottom of the Export step to see and search all your style settings before downloading.</p>
              <Tip>Open <code>html-css/examples.html</code> directly in a browser to instantly verify how your exported components look — no build step or coding needed.</Tip>
            </Section>

            <Section id="canvas" title="Canvas & Scenes">
              <p>The canvas is a live preview area that re-renders every time you change a token. It has four scenes, selectable from the tab bar at the top.</p>
              <ul>
                <li><strong>Components</strong> — a Storybook-style browser with 60+ component stories. Use the search bar or sidebar to find any component. Each story shows your tokens applied to that component in isolation.</li>
                <li><strong>Marketing</strong> — a full marketing page layout: hero, stats strip, features grid, pricing cards, blog cards, and a CTA section. Tests how your brand reads at a large scale.</li>
                <li><strong>Dashboard</strong> — a product dashboard with a sidebar, stats cards, data table, and charts. Shows how your tokens behave in a dense UI context.</li>
                <li><strong>Mobile</strong> — a phone-frame preview of a mobile app screen. Tests how colors and type work at smaller sizes.</li>
              </ul>
              <h3 className="guide-h3">Dark / Light mode toggle</h3>
              <p>The sun/moon button in the canvas toolbar switches the preview between light and dark mode. This is independent of the shell theme toggle in the header — you can view the canvas in dark mode while keeping the configurator UI in light mode.</p>
              <Tip>The shell theme toggle in the header (sun/moon icon, top right) controls the configurator UI itself. The canvas toolbar toggle controls only the design system preview inside the canvas.</Tip>
              <Note>At narrower canvas widths, multi-column grids in the Marketing scene automatically stack to a single column using CSS container queries — this mirrors how the layout would behave on a real narrow screen.</Note>
            </Section>

            <Section id="analyzer" title="Brand Analyzer">
              <p>The Brand Analyzer (marked Beta) uses Claude AI to generate a complete token set from brand images and/or a text description.</p>
              <h3 className="guide-h3">How to use it</h3>
              <ul>
                <li>Click <strong>Analyze brand</strong> in the header, or the Analyze card on the Intro step</li>
                <li>Upload up to 5 brand images — logos, UI screenshots, brand guideline pages, photography</li>
                <li>Optionally add a text description of the brand's personality, industry, and target audience. This significantly improves output quality.</li>
                <li>Click <strong>Analyze</strong> — Claude extracts colors, typography direction, radius, shadow, and mode preference</li>
              </ul>
              <h3 className="guide-h3">Editing the results</h3>
              <p>After analysis, you'll see a two-column token table (Light / Dark). Click any color swatch to open an inline picker, or type a hex code directly next to it. The preview panel on the right updates live as you edit.</p>
              <p>The preview automatically switches to show the mode you're editing — editing a Dark Mode color switches the preview to dark, editing a Light Mode color switches it to light.</p>
              <h3 className="guide-h3">Reset to original</h3>
              <p>If you've made edits and want to go back to what the AI originally suggested, click <strong>Reset to original</strong> (appears next to the edit hint once you've made changes).</p>
              <h3 className="guide-h3">WCAG enforcement</h3>
              <p>Before displaying results, the tool automatically checks every semantic color against WCAG AA (4.5:1 contrast ratio) and corrects any failures. The AI prompt also includes explicit guidance to avoid dark colors in light mode — this two-layer approach minimises inaccessible suggestions.</p>
              <Tip>Describing the brand in text alongside images produces noticeably better results. Try: "Luxury fintech for high-net-worth investors. Dark, premium, minimal."</Tip>
            </Section>

            <Section id="importexport" title="Import & Export">
              <h3 className="guide-h3">Auto-save</h3>
              <p>Your work saves automatically in your browser as you go. Refreshing the page or closing the tab won't lose anything. Progress is tied to this specific browser on this device — use the export options below to move work to another device or share it.</p>
              <h3 className="guide-h3">Downloading a blank template</h3>
              <p>Click <strong>Token template</strong> in the header, then <strong>Download token template</strong> to get a blank JSON file listing every configurable setting with its default value. Fill it in (or have Claude fill it in) and re-import it to apply your values instantly.</p>
              <h3 className="guide-h3">Importing a style file</h3>
              <p>Click <strong>Token template → Import token template</strong> in the header (or <strong>I have a style file</strong> in the welcome screen) to load a previously saved JSON file. The configurator and canvas sync immediately to the imported values.</p>
              <h3 className="guide-h3">Saving your progress</h3>
              <p>Click <strong>Save your progress?</strong> in the header to open the Save panel. From here you can export your current settings as a JSON file and bring it back anytime via Import — useful for picking up on a different device or sharing with a team member.</p>
            </Section>

            <Section id="tips" title="Tips & Tricks">
              <h3 className="guide-h3">Resize the configurator panel</h3>
              <p>Drag the thin divider between the configurator and the canvas to resize the panel. It snaps to three widths: compact (340px), half the viewport, or nearly full width. Double the panel to focus on configuration; shrink it to focus on the canvas.</p>
              <h3 className="guide-h3">Collapse the panel</h3>
              <p>Click the <strong>chevron button</strong> at the bottom of the nav rail (the numbered step column) to collapse the configurator entirely, giving the canvas maximum space. Click any step number to re-open it.</p>
              <h3 className="guide-h3">Copy hex values from the canvas</h3>
              <p>Click any colored element in the canvas to copy its hex value to your clipboard. A brief confirmation toast appears. This is useful for sampling a token value without navigating back to the Colors step.</p>
              <h3 className="guide-h3">Reset a single step</h3>
              <p>Every step has a <strong>Reset [Step name]</strong> button in the footer nav. This resets only that step's tokens to defaults, leaving everything else untouched.</p>
              <h3 className="guide-h3">Overlay mode on tablet</h3>
              <p>Between 786px and 1148px wide, the configurator becomes an overlay drawer. Click a step in the nav rail to slide it open over the canvas; click the dimmed backdrop or collapse button to close it.</p>
              <h3 className="guide-h3">Shell vs. canvas dark mode</h3>
              <p>The header toggle (top right) controls the <em>shell</em> — the configurator UI itself. The canvas toolbar toggle controls the <em>preview</em> — your design system tokens. They're independent, so you can configure in light mode while previewing a dark-mode design system.</p>
              <h3 className="guide-h3">Preset confirmation</h3>
              <p>If you've applied a custom brand via the Analyzer and then click a preset, a confirmation dialog appears before overwriting — so you won't accidentally lose brand work.</p>
              <h3 className="guide-h3">Token preview search</h3>
              <p>On the Export step, expand the Token preview accordion and use the search box to filter tokens by name. Useful for quickly checking a specific <code>--ds-*</code> value before downloading.</p>
            </Section>

            <Section id="builder" title="Meet the Builder">
              <div className="guide-builder-card">
                <img
                  src="/sagar.jpg"
                  alt="Sagar Mistry"
                  className="guide-builder-photo"
                />
                <div className="guide-builder-info">
                  <div className="guide-builder-name">Sagar Mistry</div>
                  <div className="guide-builder-title">Principal Lead UX Designer, Client Journey @ FM&nbsp;&nbsp;·&nbsp;&nbsp;AI-led UX Engineer&nbsp;&nbsp;·&nbsp;&nbsp;Creative Problem Solver</div>
                  <div className="guide-builder-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    Durham, North Carolina
                  </div>
                  <a
                    href="https://www.linkedin.com/in/sagar-mistry/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="guide-builder-linkedin"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                    Let's connect!
                  </a>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}
