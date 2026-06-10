import { useState, useMemo } from 'react';
import { Folder, Sun, Moon, ChevronRight, ChevronDown, Layers, Monitor } from 'lucide-react';
import ThemePreview from './ThemePreview';
import {
  AccordionStory, ActionBarStory, AlertStory, AppLayoutStory, AvatarStory,
  BadgeStory, BannerStory, BreadcrumbsStory, ButtonStory, ButtonGroupStory,
  CalloutStory, CardStory, CheckboxStory, CheckboxGroupStory, ChipStory,
  ComboboxStory, CommentBoxStory, DatePickerStory, DividerStory, DragDropStory,
  ErrorPageStory, FabStory, FileUploaderStory, FooterStory, FormWrapperStory,
  HeaderStory, HeadlineStory, HeroIconStory, IconsStory, IndicatorStory, InputStory,
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
  { id: 'icons',           label: 'Icons',           Story: IconsStory },
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

export default function Canvas({ cssVars, darkMode, setDarkMode }) {
  const [active, setActive] = useState('button');
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('stories');

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

      {mode === 'stories' && <nav className="canvas-sidenav">
        <div className="story-search-wrap">
          <input
            className="story-search-input"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="story-section-header">
          <ChevronDown size={11} style={{flexShrink:0}} />
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
      </nav>}

      <div className="canvas-content">
        <div className="canvas-content-header">
          {mode === 'stories' ? (
            <>
              <span className="canvas-story-path">Components</span>
              <span className="canvas-story-sep">/</span>
              <span className="canvas-story-name">{activeComp.label}</span>
            </>
          ) : (
            <span className="canvas-story-name">Theme Preview</span>
          )}
          <div className="canvas-header-right">
            <div className="canvas-view-toggle">
              <button
                className={`canvas-view-pill${mode === 'stories' ? ' active' : ''}`}
                onClick={() => setMode('stories')}
              >
                <Layers size={11} /> Components
              </button>
              <button
                className={`canvas-view-pill${mode === 'preview' ? ' active' : ''}`}
                onClick={() => setMode('preview')}
              >
                <Monitor size={11} /> Preview
              </button>
            </div>
            <button
              className="canvas-mode-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch canvas to light' : 'Switch canvas to dark'}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
        <div
          className={`canvas-body${mode === 'preview' ? ' canvas-body--preview' : ''}`}
          style={cssVars}
          data-dark={darkMode ? 'true' : undefined}
        >
          {mode === 'stories' ? <Story key={active} /> : <ThemePreview />}
        </div>
      </div>
    </div>
  );
}
