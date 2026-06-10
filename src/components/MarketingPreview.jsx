import { ArrowRight, Zap, Shield, Layers, Check } from 'lucide-react';

const FEATURES = [
  {
    Icon: Zap,
    title: 'AI-powered tokens',
    body: 'Upload brand assets, get a complete production-ready design system in seconds.',
  },
  {
    Icon: Shield,
    title: 'Ship the same day',
    body: 'Export to CSS custom properties, Tailwind config, and Figma Variables instantly.',
  },
  {
    Icon: Layers,
    title: 'Every context covered',
    body: 'Preview tokens across dashboard, mobile, and marketing layouts simultaneously.',
  },
];

const STATS = [
  { value: '10K+', label: 'Product teams' },
  { value: '3 min', label: 'Avg setup time' },
  { value: '60+',   label: 'CSS variables' },
];

const PLAN_FEATURES = [
  'Complete token schema',
  'AI brand analysis',
  'Multi-context preview',
  'Figma Variables export',
];

export default function MarketingPreview() {
  return (
    <div className="mkt-shell">

      {/* Navbar */}
      <nav className="mkt-nav">
        <div className="mkt-nav-brand">
          <div className="mkt-nav-mark" />
          <span className="mkt-nav-name">Acme</span>
        </div>
        <div className="mkt-nav-links">
          <span className="mkt-nav-link">Features</span>
          <span className="mkt-nav-link">Pricing</span>
          <span className="mkt-nav-link">Docs</span>
          <span className="mkt-nav-link">Blog</span>
        </div>
        <button className="mkt-nav-cta">Get started</button>
      </nav>

      {/* Hero */}
      <section className="mkt-hero">
        <div className="mkt-hero-badge">
          <span className="mkt-badge-dot" />
          Now with AI brand analysis
          <ArrowRight size={11} />
        </div>
        <h1 className="mkt-hero-headline">
          Design systems<br />
          that <em>compete.</em>
        </h1>
        <p className="mkt-hero-sub">
          The token platform for ambitious product teams.
          From brand identity to production-ready components — in minutes, not months.
        </p>
        <div className="mkt-hero-actions">
          <button className="mkt-btn mkt-btn-primary">
            Start building free
            <ArrowRight size={14} />
          </button>
          <button className="mkt-btn mkt-btn-ghost">
            See how it works
          </button>
        </div>
        <div className="mkt-hero-trust">
          Trusted by teams at <strong>Stripe</strong>, <strong>Linear</strong>, <strong>Vercel</strong>
        </div>
      </section>

      {/* Stats strip */}
      <div className="mkt-stats-strip">
        {STATS.map(({ value, label }) => (
          <div key={label} className="mkt-stat">
            <div className="mkt-stat-value">{value}</div>
            <div className="mkt-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="mkt-features">
        <div className="mkt-section-eyebrow">Why teams choose us</div>
        <h2 className="mkt-section-headline">
          Everything you need to build a<br />
          world-class design system.
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

      {/* CTA banner */}
      <section className="mkt-cta-section">
        <div className="mkt-cta-card">
          <div className="mkt-cta-left">
            <h2 className="mkt-cta-headline">
              Ready to build something remarkable?
            </h2>
            <ul className="mkt-cta-features">
              {PLAN_FEATURES.map(f => (
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

    </div>
  );
}
