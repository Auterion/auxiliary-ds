export { default as Button } from './primitives/Button.vue';
export { default as Input } from './primitives/Input.vue';
export { default as Label } from './primitives/Label.vue';

// Register — expressive↔operational duality wrapper (ROADMAP §6g / Phase 6.2).
export { default as Register } from './primitives/Register.vue';

export { default as Dialog } from './primitives/Dialog/Dialog.vue';
export { default as DialogTrigger } from './primitives/Dialog/DialogTrigger.vue';
export { default as DialogContent } from './primitives/Dialog/DialogContent.vue';
export { default as DialogTitle } from './primitives/Dialog/DialogTitle.vue';
export { default as DialogDescription } from './primitives/Dialog/DialogDescription.vue';
export { default as DialogClose } from './primitives/Dialog/DialogClose.vue';

export { default as Popover } from './primitives/Popover/Popover.vue';
export { default as PopoverTrigger } from './primitives/Popover/PopoverTrigger.vue';
export { default as PopoverContent } from './primitives/Popover/PopoverContent.vue';

export { default as TooltipProvider } from './primitives/Tooltip/TooltipProvider.vue';
export { default as Tooltip } from './primitives/Tooltip/Tooltip.vue';
export { default as TooltipTrigger } from './primitives/Tooltip/TooltipTrigger.vue';
export { default as TooltipContent } from './primitives/Tooltip/TooltipContent.vue';

export { default as DropdownMenu } from './primitives/DropdownMenu/DropdownMenu.vue';
export { default as DropdownMenuTrigger } from './primitives/DropdownMenu/DropdownMenuTrigger.vue';
export { default as DropdownMenuContent } from './primitives/DropdownMenu/DropdownMenuContent.vue';
export { default as DropdownMenuItem } from './primitives/DropdownMenu/DropdownMenuItem.vue';
export { default as DropdownMenuLabel } from './primitives/DropdownMenu/DropdownMenuLabel.vue';
export { default as DropdownMenuSeparator } from './primitives/DropdownMenu/DropdownMenuSeparator.vue';

export { default as Select } from './primitives/Select/Select.vue';
export { default as SelectTrigger } from './primitives/Select/SelectTrigger.vue';
export { default as SelectValue } from './primitives/Select/SelectValue.vue';
export { default as SelectContent } from './primitives/Select/SelectContent.vue';
export { default as SelectItem } from './primitives/Select/SelectItem.vue';
export { default as SelectSeparator } from './primitives/Select/SelectSeparator.vue';

export { default as Combobox } from './primitives/Combobox/Combobox.vue';
export { default as ComboboxInput } from './primitives/Combobox/ComboboxInput.vue';
export { default as ComboboxContent } from './primitives/Combobox/ComboboxContent.vue';
export { default as ComboboxItem } from './primitives/Combobox/ComboboxItem.vue';
export { default as ComboboxEmpty } from './primitives/Combobox/ComboboxEmpty.vue';
export { default as ComboboxSeparator } from './primitives/Combobox/ComboboxSeparator.vue';

export { default as Tabs } from './primitives/Tabs/Tabs.vue';
export { default as TabsList } from './primitives/Tabs/TabsList.vue';
export { default as TabsTrigger } from './primitives/Tabs/TabsTrigger.vue';
export { default as TabsContent } from './primitives/Tabs/TabsContent.vue';

export { default as ToastProvider } from './primitives/Toast/ToastProvider.vue';
export { default as ToastViewport } from './primitives/Toast/ToastViewport.vue';
export { default as Toast } from './primitives/Toast/Toast.vue';
export { default as ToastTitle } from './primitives/Toast/ToastTitle.vue';
export { default as ToastDescription } from './primitives/Toast/ToastDescription.vue';
export { default as ToastAction } from './primitives/Toast/ToastAction.vue';
export { default as ToastClose } from './primitives/Toast/ToastClose.vue';

