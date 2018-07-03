<i18n src="./ActionsPane.yml"></i18n>

<template>
  <div class="actions-pane is-flex is-size-7">
    <div class="actions-item">
      <span
        class="action-button"
        @click="setSharePopupOpen(!isSharePopupOpen)">
        <img src="./assets/share.svg">
        <span>{{ $t('share') }}</span>
      </span>
      <SharePane
        :is-open="isSharePopupOpen"
        @close="setSharePopupOpen(false)"/>
    </div>
    <div class="actions-item">
      <span
        class="action-button"
        @click="print">
        <img src="./assets/print.svg">
        <span>{{ $t('print') }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SharePane from '../SharePane/SharePane.vue';

  export default Vue.extend({
    components: {
      SharePane
    },
    data() {
      return {
        isSharePopupOpen: false
      };
    },
    methods: {
      print() {
        window.print();
      },
      setSharePopupOpen(val: boolean) {
        this.isSharePopupOpen = val;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';

  $actions-item-spread: $building-unit-x2;
  $actions-icon-spread: $building-unit-x0_5;

  .actions-pane {
    .actions-item {
      margin-right: $actions-item-spread;
      cursor: pointer;
      color: $gray-56;
      position: relative;

      img {
        margin-right: $actions-icon-spread;
        position: relative;
        top: 1px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
