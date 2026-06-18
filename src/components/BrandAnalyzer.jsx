import { useState, useRef, useEffect } from 'react';
import { X, Upload, RotateCcw, ArrowRight, ImageIcon, Sun, Moon, LayoutDashboard, Layers } from 'lucide-react';
import { buildCssVars } from '../hooks/useTokens';
import { defaultTokens, shadowValues, wcagContrast } from '../utils/tokens';
import ThemePreview from './ThemePreview';

const RADIUS_STOPS = ['0px','2px','4px','6px','8px','12px','16px','24px','999px'];

// Adjust a hex color's HSL lightness until it meets the target contrast ratio with textHex.
// lighten=true moves toward white, lighten=false moves toward black.
function enforceWcag(colorHex, textHex, lighten, targetRatio = 4.5) {
  if (!colorHex || !/^#[0-9a-fA-F]{6}$/.test(colorHex)) return colorHex;
  if (wcagContrast(colorHex, textHex) >= targetRatio) return colorHex;
  const r = parseInt(colorHex.slice(1,3),16)/255;
  const g = parseInt(colorHex.slice(3,5),16)/255;
  const b = parseInt(colorHex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min;
  let h = 0, s = 0, l = (max+min)/2;
  if (d !== 0) {
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max===r) h = ((g-b)/d + (g<b?6:0))/6;
    else if (max===g) h = ((b-r)/d + 2)/6;
    else h = ((r-g)/d + 4)/6;
  }
  const hue2rgb = (p,q,t) => { t=t<0?t+1:t>1?t-1:t; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; };
  for (let i = 0; i < 60; i++) {
    l = lighten ? Math.min(0.95, l+0.02) : Math.max(0.05, l-0.02);
    const q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    const nr = Math.round(hue2rgb(p,q,h+1/3)*255);
    const ng = Math.round(hue2rgb(p,q,h)*255);
    const nb = Math.round(hue2rgb(p,q,h-1/3)*255);
    const adjusted = '#' + [nr,ng,nb].map(v=>v.toString(16).padStart(2,'0')).join('');
    if (wcagContrast(adjusted, textHex) >= targetRatio) return adjusted;
    if (l >= 0.95 || l <= 0.05) break;
  }
  return colorHex;
}

const SEMANTIC_KEYS = ['brand','secondary','tertiary','success','caution','error','info'];

function applyWcagCorrections(suggestion) {
  const textLight = suggestion.coreColors?.find(c=>c.id==='text-primary')?.hex ?? '#1E1E1E';
  const textDark  = suggestion.coreColors?.find(c=>c.id==='text-primary-dark')?.hex ?? '#F5F5F5';
  const out = { ...suggestion };
  SEMANTIC_KEYS.forEach(key => {
    if (out[key])          out[key]          = enforceWcag(out[key],          textLight, true);
    const dm = `${key}Dm`;
    if (out[dm])           out[dm]           = enforceWcag(out[dm],           textDark,  false);
  });
  return out;
}

function processImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      URL.revokeObjectURL(url);
      resolve({ data: dataUrl.split(',')[1], mediaType: 'image/jpeg', preview: dataUrl });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
    img.src = url;
  });
}

function buildPreviewVars(s, isDark) {
  if (!s) return {};
  const base = {
    ...defaultTokens,
    brand:       s.brand       ?? defaultTokens.brand,
    brandDm:     s.brandDm     ?? s.brand    ?? defaultTokens.brandDm,
    secondary:   s.secondary   ?? defaultTokens.secondary,
    secondaryDm: s.secondaryDm ?? s.secondary ?? defaultTokens.secondaryDm,
    tertiary:    s.tertiary    ?? defaultTokens.tertiary,
    tertiaryDm:  s.tertiaryDm  ?? s.tertiary  ?? defaultTokens.tertiaryDm,
    success:     s.success     ?? defaultTokens.success,
    successDm:   s.successDm   ?? s.success   ?? defaultTokens.successDm,
    caution:     s.caution     ?? defaultTokens.caution,
    cautionDm:   s.cautionDm   ?? s.caution   ?? defaultTokens.cautionDm,
    error:       s.error       ?? defaultTokens.error,
    errorDm:     s.errorDm     ?? s.error     ?? defaultTokens.errorDm,
    info:        s.info        ?? defaultTokens.info,
    infoDm:      s.infoDm      ?? s.info      ?? defaultTokens.infoDm,
    fontDisplay: s.fontDisplay ?? defaultTokens.fontDisplay,
    fontBody:    s.fontBody    ?? defaultTokens.fontBody,
    radiusSm:    s.radiusSm    ?? defaultTokens.radiusSm,
    radiusMd:    s.radiusMd    ?? defaultTokens.radiusMd,
    radiusLg:    s.radiusLg    ?? defaultTokens.radiusLg,
    radiusPill:  s.radiusPill  ?? defaultTokens.radiusPill,
    shadow:      s.shadow      ?? defaultTokens.shadow,
    darkMode:    isDark,
    coreColors: s.coreColors?.length
      ? defaultTokens.coreColors.map(existing => {
          const hit = s.coreColors.find(c => c.id === existing.id);
          return hit ? { ...existing, hex: hit.hex } : existing;
        })
      : defaultTokens.coreColors,
  };
  return buildCssVars(base);
}

