<template>
  <div>
    <div
      :class="{'progress-bar-animation': isLoading}"
      class="header-bar-top"/>
    <div
      v-if="isLoading"
      class="loading-state-overlay"/>
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


  .progress-bar-animation {
    animation-name: move-progress-bar;
    animation-duration: 2.5s;
    animation-fill-mode: forwards;
  }

  .loading-state-overlay {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $white;
    opacity: 0.6;
    z-index: 1000;
    top: 4px;
  }

  .header-bar-top {
    width: 100%;
    height: 4px;
    background-color: $magenta;
    position: fixed;
    top: 0;
    z-index: 10;
  }

  @keyframes move-progress-bar {
    from {
      width: 10%;
    }
    to {
      width: 90%;
    }
  }
</style>

