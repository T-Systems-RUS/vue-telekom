<template>
  <section class="slider">
    <div
      ref="track"
      @transitionend="onTransitionend"
      :style="trackTransform"
      :class="{'is-dragging': isDragging}"
      class="track">
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
    slidesHTML: HTMLElement[]
    activeSlide: Vue | undefined;
    trackEl: HTMLElement;
    slideWidth: number;
    delta: number;
    startPosition: number;
    endPosition: number;
    isDragging: boolean;
    isSliding: boolean;
  }

  export default Vue.extend({
    props: {
      hasDots: {
        default: true,
        type: Boolean
      },
      hasArrows: {
        default: false,
        type: Boolean
      }
    },
    data(): ISliderData {
      return {
        slides: [],
        slidesHTML: [],
        activeSlide: undefined,
        trackEl: this.$refs.track as HTMLElement,
        slideWidth: 0,
        delta: 0,
        startPosition: 0,
        endPosition: 0,
        isDragging: false,
        isSliding: false
      };
    },
    mounted() {
      this.initSlider();
      this.$nextTick(() => {
        this.updateWidth();
        this.setSlide(0);
      });
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
      },
      trackTransform(): string {
        return `transform: translate(${this.delta - (this.activeSlideIndex * this.slideWidth)}px, 0);`;
      }
    },
    methods: {
      setSlide(index: number) {
        if (index >= 0 && index < this.slides.length) {
          this.activeSlide = this.slides[index];
        }
      },
      initSlider() {
        this.slides = this.$children;
        this.trackEl = this.$refs.track as HTMLElement;
        this.slidesHTML = Array.from(this.trackEl.children as HTMLCollection) as HTMLElement[];
        document.addEventListener('touchstart', this.onDragStart, {passive: true});
        window.addEventListener('resize', this.updateWidth);
      },
      updateWidth() {
        const rect = this.$el.getBoundingClientRect();
        this.slideWidth = rect.width;
        this.slidesHTML.forEach((slide: HTMLElement) => {
          slide.style.width = `${this.slideWidth}px`;
        });
      },
      onDragStart(event: TouchEvent) {
        if (this.isSliding) {
          return;
        }
        this.startPosition = event.touches[0].clientX;
        this.isDragging = true;
        document.addEventListener('touchmove', this.onDrag);
        document.addEventListener('touchend', this.onDragEnd);
      },
      onDrag(event: TouchEvent) {
        this.endPosition = event.touches[0].clientX;
        this.delta = this.endPosition - this.startPosition;
      },
      onDragEnd() {
        const tolerance = 0.5;
        const direction = Math.sign(this.delta);
        const draggedSlide = Math.round(Math.abs(this.delta / this.slideWidth) + tolerance);
        this.setSlide(this.activeSlideIndex - (direction * draggedSlide));
        this.delta = 0;
        this.isDragging = false;
        this.isSliding = true;
        document.removeEventListener('touchmove', this.onDrag);
        document.removeEventListener('touchend', this.onDragEnd);
      },
      onTransitionend() {
        this.trackEl.style.transition = '';
        this.isSliding = false;
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
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .track {
    display: flex;
    width: 100%;
    transition: $transition-default;

    &.is-dragging {
      transition: none;
    }
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
