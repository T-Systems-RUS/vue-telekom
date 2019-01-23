<template>
  <section class="slider">
    <div
      ref="track"
      @transitionend="onTransitionend"
      @touchstart="onDragStart"
      :style="{transform: `translate(${transform}px, 0)`}"
      :class="{'is-dragging': isDragging, 'is-sliding': isSliding}"
      class="track">
      <slot/>
    </div>
    <div
      v-if="isGallery && slides.length > 1"
      class="gallery-controls">
      <div class="gallery-arrow-container is-left">
        <div
          @click="setSlide(activeSlideIndex - 1)"
          :class="{'is-disabled': isLeftArrowDisabled}"
          class="slider-arrow is-left"/>
      </div>
      <div class="gallery-arrow-container is-right">
        <div
          @click="setSlide(activeSlideIndex + 1)"
          :class="{'is-disabled': isRightArrowDisabled}"
          class="slider-arrow is-right"/>
      </div>
    </div>
    <div
      v-if="hasDots"
      class="slider-controls">
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
    slideWidth: number;
    delta: number;
    startPosition: number;
    endPosition: number;
    isDragging: boolean;
    isSliding: boolean;
  }

  export default Vue.extend({
    props: {
      // enable bottom menu
      hasDots: {
        default: true,
        type: Boolean
      },
      // enable black bars with arrows
      isGallery: {
        default: false,
        type: Boolean
      }
    },
    data(): ISliderData {
      return {
        slides: [],
        slidesHTML: [],
        activeSlide: undefined,
        slideWidth: 0,
        delta: 0, // offset of slider
        startPosition: 0, // drag start position
        endPosition: 0, // drag end position
        isDragging: false,
        isSliding: false // is animation of dragging not ended
      };
    },
    mounted() {
      this.initSlider();
      this.updateWidth();
      if (this.slides.length) {
        this.activeSlide = this.slides[0];
      }
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
      transform(): number {
        return this.delta - (this.activeSlideIndex * this.slideWidth);
      }
    },
    methods: {
      setSlide(index: number) {
        if (index >= 0 && index < this.slides.length) {
          this.isSliding = true;
          this.activeSlide = this.slides[index];
        }
      },
      initSlider() {
        this.slides = this.$children;
        if (this.$refs.track instanceof HTMLElement) {
          this.slidesHTML = Array.from(this.$refs.track.children as HTMLCollection) as HTMLElement[];
        }
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
        // if animation is not ended or only one slide then not allow dragging
        if (this.isSliding || (this.slides.length <= 1)) {
          return;
        }
        this.startPosition = event.touches[0].clientX;
        document.addEventListener('touchmove', this.onDrag);
        document.addEventListener('touchend', this.onDragEnd);
      },
      onDrag(event: TouchEvent) {
        this.isDragging = true;
        this.endPosition = event.touches[0].clientX;
        this.delta = this.endPosition - this.startPosition;
      },
      onDragEnd() {
        const tolerance = 0.15;
        const direction = Math.sign(this.delta);
        // find index offset while dragging
        const draggedSlide = Math.round(Math.abs(this.delta / this.slideWidth) + tolerance);
        if (this.isDragging) {
          this.setSlide(this.activeSlideIndex - (direction * draggedSlide));
        }
        this.delta = 0;
        this.isDragging = false;
        document.removeEventListener('touchmove', this.onDrag);
        document.removeEventListener('touchend', this.onDragEnd);
      },
      onTransitionend() {
        if (this.$refs.track instanceof HTMLElement) {
          this.$refs.track.style.transition = '';
        }
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
    border-radius: $telekom-radius;

    &:hover {
      .gallery-controls {
        opacity: 1;
      }
    }

    @include mobile {
      .gallery-controls {
        opacity: 1;
      }
    }
  }

  .track {
    display: flex;
    width: 100%;

    &.is-sliding {
      transition: $transition-default;
    }

    &.is-dragging {
      transition: none;
    }
  }

  .gallery-controls {
    opacity: 0;
    transition: $transition-default;

    .gallery-arrow-container {
      position: absolute;
      background-color: rgba($black, 0.75);
      width: $building-unit_x6;
      height: 100%;
      top: 0;

      @include mobile {
        width: $building-unit-x2_5;
      }

      .slider-arrow {
        width: $building-unit_x3;
        height: $building-unit_x3;
        @include absolute-xy-center;

        @include mobile {
          width: $building-unit;
          height: $building-unit;
        }

        &::before {
          width: $building-unit-x1_5;
          height: $building-unit-x1_5;
          border-bottom: 2px solid $white;
          border-left: 2px solid $white;

          @include mobile {
            width: $building-unit-x0_5;
            height: $building-unit-x0_5;
            border-bottom: 1px solid $white;
            border-left: 1px solid $white;
          }
        }

        &.is-disabled {
          pointer-events: none;

          &::before {
            border-color: $gray-220;
          }
        }

        &.is-right {
          margin-left: 0;
        }
      }

      &.is-right {
        right: 0;
      }
    }

  }

  .slider-controls {
    display: flex;
    justify-content: center;
    align-items: center;

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
</style>
