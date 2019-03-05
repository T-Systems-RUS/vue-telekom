<template>
  <label
    class="checkbox"
    :class="{'is-disabled': disabled}"
    @click="toggleCheck">
    <input
      :name="name"
      :checked="checked"
      :disabled="disabled"
      type="checkbox"
      @click.stop.prevent>
    <span
      class="checkbox-icon"
      :class="{'is-checked': checkedValue}"/>
    <span class="checkbox-label"><slot/></span>
  </label>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      name: String,
      checked: Boolean,
      disabled: Boolean
    },
    computed: {
      checkedValue(): boolean {
        return this.checked;
      }
    },
    methods: {
      toggleCheck() {
        if (!this.disabled) {
          this.$emit('update:checked', !this.checked);
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/bulma/bulma-override-variables';

  $checkbox-size: $building-unit-x2;
  $checkbox-small-size: $building-unit-x1_33;
  $checkbox-background-color: $gray-237;
  $checkbox-border-color: $gray-178;
  $checkbox-label-padding-left: $checkbox-size;
  $checkbox-small-label-padding-left: $checkbox-small-size;
  $checkbox-label-padding-top: $building-unit-x0_25;

  input[type="checkbox"] {
    display: none;
  }

  label.checkbox {
    padding-left: $checkbox-label-padding-left;
    padding-top: $checkbox-label-padding-top;
    min-height: $checkbox-size;

    &.is-disabled {
      pointer-events: none;

      .checkbox-icon {
        background-color: $gray-248;
        border-color: $gray-220;
        pointer-events: none;

        &.is-checked {
          &::after {
            opacity: .5;
          }
        }
      }

      &:active,
      &:hover {
        background-color: $gray-248;
        border-color: $gray-220;
        pointer-events: none;
      }
    }

    &.is-small {
      padding-left: $checkbox-small-label-padding-left;
      min-height: $checkbox-small-size;

      .checkbox-icon {
        width: $checkbox-small-size;
        height: $checkbox-small-size;

        &::after {
          width: $checkbox-small-size;
          height: $checkbox-small-size;
        }
      }
    }

    &:hover {
      .checkbox-icon {
        background-color: $gray-220;
        color: $gray-56;
      }
    }

    &:active {
      .checkbox-icon {
        background-color: $gray-199;
      }
    }

    &:focus {
      outline: 0;
      .checkbox-icon {
        background-color: $gray-237;
        border-color: $blue;
        box-shadow: $input-focus-box-shadow-size rgba($blue, .5);
        outline: 0;
      }
    }
  }

  .checkbox-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: $checkbox-size;
    height: $checkbox-size;
    background-color: $checkbox-background-color;
    border-radius: $telekom-radius;
    border: 1px solid $checkbox-border-color;
    transition: $transition-default;

    &::after {
      content: '';
      width: $checkbox-size;
      height: $checkbox-size;
      background: url('./assets/check.svg') no-repeat center / cover;
      position: absolute;
      top: -1px;
      left: -1px;
      opacity: 0;
    }

    &.is-checked {
      &::after {
        opacity: 1;
      }
    }
  }

  .checkbox-icon + .checkbox-label:not(:empty) {
    margin-left: $building-unit;
    display: block;
  }
</style>
