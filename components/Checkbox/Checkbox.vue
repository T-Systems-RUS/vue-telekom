<template>
  <label
    class="checkbox"
    @click="toggleCheck">
    <input
      :name="name"
      :checked="checked"
      type="checkbox"
      @click.stop.prevent>
    <span
      class="checkbox-icon"
      :class="{'is-checked': checkedValue}"/>
    <span class="checkbox-label">
      <slot/>
    </span>
  </label>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      name: String,
      checked: Boolean
    },
    computed: {
      checkedValue(): boolean {
        return this.checked;
      }
    },
    methods: {
      toggleCheck() {
        this.$emit('update:checked', !this.checked);
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/bulma/bulma-override-variables';

  $checkbox-size: $building-unit-x2;
  $checkbox-background-color: $gray-237;
  $checkbox-border-color: $gray-178;
  $checkbox-label-padding-left: $checkbox-size + $building-unit;
  $checkbox-label-padding-top: $building-unit-x0_25;

  input[type="checkbox"] {
    display: none;
  }

  label.checkbox {
    padding-left: $checkbox-label-padding-left;
    padding-top: $checkbox-label-padding-top;

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
      background: url('./assets/check.svg') no-repeat center center;
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
</style>
