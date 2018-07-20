<i18n src="./SharePane.yml"></i18n>

<template>
  <transition name="opacity">
    <div
      v-outer-click="close"
      class="share-pane"
      v-if="isOpen">
      <div class="share-list">
        <a
          class="share-item is-facebook"
          :title="$t('facebook')"
          :href="getShareUrl('https://www.facebook.com/sharer/sharer.php?u=')"
          target="_blank"/>
        <a
          class="share-item is-twitter"
          :title="$t('twitter')"
          :href="getShareUrl('https://twitter.com/intent/tweet?text=')"
          target="_blank"/>
        <a
          class="share-item is-linked-in"
          :title="$t('linkedIn')"
          :href="getShareUrl('https://www.linkedin.com/shareArticle?mini=true&url=')"
          target="_blank"/>
        <a
          class="share-item is-xing"
          :title="$t('xing')"
          :href="getShareUrl('https://www.xing.com/app/user?op=share&url=')"
          target="_blank"/>
        <a
          class="share-item is-google-plus"
          :title="$t('googlePlus')"
          :href="getShareUrl('https://plus.google.com/share?url=')"
          target="_blank"/>
        <a
          class="share-pane-close"
          @click="close()"
          :title="$t('close')"/>
      </div>
      <span class="share-pane-arrow"/>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {OuterClick} from '../../directives/outerClick';

  export default Vue.extend({
    directives: {OuterClick},
    props: {
      isOpen: Boolean
    },
    methods: {
      getShareUrl(url: string) {
        return url + window.location.href;
      },
      close() {
        this.$emit('close');
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $share-pane-size: 294px;
  $share-pane-background: $gray-237;
  $share-pane-padding: $building-unit;
  $share-pane-top: $building-unit;

  $icon-size: $building-unit-x2;
  $icon-background-size: $icon-size $icon-size;

  $close-icon-size: $building-unit-x1_5;
  $close-btn-size: 30px;

  $arrow-width: $building-unit-x1_5;
  $arrow-height: $building-unit;

  $share-item-size: $building-unit-x3;
  $share-item-margin: $building-unit;
  $share-item-hover-color: $gray-220;
  $share-item-active-color: $gray-199;
  $share-item-border-focus: 1px solid $gray-178;

  .share-pane {
    .share-list {
      display: flex;
      align-items: center;
      width: $share-pane-size;
      background-color: $share-pane-background;
      padding: $share-pane-padding;
      position: absolute;
      left: 0;
      top: calc(100% + #{$share-pane-top});
      border-radius: $telekom-radius;

      @include widescreen {
        @include absolute-x-center;
      }

      .share-item {
        width: $share-item-size;
        height: $share-item-size;
        background-size: $icon-background-size;
        background-position: center;
        background-repeat: no-repeat;
        margin-right: $share-item-margin;
        border-radius: $telekom-radius;
        transition: $transition-default;
        flex-shrink: 0;
        outline: 0;

        &.is-facebook {
          background-image: url('assets/facebook-f.svg');
        }

        &.is-twitter {
          background-image: url('assets/twitter.svg');
        }

        &.is-linked-in {
          background-image: url('assets/linkedin-in.svg');
        }

        &.is-xing {
          background-image: url('assets/xing.svg');
        }

        &.is-google-plus {
          background-image: url('assets/google-plus-g.svg');
        }

        &:hover {
          background-color: $share-item-hover-color;
        }

        &:active {
          background-color: $share-item-active-color;
        }

        &:focus {
          border: $share-item-border-focus;
        }
      }

      .share-pane-close {
        width: $close-btn-size;
        height: $close-btn-size;
        border-radius: $telekom-radius;
        cursor: pointer;
        background-image: url('./assets/cancel_outline.svg');
        background-size: $close-icon-size $close-icon-size;
        background-position: center;
        background-repeat: no-repeat;
        transition: $transition-default;
        outline: 0;

        &:hover {
          background-color: $share-item-hover-color;
        }

        &:active {
          background-color: $share-item-active-color;
        }

        &:focus {
          border: $share-item-border-focus;
        }
      }
    }

    .share-pane-arrow {
      border: $arrow-width/2 solid transparent;
      border-bottom: $arrow-height solid $share-pane-background;
      border-top: 0;
      @include absolute-x-center;
      top: calc(100% + #{$share-pane-top} - #{$arrow-height});
    }
  }
</style>
