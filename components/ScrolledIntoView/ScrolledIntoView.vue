<template>
  <div class="scrolled"/>
</template>

<script lang="ts">
  import Vue from 'vue';

  const SCROLL_TIMEOUT = 2000;

  export default Vue.extend({
    data() {
      return {
        lastScrollPosition: 0,
        isScrolled: false
      };
    },
    mounted() {
      document.addEventListener('scroll', this.scrollHandler);
    },
    methods: {
      scrollHandler() {
        if (!this.isScrolled && this.isScrolledDown() && this.isScrolledIntoView()) {
          this.$emit('scrolled');
          this.isScrolled = true;

          // Prevent multiple events while scrolled into view for timeout
          const timeoutId = setTimeout(() => {
            this.isScrolled = false;
            clearTimeout(timeoutId);
          }, SCROLL_TIMEOUT);
        }
      },
      isScrolledIntoView() {
        const rect = this.$el.getBoundingClientRect();
        // Only completely visible elements return true:
        // rect.top < window.innerHeight && rect.bottom >= 0;
        return (rect.top >= 0) && (rect.bottom <= window.innerHeight);
      },
      isScrolledDown() {
        let scrolledDown = false;
        if (document.documentElement.scrollTop > this.lastScrollPosition) {
          scrolledDown = true;
        }
        this.lastScrollPosition = document.documentElement.scrollTop;
        return scrolledDown;
      }
    },
    destroyed() {
      document.removeEventListener('scroll', this.scrollHandler);
    }
  });
</script>

<style lang='scss' scoped>
  .scrolled {
    height: 50px;
  }
</style>
