import { useState } from 'react';

// ─── Shared sub-components ──────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="comp-section">
      <div className="comp-title">{title}</div>
      {children}
    </div>
  );
}
function Row({ children, wrap }) {
  return <div style={{display:'flex',flexWrap:wrap?'wrap':'nowrap',gap:8,alignItems:'center'}}>{children}</div>;
}
function Col({ children, style }) {
  return <div style={{display:'flex',flexDirection:'column',gap:10,...style}}>{children}</div>;
}
function Field({ label, hint, error, children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <label style={{fontSize:12,fontWeight:500,color:'var(--ds-neutral-800)'}}>{label}</label>
      {children}
      {hint  && <span style={{fontSize:11,color:'var(--ds-neutral-400)'}}>{hint}</span>}
      {error && <span style={{fontSize:11,color:'var(--ds-danger)'}}>{error}</span>}
    </div>
  );
}
function Chip({ children }) {
  return (
    <span className="ds-chip">
      {children}
      <button className="chip-x" aria-label={`Remove ${children}`}>×</button>
    </span>
  );
}
function AvatarGroup() {
  return (
    <div style={{display:'flex'}}>
      {['JD','MK','SR','+3'].map((i,idx)=>(
        <div key={i} className="ds-avatar" style={{width:32,height:32,fontSize:11,border:'2px solid var(--ds-surface)',marginLeft:idx===0?0:-8,zIndex:4-idx}}>{i}</div>
      ))}
    </div>
  );
}
function BtnSpinner() {
  return <span style={{width:12,height:12,border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin .6s linear infinite'}} />;
}

// ─── BUTTONS ────────────────────────────────────────────────
export function ButtonsPreview() {
  const [loading, setLoading] = useState(false);
  function simulateLoad() { setLoading(true); setTimeout(() => setLoading(false), 2000); }
  return (
    <div className="preview-sections">
      <Section title="Button — Variants">
        <Row>
          <button className="ds-btn primary">Primary</button>
          <button className="ds-btn secondary">Secondary</button>
          <button className="ds-btn ghost">Ghost</button>
          <button className="ds-btn danger">Delete</button>
          <button className="ds-btn link">Link →</button>
        </Row>
      </Section>
      <Section title="Button — Sizes">
        <Row>
          <button className="ds-btn primary sm">Small</button>
          <button className="ds-btn primary">Default</button>
          <button className="ds-btn primary lg">Large</button>
        </Row>
      </Section>
      <Section title="Button — States">
        <Row>
          <button className="ds-btn primary" style={{opacity:.45,cursor:'not-allowed'}} disabled>Disabled</button>
          <button className="ds-btn primary" onClick={simulateLoad}>
            {loading ? <><BtnSpinner /> Saving…</> : 'Click to load'}
          </button>
          <button className="ds-btn ghost icon-only" aria-label="Settings">⚙</button>
          <button className="ds-btn secondary icon-left"><span>↑</span> Upload</button>
        </Row>
      </Section>
      <Section title="Button Group">
        <div className="ds-btn-group">
          <button className="ds-btn primary">Save</button>
          <button className="ds-btn primary">Preview</button>
          <button className="ds-btn primary">Publish</button>
        </div>
      </Section>
      <Section title="FAB — Floating Action Button">
        <Row>
          <button className="ds-fab" title="Add">+</button>
          <button className="ds-fab secondary" title="Edit">✏</button>
          <button className="ds-fab sm" title="Up">↑</button>
        </Row>
      </Section>
      <Section title="Badge">
        <Row wrap>
          <span className="ds-badge brand">Brand</span>
          <span className="ds-badge success">Active</span>
          <span className="ds-badge warning">Pending</span>
          <span className="ds-badge danger">Error</span>
          <span className="ds-badge neutral">Draft</span>
          <span className="ds-badge success dot">Online</span>
        </Row>
      </Section>
      <Section title="Chip">
        <Row>{['Design','React','TypeScript'].map(t=><Chip key={t}>{t}</Chip>)}</Row>
      </Section>
      <Section title="Avatar">
        <Row>
          {[24,32,40,52,64].map(s=>(
            <div key={s} className="ds-avatar" style={{width:s,height:s,fontSize:s*0.3}}>{s>32?'JD':'J'}</div>
          ))}
          <AvatarGroup />
        </Row>
      </Section>
      <Section title="Indicator">
        <Row>
          <div className="ds-indicator">
            <button className="ds-btn ghost icon-only">🔔</button>
            <span className="ds-indicator-dot danger">3</span>
          </div>
          <div className="ds-indicator">
            <div className="ds-avatar" style={{width:36,height:36,fontSize:13}}>JD</div>
            <span className="ds-indicator-dot success" />
          </div>
          <div className="ds-indicator">
            <button className="ds-btn ghost icon-only">✉</button>
            <span className="ds-indicator-dot brand">12</span>
          </div>
        </Row>
      </Section>
    </div>
  );
}

// ─── FORMS ──────────────────────────────────────────────────
export function FormsPreview() {
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(false);
  const [radio, setRadio] = useState('Email');
  const [radioCard, setRadioCard] = useState('Monthly');
  const [slider, setSlider] = useState(65);
  const [comboVal, setComboVal] = useState('');
  const [comboOpen, setComboOpen] = useState(false);
  const [checkGroup, setCheckGroup] = useState(['Design']);
  const comboOptions = ['Design','Development','Marketing','Sales','Support'];
  function toggleCheck(val) { setCheckGroup(p=>p.includes(val)?p.filter(v=>v!==val):[...p,val]); }
  return (
    <div className="preview-sections">
      <Section title="Input">
        <Col style={{maxWidth:320}}>
          <Field label="Full name" hint="As shown on your ID">
            <input className="ds-input" type="text" placeholder="Jane Smith" />
          </Field>
          <Field label="Email (error state)" error="Enter a valid email address">
            <input className="ds-input error" type="email" defaultValue="not-an-email" />
          </Field>
          <Field label="Disabled">
            <input className="ds-input" type="text" value="Cannot edit" disabled readOnly />
          </Field>
        </Col>
      </Section>
      <Section title="Search">
        <div className="ds-search-wrap" style={{maxWidth:280}}>
          <span className="ds-search-icon">🔍</span>
          <input className="ds-input ds-search" placeholder="Search components…" />
        </div>
      </Section>
      <Section title="Select & Textarea">
        <Col style={{maxWidth:320}}>
          <Field label="Country">
            <select className="ds-input">
              <option>United States</option><option>United Kingdom</option><option>France</option>
            </select>
          </Field>
          <Field label="Bio">
            <textarea className="ds-input" rows={3} placeholder="Tell us about yourself…" style={{resize:'vertical',lineHeight:1.5}} />
          </Field>
        </Col>
      </Section>
      <Section title="Combobox">
        <div style={{position:'relative',maxWidth:240}}>
          <input
            className="ds-input"
            placeholder="Select team…"
            value={comboVal}
            onChange={e=>setComboVal(e.target.value)}
            onFocus={()=>setComboOpen(true)}
            onBlur={()=>setTimeout(()=>setComboOpen(false),150)}
          />
          {comboOpen && (
            <div className="ds-combobox-dropdown">
              {comboOptions.filter(o=>o.toLowerCase().includes(comboVal.toLowerCase())).map(o=>(
                <div key={o} className="ds-combobox-option" onMouseDown={()=>{setComboVal(o);setComboOpen(false);}}>
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
      <Section title="Input Date Picker">
        <Col style={{maxWidth:240}}>
          <Field label="Start date"><input className="ds-input" type="date" /></Field>
          <Field label="End date"><input className="ds-input" type="date" /></Field>
        </Col>
      </Section>
      <Section title="Input Slider">
        <Col style={{maxWidth:300}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
            <span>Volume</span><span style={{color:'var(--ds-neutral-400)'}}>{slider}%</span>
          </div>
          <input type="range" className="ds-slider" min={0} max={100} value={slider} onChange={e=>setSlider(+e.target.value)} />
        </Col>
      </Section>
      <Section title="Checkbox & Toggle">
        <Col>
          <label className="ds-check-label">
            <input type="checkbox" className="ds-check" checked={checked} onChange={e=>setChecked(e.target.checked)} />
            <span>Remember me</span>
          </label>
          <label className="ds-check-label">
            <input type="checkbox" className="ds-check" />
            <span>Subscribe to newsletter</span>
          </label>
          <label className="ds-check-label">
            <span className={`ds-toggle-track${toggled?' on':''}`} onClick={()=>setToggled(v=>!v)} style={{cursor:'pointer'}}>
              <span className="ds-toggle-thumb" style={{transform:toggled?'translateX(16px)':'none'}}/>
            </span>
            <span>Enable notifications {toggled?'(on)':'(off)'}</span>
          </label>
        </Col>
      </Section>
      <Section title="Checkbox Group">
        <div className="ds-checkbox-group">
          {['Design','Development','Marketing','Analytics'].map(item=>(
            <label key={item} className="ds-check-label">
              <input type="checkbox" className="ds-check" checked={checkGroup.includes(item)} onChange={()=>toggleCheck(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </Section>
      <Section title="Radio Button">
        <Col>
          {['Email','SMS','Push'].map(opt=>(
            <label key={opt} className="ds-radio-label">
              <input type="radio" className="ds-radio" name="notif" value={opt} checked={radio===opt} onChange={()=>setRadio(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </Col>
      </Section>
      <Section title="Radio Button Group">
        <Row>
          {['Monthly','Annual'].map(p=>(
            <label key={p} className={`ds-radio-card ${radioCard===p?'selected':''}`} onClick={()=>setRadioCard(p)}>
              <div className="radio-card-title">{p}</div>
              <div className="radio-card-desc">{p==='Annual'?'Save 20%':'Billed monthly'}</div>
            </label>
          ))}
        </Row>
      </Section>
      <Section title="File Uploader">
        <label className="ds-file-uploader">
          <span className="file-uploader-icon">📁</span>
          <span className="file-uploader-text">Drop files here or <span style={{color:'var(--ds-brand)'}}>browse</span></span>
          <span className="file-uploader-hint">PNG, JPG, PDF — up to 10 MB</span>
          <input type="file" style={{display:'none'}} />
        </label>
      </Section>
      <Section title="Form Wrapper">
        <div className="ds-form-wrapper" style={{maxWidth:340}}>
          <div className="ds-form-header">Account settings</div>
          <div className="ds-form-body">
            <div className="ds-form-row">
              <Field label="First name"><input className="ds-input" placeholder="Jane" /></Field>
              <Field label="Last name"><input className="ds-input" placeholder="Smith" /></Field>
            </div>
            <Field label="Email"><input className="ds-input" type="email" placeholder="jane@example.com" /></Field>
          </div>
          <div className="ds-form-footer">
            <button className="ds-btn ghost sm">Cancel</button>
            <button className="ds-btn primary sm">Save changes</button>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── DATA DISPLAY ───────────────────────────────────────────
export function DataPreview() {
  const [page, setPage] = useState(1);
  const users = [
    {name:'Jane Doe',   initials:'JD', role:'Admin',  status:'success', statusLabel:'Active',  joined:'Jan 2024'},
    {name:'Mike Kim',   initials:'MK', role:'Editor', status:'warning', statusLabel:'Pending', joined:'Mar 2024'},
    {name:'Sara Reyes', initials:'SR', role:'Viewer', status:'neutral', statusLabel:'Invited', joined:'May 2024'},
  ];
  return (
    <div className="preview-sections">
      <Section title="Table">
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th style={{textAlign:'right'}}>Joined</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.name} className="ds-tr">
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="ds-avatar" style={{width:28,height:28,fontSize:10}}>{u.initials}</div>{u.name}</div></td>
                  <td style={{color:'var(--ds-neutral-600)',fontSize:13}}>{u.role}</td>
                  <td><span className={`ds-badge ${u.status}`}>{u.statusLabel}</span></td>
                  <td style={{textAlign:'right',color:'var(--ds-neutral-400)',fontSize:12}}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Pagination">
        <div className="ds-pagination">
          <button className="page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))}>‹</button>
          {[1,2,3,'…',12].map((n,i)=>(
            typeof n==='number'
              ? <button key={i} className={`page-btn ${page===n?'active':''}`} onClick={()=>setPage(n)}>{n}</button>
              : <span key={i} className="page-ellipsis">…</span>
          ))}
          <button className="page-btn" onClick={()=>setPage(p=>Math.min(12,p+1))}>›</button>
        </div>
      </Section>
      <Section title="Progress Bar">
        <Col style={{maxWidth:320}}>
          {[['Storage','65%',65,'brand'],['Success rate','92%',92,'success'],['Disk','88%',88,'danger']].map(([l,pct,val,t])=>(
            <div key={l}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                <span>{l}</span><span className={`stat-change ${t}`}>{pct}</span>
              </div>
              <div className="ds-progress-wrap"><div className="ds-progress-bar" style={{width:`${val}%`,background:t==='success'?'var(--ds-success)':t==='danger'?'var(--ds-danger)':'var(--ds-brand)'}} /></div>
            </div>
          ))}
        </Col>
      </Section>
      <Section title="Progress Circle">
        <Row>
          {[[75,'brand'],[55,'success'],[88,'danger']].map(([pct,t])=>{
            const r=22, circ=2*Math.PI*r, dash=(pct/100)*circ;
            const color = t==='success'?'var(--ds-success)':t==='danger'?'var(--ds-danger)':'var(--ds-brand)';
            return (
              <div key={pct} className="ds-progress-circle">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r={r} fill="none" stroke="var(--ds-neutral-100)" strokeWidth="5"/>
                  <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                    transform="rotate(-90 30 30)"/>
                </svg>
                <span className="progress-circle-label" style={{color}}>{pct}%</span>
              </div>
            );
          })}
        </Row>
      </Section>
      <Section title="Skeleton">
        <Col style={{maxWidth:280}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="ds-skeleton" style={{width:36,height:36,borderRadius:'50%',flexShrink:0}}/>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <div className="ds-skeleton" style={{height:12,width:'60%'}}/>
              <div className="ds-skeleton" style={{height:12,width:'80%'}}/>
            </div>
          </div>
          <div className="ds-skeleton" style={{height:12}}/>
          <div className="ds-skeleton" style={{height:12,width:'70%'}}/>
        </Col>
      </Section>
      <Section title="Spinner">
        <Row>
          <div className="ds-spinner sm" />
          <div className="ds-spinner" />
          <div className="ds-spinner lg" />
          <div className="ds-spinner" style={{borderTopColor:'var(--ds-success)'}} />
          <div className="ds-spinner" style={{borderTopColor:'var(--ds-danger)'}} />
        </Row>
      </Section>
      <Section title="List">
        <div className="ds-list" style={{maxWidth:320}}>
          {[
            {label:'Jane Doe',   meta:'Admin',  icon:'👤'},
            {label:'Mike Kim',   meta:'Editor', icon:'👤'},
            {label:'Sara Reyes', meta:'Viewer', icon:'👤'},
          ].map(item=>(
            <div key={item.label} className="ds-list-item">
              <span className="ds-list-icon">{item.icon}</span>
              <div className="ds-list-item-label">{item.label}</div>
              <div className="ds-list-item-meta">{item.meta}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Stat cards">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {[['Revenue','$48.2k','↑ 12.5%','success'],['Users','8,421','↑ 4.1%','success'],['Churn','2.3%','↑ 0.4%','danger']].map(([l,v,c,t])=>(
            <div key={l} className="ds-stat-card">
              <div className="stat-label">{l}</div>
              <div className="stat-value">{v}</div>
              <div className={`stat-change ${t}`}>{c}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── FEEDBACK ────────────────────────────────────────────────
export function FeedbackPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const tabs = ['Overview','Analytics','Settings','Billing'];
  const faqs = [
    {q:'What payment methods do you accept?', a:'We accept Visa, Mastercard, and PayPal.'},
    {q:'Can I cancel anytime?',               a:'Yes, cancel with one click from your account settings.'},
    {q:'Is there a free trial?',              a:'Every plan includes a 14-day free trial, no card required.'},
  ];
  return (
    <div className="preview-sections">
      <Section title="Alert">
        <Col>
          {[
            {type:'info',    icon:'ℹ', title:'Heads up',  desc:'Your trial ends in 3 days.'},
            {type:'success', icon:'✓', title:'Saved',     desc:'Your changes have been saved.'},
            {type:'warning', icon:'⚠', title:'Attention', desc:'Storage is at 88% capacity.'},
            {type:'danger',  icon:'✕', title:'Error',     desc:'Something went wrong. Please retry.'},
          ].map(a=>(
            <div key={a.type} className={`ds-alert ${a.type}`}>
              <span style={{flexShrink:0,marginTop:1}}>{a.icon}</span>
              <div><div style={{fontWeight:500,marginBottom:2}}>{a.title}</div><div style={{fontSize:11,opacity:.9}}>{a.desc}</div></div>
            </div>
          ))}
        </Col>
      </Section>
      <Section title="Banner">
        <Col>
          <div className="ds-banner info">
            <span>🎉 New features available — <a style={{color:'inherit',fontWeight:600,cursor:'pointer'}}>See what's new</a></span>
            <button className="ds-banner-close">×</button>
          </div>
          <div className="ds-banner warning">
            <span>⚠ Subscription expires in 7 days. <a style={{color:'inherit',fontWeight:600,cursor:'pointer'}}>Renew now</a></span>
            <button className="ds-banner-close">×</button>
          </div>
        </Col>
      </Section>
      <Section title="Snackbar">
        <Col>
          <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:320}}>
            {[
              {type:'success',icon:'✓',title:'Saved',desc:'Your changes were saved.'},
              {type:'danger', icon:'✕',title:'Failed',desc:'Could not connect to server.'},
            ].map(t=>(
              <div key={t.type} className="ds-toast">
                <span className={`toast-icon ${t.type}`}>{t.icon}</span>
                <div><div className="toast-title">{t.title}</div><div className="toast-desc">{t.desc}</div></div>
                <button className="toast-close">×</button>
              </div>
            ))}
          </div>
          <div style={{position:'relative'}}>
            <button className="ds-btn secondary sm" onClick={()=>{setShowSnackbar(true);setTimeout(()=>setShowSnackbar(false),3000);}}>
              Show snackbar
            </button>
            {showSnackbar && (
              <div className="ds-snackbar" style={{position:'absolute',left:0,bottom:'calc(100% + 8px)',whiteSpace:'nowrap'}}>
                ✓ Action completed
                <button className="ds-snackbar-action" onClick={()=>setShowSnackbar(false)}>Undo</button>
              </div>
            )}
          </div>
        </Col>
      </Section>
      <Section title="Modal">
        <div style={{position:'relative'}}>
          <button className="ds-btn secondary sm" onClick={()=>setShowModal(true)}>Open modal</button>
          {showModal && (
            <div className="ds-modal-overlay" onClick={()=>setShowModal(false)}>
              <div className="ds-modal" onClick={e=>e.stopPropagation()}>
                <div className="ds-modal-header">
                  <span className="ds-modal-title">Confirm action</span>
                  <button className="ds-modal-close" onClick={()=>setShowModal(false)}>×</button>
                </div>
                <div className="ds-modal-body">
                  Are you sure you want to delete this project? This action cannot be undone.
                </div>
                <div className="ds-modal-footer">
                  <button className="ds-btn ghost sm" onClick={()=>setShowModal(false)}>Cancel</button>
                  <button className="ds-btn danger sm" onClick={()=>setShowModal(false)}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
      <Section title="Tabs">
        <div>
          <div className="ds-tab-row">
            {tabs.map((t,i)=>(
              <button key={t} className={`ds-tab ${activeTab===i?'active':''}`} onClick={()=>setActiveTab(i)}>{t}</button>
            ))}
          </div>
          <div style={{padding:'12px 0',fontSize:12,color:'var(--ds-neutral-600)'}}>
            Showing: <strong>{tabs[activeTab]}</strong> panel content
          </div>
        </div>
      </Section>
      <Section title="Accordion">
        <div className="ds-accordion" style={{maxWidth:380}}>
          {faqs.map((faq,i)=>(
            <div key={i} className="accordion-item">
              <button className="accordion-trigger" onClick={()=>setOpenAccordion(openAccordion===i?null:i)}>
                <span>{faq.q}</span>
                <span style={{transform:openAccordion===i?'rotate(180deg)':'none',transition:'transform .2s',display:'inline-block',color:'var(--ds-neutral-400)'}}>⌄</span>
              </button>
              {openAccordion===i && <div className="accordion-body">{faq.a}</div>}
            </div>
          ))}
        </div>
      </Section>
      <Section title="Stepper">
        <div className="ds-stepper">
          {['Cart','Shipping','Payment','Confirm'].map((s,i)=>(
            <div key={s} className={`ds-step ${i===0?'done':i===1?'active':''}`}>
              <div className="step-dot">{i===0?'✓':i+1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Tooltip">
        <Row>
          {[['⚙','Open settings'],['🗑','Delete item'],['✏','Edit'],['↗','Share']].map(([icon,tip])=>(
            <div key={tip} className="tooltip-root">
              <button className="ds-btn ghost sm">{icon}</button>
              <span className="ds-tooltip">{tip}</span>
            </div>
          ))}
        </Row>
      </Section>
    </div>
  );
}

// ─── NAVIGATION ─────────────────────────────────────────────
export function NavigationPreview() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    {id:'dashboard', label:'Dashboard', icon:'⊞'},
    {id:'projects',  label:'Projects',  icon:'📁'},
    {id:'team',      label:'Team',      icon:'👥'},
    {id:'settings',  label:'Settings',  icon:'⚙'},
  ];
  const menuItems = ['Edit','Duplicate','Archive',null,'Delete'];
  return (
    <div className="preview-sections">
      <Section title="Header">
        <div className="ds-header-demo">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:28,height:28,borderRadius:6,background:'var(--ds-brand)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700}}>D</div>
            <span style={{fontWeight:600,fontSize:13}}>DesignCo</span>
          </div>
          <nav style={{display:'flex',gap:4}}>
            {['Product','Docs','Pricing'].map(l=>(
              <button key={l} className="ds-btn ghost sm">{l}</button>
            ))}
          </nav>
          <button className="ds-btn primary sm">Get started</button>
        </div>
      </Section>
      <Section title="Nav — sidebar">
        <div className="ds-nav">
          {navItems.map(item=>(
            <button key={item.id} className={`ds-nav-item ${activeNav===item.id?'active':''}`} onClick={()=>setActiveNav(item.id)}>
              <span className="ds-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Action Bar">
        <div className="ds-action-bar">
          <span className="ds-action-bar-title">3 items selected</span>
          <div style={{display:'flex',gap:6}}>
            <button className="ds-btn ghost sm" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}}>Move</button>
            <button className="ds-btn ghost sm" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}}>Copy</button>
            <button className="ds-btn danger sm">Delete</button>
          </div>
        </div>
      </Section>
      <Section title="Menu">
        <div style={{position:'relative',display:'inline-block'}}>
          <button className="ds-btn secondary sm" onClick={()=>setMenuOpen(v=>!v)}>Options ⌄</button>
          {menuOpen && (
            <div className="ds-menu">
              {menuItems.map((item,i)=>
                item===null
                  ? <div key={i} className="ds-menu-divider"/>
                  : <button key={item} className={`ds-menu-item${item==='Delete'?' danger':''}`} onClick={()=>setMenuOpen(false)}>{item}</button>
              )}
            </div>
          )}
        </div>
      </Section>
      <Section title="Breadcrumbs">
        <nav style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}>
          {['Home','Projects'].map(c=>(
            <span key={c} style={{display:'flex',alignItems:'center',gap:6}}>
              <a style={{color:'var(--ds-neutral-600)',textDecoration:'none',cursor:'pointer'}}>{c}</a>
              <span style={{color:'var(--ds-neutral-400)'}}>/</span>
            </span>
          ))}
          <span style={{color:'var(--ds-neutral-800)',fontWeight:500}}>Design System</span>
        </nav>
      </Section>
      <Section title="Page Heading">
        <div className="ds-page-heading">
          <div>
            <h1 className="ds-page-heading-title">Projects</h1>
            <p className="ds-page-heading-desc">Manage and track all your design projects.</p>
          </div>
          <button className="ds-btn primary sm">+ New project</button>
        </div>
      </Section>
      <Section title="Section Heading">
        <Col>
          <div className="ds-section-heading">Recent activity</div>
          <div className="ds-section-heading" style={{fontSize:10}}>Team members</div>
        </Col>
      </Section>
      <Section title="Footer">
        <div className="ds-footer-demo">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:20,height:20,borderRadius:4,background:'var(--ds-brand)'}}/>
            <span style={{fontWeight:600,fontSize:12}}>DesignCo</span>
          </div>
          <nav style={{display:'flex',gap:12}}>
            {['Privacy','Terms','Contact'].map(l=>(
              <a key={l} style={{fontSize:11,color:'var(--ds-neutral-400)',textDecoration:'none',cursor:'pointer'}}>{l}</a>
            ))}
          </nav>
          <span style={{fontSize:11,color:'var(--ds-neutral-400)'}}>© 2026</span>
        </div>
      </Section>
    </div>
  );
}

// ─── LAYOUT ─────────────────────────────────────────────────
export function LayoutPreview() {
  const [dragItems, setDragItems] = useState(['Item A','Item B','Item C']);
  const [dragging, setDragging] = useState(null);
  function onDrop(idx) {
    if (dragging===null||dragging===idx){setDragging(null);return;}
    const arr=[...dragItems],[item]=arr.splice(dragging,1);arr.splice(idx,0,item);
    setDragItems(arr);setDragging(null);
  }
  return (
    <div className="preview-sections">
      <Section title="Card">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="ds-card"><div className="card-title">Default card</div><div className="card-text">A general-purpose surface for grouping content.</div></div>
          <div className="ds-card interactive"><div className="card-title">Interactive</div><div className="card-text">Hover me for the lift effect.</div></div>
        </div>
        <div className="ds-card media-card" style={{maxWidth:240,marginTop:12}}>
          <div className="card-image-placeholder">Image</div>
          <div style={{padding:14}}>
            <div className="card-title" style={{fontSize:14}}>Media card</div>
            <div className="card-text">With image header and footer.</div>
            <div className="card-footer"><span className="ds-badge brand">New</span><button className="ds-btn primary sm">View</button></div>
          </div>
        </div>
      </Section>
      <Section title="Panel">
        <div className="ds-panel" style={{maxWidth:340}}>
          <div className="ds-panel-header">
            <span>Team members</span>
            <button className="ds-btn ghost sm">+ Add</button>
          </div>
          <div className="ds-panel-body">
            {['Jane Doe — Admin','Mike Kim — Editor','Sara Reyes — Viewer'].map(m=>(
              <div key={m} style={{fontSize:12,color:'var(--ds-neutral-600)',padding:'4px 0',borderBottom:'0.5px solid var(--ds-neutral-100)'}}>{m}</div>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Divider">
        <Col>
          <div className="ds-divider" />
          <div className="ds-divider"><span className="ds-divider-label">or continue with</span></div>
        </Col>
      </Section>
      <Section title="App Layout">
        <div className="ds-app-layout-demo">
          <div className="ds-layout-topbar">
            <span style={{fontWeight:600,fontSize:11}}>App</span>
            <div className="ds-avatar" style={{width:22,height:22,fontSize:8}}>JD</div>
          </div>
          <div style={{display:'flex',flex:1,overflow:'hidden'}}>
            <div className="ds-layout-sidebar">
              {['Home','Files','Team','Settings'].map(l=>(
                <div key={l} className="ds-layout-nav-item">{l}</div>
              ))}
            </div>
            <div className="ds-layout-main">
              <div className="ds-skeleton" style={{height:8,width:'60%',marginBottom:6}}/>
              <div className="ds-skeleton" style={{height:8,width:'80%'}}/>
            </div>
          </div>
          <div className="ds-layout-footer">Footer</div>
        </div>
      </Section>
      <Section title="Drag and Drop">
        <div style={{display:'flex',flexDirection:'column',gap:4,maxWidth:280}}>
          {dragItems.map((item,idx)=>(
            <div
              key={item}
              className={`ds-draggable${dragging===idx?' dragging':''}`}
              draggable
              onDragStart={()=>setDragging(idx)}
              onDragOver={e=>e.preventDefault()}
              onDrop={()=>onDrop(idx)}
            >
              <span className="ds-draggable-handle">⋮⋮</span>
              {item}
            </div>
          ))}
        </div>
      </Section>
      <Section title="Error Page">
        <div className="ds-error-page" style={{maxWidth:300}}>
          <div className="ds-error-code">404</div>
          <div className="ds-error-title">Page not found</div>
          <div className="ds-error-desc">The page you're looking for doesn't exist or has been moved.</div>
          <button className="ds-btn primary sm">Go home</button>
        </div>
      </Section>
      <Section title="Comment Box">
        <div className="ds-comment-box" style={{maxWidth:340}}>
          <div className="ds-avatar" style={{width:32,height:32,fontSize:11,flexShrink:0}}>JD</div>
          <div className="ds-comment-inner">
            <textarea className="ds-input ds-comment-textarea" rows={2} placeholder="Leave a comment…" />
            <div className="ds-comment-footer">
              <span style={{fontSize:11,color:'var(--ds-neutral-400)'}}>Markdown supported</span>
              <button className="ds-btn primary sm">Post</button>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Callout">
        <Col>
          {[
            {type:'info',   icon:'ℹ', title:'Pro tip',  text:'Use keyboard shortcuts to navigate faster.'},
            {type:'warning',icon:'⚠', title:'Heads up', text:'This action may take up to 5 minutes.'},
          ].map(c=>(
            <div key={c.type} className={`ds-callout ${c.type}`}>
              <span>{c.icon}</span>
              <div><div style={{fontWeight:500,marginBottom:2,fontSize:13}}>{c.title}</div><div style={{fontSize:12,lineHeight:1.5}}>{c.text}</div></div>
            </div>
          ))}
        </Col>
      </Section>
    </div>
  );
}

// ─── TYPOGRAPHY ─────────────────────────────────────────────
export function TypographyPreview() {
  return (
    <div className="preview-sections">
      <Section title="Headline">
        <Col>
          <h1 className="ds-headline h1">The quick brown fox</h1>
          <h2 className="ds-headline h2">The quick brown fox jumps</h2>
          <h3 className="ds-headline h3">The quick brown fox jumps over</h3>
          <h4 className="ds-headline h4">The quick brown fox jumps over the lazy dog</h4>
        </Col>
      </Section>
      <Section title="Text">
        <Col>
          <p className="ds-text lg">Large body — Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p className="ds-text">Default body — Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          <p className="ds-text sm">Small body — Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
          <p className="ds-text muted">Muted — This text is de-emphasized for secondary information.</p>
        </Col>
      </Section>
      <Section title="Label">
        <Col>
          <label className="ds-label">Form field label</label>
          <label className="ds-label required">Required field</label>
          <label className="ds-label sm">Small label</label>
        </Col>
      </Section>
      <Section title="Link">
        <Col>
          <a className="ds-link">Default link</a>
          <a className="ds-link muted">Muted link</a>
          <a className="ds-link danger">Danger link</a>
        </Col>
      </Section>
      <Section title="Hero Icon">
        <div className="ds-hero-icon-grid">
          {[
            {name:'Home',     svg:'M3 12l9-9 9 9M5 10v9h5v-5h4v5h5v-9'},
            {name:'Search',   svg:'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'},
            {name:'Bell',     svg:'M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.003 6.003 0 0 0-5-5.917V5a1 1 0 0 0-2 0v.083A6.003 6.003 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9'},
            {name:'User',     svg:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'},
            {name:'Settings', svg:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'},
            {name:'Star',     svg:'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118L3.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z'},
          ].map(({name,svg})=>(
            <div key={name} className="ds-hero-icon-item">
              <svg className="ds-hero-icon-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={svg}/>
              </svg>
              <span className="ds-hero-icon-name">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
