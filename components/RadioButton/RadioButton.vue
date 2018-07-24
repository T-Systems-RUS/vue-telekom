<template>
  <label class="radio">
    <input
            :name="name"
            :checked="checked"
            @change="toggle"
            type="radio">
    <span class="radio-icon"/>
    <span class="radio-label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      name: String,
      checked: Boolean,
      label: String
    },
    methods: {
      toggle() {
        this.$emit('toggle');
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/bulma/bulma-override-variables';

  $radio-size: $building-unit-x2;
  $radio-label-padding-left: $building-unit-x3;
  $radio-label-padding-top: $building-unit-x0_25;

  input[type='radio'] {
    display: none;

    &:checked + .radio-icon {
      &::after {
        opacity: 1;
      }
    }
  }

  label.radio {
    display: inline-block;
    position: relative;
    padding-left: $radio-label-padding-left;
    padding-top: $radio-label-padding-top;

    &:hover {
      .radio-icon {
        background-color: $gray-220;
        color: $gray-56;
      }
    }

    &:active {
      .radio-icon {
        background-color: $gray-199;
      }
    }

    &:focus {
      outline: 0;

      .radio-icon {
        background-color: $gray-237;
        border-color: $blue;
        box-shadow: $input-focus-box-shadow-size rgba($blue, .5);
        outline: 0;
      }
    }
  }

  .radio-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: $radio-size;
    height: $radio-size;
    border: 1px solid $gray-178;
    background-color: $gray-237;
    font-size: 0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
      content: "";
      width: $radio-size/2;
      height: $radio-size/2;
      border-radius: 50%;
      opacity: 0;
      background-color: $magenta;
    }
  }
</style>
