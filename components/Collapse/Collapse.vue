<template>
  <div
    class="collapse has-text-left"
    @click="toggleExpanded">
    <div class="collapse-header">
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

  .collapse {
    min-height: $collapse-padding * 2 + $expander-size;
    padding: $collapse-padding;
    background-color: $gray-248;
    position: relative;

    .expander {
      position: absolute;
      right: $collapse-padding;
      width: $expander-size;
      height: $expander-size;

      &.is-expanded {
        transform: rotate(180deg);
      }
    }

    .content {
      padding-top: $collapse-padding;
      overflow: hidden;
    }
  }
</style>
