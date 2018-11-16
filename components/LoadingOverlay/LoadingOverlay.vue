<template>
  <div class="loading-overlay">
    <div
      :class="{'is-loading': isLoading}"
      class="loading-overlay-bar"/>
    <transition name="opacity">
      <div
        v-if="isLoading"
        class="loading-overlay-cover"/>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      isLoading: {
        type: Boolean,
        required: true
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/bulma/bulma-override-variables';
  @import '../../styles/utilities/mixins';

  $loading-bar-height: 4px;
  $animation-time: 2.5s;
  $long-animation-time: 10s;
  $animation-delay: $animation-time;

  .loading-overlay {
    &-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: $loading-bar-height;
      background-color: $magenta;
      z-index: 10;

      &.is-loading {
        animation: loading-bar $animation-time forwards,
                   loading-bar-long $long-animation-time $animation-delay linear infinite;
      }
    }

    &-cover {
      position: fixed;
      height: 100%;
      width: 100%;
      top: $loading-bar-height;
      left: 0;
      background-color: $white;
      opacity: 0.6;
      z-index: 1000;
    }

    &.is-absolute {
      .loading-overlay-bar,
      .loading-overlay-cover {
        position: absolute;
      }
    }
  }

  @keyframes loading-bar {
    from {
      width: 0%;
    }
    to {
      width: 95%;
    }
  }

  @keyframes loading-bar-long {
    0% {
      width: 95%;
    }
    90% {
      width: 98%;
    }
    100% {
      width: 95%;
    }
  }
</style>

