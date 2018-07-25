<template>
  <div class="collapse has-text-left">
    <div
      class="collapse-header"
      @click="toggleExpanded">
      <strong> {{ header }} </strong>
      <img
        class="expander"
        v-if="!isExpanded"
        src="./assets/expand_outline.svg">
      <img
        class="expander is-expanded"
        v-if="isExpanded"
        src="./assets/expand_outline_magenta.svg">
    </div>
    <transition name="fade-vertical">
      <div
        v-if="isExpanded"
        class="content is-size-6">
        <slot>
          Collapse content
        </slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    data() {
      return {
        expanded: false
      };
    },
    props: {
      header: String
    },
    computed: {
      isExpanded(): boolean {
        return this.expanded;
      }
    },
    methods: {
      toggleExpanded() {
        this.expanded = !this.expanded;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';

  $collapse-padding: $building-unit-x2;
  $expander-size: $building-unit-x2;

  .grey {
    color: $magenta-238;
  }

  .collapse {
    min-height: $collapse-padding * 2 + $expander-size;
    position: relative;
    background-color: $gray-248;

    &.is-bg-white {
      background-color: $white;

      .collapse-header {
        border-top: 1px solid $gray-220;
        border-bottom: 1px solid $gray-220;
      }

      .content {
        padding: $collapse-padding $collapse-padding $building-unit-x3;
      }
    }

    .expander {
      position: absolute;
      right: $collapse-padding;
      width: $building-unit-x1_5;
      height: $building-unit-x1_5;
      top: 50%;
      transform: translateY(-50%);

      &.is-expanded {
        transform: translateY(-50%) rotate(180deg);
      }
    }

    .collapse-header {
      padding: $collapse-padding;
      cursor: pointer;
      position: relative;
    }

    .content {
      padding: 0 $collapse-padding $collapse-padding;
    }
  }
</style>
