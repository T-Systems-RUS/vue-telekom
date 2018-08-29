<template>
  <section class="slider">
    <div class="slider-slides">
      <slot/>
    </div>
    <div class="slider-controls">
      <div
        @click="setSlide(activeSlideIndex - 1)"
        :class="{'is-disabled': isLeftArrowDisabled}"
        class="slider-arrow is-left"/>
      <ul class="slider-dots">
        <li
          v-for="(slide, index) in slides"
          :class="{'is-active': activeSlideIndex === index}"
          @click="setSlide(index)"
          class="slider-dot"/>
      </ul>
      <div
        @click="setSlide(activeSlideIndex + 1)"
        :class="{'is-disabled': isRightArrowDisabled}"
        class="slider-arrow is-right"/>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';

  interface ISliderData {
    slides: Vue[];
    activeSlide: Vue | undefined;
  }

  export default Vue.extend({
    data(): ISliderData {
      return {
        slides: [],
        activeSlide: undefined
      };
    },
    mounted() {
      this.slides = this.$children;
      this.setSlide(0);
    },
    computed: {
      activeSlideIndex(): number {
        return this.activeSlide ?
          this.slides.indexOf(this.activeSlide) : -1;
      },
      isLeftArrowDisabled(): boolean {
        return this.activeSlideIndex <= 0;
      },
      isRightArrowDisabled(): boolean {
        return this.activeSlideIndex >= this.slides.length - 1;
      }
    },
    methods: {
      setSlide(index: number) {
        if (index >= 0 && index < this.slides.length) {
          this.activeSlide = this.slides[index];
        }
      }
    }
  });
</script>


<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $slider-control-size: $building-unit-x1_5;
  $slider-dot-size: $building-unit-x0_5;
  $arrow-size: 8px;

  .slider {
    width: 100%;
  }

  .slider-slides {
    position: relative;
    overflow: hidden;
  }

  .slider-controls {
    display: flex;
    justify-content: center;
    align-items: center;

    .slider-arrow {
      width: $slider-control-size;
      height: $slider-control-size;
      position: relative;
      display: block;
      cursor: pointer;
      transition: $transition-default;

      &.is-disabled {
        pointer-events: none;

        &::before {
          border-color: $gray-220;
        }
      }

      &:not(.is-disabled):hover {
        &::before {
          border-color: $gray-178;
        }
      }

      &::before {
        content: '';
        width: $arrow-size;
        height: $arrow-size;
        border-bottom: 1px solid $gray-117;
        border-left: 1px solid $gray-117;
        @include absolute-xy-center;
      }

      &.is-left {
        margin-right: $building-unit-x0_5;

        &::before {
          transform: translate(-30%, -60%) rotate(45deg);
        }
      }

      &.is-right {
        margin-left: $building-unit-x0_5;

        &::before {
          transform: translate(-70%, -60%) rotate(225deg);
        }
      }
    }

    .slider-dots {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .slider-dot {
      position: relative;
      width: $slider-control-size;
      height: $slider-control-size;
      cursor: pointer;

      &.is-active {
        cursor: default;

        &::after {
          background-color: $magenta;
        }
      }

      &:not(.is-active):hover {
        &:after {
          background-color: $gray-178;
        }
      }

      &::after {
        content: '';
        @include absolute-xy-center;
        width: $slider-dot-size;
        height: $slider-dot-size;
        border-radius: 50%;
        background-color: $gray-199;
        transition: $transition-default;
      }
    }
  }
</style>
