import { useState } from 'react';
import {
  LayoutDashboard, BarChart2, Users, FileText, Settings,
  Search, Bell, TrendingUp, TrendingDown, Plus, Download,
  MoreVertical, AlertCircle, ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { Icon: LayoutDashboard, label: 'Dashboard' },
  { Icon: BarChart2,       label: 'Analytics', active: true },
  { Icon: Users,           label: 'Team' },
  { Icon: FileText,        label: 'Reports' },
  { Icon: Settings,        label: 'Settings' },
];

const STATS = [
  { label: 'Total Revenue',   value: '$48,295', delta: '+12.5%', up: true  },
  { label: 'Active Users',    value: '3,842',   delta: '+8.1%',  up: true  },
  { label: 'Conversion Rate', value: '4.7%',    delta: '−0.3%',  up: false },
  { label: 'Avg. Session',    value: '3m 42s',  delta: '+0.9%',  up: true  },
];

const MEMBERS = [
  { name: 'Aria Johnson', email: 'aria@example.com',   role: 'Admin',  status: 'active',   initials: 'AJ' },
  { name: 'Marcus Chen',  email: 'marcus@example.com', role: 'Editor', status: 'active',   initials: 'MC' },
  { name: 'Sofia Rivera', email: 'sofia@example.com',  role: 'Viewer', status: 'pending',  initials: 'SR' },
  { name: 'James Park',   email: 'james@example.com',  role: 'Editor', status: 'inactive', initials: 'JP' },
  { name: 'Leila Nasser', email: 'leila@example.com',  role: 'Admin',  status: 'active',   initials: 'LN' },
];

export default function ThemePreview() {
  const [tog1, setTog1] = useState(true);
  const [tog2, setTog2] = useState(false);

  return (
    <div className="tp-shell">

      {/* ── Sidebar */}
      <aside className="tp-sidebar">
        <div className="tp-sidebar-brand">
          <div className="tp-brand-mark" />
          <span className="tp-brand-name">Acme Inc</span>
        </div>

        <nav className="tp-nav">
          {NAV_ITEMS.map(({ Icon, label, active }) => (
            <div key={label} className={`tp-nav-item${active ? ' active' : ''}`}>
              <Icon size={15} strokeWidth={1.8} />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="tp-sidebar-footer">
          <div className="tp-sidebar-user">
            <div className="tp-user-avatar">AJ</div>
            <div className="tp-user-meta">
              <div className="tp-user-name-sm">Aria Johnson</div>
              <div className="tp-user-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main */}
      <div className="tp-main">

        {/* Top bar */}
        <header className="tp-topbar">
          <div className="tp-topbar-search">
            <Search size={13} className="tp-search-icon" />
            <input className="tp-search-input" placeholder="Search…" readOnly />
          </div>
          <div className="tp-topbar-right">
            <button className="tp-icon-btn">
              <Bell size={15} />
              <span className="tp-notif-dot" />
            </button>
          </div>
        </header>

        {/* Scrollable page */}
        <div className="tp-page">

          {/* Page heading */}
          <div className="tp-page-header">
            <div>
              <div className="tp-breadcrumb">
                <span>Dashboard</span>
                <span className="tp-breadcrumb-sep">/</span>
                <span className="tp-breadcrumb-active">Analytics</span>
              </div>
              <h1 className="tp-page-title">Analytics</h1>
            </div>
            <div className="tp-page-actions">
              <button className="tp-btn tp-btn-ghost">
                <Download size={13} /> Export
              </button>
              <button className="tp-btn tp-btn-primary">
                <Plus size={13} /> New Report
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="tp-stats-grid">
            {STATS.map(({ label, value, delta, up }) => (
              <div key={label} className="tp-stat-card">
                <div className="tp-stat-label">{label}</div>
                <div className="tp-stat-value">{value}</div>
                <div className={`tp-stat-delta${up ? ' up' : ' down'}`}>
                  {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {delta} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Lower row: table + right panel */}
          <div className="tp-lower-row">

            {/* Table card */}
            <div className="tp-card tp-table-card">
              <div className="tp-card-header">
                <span className="tp-card-title">Team Members</span>
                <button className="tp-btn tp-btn-ghost tp-btn-sm">
                  <Plus size={11} /> Add member
                </button>
              </div>
              <table className="tp-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.map(m => (
                    <tr key={m.email}>
                      <td>
                        <div className="tp-cell-user">
                          <div className="tp-cell-avatar">{m.initials}</div>
                          <div>
                            <div className="tp-cell-name">{m.name}</div>
                            <div className="tp-cell-email">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="tp-role-chip">{m.role}</span></td>
                      <td><span className={`tp-status-badge ${m.status}`}>{m.status}</span></td>
                      <td>
                        <button className="tp-row-btn"><MoreVertical size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right column */}
            <div className="tp-right-col">

              {/* Form card */}
              <div className="tp-card">
                <div className="tp-card-header">
                  <span className="tp-card-title">Profile settings</span>
                </div>
                <div className="tp-form">
                  <div className="tp-field">
                    <label className="tp-label">Display name</label>
                    <input className="tp-input" defaultValue="Aria Johnson" readOnly />
                  </div>
                  <div className="tp-field">
                    <label className="tp-label">Role</label>
                    <div className="tp-select-wrap">
                      <select className="tp-select">
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Viewer</option>
                      </select>
                      <ChevronDown size={12} className="tp-select-caret" />
                    </div>
                  </div>
                  <div className="tp-toggle-row">
                    <div>
                      <div className="tp-toggle-label">Email notifications</div>
                      <div className="tp-toggle-hint">Receive activity updates</div>
                    </div>
                    <button className={`tp-toggle${tog1 ? ' on' : ''}`} onClick={() => setTog1(v => !v)}>
                      <span className="tp-toggle-knob" />
                    </button>
                  </div>
                  <div className="tp-toggle-row">
                    <div>
                      <div className="tp-toggle-label">Two-factor auth</div>
                      <div className="tp-toggle-hint">Extra account security</div>
                    </div>
                    <button className={`tp-toggle${tog2 ? ' on' : ''}`} onClick={() => setTog2(v => !v)}>
                      <span className="tp-toggle-knob" />
                    </button>
                  </div>
                  <button className="tp-btn tp-btn-primary" style={{width:'100%',justifyContent:'center'}}>
                    Save changes
                  </button>
                </div>
              </div>

              {/* Callout */}
              <div className="tp-callout tp-callout-warning">
                <AlertCircle size={14} className="tp-callout-icon" />
                <div>
                  <div className="tp-callout-title">Usage limit approaching</div>
                  <div className="tp-callout-body">You've used 82% of your plan's API calls this month.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
