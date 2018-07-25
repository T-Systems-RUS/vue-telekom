<template>
  <div
    v-outer-click="closeDropdown"
    class="dropdown is-right"
    :class="{'is-active': isOpen }">
    <div class="dropdown-trigger">
      <button
        class="button is-icon action-toggle"
        @click.stop="toggleDropdown"/>
    </div>
    <div
      class="dropdown-menu"
      @click.stop="closeDropdown">
      <div class="dropdown-content is-size-6">
        <slot name="items">
          <a class="dropdown-item">
            Dropdown item
          </a>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {OuterClick} from '../../directives/outerClick';

  export default Vue.extend({
    directives: {OuterClick},
    data() {
      return {
        isOpen: false
      };
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen;
      },
      closeDropdown() {
        this.isOpen = false;
      }
    }
  });
</script>
<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';
  @import '../../styles/base/typography';

  $content-border-size: 1px;
  $max-items-without-scroll: 5;
  $item-height: $building-unit-x3;
  $max-content-height: ($item-height * $max-items-without-scroll) + $content-border-size * 2;

  .dropdown-content {
    box-shadow: none;
    border-radius: $telekom-radius;
    border: 1px solid $gray-178;
    overflow: auto;
    max-height: $max-content-height;
    @include custom-scroll;
  }

  .dropdown-item {
    text-decoration: none;
    color: $gray-56;
    @include font-size(6);
    white-space: nowrap;
    height: $item-height;
    line-height: $item-height;
    padding: 0 $building-unit;

    &:hover {
      background-color: $gray-237;
    }
  }

  .action-toggle {
    &::after {
      background-image: url('./assets/more.svg');
    }
  }
</style>
