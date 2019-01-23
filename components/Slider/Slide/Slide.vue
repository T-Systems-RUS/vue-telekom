<template>
  <section
    :class="{'is-active': isActive}"
    class="slide">
    <slot/>
  </section>
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

  .slide {
    flex-shrink: 0;
  }

</style>
