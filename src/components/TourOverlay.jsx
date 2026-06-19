import { useEffect, useState, useCallback } from 'react';

// null target = centered intro card, no spotlight
const TOUR_STEPS = [
  {
    target: null,
    title: 'Here\'s how this works',
    body: null,
    placement: 'center',
    pad: 0,
  },
  {
    target: '.step-nav-rail',
    title: 'Start here — pick your style',
    body: 'Choose a pre-built look from the Intro step, or let AI read your brand images. Think of it like picking a theme for your app. Each step after this lets you fine-tune the details.',
    placement: 'right',
    pad: 6,
  },
  {
    target: '.canvas-scene-tabs',
    title: 'Your app, live in real screens',
    body: 'This preview updates instantly as you make changes on the left. Switch between a website, dashboard, mobile app, and UI components to see exactly how your style looks in context.',
    placement: 'bottom',
    pad: 6,
  },
  {
    target: '.header-analyze-btn',
    title: 'Let AI read your brand',
    body: 'Have a logo or brand images? Upload them here — or just describe what your brand feels like in plain English. The AI figures out your colors and style for you automatically.',
    placement: 'bottom',
    pad: 8,
  },
  {
    target: '.step-nav-item:last-child',
    title: 'Get your style file for Claude',
    body: 'When everything looks right, download your style guide. Share it with Claude and say "use this for my project" — Claude will follow your exact colors, fonts, and style from then on.',
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

      <div className="tour-intro-eyebrow">Before you open Claude...</div>
      <div className="tour-intro-title">Decide what your app looks like</div>
      <p className="tour-intro-sub">
        When you ask Claude to build an app, it guesses at the colors, fonts, and style — and it guesses differently every time. This tool lets you make those decisions first, so Claude always builds in your style.
      </p>

      <ol className="tour-intro-steps">
        <li>
          <span className="tour-intro-num">1</span>
          <div>
            <strong>Pick a look you like</strong>
            <span>Choose from pre-built styles, or upload your logo and let AI match your brand</span>
          </div>
        </li>
        <li>
          <span className="tour-intro-num">2</span>
          <div>
            <strong>Tweak it until it feels right</strong>
            <span>Adjust colors, fonts, and more — a live preview shows your changes instantly</span>
          </div>
        </li>
        <li>
          <span className="tour-intro-num">3</span>
          <div>
            <strong>Give the style guide to Claude</strong>
            <span>Download your file and share it with Claude — it follows your style from then on</span>
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
