declare module 'v-calendar' {
  import { default as _Vue}  from 'vue';

  /**
   * Represents an instance of v-calendar formats
   */
  interface IVCalendarFormats {
    title?: string;
    weekdays?: string;
    navMonths?: string;
    input?: string[]; // Only for `v-date-picker`
    dayPopover?: string; // Only for `v-date-picker`
    data?: string;
  }

  /**
   * Represents an instance of setupCalendar options
   */
  interface IVCalendarSetupOptions {
    locale?: string;
    firstDayOfWeek?: number;
    popover?: boolean;
    componentPrefix?: string;
    formats?: IVCalendarFormats;
    navVisibility?: string;
    titlePosition?: string;
    titleTransition?: string;
    weeksTransition?: string;
    paneWidth?: number;
    showLinkedButtons?: boolean;
    datePickerUpdateOnInput?: boolean;
    datePickerShowCaps?: boolean;
    datePickerShowDayPopover?: boolean;
    datePickerTintColor?: string;
    popoverExpanded?: boolean;
    popoverDirection?: string;
    popoverAlign?: string;
    popoverVisibility?: string;
    popoverContentOffset?: string;
    popoverKeepVisibleOnInput?: boolean;
    maxSwipeTime?: number;
    minHorizontalSwipeDistance?: number;
    maxVerticalSwipeDistance?: number;
    maxTapTolerance?: number;
    maxTapDuration?: number;
  }

  export function setupCalendar(options: IVCalendarSetupOptions): void;

  export class DatePicker extends _Vue {}
}
