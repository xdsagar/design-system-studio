import { useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, AlignCenter, AlignLeft, AlignRight,
  Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight,
  Award, BarChart2, BarChart3, Bell, Bluetooth, Bold, Bookmark,
  Bug, Calendar, Camera, Check, CheckCircle, ChevronDown, ChevronLeft,
  ChevronRight, ChevronUp, Clipboard, Clock, Cloud, CloudDownload, CloudUpload,
  Code, Code2, Copy, CornerDownLeft, CreditCard, Crop, Database, Download,
  Edit, ExternalLink, Eye, EyeOff, File, FileDown, FileText, FileUp,
  Filter, Fingerprint, Flag, Folder, FolderOpen, Gauge, Globe, Grid3x3,
  GripVertical, Heart, HelpCircle, Home, Image, Info, Italic, Key,
  LayoutDashboard, LayoutGrid, LayoutList, Layers, Lightbulb, Link,
  LineChart, List, Loader, Lock, LogIn, LogOut, Mail, MapPin, Maximize2,
  Megaphone, Menu, MessageCircle, MessageSquare, Mic, Minimize2, Minus,
  Monitor, MoreHorizontal, MoreVertical, Move, Navigation, Package, Palette,
  PanelLeft, PanelRight, Pencil, Phone, PieChart, Pin, Play, Plus,
  RefreshCw, Rocket, RotateCcw, Search, Send, Settings, Shield, Scissors,
  Share2, ShoppingBag, ShoppingCart, SkipBack, SkipForward, Sliders,
  Smartphone, SortAsc, Sparkles, Star, Tag, Tags, Tablet, Terminal,
  ThumbsDown, ThumbsUp, Timer, Trash2, TrendingDown, TrendingUp, Truck,
  Underline, Unlock, Upload, User, UserCheck, UserMinus, UserPlus, Users,
  UserX, Video, Volume2, Wand2, Wifi, X, XCircle, Zap, ZoomIn, ZoomOut,
} from 'lucide-react';

