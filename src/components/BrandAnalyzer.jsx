import { useState, useRef } from 'react';
import { X, Upload, RotateCcw, ArrowRight, ImageIcon } from 'lucide-react';

// Resize + base64-encode an image file before sending to the API
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

function ColorSwatch({ label, hex }) {
  return (
    <div className="ba-swatch">
      <div className="ba-swatch-dot" style={{ background: hex }} />
      <div>
        <div className="ba-swatch-label">{label}</div>
        <div className="ba-swatch-hex">{hex}</div>
      </div>
    </div>
  );
}

function RadiusPreview({ sm, md, lg }) {
  return (
    <div className="ba-radius-row">
      {[['SM', sm], ['MD', md], ['LG', lg]].map(([name, val]) => (
        <div key={name} className="ba-radius-item">
          <div className="ba-radius-box" style={{ borderRadius: val }} />
          <span className="ba-radius-label">{name} · {val}</span>
        </div>
      ))}
    </div>
  );
}

export default function BrandAnalyzer({ onClose, onApply }) {
  const [images, setImages]     = useState([]); // [{preview, data, mediaType}]
  const [phase, setPhase]       = useState('upload'); // upload | analyzing | results | error
  const [suggestion, setSuggestion] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  async function addFiles(files) {
    const remaining = 3 - images.length;
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

  return (
    <div className="ba-overlay" onClick={onClose}>
      <div className="ba-modal" onClick={e => e.stopPropagation()}>

        <div className="ba-header">
          <div>
            <div className="ba-title">Analyze Brand</div>
            <div className="ba-subtitle">Upload brand images to get AI-suggested design tokens</div>
          </div>
          <button className="ba-close" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="ba-body">

          {/* ── Upload ── */}
          {(phase === 'upload' || phase === 'error') && (
            <div className="ba-upload-phase">
              {phase === 'error' && (
                <div className="ba-error-banner">
                  {errorMsg}
                </div>
              )}

              <label
                className={`ba-dropzone${dragOver ? ' drag-over' : ''}${images.length >= 3 ? ' full' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              >
                <ImageIcon size={28} className="ba-drop-icon" />
                <span className="ba-drop-text">
                  {images.length >= 3 ? 'Maximum 3 images' : 'Drop images here or browse'}
                </span>
                <span className="ba-drop-hint">Up to 3 images · JPG, PNG, WebP</span>
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
                  {images.length < 3 && (
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

          {/* ── Results ── */}
          {phase === 'results' && suggestion && (
            <div className="ba-results-phase">
              <div className="ba-results-scroll">

                <div className="ba-result-section">
                  <div className="ba-result-label">Brand Colors</div>
                  <div className="ba-swatches">
                    <ColorSwatch label="Primary"   hex={suggestion.brand}     />
                    <ColorSwatch label="Secondary" hex={suggestion.secondary} />
                    <ColorSwatch label="Tertiary"  hex={suggestion.tertiary}  />
                  </div>
                </div>

                <div className="ba-result-section">
                  <div className="ba-result-label">Status Colors</div>
                  <div className="ba-swatches">
                    <ColorSwatch label="Success" hex={suggestion.success} />
                    <ColorSwatch label="Caution" hex={suggestion.caution} />
                    <ColorSwatch label="Error"   hex={suggestion.error}   />
                  </div>
                </div>

                <div className="ba-result-section">
                  <div className="ba-result-label">Shape & Shadow</div>
                  <RadiusPreview sm={suggestion.radiusSm} md={suggestion.radiusMd} lg={suggestion.radiusLg} />
                  <div className="ba-meta-row">
                    <span className="ba-meta-chip">Shadow · {suggestion.shadow}</span>
                    <span className="ba-meta-chip">{suggestion.darkMode ? 'Dark mode' : 'Light mode'}</span>
                  </div>
                </div>

                <div className="ba-result-section">
                  <div className="ba-result-label">Typography</div>
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
          )}

        </div>
      </div>
    </div>
  );
}
