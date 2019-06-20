<template>
  <transition name="opacity">
    <div class="modal-popup modal is-active">
      <div class="modal-background"/>
      <div class="modal-card">
        <header class="modal-card-head">
          <div class="modal-head-content">
            <slot name="modal-header"/>
          </div>
          <button
            @click="exit"
            class="modal-close-btn"/>
        </header>
        <section class="modal-card-body">
          <div class="modal-card-content">
            <slot name="modal-body"/>
          </div>
        </section>
        <footer
          v-if="hasFooter"
          class="modal-card-foot">
          <slot name="modal-footer"/>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      hasFooter: {
        type: Boolean,
        default: true
      }
    },
    created() {
      document.documentElement.classList.add('is-clipped');
    },
    destroyed() {
      document.documentElement.classList.remove('is-clipped');
    },
    methods: {
      exit() {
        this.$emit('exit');
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/transitions';
  @import '../../styles/utilities/mixins';

  // sizes and paddings
  $modal-vertical-padding: $building-unit-x6;
  $modal-vertical-padding-mobile: $building-unit-x2;

  $modal-card-max-width: 672px;
  $modal-card-max-width-wide: 1056px;

  $close-size: $building-unit-x2;

  $hz-padding: $building-unit-x3;
  $hz-padding-mobile: $building-unit-x2;

  $header-min-height: 84px;
  $header-padding-right: $hz-padding + $close-size + $building-unit-x2;
  $header-padding-right-mobile: $hz-padding-mobile + $close-size + $building-unit;

  $body-hz-padding: $building-unit-x0_25;
  $body-padding: $building-unit $body-hz-padding;

  $content-padding: $building-unit-x2 ($hz-padding - $body-hz-padding);
  $content-padding-mobile: $building-unit ($hz-padding-mobile - $body-hz-padding);

  $footer-padding: $building-unit-x2 $hz-padding $building-unit-x2_5;
  $footer-padding-mobile: $building-unit-x2 $hz-padding-mobile $building-unit-x2_5;

  // colors, shadows
  $modal-card-bg-color: $white;
  $modal-border: 1px solid $gray-237;
  $modal-card-shadow: 0 $building-unit-x2 $building-unit-x3 0 rgba($black, 0.24);

  .modal-popup {
    align-items: flex-start;
    padding: $building-unit-x6 0;

    @include mobile {
      padding: $building-unit-x2 0;
    }

    &.is-wide {
      .modal-card {
        max-width: $modal-card-max-width-wide;
      }
    }

    .modal-background {
      background-color: rgba($black, .7);
    }

    .modal-card {
      width: 100%;
      max-width: $modal-card-max-width;
      max-height: calc(100vh - #{$modal-vertical-padding * 2});
      margin: 0;
      box-shadow: $modal-card-shadow;
      background-color: $modal-card-bg-color;
      border-radius: $telekom-radius;

      @include mobile {
        max-height: calc(100vh - #{$modal-vertical-padding-mobile * 2});
      }
    }

    .modal-card-head {
      background-color: $modal-card-bg-color;
      border-radius: 0;
      padding-top: $building-unit-x1_5;
      padding-bottom: $building-unit-x1_5;
      padding-left: $hz-padding;
      padding-right: $header-padding-right;
      position: relative;
      border-bottom: $modal-border;
      min-height: $header-min-height;

      @include mobile {
        padding-left: $hz-padding-mobile;
        padding-right: $header-padding-right-mobile;
      }
    }

    .modal-card-body {
      padding: $body-padding;
      overflow: hidden;
      display: flex;
    }

    .modal-card-content {
      overflow: auto;
      padding: $content-padding;
      @include custom-scroll-thin;

      @include mobile {
        padding: $content-padding-mobile;
      }
    }

    .modal-card-foot {
      padding: $footer-padding;
      background-color: $modal-card-bg-color;
      border-radius: 0;
      border-top: $modal-border;
      display: block;

      @include mobile {
        padding: $footer-padding-mobile;
      }
    }

    .modal-close-btn {
      width: $close-size;
      height: $close-size;
      @include absolute-y-center;
      right: $hz-padding;
      border: 0;
      cursor: pointer;
      outline: none;
      background: center / cover url('./assets/close.svg') no-repeat;
      transition: $transition-default;

      @include mobile {
        right: $hz-padding-mobile;
      }

      &:hover {
        opacity: .8;
      }

      &:active {
        opacity: .6;
      }
    }
  }
</style>
