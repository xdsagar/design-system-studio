import { useState } from 'react';
import {
  LayoutDashboard, BarChart2, Users, FileText, Settings,
  Search, Bell, TrendingUp, TrendingDown, Plus, Download,
  MoreVertical, AlertCircle, ChevronDown, Activity,
  CheckCircle2, Clock, XCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'analytics', Icon: BarChart2,       label: 'Analytics' },
  { id: 'team',      Icon: Users,           label: 'Team'      },
  { id: 'reports',   Icon: FileText,        label: 'Reports'   },
  { id: 'settings',  Icon: Settings,        label: 'Settings'  },
];

const OVERVIEW_STATS = [
  { label: 'Total Revenue',   value: '$48,295', delta: '+12.5%', up: true  },
  { label: 'Active Users',    value: '3,842',   delta: '+8.1%',  up: true  },
  { label: 'Conversion Rate', value: '4.7%',    delta: '−0.3%',  up: false },
  { label: 'Avg. Session',    value: '3m 42s',  delta: '+0.9%',  up: true  },
];

const ANALYTICS_STATS = [
  { label: 'Page Views',       value: '128,430', delta: '+18.2%', up: true  },
  { label: 'Unique Visitors',  value: '41,209',  delta: '+6.4%',  up: true  },
  { label: 'Bounce Rate',      value: '38.2%',   delta: '−4.1%',  up: true  },
  { label: 'Avg. Duration',    value: '2m 14s',  delta: '−0.3%',  up: false },
];

const CHART_BARS = [42, 67, 38, 85, 58, 92, 74, 61, 79, 55, 88, 70];
const CHART_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TOP_PAGES = [
  { path: '/dashboard',   views: '14,230', pct: 89 },
  { path: '/pricing',     views: '9,812',  pct: 61 },
  { path: '/docs/start',  views: '7,104',  pct: 44 },
  { path: '/blog',        views: '4,892',  pct: 31 },
  { path: '/settings',    views: '2,341',  pct: 15 },
];

const MEMBERS = [
  { name: 'Aria Johnson', email: 'aria@example.com',   role: 'Admin',  status: 'active',   initials: 'AJ' },
  { name: 'Marcus Chen',  email: 'marcus@example.com', role: 'Editor', status: 'active',   initials: 'MC' },
  { name: 'Sofia Rivera', email: 'sofia@example.com',  role: 'Viewer', status: 'pending',  initials: 'SR' },
  { name: 'James Park',   email: 'james@example.com',  role: 'Editor', status: 'inactive', initials: 'JP' },
  { name: 'Leila Nasser', email: 'leila@example.com',  role: 'Admin',  status: 'active',   initials: 'LN' },
];

const ACTIVITY = [
  { icon: CheckCircle2, color: 'success', text: 'Deployment completed successfully', time: '2m ago' },
  { icon: Users,        color: 'brand',   text: 'Sofia Rivera joined the workspace', time: '14m ago' },
  { icon: AlertCircle,  color: 'warning', text: 'API usage at 82% of monthly limit', time: '1h ago' },
  { icon: FileText,     color: 'neutral', text: 'Q3 Report was exported by Marcus',   time: '3h ago' },
  { icon: XCircle,      color: 'danger',  text: 'Build #204 failed on staging',       time: '5h ago' },
];

const REPORTS = [
  { title: 'Q2 Growth Summary',     status: 'ready',      date: 'Jun 10',  owner: 'AJ' },
  { title: 'User Retention Analysis',status: 'ready',     date: 'Jun 8',   owner: 'MC' },
  { title: 'Revenue Forecast H2',   status: 'processing', date: 'Jun 6',   owner: 'AJ' },
  { title: 'Funnel Conversion Audit',status: 'ready',     date: 'May 30',  owner: 'LN' },
  { title: 'Infrastructure Costs',   status: 'draft',     date: 'May 28',  owner: 'JP' },
];

const PAGE_META = {
  dashboard: { crumb: 'Overview',  title: 'Overview'  },
  analytics: { crumb: 'Analytics', title: 'Analytics' },
  team:      { crumb: 'Team',      title: 'Team'      },
  reports:   { crumb: 'Reports',   title: 'Reports'   },
  settings:  { crumb: 'Settings',  title: 'Settings'  },
};