export { default as Card } from './primitives/Card/Card.vue';
export { default as CardHeader } from './primitives/Card/CardHeader.vue';
export { default as CardTitle } from './primitives/Card/CardTitle.vue';
export { default as CardDescription } from './primitives/Card/CardDescription.vue';
export { default as CardContent } from './primitives/Card/CardContent.vue';
export { default as CardFooter } from './primitives/Card/CardFooter.vue';

export { default as Separator } from './primitives/Separator.vue';

export { default as Table } from './primitives/Table/Table.vue';
export { default as TableHeader } from './primitives/Table/TableHeader.vue';
export { default as TableBody } from './primitives/Table/TableBody.vue';
export { default as TableRow } from './primitives/Table/TableRow.vue';
export { default as TableHead } from './primitives/Table/TableHead.vue';
export { default as TableCell } from './primitives/Table/TableCell.vue';
export { default as TableCaption } from './primitives/Table/TableCaption.vue';

export { default as Accordion } from './primitives/Accordion/Accordion.vue';
export { default as AccordionItem } from './primitives/Accordion/AccordionItem.vue';
export { default as AccordionTrigger } from './primitives/Accordion/AccordionTrigger.vue';
export { default as AccordionContent } from './primitives/Accordion/AccordionContent.vue';

export { default as Avatar } from './primitives/Avatar/Avatar.vue';
export { default as AvatarImage } from './primitives/Avatar/AvatarImage.vue';
export { default as AvatarFallback } from './primitives/Avatar/AvatarFallback.vue';

export { default as Badge } from './primitives/Badge.vue';
export { default as Progress } from './primitives/Progress.vue';
export { default as Spinner } from './primitives/Spinner.vue';
export { default as Skeleton } from './primitives/Skeleton.vue';

export { default as Checkbox } from './primitives/Checkbox.vue';
export { default as Switch } from './primitives/Switch.vue';
export { default as RadioGroup } from './primitives/RadioGroup/RadioGroup.vue';
export { default as RadioGroupItem } from './primitives/RadioGroup/RadioGroupItem.vue';
export { default as Slider } from './primitives/Slider.vue';
export { default as Textarea } from './primitives/Textarea.vue';
export { default as NumberField } from './primitives/NumberField.vue';

// Operational primitives — Auterion-specific (mission control, telemetry, alerts)
export { default as StatusBadge, type StatusLevel } from './primitives/StatusBadge.vue';
export { default as TelemetryValue } from './primitives/TelemetryValue.vue';
export { default as AlertBanner, type AlertLevel } from './primitives/AlertBanner.vue';

// CoordinateValue — lat/long + MGRS coordinate readout (ROADMAP §6i / Phase 6.3).
export { default as CoordinateValue } from './primitives/CoordinateValue.vue';

// UnitSystemProvider — deployment-wide metric/imperial + locale context (ROADMAP §6i / Phase 6.3).
export { default as UnitSystemProvider } from './primitives/UnitSystemProvider.vue';
export {
  useUnitSystem,
  provideUnitSystem,
  type UnitSystemContext,
} from './composables/useUnitSystem';
export type { UnitSystem, Quantity } from '@auxiliary/css/format';

// Alert model — prioritized, acknowledgeable, latching alert set (ROADMAP §6i / Phase 6.3).
// Composes AlertBanner + StatusBadge; never modifies them.
export { default as AlertManager } from './primitives/AlertManager.vue';
export { default as AlertAnnunciator } from './primitives/AlertAnnunciator.vue';
export {
  useAlertModel,
  compareAlerts,
  ALERT_LEVELS,
  type Alert,
  type AlertSource,
  type AlertModel,
  type UseAlertModelOptions,
} from './composables/useAlertModel';

// GuardedAction — hard-to-misfire control for irreversible commands (ROADMAP §6i / Phase 6.3).
export { default as GuardedAction } from './primitives/GuardedAction.vue';
