import { useState, useRef } from 'react';
import { X, Upload, RotateCcw, ArrowRight, ImageIcon, Sun, Moon } from 'lucide-react';
import { buildCssVars } from '../hooks/useTokens';
import { defaultTokens } from '../utils/tokens';
import ThemePreview from './ThemePreview';

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

function DualRow({ label, light, dark }) {
  return (
    <div className="ba-tl-dual-row">
      <span className="ba-tl-name">{label}</span>
      <div className="ba-tl-val">
        {light && <div className="ba-tl-dot" style={{ background: light }} />}
        <span className="ba-tl-hex">{light ?? '—'}</span>
      </div>
      <div className="ba-tl-val">
        {dark && <div className="ba-tl-dot" style={{ background: dark }} />}
        <span className="ba-tl-hex">{dark ?? '—'}</span>
      </div>
    </div>
  );
}

function SingleRow({ label, hex }) {
  return (
    <div className="ba-tl-single-row">
      <div className="ba-tl-val">
        {hex && <div className="ba-tl-dot" style={{ background: hex }} />}
        <span className="ba-tl-hex">{hex ?? '—'}</span>
      </div>
      <span className="ba-tl-name ba-tl-name-muted">{label}</span>
    </div>
  );
}

function countTokens(s) {
  if (!s) return 0;
  const pairs = ['brand','secondary','tertiary','success','caution','error','info'];
  const cores = s.coreColors?.length ?? 0;
  return pairs.length * 2 + cores + 5; // pairs×2 + coreColors + shape/font fields
}

export default function BrandAnalyzer({ onClose, onApply }) {
  const [images, setImages]           = useState([]);
  const [phase, setPhase]             = useState('upload');
  const [suggestion, setSuggestion]   = useState(null);
  const [errorMsg, setErrorMsg]       = useState('');
  const [dragOver, setDragOver]       = useState(false);
  const [previewDark, setPreviewDark] = useState(true);
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

  async function analyze() {
    setPhase('analyzing');
    setErrorMsg('');
    try {
      const res = await fetch('/api/analyze-brand', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ images: images.map(({ data, mediaType }) => ({ data, mediaType })) }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Analysis failed');
      setSuggestion(json.suggestion);
      setPreviewDark(json.suggestion.darkMode ?? true);
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
                ? `${tokenCount} tokens extracted · review before applying`
                : 'Upload brand images to get AI-suggested design tokens'}
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
                className={`ba-dropzone${dragOver ? ' drag-over' : ''}${images.length >= 3 ? ' full' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              >
                <ImageIcon size={28} className="ba-drop-icon" />
                <span className="ba-drop-text">
                  {images.length >= 5 ? 'Maximum 5 images' : 'Drop images here or browse'}
                </span>
                <span className="ba-drop-hint">Up to 5 images · JPG, PNG, WebP</span>
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

              <button
                className="ba-analyze-btn"
                disabled={images.length === 0}
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
                  <span>Live Preview</span>
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
                <div className="ba-preview-body" style={previewVars}>
                  <ThemePreview />
                </div>
              </div>

              {/* Right: token breakdown */}
              <div className="ba-tokens-panel">
                <div className="ba-tokens-scroll">

                  {/* Action Colors */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Action Colors</div>
                    <div className="ba-tl-col-heads">
                      <span />
                      <span>Light mode</span>
                      <span>Dark mode</span>
                    </div>
                    <DualRow label="Primary"   light={suggestion.brand}     dark={suggestion.brandDm     ?? suggestion.brand}     />
                    <DualRow label="Secondary" light={suggestion.secondary} dark={suggestion.secondaryDm ?? suggestion.secondary} />
                    <DualRow label="Tertiary"  light={suggestion.tertiary}  dark={suggestion.tertiaryDm  ?? suggestion.tertiary}  />
                  </div>

                  {/* Semantic Colors */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Semantic Colors</div>
                    <div className="ba-tl-col-heads">
                      <span />
                      <span>Light mode</span>
                      <span>Dark mode</span>
                    </div>
                    <DualRow label="Success" light={suggestion.success} dark={suggestion.successDm ?? suggestion.success} />
                    <DualRow label="Caution" light={suggestion.caution} dark={suggestion.cautionDm ?? suggestion.caution} />
                    <DualRow label="Error"   light={suggestion.error}   dark={suggestion.errorDm   ?? suggestion.error}   />
                    <DualRow label="Info"    light={suggestion.info}    dark={suggestion.infoDm    ?? suggestion.info}    />
                  </div>

                  {/* Surfaces & Text */}
                  {suggestion.coreColors?.length > 0 && (
                    <div className="ba-tl-section">
                      <div className="ba-tl-section-label">Surfaces & Text</div>
                      {SURFACE_IDS.map(id => {
                        const c = suggestion.coreColors.find(x => x.id === id);
                        return c ? <SingleRow key={id} label={c.label} hex={c.hex} /> : null;
                      })}
                    </div>
                  )}

                  {/* Shape */}
                  <div className="ba-tl-section">
                    <div className="ba-tl-section-label">Shape & Shadow</div>
                    <div className="ba-radius-row">
                      {[['SM', suggestion.radiusSm], ['MD', suggestion.radiusMd], ['LG', suggestion.radiusLg]].map(([n, v]) => (
                        <div key={n} className="ba-radius-item">
                          <div className="ba-radius-box" style={{ borderRadius: v }} />
                          <span className="ba-radius-label">{n} · {v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ba-meta-row">
                      <span className="ba-meta-chip">Shadow · {suggestion.shadow}</span>
                      <span className="ba-meta-chip">{suggestion.darkMode ? 'Dark mode' : 'Light mode'}</span>
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
