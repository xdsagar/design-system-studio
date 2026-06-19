import { useEffect, useState, useCallback } from 'react';

// null target = centered intro card, no spotlight
const TOUR_STEPS = [
  {
    target: null,
    title: 'Here\'s how this works',
    body: null, // rendered as custom intro layout
    placement: 'center',
    pad: 0,
  },
  {
    target: '.step-nav-rail',
    title: 'Start here — pick your style',
    body: 'The first step lets you choose a pre-built look — colors, fonts, and shapes ready to go. Think of it like picking a theme. You can tweak every detail afterwards.',
    placement: 'right',
    pad: 6,
  },
  {
    target: '.canvas-scene-tabs',
    title: 'See it live in real screens',
    body: 'This canvas shows your style applied to real product screens — a marketing page, a dashboard, a mobile app, and UI components. Every change you make on the left appears here instantly.',
    placement: 'bottom',
    pad: 6,
  },
  {
    target: '.header-analyze-btn',
    title: 'Have a brand? Let AI do the setup',
    body: 'Upload a logo or brand images — or just describe your brand in plain English. The AI reads your visual style and generates a matching color palette and token set automatically.',
    placement: 'bottom',
    pad: 8,
  },
  {
    target: '.step-nav-item:last-child',
    title: 'Export production-ready code',
    body: 'When you\'re happy with how everything looks, download your design system as a ZIP. It includes CSS variables, React components, and HTML examples — ready to drop straight into your project.',
    placement: 'right',
    pad: 6,
  },
];

export const TOUR_KEY = 'dss-tour-seen';

const TOOLTIP_W = 300;
const GAP = 16;

function getPos(r, placement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampX = (x) => Math.max(12, Math.min(vw - TOOLTIP_W - 12, x));

  switch (placement) {
    case 'right':
      return { left: r.right + GAP, top: r.top + r.height / 2 };
    case 'bottom':
      return { left: clampX(r.left + r.width / 2 - TOOLTIP_W / 2), top: r.bottom + GAP };
    case 'left':
      return { left: r.left - TOOLTIP_W - GAP, top: r.top + r.height / 2 };
    case 'top':
      return { left: clampX(r.left + r.width / 2 - TOOLTIP_W / 2), bottom: vh - r.top + GAP };
    default:
      return { left: clampX(vw / 2 - TOOLTIP_W / 2), top: vh / 2 };
  }
}

function IntroCard({ onNext, onSkip, stepCount }) {
  return (
    <div className="tour-intro-card">
      <button className="tour-skip" onClick={onSkip} style={{ position: 'absolute', top: 16, right: 16 }}>
        Skip tour
      </button>

      <div className="tour-intro-eyebrow">Quick start</div>
      <div className="tour-intro-title">Here's how this works</div>
      <p className="tour-intro-sub">
        Design System Studio helps you define the visual style of your app or website — colors, fonts, spacing, and more — and turns it into production-ready code. No design software needed.
      </p>

      <ol className="tour-intro-steps">
        <li>
          <span className="tour-intro-num">1</span>
          <div>
            <strong>Pick a starting point</strong>
            <span>Choose a pre-built style preset or let the AI analyze your brand images</span>
          </div>
        </li>
        <li>
          <span className="tour-intro-num">2</span>
          <div>
            <strong>Customize your style</strong>
            <span>Fine-tune colors, fonts, spacing, and more — the canvas updates live as you go</span>
          </div>
        </li>
        <li>
          <span className="tour-intro-num">3</span>
          <div>
            <strong>Export your code</strong>
            <span>Download CSS, React components, and HTML examples ready for your project</span>
          </div>
        </li>
      </ol>

      <div className="tour-intro-footer">
        <span className="tour-step-counter">1 / {stepCount}</span>
        <button className="tour-btn-next" onClick={onNext}>Show me around →</button>
      </div>
    </div>
  );
}

export default function TourOverlay({ onDone }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const current         = TOUR_STEPS[step];
  const isIntro         = current.target === null;

  const measure = useCallback(() => {
    if (!current.target) { setRect(null); return; }
    const el = document.querySelector(current.target);
    if (el) setRect(el.getBoundingClientRect());
  }, [current.target]);

  useEffect(() => {
    setRect(null);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  function next() {
    if (step < TOUR_STEPS.length - 1) setStep(s => s + 1);
    else finish();
  }

  function back() {
    if (step > 0) setStep(s => s - 1);
  }

  function finish() {
    localStorage.setItem(TOUR_KEY, '1');
    onDone();
  }

  // Intro step — centered card, no spotlight
  if (isIntro) {
    return (
      <>
        <div className="tour-backdrop tour-backdrop--intro" onClick={finish} />
        <IntroCard onNext={next} onSkip={finish} stepCount={TOUR_STEPS.length} />
      </>
    );
  }

  // Spotlight steps — wait for rect
  if (!rect) return null;

  const pad = current.pad ?? 6;
  const sr  = {
    left:   rect.left   - pad,
    top:    rect.top    - pad,
    width:  rect.width  + pad * 2,
    height: rect.height + pad * 2,
  };

  const pos    = getPos(sr, current.placement);
  const isLast = step === TOUR_STEPS.length - 1;

  const tooltipStyle = {
    position: 'fixed',
    width: TOOLTIP_W,
    zIndex: 10002,
    ...(pos.bottom !== undefined
      ? { bottom: pos.bottom, left: pos.left }
      : { top: pos.top,       left: pos.left }),
    ...(current.placement === 'right' || current.placement === 'left'
      ? { transform: 'translateY(-50%)' }
      : {}),
  };

  return (
    <>
      <div className="tour-backdrop" onClick={finish} />

      <div className="tour-spotlight" style={{ left: sr.left, top: sr.top, width: sr.width, height: sr.height }} />

      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-tooltip-top">
          <span className="tour-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
          <button className="tour-skip" onClick={finish}>Skip tour</button>
        </div>

        <div className="tour-title">{current.title}</div>
        <div className="tour-body">{current.body}</div>

        <div className="tour-nav">
          <button className="tour-btn-back" onClick={back}>Back</button>
          <button className="tour-btn-next" onClick={next}>
            {isLast ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
}
