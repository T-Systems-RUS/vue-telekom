<template>
  <div
    v-outer-click="closeDropdown"
    class="dropdown is-right"
    :class="{'is-active': isOpen }">
    <div class="dropdown-trigger">
      <button
        class="button action-toggle"
        @click.stop="toggleDropdown">
        <slot name="toggle">
          Open
        </slot>
      </button>
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
  .dropdown-item {
    text-decoration: none;
  }
</style>
