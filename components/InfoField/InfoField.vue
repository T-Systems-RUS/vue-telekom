<template>
  <div class="control">
    <div class="icon-element-wrap">
      <input
        type="text"
        class="input"
        :value="value"
        @input="updateInput($event.target.value)"
        :class="{'is-danger': invalid}">
      <Tooltip
        class="is-input is-absolute info-icon"
        :text="text">
        <img src="./assets/information_outline_blue.svg">
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Tooltip from '../Tooltip/Tooltip.vue';

  export default Vue.extend({
    components: {Tooltip},
    props: {
      name: String,
      value: {required: true},
      invalid: Boolean,
      text: String
    },
    methods: {
      updateInput(value: string) {
        this.$emit('input', value);
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $visible-image-size: $building-unit-x1_5;

  .icon-element-wrap {
    display: inline-block;
    width: 100%;
    position: relative;
  }

  .info-icon {
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
