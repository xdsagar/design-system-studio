import { useState, useRef } from 'react';
import { Check, X, FileUp } from 'lucide-react';
import { parseImportFile } from '../utils/tokenTemplate';

export default function ImportModal({ onClose, onImport }) {
  const [phase, setPhase]   = useState('idle'); // idle | loading | success | fail
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  async function processFile(file) {
    if (!file || !file.name.endsWith('.json')) {
      setError('Please select a .json file.');
      setPhase('fail');
      return;
    }
    setPhase('loading');
    // brief pause so the loading state is visible
    await new Promise(r => setTimeout(r, 700));
    try {
      const parsed = await parseImportFile(file);
      setResult(parsed);
      setPhase('success');
    } catch (err) {
      setError(err.message);
      setPhase('fail');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleApply() {
    if (result) onImport(result.tokens);
    onClose();
  }

  const allGood = result && result.found === result.total;

  return (
    <div className="import-overlay" onClick={onClose}>
      <div className="import-modal" onClick={e => e.stopPropagation()}>

        <div className="import-modal-header">
          <span className="import-modal-title">Import token template</span>
          <button className="import-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="import-modal-body">

          {phase === 'idle' && (
            <label
              className={`import-dropzone${dragOver ? ' drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <FileUp size={28} style={{color:'var(--shell-text-3)'}} />
              <span className="import-dropzone-text">
                Drop your template here or{' '}
                <span style={{color:'var(--shell-accent)'}}>browse</span>
              </span>
              <span className="import-dropzone-hint">.json files only</span>
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                style={{display:'none'}}
                onChange={e => processFile(e.target.files[0])}
              />
            </label>
          )}

          {phase === 'loading' && (
            <div className="import-loading">
              <div className="import-spinner" />
              <span className="import-loading-text">Reading token file…</span>
            </div>
          )}

          {phase === 'success' && result && (
            <div className="import-result-wrap">
              <div className="import-result-icon success"><Check size={22} /></div>
              <div className="import-result-title">Import successful</div>

              <div className="import-token-count">
                <span className={`import-count-num ${allGood ? 'success' : 'partial'}`}>
                  {result.found}
                </span>
                <span className="import-count-sep">/</span>
                <span className="import-count-total">{result.total}</span>
                <span className="import-count-label">tokens loaded</span>
              </div>

              {!allGood && (
                <div className="import-missing-note">
                  {result.total - result.found} token{result.total - result.found !== 1 ? 's' : ''} missing — defaults will be used.
                </div>
              )}

              <label className="import-ack-label">
                <input
                  type="checkbox"
                  className="import-ack-check"
                  checked={acknowledged}
                  onChange={e => setAcknowledged(e.target.checked)}
                />
                <span>
                  I understand this will overwrite all current canvas tokens.
                  Any changes made after importing will only be reflected in the download.
                </span>
              </label>
            </div>
          )}

          {phase === 'fail' && (
            <div className="import-result-wrap">
              <div className="import-result-icon fail"><X size={22} /></div>
              <div className="import-result-title">Import failed</div>
              <div className="import-fail-desc">{error}</div>
              <button className="import-retry-btn" onClick={() => setPhase('idle')}>
                Try again
              </button>
            </div>
          )}

        </div>

        {phase === 'success' && (
          <div className="import-modal-footer">
            <button className="import-cancel-btn" onClick={onClose}>Cancel</button>
            <button
              className="import-apply-btn"
              onClick={handleApply}
              disabled={!acknowledged}
            >
              Apply to canvas
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