// Inline components preview — more useful than dashboard for validating tokens
function ComponentsPreview() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--ds-font-body)', background: 'var(--ds-surface)', minHeight: '100%' }}>
      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ds-neutral-400)', marginBottom: 2 }}>Buttons</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button className="ds-btn primary">Primary</button>
          <button className="ds-btn secondary">Secondary</button>
          <button className="ds-btn tertiary">Tertiary</button>
          <button className="ds-btn ghost">Ghost</button>
          <button className="ds-btn danger">Danger</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ds-btn primary sm">Small</button>
          <button className="ds-btn primary">Default</button>
          <button className="ds-btn primary lg">Large</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ds-neutral-400)', marginBottom: 2 }}>Tabs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="ds-tab-row">
            {['Overview','Analytics','Settings'].map((t, i) => (
              <button key={t} className={`ds-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <div className="ds-tab-row enclosed" style={{ display: 'inline-flex' }}>
            {['List','Grid','Board'].map((t, i) => (
              <button key={t} className={`ds-tab ${tab === i + 10 ? 'active' : ''}`} onClick={() => setTab(i + 10)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ds-neutral-400)', marginBottom: 2 }}>Badges</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span className="ds-badge brand">Primary</span>
          <span className="ds-badge success">Success</span>
          <span className="ds-badge caution">Caution</span>
          <span className="ds-badge danger">Error</span>
          <span className="ds-badge info">Info</span>
          <span className="ds-badge neutral">Neutral</span>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ds-neutral-400)', marginBottom: 2 }}>Form</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ds-neutral-800)' }}>Email address</label>
          <input className="ds-input" placeholder="you@company.com" readOnly style={{ maxWidth: 300 }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ds-neutral-400)', marginBottom: 2 }}>Card</div>
        <div className="ds-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-neutral-900)', fontFamily: 'var(--ds-font-display)' }}>Team plan</div>
          <div style={{ fontSize: 12, color: 'var(--ds-neutral-600)' }}>Everything in Pro, plus unlimited seats and priority support.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button className="ds-btn primary sm">Upgrade</button>
            <button className="ds-btn ghost sm">Learn more</button>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ds-neutral-400)', marginBottom: 2 }}>Typography</div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--ds-font-display)', color: 'var(--ds-neutral-900)', lineHeight: 1.2 }}>Display heading</div>
        <div style={{ fontSize: 14, color: 'var(--ds-neutral-800)', lineHeight: 1.6 }}>Body text — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</div>
        <div style={{ fontSize: 12, color: 'var(--ds-neutral-600)', lineHeight: 1.5 }}>Secondary / muted text for captions and supporting copy.</div>
      </div>
    </div>
  );
}

// Editable color swatch — dot opens native color picker, text field accepts hex
function EditableSwatch({ hex, onChange }) {
  const colorRef = useRef(null);
  const [localHex, setLocalHex] = useState(hex || '');

  useEffect(() => { setLocalHex(hex || ''); }, [hex]);

  if (!hex) return <span className="ba-tl-hex">—</span>;

  const validHex = /^#[0-9a-fA-F]{6}$/.test(localHex) ? localHex : hex;

  function handleText(e) {
    const v = e.target.value;
    setLocalHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  }

  return (
    <div className="ba-tl-val ba-tl-editable">
      <div className="ba-tl-dot-wrap" onClick={() => colorRef.current?.click()} title="Open color picker">
        <div className="ba-tl-dot" style={{ background: localHex || hex }} />
        <input
          ref={colorRef}
          type="color"
          value={validHex}
          onChange={e => { const v = e.target.value; setLocalHex(v); onChange(v); }}
          className="ba-color-input"
          onClick={e => e.stopPropagation()}
        />
      </div>
      <input
        type="text"
        className="ba-tl-hex-input"
        value={localHex}
        onChange={handleText}
        maxLength={7}
        spellCheck={false}
      />
    </div>
  );
}

function EditableDualRow({ label, lightKey, darkKey, light, dark, onEdit }) {
  return (
    <div className="ba-tl-dual-row">
      <span className="ba-tl-name">{label}</span>
      <EditableSwatch hex={light} onChange={v => onEdit(lightKey, v)} />
      <EditableSwatch hex={dark}  onChange={v => onEdit(darkKey, v)} />
    </div>
  );
}

function EditableSingleRow({ label, id, hex, onEdit }) {
  return (
    <div className="ba-tl-single-row">
      <EditableSwatch hex={hex} onChange={v => onEdit(id, v)} />
      <span className="ba-tl-name ba-tl-name-muted">{label}</span>
    </div>
  );
}

function countTokens(s) {
  if (!s) return 0;
  const pairs = ['brand','secondary','tertiary','success','caution','error','info'];
  const cores = s.coreColors?.length ?? 0;
  return pairs.length * 2 + cores + 5;
}

export default function BrandAnalyzer({ onClose, onApply }) {
  const [images, setImages]                   = useState([]);
  const [brandDescription, setBrandDescription] = useState('');
  const [phase, setPhase]                     = useState('upload');
  const [suggestion, setSuggestion]           = useState(null);
  const [originalSuggestion, setOriginalSuggestion] = useState(null);
  const [errorMsg, setErrorMsg]               = useState('');
  const [dragOver, setDragOver]               = useState(false);
  const [previewDark, setPreviewDark]         = useState(true);
  const [previewScene, setPreviewScene]       = useState('components');
  const fileRef = useRef(null);

  async function addFiles(files) {
    const remaining = 5 - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const processed = await Promise.all(toAdd.map(processImage));
    setImages(prev => [...prev, ...processed]);
  }

  function removeImage(idx) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  function editToken(key, value) {
    setSuggestion(s => ({ ...s, [key]: value }));
    setPreviewDark(key.endsWith('Dm'));
  }

  function editCoreColor(id, value) {
    setSuggestion(s => ({
      ...s,
      coreColors: (s.coreColors ?? []).map(c => c.id === id ? { ...c, hex: value } : c),
    }));
  }

  function resetToOriginal() {
    setSuggestion({ ...originalSuggestion });
    setPreviewDark(originalSuggestion.darkMode ?? true);
  }

  const hasEdits = originalSuggestion && JSON.stringify(suggestion) !== JSON.stringify(originalSuggestion);

  async function analyze() {
    setPhase('analyzing');
    setErrorMsg('');
    try {
      const res = await fetch('/api/analyze-brand', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          images: images.map(({ data, mediaType }) => ({ data, mediaType })),
          brandDescription: brandDescription.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Analysis failed');
      const corrected = applyWcagCorrections(json.suggestion);
      setSuggestion(corrected);
      setOriginalSuggestion(corrected);
      setPreviewDark(corrected.darkMode ?? true);
      setPhase('results');
    } catch (err) {
      setErrorMsg(err.message);
      setPhase('error');
    }
  }

  function retry() {
    setPhase('upload');
    setErrorMsg('');
    setSuggestion(null);
    setOriginalSuggestion(null);
  }

  function apply() {
    onApply(suggestion);
    onClose();
  }

  const isLarge     = phase === 'results' && !!suggestion;
  const previewVars = isLarge ? buildPreviewVars(suggestion, previewDark) : null;
  const tokenCount  = countTokens(suggestion);

  const SURFACE_IDS = ['bg-dark','bg-light','surface','text-primary','text-primary-dark','text-secondary','border','neutral'];

  return (
    <div className="ba-overlay" onClick={onClose}>
      <div className={`ba-modal${isLarge ? ' ba-modal-large' : ''}`} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="ba-header">
          <div>
            <div className="ba-title">Analyze Brand</div>
            <div className="ba-subtitle">
              {isLarge
                ? `${tokenCount} tokens extracted · click any color to edit before applying`
                : 'Upload brand images and describe your brand for AI-suggested tokens'}
            </div>
          </div>
          <button className="ba-close" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="ba-body">

          {/* ── Upload / Error ── */}
          {(phase === 'upload' || phase === 'error') && (
            <div className="ba-upload-phase">
              {phase === 'error' && (
                <div className="ba-error-banner">{errorMsg}</div>
              )}

              <label
                className={`ba-dropzone${dragOver ? ' drag-over' : ''}${images.length >= 5 ? ' full' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              >
                <ImageIcon size={28} className="ba-drop-icon" />
                <span className="ba-drop-text">
                  {images.length >= 5 ? 'Maximum 5 images' : 'Drop brand images here or browse'}
                </span>
                <span className="ba-drop-hint">Up to 5 images · JPG, PNG, WebP — logos, UI screenshots, brand guidelines</span>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={e => addFiles(e.target.files)}
                />
              </label>

              {images.length > 0 && (
                <div className="ba-thumbs">
                  {images.map((img, i) => (
                    <div key={i} className="ba-thumb">
                      <img src={img.preview} alt={`brand ${i + 1}`} />
                      <button className="ba-thumb-remove" onClick={() => removeImage(i)}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="ba-thumb ba-thumb-add" title="Add another image">
                      <Upload size={16} className="ba-thumb-add-icon" />
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={e => addFiles(e.target.files)}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Brand description */}
              <div className="ba-desc-field">
                <label className="ba-desc-label">Brand description <span className="ba-desc-optional">(optional but helps a lot)</span></label>
                <textarea
                  className="ba-desc-textarea"
                  placeholder={"Describe your brand's personality, industry, and target audience.\n\nExamples:\n• \"Luxury fintech app for high-net-worth investors. Dark, premium, minimal.\"\n• \"Friendly SaaS tool for small business owners. Warm, approachable, light mode.\"\n• \"Bold sports brand targeting Gen Z. High contrast, energetic, dark mode.\""}
                  value={brandDescription}
                  onChange={e => setBrandDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <button
                className="ba-analyze-btn"
                disabled={images.length === 0 && !brandDescription.trim()}
                onClick={analyze}
              >
                Analyze brand
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* ── Analyzing ── */}
          {phase === 'analyzing' && (
            <div className="ba-analyzing-phase">
              <div className="ba-spinner" />
              <div className="ba-analyzing-title">Reading your brand…</div>
              <div className="ba-analyzing-sub">Extracting colors, style signals, and token suggestions</div>
            </div>
          )}

          {/* ── Results (large 2-panel) ── */}
          {phase === 'results' && suggestion && (
            <div className="ba-results-large">

              {/* Left: live preview */}
              <div className="ba-preview-panel">
                <div className="ba-preview-topbar">
                  <div className="ba-preview-scenes">
                    <button
                      className={`ba-scene-btn${previewScene === 'components' ? ' active' : ''}`}
                      onClick={() => setPreviewScene('components')}
                    >
                      <Layers size={11} /> Components
                    </button>
                    <button
                      className={`ba-scene-btn${previewScene === 'dashboard' ? ' active' : ''}`}
                      onClick={() => setPreviewScene('dashboard')}
                    >
                      <LayoutDashboard size={11} /> Dashboard
                    </button>
                  </div>
                  <div className="ba-preview-toggle">
                    <button
                      className={`ba-pt-btn${previewDark ? ' active' : ''}`}
                      onClick={() => setPreviewDark(true)}
                    >
                      <Moon size={10} /> Dark
                    </button>
                    <button
                      className={`ba-pt-btn${!previewDark ? ' active' : ''}`}
                      onClick={() => setPreviewDark(false)}
                    >
                      <Sun size={10} /> Light
                    </button>
                  </div>
                </div>
                <div
                  className="ba-preview-body"
                  style={previewVars}
                  data-dark={previewDark ? 'true' : undefined}
                >
                  {previewScene === 'dashboard'
                    ? <ThemePreview />
                    : <ComponentsPreview />
                  }
                </div>
              </div>

              {/* Right: token breakdown (editable) */}
              <div className="ba-tokens-panel">
                <div className="ba-tokens-scroll">

                  <div className="ba-edit-hint">
                    <span>Click any color swatch to adjust it</span>
                    {hasEdits && (
                      <button className="ba-reset-edits-btn" onClick={resetToOriginal} title="Reset all edits back to the original AI suggestion">
                        <RotateCcw size={10} /> Reset to original
                      </button>
                    )}
                  </div>

                  {/* Action Colors */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Action Colors</div>
                    <div className="ba-tl-col-heads">
                      <span />
                      <span>Light mode</span>
                      <span>Dark mode</span>
                    </div>
                    <EditableDualRow label="Primary"   lightKey="brand"     darkKey="brandDm"     light={suggestion.brand}     dark={suggestion.brandDm     ?? suggestion.brand}     onEdit={editToken} />
                    <EditableDualRow label="Secondary" lightKey="secondary" darkKey="secondaryDm" light={suggestion.secondary} dark={suggestion.secondaryDm ?? suggestion.secondary} onEdit={editToken} />
                    <EditableDualRow label="Tertiary"  lightKey="tertiary"  darkKey="tertiaryDm"  light={suggestion.tertiary}  dark={suggestion.tertiaryDm  ?? suggestion.tertiary}  onEdit={editToken} />
                  </div>

                  {/* Semantic Colors */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Semantic Colors</div>
                    <div className="ba-tl-col-heads">
                      <span />
                      <span>Light mode</span>
                      <span>Dark mode</span>
                    </div>
                    <EditableDualRow label="Success" lightKey="success" darkKey="successDm" light={suggestion.success} dark={suggestion.successDm ?? suggestion.success} onEdit={editToken} />
                    <EditableDualRow label="Caution" lightKey="caution" darkKey="cautionDm" light={suggestion.caution} dark={suggestion.cautionDm ?? suggestion.caution} onEdit={editToken} />
                    <EditableDualRow label="Error"   lightKey="error"   darkKey="errorDm"   light={suggestion.error}   dark={suggestion.errorDm   ?? suggestion.error}   onEdit={editToken} />
                    <EditableDualRow label="Info"    lightKey="info"    darkKey="infoDm"    light={suggestion.info}    dark={suggestion.infoDm    ?? suggestion.info}    onEdit={editToken} />
                  </div>

                  {/* Surfaces & Text */}
                  {suggestion.coreColors?.length > 0 && (
                    <div className="ba-tl-section">
                      <div className="ba-tl-section-label">Surfaces & Text</div>
                      {SURFACE_IDS.map(id => {
                        const c = suggestion.coreColors.find(x => x.id === id);
                        return c ? <EditableSingleRow key={id} id={id} label={c.label} hex={c.hex} onEdit={editCoreColor} /> : null;
                      })}
                    </div>
                  )}

                  {/* Shape & Shadow */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Shape & Shadow</div>

                    {/* Radius — brand-colored boxes + steppers */}
                    <div className="ba-radius-row">
                      {[['SM','radiusSm',suggestion.radiusSm],['MD','radiusMd',suggestion.radiusMd],['LG','radiusLg',suggestion.radiusLg]].map(([n, key, v]) => {
                        const idx = RADIUS_STOPS.indexOf(v ?? '');
                        return (
                          <div key={n} className="ba-radius-item">
                            <div
                              className="ba-radius-box"
                              style={{ borderRadius: v, background: suggestion.brand || '#0D99FF' }}
                            />
                            <span className="ba-radius-label">{n} · {v}</span>
                            <div className="ba-radius-steppers">
                              <button
                                className="ba-radius-step"
                                disabled={idx <= 0}
                                onClick={() => editToken(key, RADIUS_STOPS[Math.max(0, idx - 1)])}
                              >−</button>
                              <button
                                className="ba-radius-step"
                                disabled={idx >= RADIUS_STOPS.length - 1}
                                onClick={() => editToken(key, RADIUS_STOPS[Math.min(RADIUS_STOPS.length - 1, idx + 1)])}
                              >+</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shadow — card preview on light floor + toggle */}
                    <div className="ba-shadow-floor">
                      <div
                        className="ba-shadow-card"
                        style={{ borderRadius: suggestion.radiusMd ?? '6px', boxShadow: shadowValues[suggestion.shadow] ?? 'none' }}
                      >
                        <span className="ba-shadow-card-text">Card</span>
                      </div>
                      <div className="ba-shadow-toggle">
                        {[['none','Flat'],['sm','Subtle'],['md','Raised']].map(([val, label]) => (
                          <button
                            key={val}
                            className={`ba-shadow-opt${suggestion.shadow === val ? ' active' : ''}`}
                            onClick={() => editToken('shadow', val)}
                          >{label}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Typography</div>
                    <div className="ba-font-row">
                      <div className="ba-font-item">
                        <span className="ba-font-role">Display</span>
                        <span className="ba-font-name" style={{ fontFamily: suggestion.fontDisplay }}>
                          {suggestion.fontDisplay.split(',')[0].replace(/'/g, '')}
                        </span>
                      </div>
                      <div className="ba-font-item">
                        <span className="ba-font-role">Body</span>
                        <span className="ba-font-name" style={{ fontFamily: suggestion.fontBody }}>
                          {suggestion.fontBody.split(',')[0].replace(/'/g, '')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {suggestion.reasoning && (
                    <div className="ba-reasoning">"{suggestion.reasoning}"</div>
                  )}

                </div>

                <div className="ba-results-footer">
                  <button className="ba-retry-btn" onClick={retry}>
                    <RotateCcw size={13} /> Re-analyze
                  </button>
                  <button className="ba-apply-btn" onClick={apply}>
                    Apply to canvas <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
