<template>
  <transition name="slide">
    <section
      v-if="isActive"
      class="slide">
      <slot/>
    </section>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    computed: {
      isActive(): boolean {
        return this.$parent.$data.activeSlide === this;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../../styles/base/variables';

  .slide-enter-active, .slide-leave-active {
    transition: opacity $transition-default;
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
