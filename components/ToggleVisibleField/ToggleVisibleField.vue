<template>
  <div class="control">
    <div class="icon-element-wrap">
      <input
        class="input"
        :type="fieldType">
      <span
        class="toggle-visible"
        @click="toggleVisible">
        <img
          v-if="!isVisible"
          src="./assets/visible_outline.svg">
        <img
          v-if="isVisible"
          src="./assets/invisible_outline.svg">
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    data() {
      return {
        visible: false
      };
    },
    props: {
      header: String
    },
    computed: {
      isVisible(): boolean {
        return this.visible;
      },
      fieldType(): string {
        return this.isVisible ? 'text' : 'password';
      }
    },
    methods: {
      toggleVisible() {
        this.visible = !this.visible;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $visible-image-size: $building-unit-x1_5;

  // Circle bullets for hidden passwords
  input[type='password'] {
    font-family: caption;
  }

  .icon-element-wrap {
    display: inline-block;
    width: 100%;
    position: relative;
  }

  .toggle-visible {
    @include absolute-y-center;
    right: $building-unit;
    height: $visible-image-size;
    width: $visible-image-size;

    img {
      width: 100%;
      height: auto;
    }
  }

</style>
