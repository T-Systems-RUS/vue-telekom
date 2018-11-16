<template>
  <transition name="opacity">
    <div
      v-if="isVisible"
      class="back-to-top"
      :class="{'is-absolute': isFooterVisible}">
      <div class="container centered">
        <button
          @click="scrollToTop()"
          class="back-to-top-button button is-icon"/>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';

  const SCROLL_DURATION = 200;
  const SCROLL_STEP = 5;

  export default Vue.extend({
    data() {
      return {
        scrolled: 0,
        isFooterVisible: false,
        isVisible: false
      };
    },
    methods: {
      setIsFooterVisible() {
        const footer = document.querySelector('footer.footer');
        this.isFooterVisible = footer ?
          footer.getBoundingClientRect().top < window.innerHeight :
          false;
      },
      setIsVisible() {
        const isScrolledEnough = document.documentElement.scrollTop > window.innerHeight;

        if (this.isDesktop()) {
          // on desktop show when one viewport is scrolled
          this.isVisible = isScrolledEnough;
        } else {
          // on touch screens show when reached footer or when scrolled up and more that one viewport
          const isScrolledUp = document.documentElement.scrollTop < this.scrolled;
          this.isVisible = (this.isFooterVisible && Boolean(this.scrolled)) || (isScrolledUp && isScrolledEnough);
        }
      },
      processPosition() {
        this.setIsFooterVisible();
        this.setIsVisible();
        this.scrolled = document.documentElement.scrollTop;
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
      },
      isDesktop(): boolean {
        return window.innerWidth >= 1024;
      }
    },
    mounted() {
      window.addEventListener('scroll', this.processPosition);
      window.addEventListener('resize', this.processPosition);
    },
    destroyed() {
      window.removeEventListener('scroll', this.processPosition);
      window.removeEventListener('resize', this.processPosition);
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $btt-bottom-position: $building-unit-x1_5;

  .back-to-top {
    position: fixed;
    left: 0;
    right: 0;
    padding: 0 $building-unit;
    width: 100%;
    bottom: $btt-bottom-position;
    z-index: 1;
    height: 0;

    .container {
      position: relative;
    }

    &.is-absolute {
      position: absolute;
      bottom: calc(100% + #{$btt-bottom-position});
    }

    &-button {
      position: absolute;
      right: 0;
      bottom: 0;

      &::after {
        background-image: url('./export_outline.svg');
      }
    }
  }
</style>
