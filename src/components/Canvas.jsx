import { useState, useMemo } from 'react';
import {
  AccordionStory, ActionBarStory, AlertStory, AppLayoutStory, AvatarStory,
  BadgeStory, BannerStory, BreadcrumbsStory, ButtonStory, ButtonGroupStory,
  CalloutStory, CardStory, CheckboxStory, CheckboxGroupStory, ChipStory,
  ComboboxStory, CommentBoxStory, DatePickerStory, DividerStory, DragDropStory,
  ErrorPageStory, FabStory, FileUploaderStory, FooterStory, FormWrapperStory,
  HeaderStory, HeadlineStory, HeroIconStory, IndicatorStory, InputStory,
  LabelStory, LinkStory, ListStory, MenuStory, ModalStory, NavStory,
  PageHeadingStory, PaginationStory, PanelStory, ProgressBarStory, ProgressCircleStory,
  RadioButtonStory, RadioGroupStory, SearchStory, SectionHeadingStory, SelectStory,
  SkeletonStory, SliderStory, SnackbarStory, SpinnerStory, StatCardStory,
  StepperStory, TableStory, TabsStory, TextStory, ToggleStory, TooltipStory,
} from './Previews';

const COMPONENTS = [
  { id: 'accordion',       label: 'Accordion',       Story: AccordionStory },
  { id: 'action-bar',      label: 'Action Bar',      Story: ActionBarStory },
  { id: 'alert',           label: 'Alert',           Story: AlertStory },
  { id: 'app-layout',      label: 'App Layout',      Story: AppLayoutStory },
  { id: 'avatar',          label: 'Avatar',          Story: AvatarStory },
  { id: 'badge',           label: 'Badge',           Story: BadgeStory },
  { id: 'banner',          label: 'Banner',          Story: BannerStory },
  { id: 'breadcrumbs',     label: 'Breadcrumbs',     Story: BreadcrumbsStory },
  { id: 'button',          label: 'Button',          Story: ButtonStory },
  { id: 'button-group',    label: 'Button Group',    Story: ButtonGroupStory },
  { id: 'callout',         label: 'Callout',         Story: CalloutStory },
  { id: 'card',            label: 'Card',            Story: CardStory },
  { id: 'checkbox',        label: 'Checkbox',        Story: CheckboxStory },
  { id: 'checkbox-group',  label: 'Checkbox Group',  Story: CheckboxGroupStory },
  { id: 'chip',            label: 'Chip',            Story: ChipStory },
  { id: 'combobox',        label: 'Combobox',        Story: ComboboxStory },
  { id: 'comment-box',     label: 'Comment Box',     Story: CommentBoxStory },
  { id: 'date-picker',     label: 'Date Picker',     Story: DatePickerStory },
  { id: 'divider',         label: 'Divider',         Story: DividerStory },
  { id: 'drag-drop',       label: 'Drag and Drop',   Story: DragDropStory },
  { id: 'error-page',      label: 'Error Page',      Story: ErrorPageStory },
  { id: 'fab',             label: 'FAB',             Story: FabStory },
  { id: 'file-uploader',   label: 'File Uploader',   Story: FileUploaderStory },
  { id: 'footer',          label: 'Footer',          Story: FooterStory },
  { id: 'form-wrapper',    label: 'Form Wrapper',    Story: FormWrapperStory },
  { id: 'header',          label: 'Header',          Story: HeaderStory },
  { id: 'headline',        label: 'Headline',        Story: HeadlineStory },
  { id: 'hero-icon',       label: 'Hero Icon',       Story: HeroIconStory },
  { id: 'indicator',       label: 'Indicator',       Story: IndicatorStory },
  { id: 'input',           label: 'Input',           Story: InputStory },
  { id: 'label',           label: 'Label',           Story: LabelStory },
  { id: 'link',            label: 'Link',            Story: LinkStory },
  { id: 'list',            label: 'List',            Story: ListStory },
  { id: 'menu',            label: 'Menu',            Story: MenuStory },
  { id: 'modal',           label: 'Modal',           Story: ModalStory },
  { id: 'nav',             label: 'Nav',             Story: NavStory },
  { id: 'page-heading',    label: 'Page Heading',    Story: PageHeadingStory },
  { id: 'pagination',      label: 'Pagination',      Story: PaginationStory },
  { id: 'panel',           label: 'Panel',           Story: PanelStory },
  { id: 'progress-bar',    label: 'Progress Bar',    Story: ProgressBarStory },
  { id: 'progress-circle', label: 'Progress Circle', Story: ProgressCircleStory },
  { id: 'radio-button',    label: 'Radio Button',    Story: RadioButtonStory },
  { id: 'radio-group',     label: 'Radio Group',     Story: RadioGroupStory },
  { id: 'search',          label: 'Search',          Story: SearchStory },
  { id: 'section-heading', label: 'Section Heading', Story: SectionHeadingStory },
  { id: 'select',          label: 'Select',          Story: SelectStory },
  { id: 'skeleton',        label: 'Skeleton',        Story: SkeletonStory },
  { id: 'slider',          label: 'Slider',          Story: SliderStory },
  { id: 'snackbar',        label: 'Snackbar',        Story: SnackbarStory },
  { id: 'spinner',         label: 'Spinner',         Story: SpinnerStory },
  { id: 'stat-card',       label: 'Stat Card',       Story: StatCardStory },
  { id: 'stepper',         label: 'Stepper',         Story: StepperStory },
  { id: 'table',           label: 'Table',           Story: TableStory },
  { id: 'tabs',            label: 'Tabs',            Story: TabsStory },
  { id: 'text',            label: 'Text',            Story: TextStory },
  { id: 'toggle',          label: 'Toggle',          Story: ToggleStory },
  { id: 'tooltip',         label: 'Tooltip',         Story: TooltipStory },
];

function FolderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="2.3" fill="currentColor"/>
      <line x1="6.5" y1="0.5" x2="6.5" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="6.5" y1="11" x2="6.5" y2="12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="0.5" y1="6.5" x2="2" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="11" y1="6.5" x2="12.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="2.4" y1="2.4" x2="3.4" y2="3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="9.6" y1="9.6" x2="10.6" y2="10.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10.6" y1="2.4" x2="9.6" y2="3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="3.4" y1="9.6" x2="2.4" y2="10.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
      <path d="M9 2.5A5 5 0 1 1 2.5 9 4 4 0 0 0 9 2.5Z" fill="currentColor"/>
    </svg>
  );
}

export default function Canvas({ cssVars, darkMode, setDarkMode }) {
  const [active, setActive] = useState('button');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    search.trim()
      ? COMPONENTS.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
      : COMPONENTS,
    [search]
  );

  const activeComp = COMPONENTS.find(c => c.id === active) ?? COMPONENTS[0];
  const { Story } = activeComp;

  return (
    <div className="canvas-panel">

      {/* Storybook-style sidenav */}
      <nav className="canvas-sidenav">
        {/* Search */}
        <div className="story-search-wrap">
          <input
            className="story-search-input"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Section header */}
        <div className="story-section-header">
          <span className="story-section-caret">▾</span>
          <span>Components</span>
          <span className="story-section-count">{filtered.length}</span>
        </div>

        {/* Flat alphabetical list */}
        <div className="story-list">
          {filtered.map(comp => (
            <button
              key={comp.id}
              className={`story-item${active === comp.id ? ' active' : ''}`}
              onClick={() => setActive(comp.id)}
            >
              <span className="story-item-chevron">›</span>
              <span className="story-item-icon"><FolderIcon /></span>
              <span className="story-item-label">{comp.label}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="story-empty">No results for "{search}"</div>
          )}
        </div>
      </nav>

      {/* Canvas content */}
      <div className="canvas-content">
        <div className="canvas-content-header">
          <span className="canvas-story-path">Components</span>
          <span className="canvas-story-sep">/</span>
          <span className="canvas-story-name">{activeComp.label}</span>
          <button
            className="canvas-mode-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch canvas to light' : 'Switch canvas to dark'}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <div
          className="canvas-body"
          style={cssVars}
          data-dark={darkMode ? 'true' : undefined}
        >
          <Story key={active} />
        </div>
      </div>
    </div>
  );
}
