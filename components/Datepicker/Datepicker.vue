<i18n src="./Datepicker.yml"></i18n>

<template>
  <div class="telekom-datepicker">
    <b-datepicker
      :value="value"
      :placeholder="placeholder"
      :date-formatter="dateFormatter"
      @input="emitValue($event)"
      :first-day-of-week="1"
      :min-date="minDate"
      :max-date="maxDate"
      :day-names="dayNames"
      :month-names="monthNames">
      <a
        @click="setToday"
        class="telekom-datepicker-today">
        {{ $t('today') }}
      </a>
    </b-datepicker>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  const DE_MONTHS = [
    'Januar', 'Februar', 'März',
    'April', 'Mai', 'Juni',
    'Juli', 'August', 'September',
    'Oktober', 'November', 'Dezember'
  ];
  const DE_DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  export default Vue.extend({
    props: {
      value: Date,
      placeholder: String,
      locale: String,
      minDate: Date,
      maxDate: Date
    },
    computed: {
      dayNames(): string[]|undefined {
        return this.locale === 'de' ? DE_DAYS : undefined;
      },
      monthNames(): string[]|undefined {
        return this.locale === 'de' ? DE_MONTHS : undefined;
      },
      dateFormatter(): (date: Date) => string {
        return (date: Date) => date.toLocaleDateString(
          this.locale ? this.locale : 'en',
          {year: 'numeric', month: 'short', day: 'numeric'}
        );
      }
    },
    methods: {
      emitValue(value: Date) {
        this.$emit('input', value);
      },
      setToday() {
        this.emitValue(new Date());
      }
    }
  });
</script>

<style lang="scss">
  @import '../../styles/buefy/datepicker';

  .datepicker {
    .dropdown-trigger {
      .control {
        &::before {
          background-image: url('./assets/calendar.svg');
        }
      }
    }
  }
</style>
