import { useState } from 'react';
import { ArrowRight, Zap, Shield, Layers, Check, Calendar, Clock, ChevronRight, Users, Star } from 'lucide-react';

const FEATURES = [
  {
    Icon: Zap,
    title: 'Ship faster',
    body: 'Streamline your workflow so your team spends time building products, not managing process.',
  },
  {
    Icon: Shield,
    title: 'Built to scale',
    body: 'Reliable infrastructure that grows with you. From first launch to millions of users.',
  },
  {
    Icon: Layers,
    title: 'Works everywhere',
    body: 'Seamless integration with the tools your team already uses. No migration headaches.',
  },
];

const STATS = [
  { value: '50K+', label: 'Teams worldwide' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '< 50ms', label: 'Avg response time' },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'Perfect to get started',
    features: ['Up to 3 projects', '1 team member', 'Basic analytics', 'Community support'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    sub: 'per month',
    features: ['Unlimited projects', 'Up to 10 members', 'Advanced analytics', 'Priority support', 'Custom integrations'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    sub: 'tailored to your team',
    features: ['Unlimited everything', 'SSO & SAML', 'Dedicated success manager', 'SLA guarantee', 'Custom contracts'],
    cta: 'Contact sales',
    highlight: false,
  },
];

const BLOG_POSTS = [
  {
    tag: 'Product',
    title: 'What we shipped in Q2: new collaboration tools and performance upgrades',
    date: 'Jun 10',
    readTime: '4 min read',
    author: 'Maya Chen',
  },
  {
    tag: 'Engineering',
    title: 'How we reduced API latency by 60% without rewriting our infrastructure',
    date: 'Jun 4',
    readTime: '7 min read',
    author: 'James Park',
  },
  {
    tag: 'Design',
    title: 'Building accessible products from day one: our approach and learnings',
    date: 'May 28',
    readTime: '5 min read',
    author: 'Sofia Rivera',
  },
];

const NAV_LINKS = ['Features', 'Pricing', 'Blog'];

export default function MarketingPreview() {
  const [activePage, setActivePage] = useState('features');

  const activeLink = activePage === 'features' ? 'Features'
    : activePage === 'pricing' ? 'Pricing'
    : 'Blog';

  return (
    <div className="mkt-shell">

      {/* Navbar */}
      <nav className="mkt-nav">
        <div className="mkt-nav-brand">
          <div className="mkt-nav-mark" />
          <span className="mkt-nav-name">Acme</span>
        </div>
        <div className="mkt-nav-links">
          {NAV_LINKS.map(link => (
            <span
              key={link}
              className={`mkt-nav-link${activeLink === link ? ' active' : ''}`}
              onClick={() => setActivePage(link.toLowerCase())}
            >
              {link}
            </span>
          ))}
        </div>
        <button className="mkt-nav-cta">Get started</button>
      </nav>

      {/* ── Features / Home page */}
      {activePage === 'features' && (
        <>
          <section className="mkt-hero">
            <div className="mkt-hero-badge">
              <span className="mkt-badge-dot" />
              Now available in 12 new regions
              <ArrowRight size={11} />
            </div>
            <h1 className="mkt-hero-headline">
              Build products<br />
              people <em>love.</em>
            </h1>
            <p className="mkt-hero-sub">
              The platform modern teams use to move fast, stay aligned, and
              ship software their users actually enjoy.
            </p>
            <div className="mkt-hero-actions">
              <button className="mkt-btn mkt-btn-primary">
                Start for free
                <ArrowRight size={14} />
              </button>
              <button className="mkt-btn mkt-btn-ghost">
                View demo
              </button>
            </div>
            <div className="mkt-hero-trust">
              Trusted by product teams worldwide
            </div>
          </section>

          <div className="mkt-stats-strip">
            {STATS.map(({ value, label }) => (
              <div key={label} className="mkt-stat">
                <div className="mkt-stat-value">{value}</div>
                <div className="mkt-stat-label">{label}</div>
              </div>
            ))}
          </div>

          <section className="mkt-features">
            <div className="mkt-section-eyebrow">Why teams choose us</div>
            <h2 className="mkt-section-headline">
              Everything your team needs<br />to build and ship with confidence.
            </h2>
            <div className="mkt-features-grid">
              {FEATURES.map(({ Icon, title, body }) => (
                <div key={title} className="mkt-feature-card">
                  <div className="mkt-feature-icon-wrap">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <h3 className="mkt-feature-title">{title}</h3>
                  <p className="mkt-feature-body">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mkt-cta-section">
            <div className="mkt-cta-card">
              <div className="mkt-cta-left">
                <h2 className="mkt-cta-headline">Ready to ship something great?</h2>
                <ul className="mkt-cta-features">
                  {['No credit card required', 'Free plan forever', '5-minute setup', 'Cancel anytime'].map(f => (
                    <li key={f} className="mkt-cta-feature-item">
                      <Check size={13} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mkt-cta-right">
                <button className="mkt-cta-btn">
                  Get started for free
                  <ArrowRight size={14} />
                </button>
                <span className="mkt-cta-note">No credit card required</span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Pricing page */}
      {activePage === 'pricing' && (
        <section className="mkt-pricing">
          <div className="mkt-section-eyebrow">Pricing</div>
          <h2 className="mkt-section-headline">Simple, transparent pricing</h2>
          <p className="mkt-pricing-sub">Start free. Upgrade when you're ready. No surprises.</p>
          <div className="mkt-pricing-grid">
            {PRICING_PLANS.map(plan => (
              <div key={plan.name} className={`mkt-plan-card${plan.highlight ? ' highlight' : ''}`}>
                {plan.highlight && <div className="mkt-plan-badge">Most popular</div>}
                <div className="mkt-plan-name">{plan.name}</div>
                <div className="mkt-plan-price">
                  {plan.price}
                  {plan.price !== 'Free' && plan.price !== 'Custom' && (
                    <span className="mkt-plan-period">/mo</span>
                  )}
                </div>
                <div className="mkt-plan-sub">{plan.sub}</div>
                <ul className="mkt-plan-features">
                  {plan.features.map(f => (
                    <li key={f} className="mkt-plan-feature-item">
                      <Check size={12} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mkt-plan-cta${plan.highlight ? ' primary' : ''}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Blog page */}
      {activePage === 'blog' && (
        <section className="mkt-blog">
          <div className="mkt-section-eyebrow">Blog</div>
          <h2 className="mkt-section-headline">From the team</h2>
          <div className="mkt-blog-grid">
            {BLOG_POSTS.map(post => (
              <div key={post.title} className="mkt-blog-card">
                <div className="mkt-blog-image" />
                <div className="mkt-blog-body">
                  <span className="mkt-blog-tag">{post.tag}</span>
                  <h3 className="mkt-blog-title">{post.title}</h3>
                  <div className="mkt-blog-meta">
                    <span className="mkt-blog-author">{post.author}</span>
                    <span className="mkt-blog-sep">·</span>
                    <Calendar size={11} />
                    <span>{post.date}</span>
                    <span className="mkt-blog-sep">·</span>
                    <Clock size={11} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
