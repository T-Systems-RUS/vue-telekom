<template>
  <section class="page">
    <div class="container">
      <div class="navigation">
        <Breadcrumbs/>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column">
          <slot name="'page-heading'"/>
          <ActionsPane/>
        </div>
      </div>
      <div class="columns">
        <div class="column page-content is-two-thirds">
          <div class="page-content-main">
            <slot name="'page-content-main'"/>
          </div>
          <div class="page-content-additional">
            <slot name="'page-content-additional'"/>
          </div>
        </div>
        <aside class="side-links column is-narrow is-one-third">
          <slot name="'side-links'"/>
        </aside>
      </div>
      <div class="columns page-content-bottom">
        <slot name="'page-content-bottom'"/>
      </div>
    </div>
    <BackToTop/>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ActionsPane from '../ActionsPane/ActionsPane.vue';

  export default Vue.extend({
    components: {
      ActionsPane
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $page-padding: 0 $building-unit $building-unit-x3;
  $page-padding-mobile: 0 $building-unit $building-unit-x1_5;
  $navigation-margin-bottom: $building-unit-x5 - 3px;
  $navigation-margin-bottom-mobile: $building-unit-x4 - 3px;
  $navigation-padding-top: $building-unit - 3px;
  $additional-content-margin-bottom: $building-unit-x2_5;
  $list-padding: $building-unit-x1_5;
  $main-content-margin-bottom: $building-unit-x3;
  $content-headers-margin-bottom: $building-unit-x1_5;
  $actions-pane-margin-bottom: $building-unit-x2;
  $bottom-content-paragraph-margin: $building-unit-x1_5;

  .navigation {
    padding-top: $navigation-padding-top;
    margin-bottom: $navigation-margin-bottom;

    @include mobile {
      margin-bottom: $navigation-margin-bottom-mobile;
    }
  }

  .page {
    padding: $page-padding;

    @include mobile {
      padding: $page-padding-mobile;
    }

    h1 {
      margin-bottom: $building-unit;
    }

    .page-content {
      .page-content-main {
        margin-bottom: $main-content-margin-bottom;
      }

      h3 {
        margin-bottom: $content-headers-margin-bottom;
        font-weight: $font-weight-regular;
      }

      p {
        margin-bottom: $additional-content-margin-bottom;
      }

      ol {
        padding-left: $list-padding;
        margin-bottom: $additional-content-margin-bottom;
      }
    }

    .actions-pane {
      margin-bottom: $actions-pane-margin-bottom;
    }

    .side-links {
      div {
        margin-bottom: $additional-content-margin-bottom;
      }

      span {
        display: inline-flex;
        width: 100%;
        border-bottom: 1px solid $gray-178;
        margin-bottom: $building-unit;
      }
    }

    .page-content-bottom {
      h2 {
        margin-bottom: $building-unit;
        font-weight: $font-weight-regular;
      }

      p {
        margin-bottom: $building-unit;

        &:last-of-type {
          margin-bottom: $bottom-content-paragraph-margin;
        }
      }

      ul {
        list-style: disc;
        padding-left: $list-padding;
      }
    }
  }
</style>
