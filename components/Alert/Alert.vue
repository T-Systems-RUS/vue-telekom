<i18n src="./Alert.yml"></i18n>

<template>
  <transition name="fade">
    <div
      v-if="alert"
      class="alert"
      :class="{'is-success': isAlertType(alertType.SUCCESS),
               'is-warning': isAlertType(alertType.WARNING),
               'is-hint': isAlertType(alertType.HINT)}">
      <div class="alert-inner container">
        <p
          class="alert-text has-text-centered"
          slot="alert-text">
          {{ $t(alert.text) }}
        </p>
        <button
          @click="resetAlert"
          class="alert-close"/>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {mapMutations, mapGetters} from 'vuex';
  import {ALERT} from './alertStore/getter-types';
  import {RESET_ALERT} from './alertStore/mutation-types';
  import {AlertType} from './alertStore';

  export default Vue.extend({
    data() {
      return {
        alertType: AlertType
      };
    },
    computed: {
      ...mapGetters({
        alert: ALERT
      })
    },
    methods: {
      ...mapMutations({
        resetAlert: RESET_ALERT
      }),
      isAlertType(type: AlertType) {
        return this.alert.type === type;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $border-width: 1px;
  $horz-padding: $building-unit-x2;
  $close-size: $building-unit-x2;
  $inner-padding-right: $close-size + $building-unit;
  $inner-padding-right-mobile: $close-size + $building-unit-x2;

  .alert {
    border-top: $border-width solid;
    border-bottom: $border-width solid;
    transition: .2s;

    &.is-success {
      border-color: $green;
      background-color: $green-247;
    }

    &.is-warning {
      border-color: $red;
      background-color: $red-253;
    }

    &.is-hint {
      border-color: $blue;
      background-color: $blue-242;
    }

    .alert-inner {
      padding: $building-unit 0;

      @include mobile {
        padding: $building-unit $horz-padding;
      }
    }

    .alert-text {
      padding-right: $inner-padding-right;
    }

    .alert-close {
      background: center / cover transparent url('./assets/close.svg') no-repeat;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: none;
      width: $close-size;
      height: $close-size;
      position: absolute;
      top: $building-unit;
      right: 0;

      @include mobile {
        right: $horz-padding;
      }
    }
  }
</style>
