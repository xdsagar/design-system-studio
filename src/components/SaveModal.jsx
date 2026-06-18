import { Download, Upload, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { exportTokens } from '../utils/tokenTemplate';
import { clearSavedTokens } from '../hooks/useTokens';

export default function SaveModal({ onClose, onImport, tokens }) {
  function handleExport() {
    exportTokens(tokens);
  }

  function handleClear() {
    if (window.confirm('This will reset your design system to the defaults. Are you sure?')) {
      clearSavedTokens();
      window.location.reload();
    }
  }

  return (
    <div className="save-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="save-modal">

        <div className="save-modal-header">
          <span className="save-modal-title">Your progress</span>
          <button className="save-modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="save-modal-body">

          {/* Auto-save status */}
          <div className="save-status-card">
            <CheckCircle2 size={18} className="save-status-icon" />
            <div>
              <div className="save-status-title">Auto-saved to this browser</div>
              <div className="save-status-sub">
                Your design system saves automatically as you work. Refreshing or closing this tab won't lose your progress.
              </div>
            </div>
          </div>

          <div className="save-section-label">Take your work with you</div>
          <p className="save-section-desc">
            Browser storage is tied to this device. Export a JSON file to continue on another device, share with your team, or keep as a backup.
          </p>

          <div className="save-action-row">
            <button className="save-btn save-btn-primary" onClick={handleExport}>
              <Download size={13} />
              Export tokens
            </button>
            <button className="save-btn save-btn-ghost" onClick={() => { onClose(); onImport(); }}>
              <Upload size={13} />
              Import file
            </button>
          </div>

          <div className="save-divider" />

          <div className="save-clear-row">
            <div className="save-clear-info">
              <AlertTriangle size={12} className="save-clear-icon" />
              <span>Reset to defaults</span>
            </div>
            <button className="save-btn save-btn-danger" onClick={handleClear}>
              Clear saved data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
