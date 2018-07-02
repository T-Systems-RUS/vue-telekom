../<i18n src="./ConfirmModal.yml"></i18n>

<template>
  <transition name="opacity">
    <div class="modal is-active">
      <div class="modal-background"/>
      <div class="modal-card">
        <header class="modal-card-head">
          <h3 class="modal-card-title is-size-3 has-text-centered">
            <slot name="modal-title"/>
          </h3>
        </header>
        <section class="modal-card-body">
          <slot name="modal-body"/>
        </section>
        <footer class="modal-card-foot has-text-centered">
          <div class="modal-confirm">
            <slot name="confirm-button">
              <button
                class="button is-primary"
                slot="modal-buttons"
                @click="confirm">
                <slot name="confirm-button-text">
                  {{ $t('confirm') }}
                </slot>
              </button>
            </slot>
          </div>
          <a
            role="button"
            @click="exit">{{ $t('cancel') }}</a>
        </footer>
        <button
          @click="exit"
          class="modal-card-close"/>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    methods: {
      exit() {
        this.$emit('exit');
      },
      confirm() {
        this.$emit('confirm');
      }
    },
    created() {
      document.documentElement.classList.add('is-clipped');
    },
    destroyed() {
      document.documentElement.classList.remove('is-clipped');
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/transitions';
  @import '../../styles/utilities/mixins';

  $padding-hz: $building-unit-x2;
  $padding-top: 54px;
  $padding-bottom: $building-unit-x4;
  $padding-hz-mobile: $building-unit;
  $close-position: $building-unit-x1_5;
  $close-size: $building-unit-x2;
  $modal-buttons-margin-bottom: $building-unit-x1_5;

  .modal {

    .modal-card {
      position: relative;

      @include mobile {
        width: 100%;
        height: 100%;
        margin: 0;
        max-height: 100vh;
        background: $white;
      }
    }

    .modal-card-head {
      background-color: $white;
      border: 0;
      padding: $padding-top $padding-hz $building-unit;

      @include mobile {
        padding-left: $padding-hz-mobile;
        padding-right: $padding-hz-mobile;
        border-radius: 0;
      }
    }

    .modal-card-body {
      padding: 0 $padding-hz $building-unit-x2;
      flex-grow: 0;

      @include mobile {
        padding-left: $padding-hz-mobile;
        padding-right: $padding-hz-mobile;
        padding-top: $building-unit;
      }
    }

    .modal-card-foot {
      background-color: $white;
      border: 0;
      flex-direction: column;
      padding-left: $padding-hz;
      padding-right: $padding-hz;
      padding-bottom: $padding-bottom;

      @include mobile {
        padding-left: $padding-hz-mobile;
        padding-right: $padding-hz-mobile;
        border-radius: 0;
      }
    }

    .modal-confirm {
      margin-bottom: $modal-buttons-margin-bottom;
    }

    .modal-card-close {
      position: absolute;
      right: $close-position;
      top: $close-position;
      width: $close-size;
      height: $close-size;
      outline: none;
      border: 0;
      background: center / contain url('./assets/cancel_outline.svg') no-repeat;
      box-shadow: none;
      cursor: pointer;
    }
  }
</style>
