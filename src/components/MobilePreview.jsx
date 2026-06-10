import {
  ArrowUpRight, ArrowDownLeft, Send, ArrowDownToLine,
  CreditCard, MoreHorizontal, Home, BarChart2, Wallet, User,
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, name: 'Spotify Premium',   amount: '-$9.99',   date: 'Today',     type: 'out', cat: 'Entertainment' },
  { id: 2, name: 'Salary Deposit',    amount: '+$4,200',  date: 'Yesterday', type: 'in',  cat: 'Income'        },
  { id: 3, name: 'Whole Foods',       amount: '-$67.43',  date: 'Mon',       type: 'out', cat: 'Groceries'     },
  { id: 4, name: 'Netflix',           amount: '-$15.49',  date: 'Sun',       type: 'out', cat: 'Entertainment' },
  { id: 5, name: 'Freelance Payment', amount: '+$850.00', date: 'Sat',       type: 'in',  cat: 'Income'        },
];

const QUICK_ACTIONS = [
  { Icon: Send,            label: 'Send'    },
  { Icon: ArrowDownToLine, label: 'Receive' },
  { Icon: CreditCard,      label: 'Pay'     },
  { Icon: MoreHorizontal,  label: 'More'    },
];

const BOTTOM_NAV = [
  { Icon: Home,     label: 'Home',      active: true  },
  { Icon: BarChart2,label: 'Analytics', active: false },
  { Icon: Wallet,   label: 'Cards',     active: false },
  { Icon: User,     label: 'Profile',   active: false },
];

export default function MobilePreview() {
  return (
    <div className="mp-shell">
      <div className="mp-frame">

        {/* Status bar */}
        <div className="mp-status-bar">
          <span className="mp-status-time">9:41</span>
          <div className="mp-status-icons">
            <span className="mp-status-signal" />
            <span className="mp-status-wifi" />
            <span className="mp-status-battery" />
          </div>
        </div>

        {/* Header */}
        <div className="mp-header">
          <div>
            <div className="mp-greeting-sub">Good morning</div>
            <div className="mp-greeting-name">Aria Johnson</div>
          </div>
          <div className="mp-avatar">AJ</div>
        </div>

        {/* Balance card */}
        <div className="mp-balance-card">
          <div className="mp-balance-label">Total Balance</div>
          <div className="mp-balance-value">$12,450.00</div>
          <div className="mp-balance-delta">
            <ArrowUpRight size={12} strokeWidth={2.5} />
            <span>+2.4% this week</span>
          </div>
          {/* Card number strip */}
          <div className="mp-card-number">•••• •••• •••• 4821</div>
        </div>

        {/* Quick actions */}
        <div className="mp-section">
          <div className="mp-quick-actions">
            {QUICK_ACTIONS.map(({ Icon, label }) => (
              <div key={label} className="mp-qa-item">
                <div className="mp-qa-btn">
                  <Icon size={16} strokeWidth={1.8} />
                </div>
                <span className="mp-qa-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="mp-section">
          <div className="mp-section-header">
            <span className="mp-section-title">Recent Activity</span>
            <span className="mp-section-link">See all</span>
          </div>
          <div className="mp-tx-list">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="mp-tx-row">
                <div className={`mp-tx-icon mp-tx-icon--${tx.type}`}>
                  {tx.type === 'in'
                    ? <ArrowDownLeft size={13} strokeWidth={2.5} />
                    : <ArrowUpRight  size={13} strokeWidth={2.5} />
                  }
                </div>
                <div className="mp-tx-meta">
                  <div className="mp-tx-name">{tx.name}</div>
                  <div className="mp-tx-sub">{tx.date} · {tx.cat}</div>
                </div>
                <div className={`mp-tx-amount mp-tx-amount--${tx.type}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mp-bottom-nav">
          {BOTTOM_NAV.map(({ Icon, label, active }) => (
            <div key={label} className={`mp-nav-item${active ? ' active' : ''}`}>
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
