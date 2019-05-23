<template>
  <div class="date-range-picker">
    <DatePicker
      :value="value"
      :mode="isRange ? 'range' : 'single'"
      :popover-visibility="visibility"
      :is-inline="isInline"
      :is-double-paned="isDoublePaned"
      :min-date="minDate"
      :max-date="maxDate"
      :show-day-popover="false"
      :theme-styles="themeStyles"
      :select-attribute="highlightAttribute"
      :drag-attribute="highlightAttribute"
      :disabled-attribute="disabledAttribute"
      v-outer-click="closeCalendarPopover"
      @input="$emit('input', $event)">
      <div
        slot-scope="props"
        @click="toggleCalendarPopover"
        class="date-range-picker-input-wrapper">
        <input
          readonly
          :id="id"
          :value="formattedDate"
          :placeholder="placeholder"
          class="date-range-picker-input input"
          :class="{'is-focused': isPopoverVisible}"
          @keydown.enter="toggleCalendarPopover"
          @keydown.esc="closeCalendarPopover">
      </div>
    </DatePicker>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  // add v-calendar.d.ts to your tsconfig.json file to avoid type errors
  import {DatePicker, setupCalendar} from 'v-calendar';
  // import styles according to v-calendar documentation
  import 'v-calendar/lib/v-calendar.min.css';
  import {DatepickerPopoverVisibility, IDateRange} from './IDateRangePicker';
  import {OuterClick} from '../../directives/outerClick';
  import {DateRangePickerService} from './DateRangePickerService';
  import {DESKTOP_VIEWPORT_WIDTH, disabledAttribute, highlightAttribute, themeStyles} from './dateRangePickerConstants';

  export default Vue.extend({
    components: {
      DatePicker
    },
    directives: {OuterClick},
    props: {
      value: {
        // type for below props due to "Right-hand side of 'instanceof' is not callable" error
        // TODO: investigate the issue
        // type: {} as () => (Date | IDateRange | null),
        required: true
      },
      minDate: {
        // type: {} as () => (Date | null),
        default: null
      },
      maxDate: {
        // type: {} as () => (Date | null),
        default: null
      },
      isInline: {
        type: Boolean,
        default: false
      },
      isRange: {
        type: Boolean,
        default: false
      },
      locale: {
        type: String,
        default: 'en'
      },
      placeholder: {
        type: String
      },
      tabindex: {
        type: String
      },
      // input id to make html label work
      id: {
        type: String
      }
    },
    watch: {
      value() {
        // $nextTick: to avoid issue with the same month on both sides of the double paned calendar
        this.$nextTick(() => this.closeCalendarPopover());
      }
    },
    created() {
      setupCalendar({
        firstDayOfWeek: 2,
        popover: false,
        locale: this.locale
      });
      this.configDatepicker();
      window.addEventListener('resize', this.configDatepicker);
    },
    destroyed() {
      window.removeEventListener('resize', this.configDatepicker);
    },
    computed: {
      formattedDate(): string {
        return DateRangePickerService.datepickerDateFormatter(this.value as (Date | IDateRange));
      },
      isPopoverVisible(): boolean {
        return this.visibility === DatepickerPopoverVisibility.visible;
      }
    },
    data() {
      return {
        highlightAttribute,
        disabledAttribute,
        themeStyles,
        isDoublePaned: false,
        visibility: DatepickerPopoverVisibility.hidden
      };
    },
    methods: {
      configDatepicker() {
        if (this.isDesktop()) {
          this.isDoublePaned = true;
        } else {
          this.isDoublePaned = false;
        }
      },
      isDesktop(): boolean {
        return window.innerWidth >= DESKTOP_VIEWPORT_WIDTH;
      },
      toggleCalendarPopover() {
        if (this.visibility === DatepickerPopoverVisibility.hidden) {
          this.openCalendarPopover();
        } else {
          this.closeCalendarPopover();
        }
      },
      closeCalendarPopover() {
        this.visibility = DatepickerPopoverVisibility.hidden;
      },
      openCalendarPopover() {
        this.visibility = DatepickerPopoverVisibility.visible;
      }
    }
  });

