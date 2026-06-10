import { useState, useMemo } from 'react';
import { Folder, Sun, Moon, ChevronRight, ChevronDown, LayoutGrid } from 'lucide-react';
import ThemePreview from './ThemePreview';
import MobilePreview from './MobilePreview';
import MarketingPreview from './MarketingPreview';
import ComponentsBrowser from './ComponentsBrowser';
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

const SCENES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mobile',    label: 'Mobile'    },
  { id: 'marketing', label: 'Marketing' },
];

export default function Canvas({ cssVars, darkMode, setDarkMode }) {
  const [scene,          setScene]          = useState('dashboard');
  const [showComponents, setShowComponents] = useState(false);
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
    <>
    <div className="canvas-panel">

      {/* ── Toolbar ── */}
      <div className="canvas-toolbar">
        <div className="canvas-scene-tabs">
          {SCENES.map(s => (
            <button
              key={s.id}
              className={`canvas-scene-tab${scene === s.id ? ' active' : ''}`}
              onClick={() => setScene(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="canvas-toolbar-right">
          <button
            className="canvas-components-btn"
            onClick={() => setShowComponents(true)}
            title="Browse components"
          >
            <LayoutGrid size={13} />
            Components
          </button>
          <button
            className="canvas-mode-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light' : 'Switch to dark'}
          >
            {darkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="canvas-content-area">

        {scene === 'dashboard' && (
          <div className="canvas-preview-scene" style={cssVars} data-dark={darkMode ? 'true' : undefined}>
            <ThemePreview />
          </div>
        )}

        {scene === 'mobile' && (
          <div className="canvas-preview-scene canvas-preview-scene--center" style={cssVars} data-dark={darkMode ? 'true' : undefined}>
            <MobilePreview />
          </div>
        )}

        {scene === 'marketing' && (
          <div className="canvas-preview-scene" style={cssVars} data-dark={darkMode ? 'true' : undefined}>
            <MarketingPreview />
          </div>
        )}

      </div>
    </div>

    {showComponents && (
      <ComponentsBrowser
        cssVars={cssVars}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onClose={() => setShowComponents(false)}
        components={COMPONENTS}
      />
    )}
    </>
  );
}
