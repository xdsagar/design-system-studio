import { useState } from 'react';
import {
  ArrowUpRight, ArrowDownLeft, Send, ArrowDownToLine,
  CreditCard, MoreHorizontal, Home, BarChart2, Wallet, User,
  Lock, Eye, EyeOff, Bell, Shield, ChevronRight, Plus,
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

const CATEGORIES = [
  { label: 'Shopping',       amount: '$342', pct: 68 },
  { label: 'Food & Dining',  amount: '$185', pct: 37 },
  { label: 'Transport',      amount: '$92',  pct: 18 },
  { label: 'Entertainment',  amount: '$67',  pct: 13 },
  { label: 'Subscriptions',  amount: '$38',  pct: 8  },
];

const BOTTOM_NAV = [
  { id: 'home',      Icon: Home,     label: 'Home'      },
  { id: 'analytics', Icon: BarChart2,label: 'Analytics' },
  { id: 'cards',     Icon: Wallet,   label: 'Cards'     },
  { id: 'profile',   Icon: User,     label: 'Profile'   },
];

const VIRTUAL_CARDS = [
  { last4: '4821', label: 'Personal',  balance: '$12,450', active: true  },
  { last4: '9302', label: 'Business',  balance: '$3,820',  active: true  },
  { last4: '1147', label: 'Savings',   balance: '$8,100',  active: false },
];

const PROFILE_SETTINGS = [
  { Icon: Bell,    label: 'Notifications',    hint: 'Push, email, SMS' },
  { Icon: Shield,  label: 'Security',         hint: 'Password, 2FA'    },
  { Icon: Lock,    label: 'Privacy',          hint: 'Data & permissions'},
  { Icon: CreditCard, label: 'Payment methods', hint: '3 cards saved'  },
];

export default function MobilePreview() {
  const [activeTab, setActiveTab] = useState('home');
  const [cardVisible, setCardVisible] = useState(false);

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

        {/* ── Home tab */}
        {activeTab === 'home' && (
          <>
            <div className="mp-header">
              <div>
                <div className="mp-greeting-sub">Good morning</div>
                <div className="mp-greeting-name">Aria Johnson</div>
              </div>
              <div className="mp-avatar">AJ</div>
            </div>

            <div className="mp-balance-card">
              <div className="mp-balance-label">Total Balance</div>
              <div className="mp-balance-value">$12,450.00</div>
              <div className="mp-balance-delta">
                <ArrowUpRight size={12} strokeWidth={2.5} />
                <span>+2.4% this week</span>
              </div>
              <div className="mp-card-number">•••• •••• •••• 4821</div>
            </div>

            <div className="mp-section">
              <div className="mp-quick-actions">
                {QUICK_ACTIONS.map(({ Icon, label }) => (
                  <div key={label} className="mp-qa-item">
                    <div className="mp-qa-btn"><Icon size={16} strokeWidth={1.8} /></div>
                    <span className="mp-qa-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

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
                    <div className={`mp-tx-amount mp-tx-amount--${tx.type}`}>{tx.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Analytics tab */}
        {activeTab === 'analytics' && (
          <>
            <div className="mp-header">
              <div>
                <div className="mp-greeting-sub">June 2025</div>
                <div className="mp-greeting-name">Spending</div>
              </div>
              <div className="mp-avatar">AJ</div>
            </div>

            <div className="mp-analytics-total">
              <div className="mp-analytics-label">Total Spent</div>
              <div className="mp-analytics-amount">$724.91</div>
              <div className="mp-analytics-delta">
                <ArrowUpRight size={12} strokeWidth={2.5} />
                <span>+$84 vs last month</span>
              </div>
            </div>

            <div className="mp-section">
              <div className="mp-section-header">
                <span className="mp-section-title">By Category</span>
              </div>
              <div className="mp-cat-list">
                {CATEGORIES.map(c => (
                  <div key={c.label} className="mp-cat-row">
                    <div className="mp-cat-meta">
                      <span className="mp-cat-label">{c.label}</span>
                      <span className="mp-cat-amount">{c.amount}</span>
                    </div>
                    <div className="mp-cat-bar-track">
                      <div className="mp-cat-bar-fill" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Cards tab */}
        {activeTab === 'cards' && (
          <>
            <div className="mp-header">
              <div>
                <div className="mp-greeting-sub">Manage</div>
                <div className="mp-greeting-name">My Cards</div>
              </div>
              <button className="mp-header-action">
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>

            <div className="mp-section">
              {VIRTUAL_CARDS.map(card => (
                <div key={card.last4} className={`mp-virtual-card${card.active ? '' : ' mp-virtual-card--inactive'}`}>
                  <div className="mp-vc-top">
                    <span className="mp-vc-label">{card.label}</span>
                    <div className="mp-vc-actions">
                      <button
                        className="mp-vc-btn"
                        onClick={() => setCardVisible(v => !v)}
                        title={cardVisible ? 'Hide' : 'Show'}
                      >
                        {cardVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button className="mp-vc-btn"><Lock size={13} /></button>
                    </div>
                  </div>
                  <div className="mp-vc-number">
                    {cardVisible ? `4782 8821 ${card.last4 === '4821' ? '4821' : card.last4} 0394` : `•••• •••• •••• ${card.last4}`}
                  </div>
                  <div className="mp-vc-bottom">
                    <span className="mp-vc-balance">{card.balance}</span>
                    {!card.active && <span className="mp-vc-frozen">Frozen</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Profile tab */}
        {activeTab === 'profile' && (
          <>
            <div className="mp-profile-hero">
              <div className="mp-profile-avatar">AJ</div>
              <div className="mp-profile-name">Aria Johnson</div>
              <div className="mp-profile-email">aria@example.com</div>
            </div>

            <div className="mp-section">
              <div className="mp-profile-settings">
                {PROFILE_SETTINGS.map(({ Icon, label, hint }) => (
                  <div key={label} className="mp-profile-row">
                    <div className="mp-profile-row-icon">
                      <Icon size={15} strokeWidth={1.8} />
                    </div>
                    <div className="mp-profile-row-meta">
                      <div className="mp-profile-row-label">{label}</div>
                      <div className="mp-profile-row-hint">{hint}</div>
                    </div>
                    <ChevronRight size={14} className="mp-profile-row-chevron" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Bottom nav */}
        <div className="mp-bottom-nav">
          {BOTTOM_NAV.map(({ id, Icon, label }) => (
            <div
              key={id}
              className={`mp-nav-item${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
              style={{ cursor: 'pointer' }}
            >
              <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 1.8} />
              <span>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