</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/bulma/bulma-override-variables';
  @import '../../styles/utilities/mixins';
  @import '../../styles/base/typography';

  $datepicker-popover-padding: $building-unit-x3 $building-unit-x3 48px;
  $datepicker-popover-padding-mobile: $building-unit-x2 16px;

  $c-header-padding: 0 0 $building-unit-x2;

  $c-weeks-padding: $building-unit-x0_5 0 0;

  $datepicker-popover-shadow: 5px 5px 30px 0 rgba(38, 38, 38, 0.12);
  $year-popover-shadow: 0 3px 8px 0 rgba(38, 38, 38, 0.12);

  $year-cell-width: $building-unit-x6;
  $year-cell-height: $building-unit-x3;
  $year-popover-header-padding: 5px 4px;
  $year-popover-top-position: 44px;

  .date-range-picker {
    &.has-calendar-icon {
      .date-range-picker-input {
        background: right 12px center / 24px 24px url('./assets/calendar.svg') no-repeat;
        padding-right: 36px;
      }
    }

    &-input-wrapper {
      position: relative;
      display: block;
    }

    &-input {
      cursor: pointer;

      &.is-focused,
      &:focus {
        box-shadow: $input-focus-box-shadow-size $input-focus-box-shadow-color;
      }
    }

    &.is-danger {
      .date-range-picker-input {
        border-color: $red;
      }
    }
  }

  /deep/ .popover-container {
    .popover-content-wrapper {
      padding-top: $building-unit!important;
    }

    .popover-content {
      box-shadow: $datepicker-popover-shadow!important;
      padding: $datepicker-popover-padding!important;

      @include mobile {
        padding: $datepicker-popover-padding-mobile!important;
      }

      &::after {
        display: none !important; // hide popover arrow
      }
    }
  }

  /deep/ .c-pane-container {
    font-family: $family-primary !important;
    background-color: transparent !important;

    // custom arrows for year/month switch
    .c-arrow-layout {
      background: center / 60% no-repeat;
      transition: $transition-default;
      position: relative;

      &:hover {
        &::after {
          opacity: .6;
        }
      }

      svg {
        opacity: 0!important;
        z-index: 1;

        &.c-disabled ~ * {
          opacity: .6;
        }
      }

      // new icon
      &::after {
        content: '';
        @include absolute-fit;
        background: center / 60% no-repeat;
        transition: $transition-default;
        z-index: 0;
      }

      // left arrow
      &:first-child {
        &::after {
          background-image: url('./assets/left_arrow_angle.svg');
        }
      }


      // right arrow
      &:last-child {
        &::after {
          background-image: url('./assets/right_arrow_angle.svg');
        }
      }
    }

    & > .c-pane > .c-header { // <  Month 2018 >
      padding: $c-header-padding;

      & > .c-title-layout .c-title {
        font-weight: $font-weight-medium;
      }
    }

    .c-day-background {
      border-radius: 0 !important;
      height: 100% !important;
      width: 100% !important;
      opacity: 1 !important;
    }

    .c-day-content {
      border-radius: 0 !important;
      margin: 0 !important;
      @include font-size(6);
    }

    // space between panes
    .c-pane-div {
      border-left: 0 !important;
      padding-left: $building-unit_x1_5 !important;
    }

    .c-weeks {
      padding: $c-weeks-padding;
    }

    .c-week {
      margin-top: -1px !important;
    }

    .c-weekdays {
      padding: 0;
    }

    .c-weekday {
      color: $gray-220;
      font-size: $size-7;
      line-height: 1;
      font-weight: $font-weight-medium !important;
    }

    // month/year selection
    .popover-container {
      padding: 0;

      .popover-origin .popover-content-wrapper {
        padding-top: $year-popover-top-position !important;

        .popover-content {
          border: 0;
          border-radius: 0;
          padding: 0 !important;
          box-shadow: $year-popover-shadow!important;

          .c-header {
            background-color: $gray-237;
            padding: $year-popover-header-padding;
            border: 0;

            .c-title {
              font-size: $size-7 !important;
              font-weight: $font-weight-medium;
            }
          }

          // month/year items
          .c-table {
            td {
              border-color: $gray-237;
              width: $year-cell-width;
              height: $year-cell-height;
            }

            .c-table-cell {
              @include font-size(7);
              font-weight: $font-weight-medium;

              &:hover,
              &.c-active {
                background-color: $gray-56;
                color: $white;
                font-weight: $font-weight-medium;
              }
            }
          }
        }
      }
    }
  }

</style>
