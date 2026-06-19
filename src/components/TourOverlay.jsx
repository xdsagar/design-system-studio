import { useEffect, useRef, useState, useCallback } from 'react';

const TOUR_STEPS = [
  {
    target: '.step-nav-rail',
    title: 'Build step by step',
    body: '7 steps take you from choosing a style preset all the way to exporting a complete design system. Click any step to jump straight to it.',
    placement: 'right',
    pad: 6,
  },
  {
    target: '.canvas-scene-tabs',
    title: 'Live preview across 4 layouts',
    body: 'Switch between Components, Marketing, Dashboard, and Mobile — every token change reflects instantly across all views.',
    placement: 'bottom',
    pad: 6,
  },
  {
    target: '.header-analyze-btn',
    title: 'AI brand analysis',
    body: 'Upload brand images or describe your brand in plain language. The AI generates a matching color palette, type, motion, and shape token set in seconds.',
    placement: 'bottom',
    pad: 8,
  },
  {
    target: '.header-file-btn',
    title: 'Save your token template',
    body: 'Your work auto-saves in the browser. Download a token template to share with your team, back up your work, or continue on another device.',
    placement: 'bottom',
    pad: 8,
  },
];

export const TOUR_KEY = 'dss-tour-seen';

const TOOLTIP_W = 288;
const GAP = 16;

function getPos(r, placement) {
  const vw = window.innerWidth;
  const clampX = (x) => Math.max(12, Math.min(vw - TOOLTIP_W - 12, x));

  switch (placement) {
    case 'right':
      return { left: r.right + GAP, top: r.top + r.height / 2 };
    case 'bottom':
      return { left: clampX(r.left + r.width / 2 - TOOLTIP_W / 2), top: r.bottom + GAP };
    case 'left':
      return { left: r.left - TOOLTIP_W - GAP, top: r.top + r.height / 2 };
    case 'top':
      return { left: clampX(r.left + r.width / 2 - TOOLTIP_W / 2), bottom: window.innerHeight - r.top + GAP };
    default:
      return { left: clampX(vw / 2 - TOOLTIP_W / 2), top: window.innerHeight / 2 };
  }
}

export default function TourOverlay({ onDone }) {
  const [step, setStep]       = useState(0);
  const [rect, setRect]       = useState(null);
  const rafRef                = useRef(null);
  const current               = TOUR_STEPS[step];

  const measure = useCallback(() => {
    const el = document.querySelector(current.target);
    if (!el) return;
    setRect(el.getBoundingClientRect());
  }, [current.target]);

  useEffect(() => {
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

  if (!rect) return null;

  const pad    = current.pad ?? 6;
  const sr     = {
    left:   rect.left   - pad,
    top:    rect.top    - pad,
    width:  rect.width  + pad * 2,
    height: rect.height + pad * 2,
  };

  const tooltipPos = getPos(sr, current.placement);
  const isLast     = step === TOUR_STEPS.length - 1;
  const isFirst    = step === 0;

  const tooltipStyle = {
    position: 'fixed',
    width: TOOLTIP_W,
    zIndex: 10002,
    ...(tooltipPos.bottom !== undefined
      ? { bottom: tooltipPos.bottom, left: tooltipPos.left }
      : { top:    tooltipPos.top,    left: tooltipPos.left }),
    ...(current.placement === 'right' || current.placement === 'left'
      ? { transform: 'translateY(-50%)' }
      : {}),
  };

  return (
    <>
      {/* Dim backdrop — click to skip */}
      <div className="tour-backdrop" onClick={finish} />

      {/* Spotlight cutout */}
      <div
        className="tour-spotlight"
        style={{
          left:   sr.left,
          top:    sr.top,
          width:  sr.width,
          height: sr.height,
        }}
      />

      {/* Tooltip card */}
      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-tooltip-top">
          <span className="tour-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
          <button className="tour-skip" onClick={finish}>Skip tour</button>
        </div>

        <div className="tour-title">{current.title}</div>
        <div className="tour-body">{current.body}</div>

        <div className="tour-nav">
          {!isFirst && (
            <button className="tour-btn-back" onClick={back}>Back</button>
          )}
          <button className="tour-btn-next" onClick={next}>
            {isLast ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
}