export default function ThemePreview() {
  const [activePage, setActivePage] = useState('dashboard');
  const [tog1, setTog1] = useState(true);
  const [tog2, setTog2] = useState(false);

  const meta = PAGE_META[activePage];

  return (
    <div className="tp-shell">

      {/* ── Sidebar */}
      <aside className="tp-sidebar">
        <div className="tp-sidebar-brand">
          <div className="tp-brand-mark" />
          <span className="tp-brand-name">Acme Inc</span>
        </div>

        <nav className="tp-nav">
          {NAV_ITEMS.map(({ id, Icon, label }) => (
            <div
              key={id}
              className={`tp-nav-item${activePage === id ? ' active' : ''}`}
              onClick={() => setActivePage(id)}
              style={{ cursor: 'pointer' }}
            >
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

        <div className="tp-page">

          {/* Page heading */}
          <div className="tp-page-header">
            <div>
              <div className="tp-breadcrumb">
                <span>Home</span>
                <span className="tp-breadcrumb-sep">/</span>
                <span className="tp-breadcrumb-active">{meta.crumb}</span>
              </div>
              <h1 className="tp-page-title">{meta.title}</h1>
            </div>
            <div className="tp-page-actions">
              <button className="tp-btn tp-btn-ghost"><Download size={13} /> Export</button>
              <button className="tp-btn tp-btn-primary"><Plus size={13} /> New</button>
            </div>
          </div>

          {/* ── Dashboard page */}
          {activePage === 'dashboard' && (
            <>
              <div className="tp-stats-grid">
                {OVERVIEW_STATS.map(({ label, value, delta, up }) => (
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

              <div className="tp-lower-row">
                <div className="tp-card tp-table-card">
                  <div className="tp-card-header">
                    <span className="tp-card-title">Recent Activity</span>
                  </div>
                  <div className="tp-activity-list">
                    {ACTIVITY.map(({ icon: Icon, color, text, time }, i) => (
                      <div key={i} className="tp-activity-row">
                        <div className={`tp-activity-icon tp-activity-icon--${color}`}>
                          <Icon size={12} strokeWidth={2} />
                        </div>
                        <span className="tp-activity-text">{text}</span>
                        <span className="tp-activity-time">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tp-right-col">
                  <div className="tp-card">
                    <div className="tp-card-header">
                      <span className="tp-card-title">Quick Stats</span>
                    </div>
                    <div className="tp-quick-stats">
                      {[
                        { label: 'Open tickets', value: '12' },
                        { label: 'Deploys today', value: '4' },
                        { label: 'Uptime', value: '99.9%' },
                        { label: 'Errors (24h)', value: '3' },
                      ].map(s => (
                        <div key={s.label} className="tp-quick-stat-row">
                          <span className="tp-quick-stat-label">{s.label}</span>
                          <span className="tp-quick-stat-value">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tp-callout tp-callout-warning">
                    <AlertCircle size={14} className="tp-callout-icon" />
                    <div>
                      <div className="tp-callout-title">Usage limit approaching</div>
                      <div className="tp-callout-body">82% of your monthly API quota used.</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Analytics page */}
          {activePage === 'analytics' && (
            <>
              <div className="tp-stats-grid">
                {ANALYTICS_STATS.map(({ label, value, delta, up }) => (
                  <div key={label} className="tp-stat-card">
                    <div className="tp-stat-label">{label}</div>
                    <div className="tp-stat-value">{value}</div>
                    <div className={`tp-stat-delta${up ? ' up' : ' down'}`}>
                      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {delta} vs last period
                    </div>
                  </div>
                ))}
              </div>

              <div className="tp-lower-row">
                <div className="tp-card tp-table-card">
                  <div className="tp-card-header">
                    <span className="tp-card-title">Monthly Traffic</span>
                    <span style={{ fontSize: 11, color: 'var(--ds-neutral-600)' }}>Last 12 months</span>
                  </div>
                  <div className="tp-chart">
                    {CHART_BARS.map((h, i) => (
                      <div key={i} className="tp-chart-col">
                        <div className="tp-chart-bar-wrap">
                          <div className="tp-chart-bar" style={{ height: `${h}%` }} />
                        </div>
                        <span className="tp-chart-label">{CHART_LABELS[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tp-right-col">
                  <div className="tp-card">
                    <div className="tp-card-header">
                      <span className="tp-card-title">Top Pages</span>
                    </div>
                    <div className="tp-top-pages">
                      {TOP_PAGES.map(p => (
                        <div key={p.path} className="tp-top-page-row">
                          <span className="tp-top-page-path">{p.path}</span>
                          <div className="tp-top-page-bar-wrap">
                            <div className="tp-top-page-bar" style={{ width: `${p.pct}%` }} />
                          </div>
                          <span className="tp-top-page-views">{p.views}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Team page */}
          {activePage === 'team' && (
            <div className="tp-lower-row" style={{ alignItems: 'flex-start' }}>
              <div className="tp-card tp-table-card">
                <div className="tp-card-header">
                  <span className="tp-card-title">Team Members</span>
                  <button className="tp-btn tp-btn-primary tp-btn-sm">
                    <Plus size={11} /> Invite member
                  </button>
                </div>
                <table className="tp-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Role</th><th>Status</th><th></th>
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
                        <td><button className="tp-row-btn"><MoreVertical size={13} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Reports page */}
          {activePage === 'reports' && (
            <div className="tp-card" style={{ marginBottom: 0 }}>
              <div className="tp-card-header">
                <span className="tp-card-title">All Reports</span>
                <button className="tp-btn tp-btn-primary tp-btn-sm">
                  <Plus size={11} /> New report
                </button>
              </div>
              <div className="tp-report-list">
                {REPORTS.map(r => (
                  <div key={r.title} className="tp-report-row">
                    <div className="tp-report-icon">
                      <FileText size={14} strokeWidth={1.8} />
                    </div>
                    <div className="tp-report-meta">
                      <div className="tp-report-title">{r.title}</div>
                      <div className="tp-report-date">{r.date} · {r.owner}</div>
                    </div>
                    <span className={`tp-report-badge tp-report-badge--${r.status}`}>{r.status}</span>
                    <button className="tp-row-btn"><MoreVertical size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Settings page */}
          {activePage === 'settings' && (
            <div className="tp-lower-row" style={{ alignItems: 'flex-start' }}>
              <div className="tp-card tp-table-card">
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
                  <button className="tp-btn tp-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Save changes
                  </button>
                </div>
              </div>

              <div className="tp-right-col">
                <div className="tp-callout tp-callout-warning">
                  <AlertCircle size={14} className="tp-callout-icon" />
                  <div>
                    <div className="tp-callout-title">Usage limit approaching</div>
                    <div className="tp-callout-body">You've used 82% of your plan's API calls this month.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
