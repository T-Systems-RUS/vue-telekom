<template>
  <transition name="opacity">
    <div class="modal common-modal is-active">
      <div class="modal-background"/>
      <div class="modal-card">
        <section class="modal-card-body">
          <div class="common-modal-body">
            <header class="common-modal-header">
              <h3 class="common-modal-title modal-card-title title is-2 is-3-mobile has-text-centered">
                <slot name="modal-title"/>
              </h3>
              <slot name="modal-subtitle">
                <p class="common-modal-subtitle has-text-centered is-size-5 is-size-6-mobile"/>
              </slot>
              <button
                @click="exit"
                class="common-modal-close"/>
            </header>
            <slot name="modal-content"/>
          </div>
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
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
  @import '../../styles/bulma/bulma-override-variables';
  @import '../../styles/utilities/transitions';
  @import '../../styles/utilities/mixins';

  $common-bg-color: $white;
  $modal-border-top: 4px solid $magenta;
  $modal-card-padding-top: 160px;

  $title-margin-bottom: $building-unit-x2;
  $subtitle-margin-bottom: $building-unit-x3;

  $close-size: $building-unit-x4;
  $close-top: $building-unit-x4;
  $close-right: -$close-size - $building-unit-x3;
  $close-right-mobile: 18px;
  $close-bg-size: 32px;

  .common-modal {
    border-top: $modal-border-top;

    .modal-background {
      background-color: $common-bg-color;
    }

    .modal-card {
      margin: 0;
      max-height: 100vh;
      height: 100vh;
      position: relative;
      //max-width: $container-max-size;
      width: 100%;
    }

    .common-modal-header {
      background-color: $common-bg-color;
      border-bottom: 0;
      padding-top: $modal-card-padding-top;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-bottom: 0;
      position: relative;
    }

    .modal-card-body {
      padding: 0 $building-unit;
      padding-bottom: $building-unit-x2;

      @include mobile {
        padding: 0 $building-unit;
      }
    }

    .common-modal-body {
      max-width: $container-min-width;
      margin: 0 auto;
    }

    &-title {
      margin-bottom: $title-margin-bottom;
    }

    &-subtitle {
      margin-bottom: $subtitle-margin-bottom;
    }

    &-close {
      width: $close-size;
      height: $close-size;
      position: absolute;
      top: $close-top;
      right: $close-right;
      border-radius: 50%;
      border: 0;
      cursor: pointer;
      outline: none;
      background: $gray-38 center / $close-bg-size $close-bg-size url('./assets/close.svg') no-repeat;

      @include mobile {
        right: $close-right-mobile;
      }

      @include tablet {
        right: $close-right-mobile;
      }

      @include desktop {
        right: $close-right;
      }
    }
  }
</style>