// ─── Shared helpers ─────────────────────────────────────────
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
function DsChip({ children }) {
  return (
    <span className="ds-chip">
      {children}
      <button className="chip-x" aria-label={`Remove ${children}`}><X size={10} /></button>
    </span>
  );
}
function BtnSpinner() {
  return <span style={{width:12,height:12,border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin .6s linear infinite'}} />;
}
function StoryFrame({ children }) {
  return <div className="story-frame">{children}</div>;
}
function Variant({ label, children }) {
  return (
    <div className="story-variant">
      <div className="story-variant-label">{label}</div>
      <div className="story-variant-content">{children}</div>
    </div>
  );
}
function StateTable({ children }) {
  return <div className="state-table">{children}</div>;
}
function StateRow({ label, children }) {
  return (
    <div className="state-row">
      <span className="state-row-label">{label}</span>
      <div className="state-row-demo">{children}</div>
    </div>
  );
}

// ─── Individual Stories ──────────────────────────────────────

export function AccordionStory() {
  const [open, setOpen] = useState(null);
  const items = [
    {q:'What payment methods do you accept?', a:'We accept Visa, Mastercard, and PayPal.'},
    {q:'Can I cancel anytime?',               a:'Yes, cancel with one click from your account settings.'},
    {q:'Is there a free trial?',              a:'Every plan includes a 14-day free trial, no card required.'},
  ];
  return (
    <StoryFrame>
      <Variant label="Default">
        <div className="ds-accordion" style={{maxWidth:400}}>
          {items.map((item,i)=>(
            <div key={i} className="accordion-item">
              <button className="accordion-trigger" onClick={()=>setOpen(open===i?null:i)}>
                <span>{item.q}</span>
                <ChevronDown size={14} style={{transform:open===i?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0,color:'var(--ds-neutral-400)'}} />
              </button>
              {open===i && <div className="accordion-body">{item.a}</div>}
            </div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function ActionBarStory() {
  return (
    <StoryFrame>
      <Variant label="Bulk selection">
        <div className="ds-action-bar">
          <span className="ds-action-bar-title">3 items selected</span>
          <div style={{display:'flex',gap:6}}>
            <button className="ds-btn ghost sm" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}}>Move</button>
            <button className="ds-btn ghost sm" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}}>Copy</button>
            <button className="ds-btn danger sm">Delete</button>
          </div>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function AlertStory() {
  const alerts = [
    {type:'info',    Icon:Info,          title:'Heads up',  desc:'Your trial ends in 3 days.'},
    {type:'success', Icon:Check,         title:'Saved',     desc:'Your changes have been saved.'},
    {type:'warning', Icon:AlertTriangle, title:'Attention', desc:'Storage is at 88% capacity.'},
    {type:'danger',  Icon:X,            title:'Error',     desc:'Something went wrong. Please retry.'},
  ];
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col>
          {alerts.map(a=>(
            <div key={a.type} className={`ds-alert ${a.type}`}>
              <a.Icon size={14} style={{flexShrink:0,marginTop:1}} />
              <div><div style={{fontWeight:500,marginBottom:2}}>{a.title}</div><div style={{fontSize:11,opacity:.9}}>{a.desc}</div></div>
            </div>
          ))}
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function AppLayoutStory() {
  return (
    <StoryFrame>
      <Variant label="App shell">
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
      </Variant>
    </StoryFrame>
  );
}

export function AvatarStory() {
  return (
    <StoryFrame>
      <Variant label="Sizes">
        <StateTable>
          {[['XS',24],['SM',32],['MD',40],['LG',52],['XL',64]].map(([lbl,s])=>(
            <StateRow key={s} label={lbl}>
              <div className="ds-avatar" style={{width:s,height:s,fontSize:s*0.3}}>{s>32?'JD':'J'}</div>
            </StateRow>
          ))}
        </StateTable>
      </Variant>
      <Variant label="Group">
        <div style={{display:'flex'}}>
          {['JD','MK','SR','+3'].map((i,idx)=>(
            <div key={i} className="ds-avatar" style={{width:32,height:32,fontSize:11,border:'2px solid var(--ds-surface)',marginLeft:idx===0?0:-8,zIndex:4-idx}}>{i}</div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function BadgeStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Row wrap>
          <span className="ds-badge brand">Brand</span>
          <span className="ds-badge success">Active</span>
          <span className="ds-badge warning">Pending</span>
          <span className="ds-badge danger">Error</span>
          <span className="ds-badge neutral">Draft</span>
        </Row>
      </Variant>
      <Variant label="With status dot">
        <Row wrap>
          <span className="ds-badge success dot">Online</span>
          <span className="ds-badge warning dot">Away</span>
          <span className="ds-badge danger dot">Offline</span>
        </Row>
      </Variant>
    </StoryFrame>
  );
}

export function BannerStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col>
          <div className="ds-banner info">
            <span style={{display:'flex',alignItems:'center',gap:6}}>
              <Megaphone size={14} style={{flexShrink:0}} />
              New features available — <a style={{color:'inherit',fontWeight:600,cursor:'pointer'}}>See what's new</a>
            </span>
            <button className="ds-banner-close"><X size={13} /></button>
          </div>
          <div className="ds-banner warning">
            <span style={{display:'flex',alignItems:'center',gap:6}}>
              <AlertTriangle size={14} style={{flexShrink:0}} />
              Subscription expires in 7 days. <a style={{color:'inherit',fontWeight:600,cursor:'pointer'}}>Renew now</a>
            </span>
            <button className="ds-banner-close"><X size={13} /></button>
          </div>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function BreadcrumbsStory() {
  return (
    <StoryFrame>
      <Variant label="Default">
        <nav style={{display:'flex',alignItems:'center',gap:4,fontSize:13}}>
          {['Home','Projects'].map(c=>(
            <span key={c} style={{display:'flex',alignItems:'center',gap:4}}>
              <a style={{color:'var(--ds-neutral-600)',textDecoration:'none',cursor:'pointer'}}>{c}</a>
              <ChevronRight size={12} style={{color:'var(--ds-neutral-400)'}} />
            </span>
          ))}
          <span style={{color:'var(--ds-neutral-800)',fontWeight:500}}>Design System</span>
        </nav>
      </Variant>
      <Variant label="Long path">
        <nav style={{display:'flex',alignItems:'center',gap:4,fontSize:13}}>
          {['Home','Workspace','Team'].map(c=>(
            <span key={c} style={{display:'flex',alignItems:'center',gap:4}}>
              <a style={{color:'var(--ds-neutral-600)',textDecoration:'none',cursor:'pointer'}}>{c}</a>
              <ChevronRight size={12} style={{color:'var(--ds-neutral-400)'}} />
            </span>
          ))}
          <span style={{color:'var(--ds-neutral-800)',fontWeight:500}}>Settings</span>
        </nav>
      </Variant>
    </StoryFrame>
  );
}

export function ButtonStory() {
  const [loading, setLoading] = useState(false);
  function simulateLoad() { setLoading(true); setTimeout(() => setLoading(false), 2000); }
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Row wrap>
          <button className="ds-btn primary">Primary</button>
          <button className="ds-btn secondary">Secondary</button>
          <button className="ds-btn tertiary">Tertiary</button>
          <button className="ds-btn ghost">Ghost</button>
          <button className="ds-btn danger">Danger</button>
          <button className="ds-btn link">Link</button>
        </Row>
      </Variant>
      <Variant label="Sizes">
        <StateTable>
          <StateRow label="Small"><button className="ds-btn primary sm">Button</button></StateRow>
          <StateRow label="Default"><button className="ds-btn primary">Button</button></StateRow>
          <StateRow label="Large"><button className="ds-btn primary lg">Button</button></StateRow>
        </StateTable>
      </Variant>
      <Variant label="States">
        <StateTable>
          <StateRow label="Default">
            <button className="ds-btn primary">Save changes</button>
          </StateRow>
          <StateRow label="Loading">
            <button className="ds-btn primary" onClick={simulateLoad}>
              {loading ? <><BtnSpinner /> Saving…</> : 'Click me'}
            </button>
          </StateRow>
          <StateRow label="Disabled">
            <button className="ds-btn primary" style={{opacity:.45,cursor:'not-allowed'}} disabled>Save changes</button>
          </StateRow>
          <StateRow label="Icon only">
            <button className="ds-btn ghost icon-only" aria-label="Settings"><Settings size={14} /></button>
          </StateRow>
          <StateRow label="Icon + label">
            <button className="ds-btn secondary icon-left"><Upload size={13} /> Upload</button>
          </StateRow>
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function ButtonGroupStory() {
  return (
    <StoryFrame>
      <Variant label="Primary">
        <div className="ds-btn-group">
          <button className="ds-btn primary">Save</button>
          <button className="ds-btn primary">Preview</button>
          <button className="ds-btn primary">Publish</button>
        </div>
      </Variant>
      <Variant label="Secondary">
        <div className="ds-btn-group">
          <button className="ds-btn secondary">Day</button>
          <button className="ds-btn secondary">Week</button>
          <button className="ds-btn secondary">Month</button>
          <button className="ds-btn secondary">Year</button>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function CalloutStory() {
  const callouts = [
    {type:'info',    Icon:Info,          title:'Pro tip',  text:'Use keyboard shortcuts to navigate faster.'},
    {type:'warning', Icon:AlertTriangle, title:'Heads up', text:'This action may take up to 5 minutes.'},
  ];
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col>
          {callouts.map(c=>(
            <div key={c.type} className={`ds-callout ${c.type}`}>
              <c.Icon size={14} style={{flexShrink:0}} />
              <div><div style={{fontWeight:500,marginBottom:2,fontSize:13}}>{c.title}</div><div style={{fontSize:12,lineHeight:1.5}}>{c.text}</div></div>
            </div>
          ))}
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function CardStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="ds-card"><div className="card-title">Default card</div><div className="card-text">A general-purpose surface for grouping content.</div></div>
          <div className="ds-card interactive"><div className="card-title">Interactive</div><div className="card-text">Hover me for the lift effect.</div></div>
        </div>
      </Variant>
      <Variant label="Media card">
        <div className="ds-card media-card" style={{maxWidth:240}}>
          <div className="card-image-placeholder">Image</div>
          <div style={{padding:14}}>
            <div className="card-title" style={{fontSize:14}}>Media card</div>
            <div className="card-text">With image header and footer.</div>
            <div className="card-footer"><span className="ds-badge brand">New</span><button className="ds-btn primary sm">View</button></div>
          </div>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function CheckboxStory() {
  const [checked, setChecked] = useState(true);
  return (
    <StoryFrame>
      <Variant label="States">
        <StateTable>
          <StateRow label="Checked">
            <label className="ds-check-label">
              <input type="checkbox" className="ds-check" checked={checked} onChange={e=>setChecked(e.target.checked)} />
              <span>Remember me</span>
            </label>
          </StateRow>
          <StateRow label="Unchecked">
            <label className="ds-check-label">
              <input type="checkbox" className="ds-check" />
              <span>Subscribe to newsletter</span>
            </label>
          </StateRow>
          <StateRow label="Disabled on">
            <label className="ds-check-label" style={{opacity:.5,pointerEvents:'none'}}>
              <input type="checkbox" className="ds-check" checked readOnly />
              <span>Always selected</span>
            </label>
          </StateRow>
          <StateRow label="Disabled off">
            <label className="ds-check-label" style={{opacity:.5,pointerEvents:'none'}}>
              <input type="checkbox" className="ds-check" />
              <span>Not available</span>
            </label>
          </StateRow>
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function CheckboxGroupStory() {
  const [selected, setSelected] = useState(['Design']);
  function toggle(val) { setSelected(p=>p.includes(val)?p.filter(v=>v!==val):[...p,val]); }
  return (
    <StoryFrame>
      <Variant label="Group">
        <div className="ds-checkbox-group">
          {['Design','Development','Marketing','Analytics'].map(item=>(
            <label key={item} className="ds-check-label">
              <input type="checkbox" className="ds-check" checked={selected.includes(item)} onChange={()=>toggle(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function ChipStory() {
  return (
    <StoryFrame>
      <Variant label="Default">
        <Row wrap>
          {['Design','React','TypeScript','Figma'].map(t=><DsChip key={t}>{t}</DsChip>)}
        </Row>
      </Variant>
    </StoryFrame>
  );
}

export function ComboboxStory() {
  const [val, setVal] = useState('');
  const [open, setOpen] = useState(false);
  const options = ['Design','Development','Marketing','Sales','Support'];
  return (
    <StoryFrame>
      <Variant label="Searchable dropdown">
        <div style={{position:'relative',maxWidth:280}}>
          <input
            className="ds-input"
            placeholder="Select team…"
            value={val}
            onChange={e=>setVal(e.target.value)}
            onFocus={()=>setOpen(true)}
            onBlur={()=>setTimeout(()=>setOpen(false),150)}
          />
          {open && (
            <div className="ds-combobox-dropdown">
              {options.filter(o=>o.toLowerCase().includes(val.toLowerCase())).map(o=>(
                <div key={o} className="ds-combobox-option" onMouseDown={()=>{setVal(o);setOpen(false);}}>
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function CommentBoxStory() {
  return (
    <StoryFrame>
      <Variant label="Default">
        <div className="ds-comment-box" style={{maxWidth:360}}>
          <div className="ds-avatar" style={{width:32,height:32,fontSize:11,flexShrink:0}}>JD</div>
          <div className="ds-comment-inner">
            <textarea className="ds-input ds-comment-textarea" rows={3} placeholder="Leave a comment…" />
            <div className="ds-comment-footer">
              <span style={{fontSize:11,color:'var(--ds-neutral-400)'}}>Markdown supported</span>
              <button className="ds-btn primary sm">Post</button>
            </div>
          </div>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function DatePickerStory() {
  return (
    <StoryFrame>
      <Variant label="Date inputs">
        <Col style={{maxWidth:280}}>
          <Field label="Start date"><input className="ds-input" type="date" /></Field>
          <Field label="End date"><input className="ds-input" type="date" /></Field>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function DividerStory() {
  return (
    <StoryFrame>
      <Variant label="Plain">
        <div className="ds-divider" />
      </Variant>
      <Variant label="With label">
        <div className="ds-divider"><span className="ds-divider-label">or continue with</span></div>
      </Variant>
    </StoryFrame>
  );
}

export function DragDropStory() {
  const [items, setItems] = useState(['Item A','Item B','Item C','Item D']);
  const [dragging, setDragging] = useState(null);
  function onDrop(idx) {
    if (dragging===null||dragging===idx){setDragging(null);return;}
    const arr=[...items],[item]=arr.splice(dragging,1);arr.splice(idx,0,item);
    setItems(arr);setDragging(null);
  }
  return (
    <StoryFrame>
      <Variant label="Drag to reorder">
        <div style={{display:'flex',flexDirection:'column',gap:4,maxWidth:280}}>
          {items.map((item,idx)=>(
            <div key={item} className={`ds-draggable${dragging===idx?' dragging':''}`}
              draggable
              onDragStart={()=>setDragging(idx)}
              onDragOver={e=>e.preventDefault()}
              onDrop={()=>onDrop(idx)}>
              <span className="ds-draggable-handle"><GripVertical size={14} /></span>
              {item}
            </div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function ErrorPageStory() {
  return (
    <StoryFrame>
      <Variant label="404">
        <div className="ds-error-page" style={{maxWidth:320}}>
          <div className="ds-error-code">404</div>
          <div className="ds-error-title">Page not found</div>
          <div className="ds-error-desc">The page you're looking for doesn't exist or has been moved.</div>
          <button className="ds-btn primary sm">Go home</button>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function FabStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <StateTable>
          <StateRow label="Primary"><button className="ds-fab" title="Add"><Plus size={18} /></button></StateRow>
          <StateRow label="Secondary"><button className="ds-fab secondary" title="Edit"><Pencil size={14} /></button></StateRow>
          <StateRow label="Small"><button className="ds-fab sm" title="Up"><ArrowUp size={13} /></button></StateRow>
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function FileUploaderStory() {
  return (
    <StoryFrame>
      <Variant label="Drop zone">
        <label className="ds-file-uploader">
          <span className="file-uploader-icon"><FileUp size={28} /></span>
          <span className="file-uploader-text">Drop files here or <span style={{color:'var(--ds-brand)'}}>browse</span></span>
          <span className="file-uploader-hint">PNG, JPG, PDF — up to 10 MB</span>
          <input type="file" style={{display:'none'}} />
        </label>
      </Variant>
    </StoryFrame>
  );
}

export function FooterStory() {
  return (
    <StoryFrame>
      <Variant label="Default">
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
          <span style={{fontSize:11,color:'var(--ds-neutral-400)'}}>&copy; 2026</span>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function FormWrapperStory() {
  return (
    <StoryFrame>
      <Variant label="Account settings">
        <div className="ds-form-wrapper" style={{maxWidth:360}}>
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
      </Variant>
    </StoryFrame>
  );
}

export function HeaderStory() {
  return (
    <StoryFrame>
      <Variant label="Top navigation">
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
      </Variant>
    </StoryFrame>
  );
}

export function HeadlineStory() {
  return (
    <StoryFrame>
      <Variant label="Scale">
        <Col>
          <h1 className="ds-headline h1">The quick brown fox</h1>
          <h2 className="ds-headline h2">The quick brown fox jumps</h2>
          <h3 className="ds-headline h3">The quick brown fox jumps over</h3>
          <h4 className="ds-headline h4">The quick brown fox jumps over the lazy dog</h4>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function HeroIconStory() {
  const icons = [
    {name:'Home',     Icon:Home},
    {name:'Search',   Icon:Search},
    {name:'Bell',     Icon:Bell},
    {name:'User',     Icon:User},
    {name:'Settings', Icon:Settings},
    {name:'Star',     Icon:Star},
    {name:'Folder',   Icon:Folder},
    {name:'Upload',   Icon:Upload},
    {name:'Trash',    Icon:Trash2},
    {name:'Pencil',   Icon:Pencil},
    {name:'Mail',     Icon:Mail},
    {name:'Chart',    Icon:BarChart2},
  ];
  return (
    <StoryFrame>
      <Variant label="Icon library">
        <div className="ds-hero-icon-grid">
          {icons.map(({name,Icon})=>(
            <div key={name} className="ds-hero-icon-item">
              <Icon size={24} className="ds-hero-icon-symbol" strokeWidth={1.5} />
              <span className="ds-hero-icon-name">{name}</span>
            </div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function IndicatorStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <StateTable>
          <StateRow label="Badge count">
            <div className="ds-indicator">
              <button className="ds-btn ghost icon-only"><Bell size={15} /></button>
              <span className="ds-indicator-dot danger">3</span>
            </div>
          </StateRow>
          <StateRow label="Online status">
            <div className="ds-indicator">
              <div className="ds-avatar" style={{width:36,height:36,fontSize:13}}>JD</div>
              <span className="ds-indicator-dot success" />
            </div>
          </StateRow>
          <StateRow label="Message count">
            <div className="ds-indicator">
              <button className="ds-btn ghost icon-only"><Mail size={15} /></button>
              <span className="ds-indicator-dot brand">12</span>
            </div>
          </StateRow>
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function InputStory() {
  return (
    <StoryFrame>
      <Variant label="States">
        <Col style={{maxWidth:320}}>
          <Field label="Full name" hint="As shown on your ID">
            <input className="ds-input" type="text" placeholder="Jane Smith" />
          </Field>
          <Field label="Email (error)" error="Enter a valid email address">
            <input className="ds-input error" type="email" defaultValue="not-an-email" />
          </Field>
          <Field label="Disabled">
            <input className="ds-input" type="text" value="Cannot edit" disabled readOnly />
          </Field>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function LabelStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col>
          <label className="ds-label">Form field label</label>
          <label className="ds-label required">Required field</label>
          <label className="ds-label sm">Small label</label>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function LinkStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col>
          <a className="ds-link">Default link</a>
          <a className="ds-link muted">Muted link</a>
          <a className="ds-link danger">Danger link</a>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function ListStory() {
  return (
    <StoryFrame>
      <Variant label="User list">
        <div className="ds-list" style={{maxWidth:320}}>
          {[
            {label:'Jane Doe',   meta:'Admin'},
            {label:'Mike Kim',   meta:'Editor'},
            {label:'Sara Reyes', meta:'Viewer'},
          ].map(item=>(
            <div key={item.label} className="ds-list-item">
              <span className="ds-list-icon"><User size={14} /></span>
              <div className="ds-list-item-label">{item.label}</div>
              <div className="ds-list-item-meta">{item.meta}</div>
            </div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function MenuStory() {
  const [open, setOpen] = useState(false);
  return (
    <StoryFrame>
      <Variant label="Dropdown menu">
        <div style={{position:'relative',display:'inline-block'}}>
          <button className="ds-btn secondary sm" onClick={()=>setOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:6}}>
            Options <ChevronDown size={12} />
          </button>
          {open && (
            <div className="ds-menu">
              {['Edit','Duplicate','Archive',null,'Delete'].map((item,i)=>
                item===null
                  ? <div key={i} className="ds-menu-divider"/>
                  : <button key={item} className={`ds-menu-item${item==='Delete'?' danger':''}`} onClick={()=>setOpen(false)}>{item}</button>
              )}
            </div>
          )}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function ModalStory() {
  const [open, setOpen] = useState(false);
  return (
    <StoryFrame>
      <Variant label="Dialog">
        <button className="ds-btn secondary sm" onClick={()=>setOpen(true)}>Open modal</button>
        {open && (
          <div className="ds-modal-overlay" onClick={()=>setOpen(false)}>
            <div className="ds-modal" onClick={e=>e.stopPropagation()}>
              <div className="ds-modal-header">
                <span className="ds-modal-title">Confirm action</span>
                <button className="ds-modal-close" onClick={()=>setOpen(false)}><X size={16} /></button>
              </div>
              <div className="ds-modal-body">
                Are you sure you want to delete this project? This action cannot be undone.
              </div>
              <div className="ds-modal-footer">
                <button className="ds-btn ghost sm" onClick={()=>setOpen(false)}>Cancel</button>
                <button className="ds-btn danger sm" onClick={()=>setOpen(false)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </Variant>
    </StoryFrame>
  );
}

export function NavStory() {
  const [active, setActive] = useState('dashboard');
  const navItems = [
    {id:'dashboard', label:'Dashboard', Icon:LayoutGrid},
    {id:'projects',  label:'Projects',  Icon:Folder},
    {id:'team',      label:'Team',      Icon:Users},
    {id:'settings',  label:'Settings',  Icon:Settings},
  ];
  return (
    <StoryFrame>
      <Variant label="Sidebar">
        <div className="ds-nav">
          {navItems.map(item=>(
            <button key={item.id} className={`ds-nav-item ${active===item.id?'active':''}`} onClick={()=>setActive(item.id)}>
              <span className="ds-nav-icon"><item.Icon size={14} /></span>
              {item.label}
            </button>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function PageHeadingStory() {
  return (
    <StoryFrame>
      <Variant label="With action">
        <div className="ds-page-heading">
          <div>
            <h1 className="ds-page-heading-title">Projects</h1>
            <p className="ds-page-heading-desc">Manage and track all your design projects.</p>
          </div>
          <button className="ds-btn primary sm">New project</button>
        </div>
      </Variant>
      <Variant label="Simple">
        <div className="ds-page-heading">
          <div>
            <h1 className="ds-page-heading-title">Settings</h1>
            <p className="ds-page-heading-desc">Manage your account and preferences.</p>
          </div>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function PaginationStory() {
  const [page, setPage] = useState(1);
  return (
    <StoryFrame>
      <Variant label="Default">
        <div className="ds-pagination">
          <button className="page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={14} /></button>
          {[1,2,3,'…',12].map((n,i)=>(
            typeof n==='number'
              ? <button key={i} className={`page-btn ${page===n?'active':''}`} onClick={()=>setPage(n)}>{n}</button>
              : <span key={i} className="page-ellipsis">…</span>
          ))}
          <button className="page-btn" onClick={()=>setPage(p=>Math.min(12,p+1))}><ChevronRight size={14} /></button>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function PanelStory() {
  return (
    <StoryFrame>
      <Variant label="Team members">
        <div className="ds-panel" style={{maxWidth:340}}>
          <div className="ds-panel-header">
            <span>Team members</span>
            <button className="ds-btn ghost sm">Add</button>
          </div>
          <div className="ds-panel-body">
            {['Jane Doe — Admin','Mike Kim — Editor','Sara Reyes — Viewer'].map(m=>(
              <div key={m} style={{fontSize:12,color:'var(--ds-neutral-600)',padding:'4px 0',borderBottom:'0.5px solid var(--ds-neutral-100)'}}>{m}</div>
            ))}
          </div>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function ProgressBarStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col style={{maxWidth:320}}>
          {[['Storage','65%',65,'brand'],['Success rate','92%',92,'success'],['Disk usage','88%',88,'danger']].map(([l,pct,val,t])=>(
            <div key={l}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                <span>{l}</span><span className={`stat-change ${t}`}>{pct}</span>
              </div>
              <div className="ds-progress-wrap">
                <div className="ds-progress-bar" style={{width:`${val}%`,background:t==='success'?'var(--ds-success)':t==='danger'?'var(--ds-danger)':'var(--ds-brand)'}} />
              </div>
            </div>
          ))}
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function ProgressCircleStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <StateTable>
          {[['Storage used',75,'brand'],['Success rate',55,'success'],['Disk usage',88,'danger']].map(([lbl,pct,t])=>{
            const r=22, circ=2*Math.PI*r, dash=(pct/100)*circ;
            const color = t==='success'?'var(--ds-success)':t==='danger'?'var(--ds-danger)':'var(--ds-brand)';
            return (
              <StateRow key={lbl} label={lbl}>
                <div className="ds-progress-circle">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r={r} fill="none" stroke="var(--ds-neutral-100)" strokeWidth="5"/>
                    <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                      transform="rotate(-90 30 30)"/>
                  </svg>
                  <span className="progress-circle-label" style={{color}}>{pct}%</span>
                </div>
              </StateRow>
            );
          })}
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function RadioButtonStory() {
  const [radio, setRadio] = useState('Email');
  return (
    <StoryFrame>
      <Variant label="Notification method">
        <Col>
          {['Email','SMS','Push notification'].map(opt=>(
            <label key={opt} className="ds-radio-label">
              <input type="radio" className="ds-radio" name="notif-story" value={opt} checked={radio===opt} onChange={()=>setRadio(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function RadioGroupStory() {
  const [selected, setSelected] = useState('Monthly');
  return (
    <StoryFrame>
      <Variant label="Plan selection">
        <Row>
          {['Monthly','Annual'].map(p=>(
            <label key={p} className={`ds-radio-card ${selected===p?'selected':''}`} onClick={()=>setSelected(p)}>
              <div className="radio-card-title">{p}</div>
              <div className="radio-card-desc">{p==='Annual'?'Save 20%':'Billed monthly'}</div>
            </label>
          ))}
        </Row>
      </Variant>
    </StoryFrame>
  );
}

export function SearchStory() {
  return (
    <StoryFrame>
      <Variant label="Search input">
        <div className="ds-search-wrap" style={{maxWidth:320}}>
          <span className="ds-search-icon"><Search size={14} /></span>
          <input className="ds-input ds-search" placeholder="Search components…" />
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function SectionHeadingStory() {
  return (
    <StoryFrame>
      <Variant label="Variants">
        <Col>
          <div className="ds-section-heading">Recent activity</div>
          <div className="ds-section-heading" style={{fontSize:10}}>Team members</div>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function SelectStory() {
  return (
    <StoryFrame>
      <Variant label="Select">
        <Col style={{maxWidth:320}}>
          <Field label="Country">
            <select className="ds-input">
              <option>United States</option>
              <option>United Kingdom</option>
              <option>France</option>
            </select>
          </Field>
        </Col>
      </Variant>
      <Variant label="Textarea">
        <Col style={{maxWidth:320}}>
          <Field label="Bio">
            <textarea className="ds-input" rows={3} placeholder="Tell us about yourself…" style={{resize:'vertical',lineHeight:1.5}} />
          </Field>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function SkeletonStory() {
  return (
    <StoryFrame>
      <Variant label="Loading state">
        <Col style={{maxWidth:280}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="ds-skeleton" style={{width:40,height:40,borderRadius:'50%',flexShrink:0}}/>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <div className="ds-skeleton" style={{height:12,width:'60%'}}/>
              <div className="ds-skeleton" style={{height:12,width:'80%'}}/>
            </div>
          </div>
          <div className="ds-skeleton" style={{height:12}}/>
          <div className="ds-skeleton" style={{height:12,width:'70%'}}/>
          <div className="ds-skeleton" style={{height:80,borderRadius:8}}/>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function SliderStory() {
  const [val, setVal] = useState(65);
  return (
    <StoryFrame>
      <Variant label="Range slider">
        <Col style={{maxWidth:300}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
            <span>Volume</span><span style={{color:'var(--ds-neutral-400)'}}>{val}%</span>
          </div>
          <input type="range" className="ds-slider" min={0} max={100} value={val} onChange={e=>setVal(+e.target.value)} />
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function SnackbarStory() {
  const [show, setShow] = useState(false);
  return (
    <StoryFrame>
      <Variant label="Toast notifications">
        <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:320}}>
          {[
            {type:'success', Icon:Check, title:'Saved',  desc:'Your changes were saved.'},
            {type:'danger',  Icon:X,    title:'Failed', desc:'Could not connect to server.'},
          ].map(t=>(
            <div key={t.type} className="ds-toast">
              <span className={`toast-icon ${t.type}`}><t.Icon size={13} /></span>
              <div><div className="toast-title">{t.title}</div><div className="toast-desc">{t.desc}</div></div>
              <button className="toast-close"><X size={13} /></button>
            </div>
          ))}
        </div>
      </Variant>
      <Variant label="Snackbar trigger">
        <div style={{position:'relative',display:'inline-block'}}>
          <button className="ds-btn secondary sm" onClick={()=>{setShow(true);setTimeout(()=>setShow(false),3000);}}>
            Show snackbar
          </button>
          {show && (
            <div className="ds-snackbar" style={{position:'absolute',left:0,bottom:'calc(100% + 8px)',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6}}>
              <Check size={13} /> Action completed
              <button className="ds-snackbar-action" onClick={()=>setShow(false)}>Undo</button>
            </div>
          )}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function SpinnerStory() {
  return (
    <StoryFrame>
      <Variant label="Sizes">
        <StateTable>
          <StateRow label="Small"><div className="ds-spinner sm" /></StateRow>
          <StateRow label="Default"><div className="ds-spinner" /></StateRow>
          <StateRow label="Large"><div className="ds-spinner lg" /></StateRow>
        </StateTable>
      </Variant>
      <Variant label="Colors">
        <StateTable>
          <StateRow label="Brand"><div className="ds-spinner" /></StateRow>
          <StateRow label="Success"><div className="ds-spinner" style={{borderTopColor:'var(--ds-success)'}} /></StateRow>
          <StateRow label="Danger"><div className="ds-spinner" style={{borderTopColor:'var(--ds-danger)'}} /></StateRow>
          <StateRow label="Warning"><div className="ds-spinner" style={{borderTopColor:'var(--ds-warning)'}} /></StateRow>
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function StatCardStory() {
  const stats = [
    {label:'Revenue', value:'$48.2k', trend:'+12.5%', type:'success', up:true},
    {label:'Users',   value:'8,421',  trend:'+4.1%',  type:'success', up:true},
    {label:'Churn',   value:'2.3%',   trend:'+0.4%',  type:'danger',  up:false},
  ];
  return (
    <StoryFrame>
      <Variant label="Metrics">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {stats.map(s=>(
            <div key={s.label} className="ds-stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change ${s.type}`} style={{display:'flex',alignItems:'center',gap:3}}>
                {s.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {s.trend}
              </div>
            </div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function StepperStory() {
  return (
    <StoryFrame>
      <Variant label="Checkout flow">
        <div className="ds-stepper">
          {['Cart','Shipping','Payment','Confirm'].map((s,i)=>(
            <div key={s} className={`ds-step ${i===0?'done':i===1?'active':''}`}>
              <div className="step-dot">{i===0?<Check size={12}/>:i+1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function TableStory() {
  const users = [
    {name:'Jane Doe',   initials:'JD', role:'Admin',  status:'success', statusLabel:'Active',  joined:'Jan 2024'},
    {name:'Mike Kim',   initials:'MK', role:'Editor', status:'warning', statusLabel:'Pending', joined:'Mar 2024'},
    {name:'Sara Reyes', initials:'SR', role:'Viewer', status:'neutral', statusLabel:'Invited', joined:'May 2024'},
  ];
  return (
    <StoryFrame>
      <Variant label="Data table">
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
      </Variant>
    </StoryFrame>
  );
}

export function TabsStory() {
  const [active, setActive] = useState(0);
  const [active2, setActive2] = useState(0);
  const tabs = ['Overview','Analytics','Settings','Billing'];
  const views = ['List','Grid','Board'];
  return (
    <StoryFrame>
      <Variant label="Underline (default)">
        <div>
          <div className="ds-tab-row">
            {tabs.map((t,i)=>(
              <button key={t} className={`ds-tab ${active===i?'active':''}`} onClick={()=>setActive(i)}>{t}</button>
            ))}
          </div>
          <div style={{padding:'12px 0',fontSize:12,color:'var(--ds-neutral-600)'}}>
            Showing: <strong>{tabs[active]}</strong> panel content
          </div>
        </div>
      </Variant>
      <Variant label="Enclosed / segmented">
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="ds-tab-row enclosed">
            {views.map((t,i)=>(
              <button key={t} className={`ds-tab ${active2===i?'active':''}`} onClick={()=>setActive2(i)}>{t}</button>
            ))}
          </div>
          <div style={{fontSize:12,color:'var(--ds-neutral-600)'}}>View: <strong>{views[active2]}</strong></div>
        </div>
      </Variant>
    </StoryFrame>
  );
}

export function TextStory() {
  return (
    <StoryFrame>
      <Variant label="Body scale">
        <Col>
          <p className="ds-text lg">Large body — Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p className="ds-text">Default body — Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
          <p className="ds-text sm">Small body — Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
          <p className="ds-text muted">Muted — This text is de-emphasized for secondary information.</p>
        </Col>
      </Variant>
    </StoryFrame>
  );
}

export function ToggleStory() {
  const [on, setOn] = useState(false);
  return (
    <StoryFrame>
      <Variant label="States">
        <StateTable>
          <StateRow label={on ? 'On' : 'Off'}>
            <label className="ds-check-label">
              <span className={`ds-toggle-track${on?' on':''}`} onClick={()=>setOn(v=>!v)} style={{cursor:'pointer'}}>
                <span className="ds-toggle-thumb" style={{transform:on?'translateX(16px)':'none'}}/>
              </span>
              <span>Enable notifications</span>
            </label>
          </StateRow>
          <StateRow label="Disabled on">
            <label className="ds-check-label" style={{opacity:.4,pointerEvents:'none'}}>
              <span className="ds-toggle-track on">
                <span className="ds-toggle-thumb" style={{transform:'translateX(16px)'}}/>
              </span>
              <span>Always enabled</span>
            </label>
          </StateRow>
          <StateRow label="Disabled off">
            <label className="ds-check-label" style={{opacity:.4,pointerEvents:'none'}}>
              <span className="ds-toggle-track">
                <span className="ds-toggle-thumb"/>
              </span>
              <span>Not available</span>
            </label>
          </StateRow>
        </StateTable>
      </Variant>
    </StoryFrame>
  );
}

export function TooltipStory() {
  const targets = [
    {Icon:Settings,     tip:'Open settings'},
    {Icon:Trash2,       tip:'Delete item'},
    {Icon:Pencil,       tip:'Edit'},
    {Icon:ExternalLink, tip:'Share'},
  ];
  return (
    <StoryFrame>
      <Variant label="Hover targets">
        <Row>
          {targets.map(({Icon,tip})=>(
            <div key={tip} className="tooltip-root">
              <button className="ds-btn ghost sm"><Icon size={14} /></button>
              <span className="ds-tooltip">{tip}</span>
            </div>
          ))}
        </Row>
      </Variant>
    </StoryFrame>
  );
}

export function IconsStory() {
  const [query, setQuery] = useState('');

  const ALL_ICONS = [
    // Actions
    { name: 'Plus',          Icon: Plus },
    { name: 'Minus',         Icon: Minus },
    { name: 'X',             Icon: X },
    { name: 'Check',         Icon: Check },
    { name: 'ChevronUp',     Icon: ChevronUp },
    { name: 'ChevronDown',   Icon: ChevronDown },
    { name: 'ChevronLeft',   Icon: ChevronLeft },
    { name: 'ChevronRight',  Icon: ChevronRight },
    { name: 'ArrowUp',       Icon: ArrowUp },
    { name: 'ArrowDown',     Icon: ArrowDown },
    { name: 'ArrowLeft',     Icon: ArrowLeft },
    { name: 'ArrowRight',    Icon: ArrowRight },
    { name: 'MoreHorizontal',Icon: MoreHorizontal },
    { name: 'MoreVertical',  Icon: MoreVertical },
    { name: 'Move',          Icon: Move },
    { name: 'RefreshCw',     Icon: RefreshCw },
    { name: 'RotateCcw',     Icon: RotateCcw },
    { name: 'Copy',          Icon: Copy },
    { name: 'Clipboard',     Icon: Clipboard },
    { name: 'Scissors',      Icon: Scissors },
    // UI
    { name: 'Search',        Icon: Search },
    { name: 'Filter',        Icon: Filter },
    { name: 'SortAsc',       Icon: SortAsc },
    { name: 'Sliders',       Icon: Sliders },
    { name: 'Menu',          Icon: Menu },
    { name: 'List',          Icon: List },
    { name: 'Grid',          Icon: Grid3x3 },
    { name: 'Layers',        Icon: Layers },
    { name: 'Layout',        Icon: LayoutDashboard },
    { name: 'Settings',      Icon: Settings },
    { name: 'Maximize',      Icon: Maximize2 },
    { name: 'Minimize',      Icon: Minimize2 },
    { name: 'ZoomIn',        Icon: ZoomIn },
    { name: 'ZoomOut',       Icon: ZoomOut },
    { name: 'Crop',          Icon: Crop },
    { name: 'Palette',       Icon: Palette },
    // Files
    { name: 'File',          Icon: File },
    { name: 'FileText',      Icon: FileText },
    { name: 'FileUp',        Icon: FileUp },
    { name: 'FileDown',      Icon: FileDown },
    { name: 'Folder',        Icon: Folder },
    { name: 'FolderOpen',    Icon: FolderOpen },
    { name: 'Download',      Icon: Download },
    { name: 'Upload',        Icon: Upload },
    { name: 'Archive',       Icon: Archive },
    { name: 'Trash',         Icon: Trash2 },
    // Communication
    { name: 'Mail',          Icon: Mail },
    { name: 'Bell',          Icon: Bell },
    { name: 'MessageSquare', Icon: MessageSquare },
    { name: 'MessageCircle', Icon: MessageCircle },
    { name: 'Send',          Icon: Send },
    { name: 'Phone',         Icon: Phone },
    { name: 'Video',         Icon: Video },
    { name: 'Mic',           Icon: Mic },
    // Media
    { name: 'Image',         Icon: Image },
    { name: 'Camera',        Icon: Camera },
    { name: 'Volume',        Icon: Volume2 },
    { name: 'Play',          Icon: Play },
    { name: 'SkipBack',      Icon: SkipBack },
    { name: 'SkipForward',   Icon: SkipForward },
    // Navigation
    { name: 'Home',          Icon: Home },
    { name: 'Bookmark',      Icon: Bookmark },
    { name: 'Star',          Icon: Star },
    { name: 'Heart',         Icon: Heart },
    { name: 'Link',          Icon: Link },
    { name: 'ExternalLink',  Icon: ExternalLink },
    { name: 'Globe',         Icon: Globe },
    { name: 'MapPin',        Icon: MapPin },
    { name: 'Navigation',    Icon: Navigation },
    // Users
    { name: 'User',          Icon: User },
    { name: 'Users',         Icon: Users },
    { name: 'UserPlus',      Icon: UserPlus },
    { name: 'UserMinus',     Icon: UserMinus },
    // Security
    { name: 'Lock',          Icon: Lock },
    { name: 'Unlock',        Icon: Unlock },
    { name: 'Eye',           Icon: Eye },
    { name: 'EyeOff',        Icon: EyeOff },
    { name: 'Shield',        Icon: Shield },
    { name: 'Key',           Icon: Key },
    // Data
    { name: 'BarChart',      Icon: BarChart2 },
    { name: 'PieChart',      Icon: PieChart },
    { name: 'TrendingUp',    Icon: TrendingUp },
    { name: 'TrendingDown',  Icon: TrendingDown },
    { name: 'Activity',      Icon: Activity },
    { name: 'Database',      Icon: Database },
    // Status
    { name: 'AlertTriangle', Icon: AlertTriangle },
    { name: 'AlertCircle',   Icon: AlertCircle },
    { name: 'Info',          Icon: Info },
    { name: 'CheckCircle',   Icon: CheckCircle },
    { name: 'XCircle',       Icon: XCircle },
    { name: 'HelpCircle',    Icon: HelpCircle },
    { name: 'Loader',        Icon: Loader },
    // Time
    { name: 'Calendar',      Icon: Calendar },
    { name: 'Clock',         Icon: Clock },
    { name: 'Timer',         Icon: Timer },
    // Design & editing
    { name: 'Pencil',        Icon: Pencil },
    { name: 'Edit',          Icon: Edit },
    { name: 'Wand2',         Icon: Wand2 },
    { name: 'Sparkles',      Icon: Sparkles },
    { name: 'Palette',       Icon: Palette },
    { name: 'Crop',          Icon: Crop },
    { name: 'GripVertical',  Icon: GripVertical },
    // Text formatting
    { name: 'Bold',          Icon: Bold },
    { name: 'Italic',        Icon: Italic },
    { name: 'Underline',     Icon: Underline },
    { name: 'AlignLeft',     Icon: AlignLeft },
    { name: 'AlignCenter',   Icon: AlignCenter },
    { name: 'AlignRight',    Icon: AlignRight },
    { name: 'Code',          Icon: Code },
    { name: 'Code2',         Icon: Code2 },
    { name: 'Terminal',      Icon: Terminal },
    // Commerce
    { name: 'ShoppingCart',  Icon: ShoppingCart },
    { name: 'ShoppingBag',   Icon: ShoppingBag },
    { name: 'CreditCard',    Icon: CreditCard },
    { name: 'Package',       Icon: Package },
    { name: 'Truck',         Icon: Truck },
    { name: 'Tag',           Icon: Tag },
    { name: 'Tags',          Icon: Tags },
    // Social & sharing
    { name: 'Share2',        Icon: Share2 },
    { name: 'ThumbsUp',      Icon: ThumbsUp },
    { name: 'ThumbsDown',    Icon: ThumbsDown },
    { name: 'Megaphone',     Icon: Megaphone },
    { name: 'Flag',          Icon: Flag },
    { name: 'Pin',           Icon: Pin },
    // Users (extended)
    { name: 'UserCheck',     Icon: UserCheck },
    { name: 'UserX',         Icon: UserX },
    { name: 'Award',         Icon: Award },
    // Cloud & connectivity
    { name: 'Cloud',         Icon: Cloud },
    { name: 'CloudDownload', Icon: CloudDownload },
    { name: 'CloudUpload',   Icon: CloudUpload },
    { name: 'Wifi',          Icon: Wifi },
    { name: 'Bluetooth',     Icon: Bluetooth },
    // Devices
    { name: 'Monitor',       Icon: Monitor },
    { name: 'Smartphone',    Icon: Smartphone },
    { name: 'Tablet',        Icon: Tablet },
    // Auth
    { name: 'LogIn',         Icon: LogIn },
    { name: 'LogOut',        Icon: LogOut },
    { name: 'Fingerprint',   Icon: Fingerprint },
    // Layout & panels
    { name: 'LayoutList',    Icon: LayoutList },
    { name: 'PanelLeft',     Icon: PanelLeft },
    { name: 'PanelRight',    Icon: PanelRight },
    // Data (extended)
    { name: 'BarChart3',     Icon: BarChart3 },
    { name: 'LineChart',     Icon: LineChart },
    { name: 'Gauge',         Icon: Gauge },
    // Misc
    { name: 'Lightbulb',     Icon: Lightbulb },
    { name: 'Rocket',        Icon: Rocket },
    { name: 'Zap',           Icon: Zap },
    { name: 'Bug',           Icon: Bug },
    { name: 'ArrowUpRight',  Icon: ArrowUpRight },
    { name: 'CornerDownLeft',Icon: CornerDownLeft },
  ];

  const filtered = query.trim()
    ? ALL_ICONS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : ALL_ICONS;

  return (
    <StoryFrame>
      <Variant label={`${filtered.length} icons`}>
        <div style={{width:'100%',display:'flex',flexDirection:'column',gap:12}}>
          <div className="ds-search-wrap" style={{maxWidth:280}}>
            <span className="ds-search-icon"><Search size={14} /></span>
            <input
              className="ds-input ds-search"
              placeholder="Search icons…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="ds-icon-grid">
            {filtered.map(({ name, Icon }) => (
              <div key={name} className="ds-icon-grid-item" title={name}>
                <Icon size={20} strokeWidth={1.5} />
                <span className="ds-icon-grid-name">{name}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <span style={{fontSize:12,color:'var(--ds-neutral-400)'}}>No icons match "{query}"</span>
            )}
          </div>
        </div>
      </Variant>
    </StoryFrame>
  );
}
