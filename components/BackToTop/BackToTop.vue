<template>
  <div
    v-if="scrolled"
    class="back-to-top container centered">
    <div
      @click="scrollToTop()"
      class="back-to-top-arrow">
      <img src="./export_outline.svg">
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  const SCROLL_DURATION = 200;
  const SCROLL_STEP = 5;
  const SCROLLED_HEIGHT = window.innerHeight;
  const VIEWPORT_L = window.matchMedia('(min-width: 1024px)');

  export default Vue.extend({
    data() {
      return {
        scrolled: false,
        currentScrollPosition: 0,
        viewHeight: 0
      };
    },
    methods: {
      getCurrentScrollPosition() {
        this.currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
      },
      getPageSizes() {
        const page = document.querySelector('.page');
        this.viewHeight = page ? page.scrollHeight : 0;
        this.getCurrentScrollPosition();
      },
      largeViewportScrollHandle() {
        this.scrolled = window.pageYOffset > SCROLLED_HEIGHT;
      },
      smallViewportScrollHandle() {
        if (document.documentElement.scrollTop < this.currentScrollPosition && window.pageYOffset > 0) {
          this.scrolled = true;
        } else {
          this.scrolled = window.pageYOffset > this.viewHeight - window.innerHeight;
        }
      },
      handleScroll() {
        if (VIEWPORT_L.matches) {
          this.largeViewportScrollHandle();
        } else {
          this.smallViewportScrollHandle();
        }
        this.getCurrentScrollPosition();
      },
      scrollToTop() {
        const step = window.pageYOffset / (SCROLL_DURATION / SCROLL_STEP);
        // smooth scrolling
        const timer = setInterval(() => {
          document.documentElement.scrollTop -= step;
          if (window.pageYOffset <= 0) {
            clearInterval(timer);
          }
        }, SCROLL_STEP);
      }
    },
    mounted() {
      this.getPageSizes();
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.getPageSizes);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.getPageSizes);
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  .back-to-top {
    position: sticky;
    bottom: 18px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: -$building-unit-x1_5;

    @include mobile {
      margin-bottom: 0;
    }

    .back-to-top-arrow {
      width: $building-unit * 3.5;
      height: $building-unit-x3;
      border: 1px solid $gray-178;
      border-radius: $telekom-radius;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $gray-237;

      @include mobile {
        margin-right: $building-unit;
      }

      img {
        height: $building-unit-x1_5;
        width: auto;
      }
    }
  }
</style>
