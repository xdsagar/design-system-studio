import { useState, useMemo } from 'react';
import { X, Sun, Moon, Folder, ChevronRight, ChevronDown } from 'lucide-react';

export default function ComponentsBrowser({ cssVars, darkMode, setDarkMode, onClose, components }) {
  const [active, setActive] = useState(components[0].id);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    search.trim()
      ? components.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
      : components,
    [search, components]
  );

  const activeComp = components.find(c => c.id === active) ?? components[0];
  const { Story } = activeComp;

  return (
    <div className="cb-overlay">
      <div className="cb-header">
        <div className="cb-header-left">
          <span className="cb-title">Components</span>
          <span className="cb-breadcrumb-sep">/</span>
          <span className="cb-breadcrumb-name">{activeComp.label}</span>
        </div>
        <div className="cb-header-right">
          <button
            className="canvas-mode-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light' : 'Switch to dark'}
          >
            {darkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button className="cb-close-btn" onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="cb-body">
        <nav className="canvas-sidenav">
          <div className="story-search-wrap">
            <input
              className="story-search-input"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="story-section-header">
            <ChevronDown size={11} style={{ flexShrink: 0 }} />
            <span>Components</span>
            <span className="story-section-count">{filtered.length}</span>
          </div>
          <div className="story-list">
            {filtered.map(comp => (
              <button
                key={comp.id}
                className={`story-item${active === comp.id ? ' active' : ''}`}
                onClick={() => setActive(comp.id)}
              >
                <span className="story-item-chevron"><ChevronRight size={10} /></span>
                <span className="story-item-icon"><Folder size={12} /></span>
                <span className="story-item-label">{comp.label}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="story-empty">No results for "{search}"</div>
            )}
          </div>
        </nav>

        <div className="canvas-body" style={cssVars} data-dark={darkMode ? 'true' : undefined}>
          <Story key={active} />
        </div>
      </div>
    </div>
  );
}
