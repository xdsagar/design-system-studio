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

export default function GuideModal({ onClose }) {
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
          <button className="guide-close" onClick={onClose}><X size={15} /></button>
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
              <p>Design System Studio is a browser-based design token configurator. You define the visual language of your product — colors, typography, spacing, motion, shape — then preview it live across real product layouts before exporting production-ready code.</p>
              <p>The tool is split into two main areas:</p>
              <ul>
                <li><strong>Configurator panel</strong> (left) — 7 steps that walk you through every dimension of your design system</li>
                <li><strong>Canvas</strong> (right) — live preview of your tokens applied to real UI: components, a marketing page, a dashboard, and a mobile screen</li>
              </ul>
              <div className="guide-quickstart">
                <div className="guide-qs-step"><span className="guide-qs-num">1</span><span>Pick a style preset or analyze your brand with AI on the Intro step</span></div>
                <div className="guide-qs-step"><span className="guide-qs-num">2</span><span>Walk through each step to fine-tune colors, type, spacing, motion, and shape</span></div>
                <div className="guide-qs-step"><span className="guide-qs-num">3</span><span>Watch the canvas update live, then export your design system as a ZIP</span></div>
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
              <p>The final step packages your complete design system into a downloadable ZIP.</p>
              <h3 className="guide-h3">Naming your system</h3>
              <p>Enter a name (e.g. "Acme Design System") — this sets the filenames, CSS comments, and labels throughout the export.</p>
              <h3 className="guide-h3">What's in the ZIP</h3>
              <ul>
                <li><strong>tokens.css</strong> — all <code>--ds-*</code> CSS custom properties as a <code>:root</code> block. Import once at your app root.</li>
                <li><strong>tokens.js</strong> — the same tokens as a JavaScript object, with helper functions (<code>token()</code>, <code>v()</code>)</li>
                <li><strong>components.css</strong> — a full component library (buttons, inputs, badges, cards, tables, modals…) built entirely on <code>var(--ds-*)</code> tokens</li>
                <li><strong>react/</strong> — 10 React components (Button, Input, Badge, Alert, Card, Tabs, Modal, Avatar, Table, Spinner) with a barrel <code>index.js</code></li>
                <li><strong>html-css/examples.html</strong> — a standalone HTML file you can open in any browser to see all components rendered</li>
                <li><strong>CLAUDE.md</strong> — an AI skill file that teaches Claude Code your exact token values, so any AI-assisted code it writes stays on-brand automatically</li>
              </ul>
              <h3 className="guide-h3">Token preview</h3>
              <p>Expand the <strong>Token preview</strong> accordion at the bottom of the Export step to see and search all generated CSS custom properties before downloading.</p>
              <Tip>Open <code>html-css/examples.html</code> directly in a browser to instantly verify your exported components look right — no build step needed.</Tip>
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
              <h3 className="guide-h3">Downloading a token template</h3>
              <p>Click the <strong>download icon</strong> in the header to get a blank JSON token template. This file lists every configurable token with its default value — edit it in any text editor and re-import it to apply your values.</p>
              <h3 className="guide-h3">Importing tokens</h3>
              <p>Click the <strong>upload icon</strong> in the header (or <strong>Import tokens</strong> in the welcome modal) to import a JSON token file. The configurator, canvas, and all step inputs sync immediately to the imported values.</p>
              <h3 className="guide-h3">Saving your progress</h3>
              <p>Click <strong>Save your progress?</strong> in the header to open the Save modal. From here you can download your current token state as a JSON file — bring it back next time via Import to continue where you left off.</p>
              <Note>The tool does not save to a server or account. Progress is not persisted between sessions automatically. Use Save → Import to carry work across sessions.</Note>
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

          </div>
        </div>
      </div>
    </div>
  );
}
