<template>
  <div class="control">
    <div class="icon-element-wrap">
      <input
        class="input"
        ref="input"
        :value="value"
        :placeholder="placeholder"
        @input="emitInput"
        @blur="$emit('blur')"
        :type="fieldType">
      <span
        class="toggle-visible"
        @click="toggleVisible">
        <span
          :class="{'is-hidden': isVisible}"
          class="action-icon is-show"/>
        <span
          :class="{'is-hidden': !isVisible}"
          class="action-icon is-hide"/>
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
      placeholder: String,
      value: String
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
      },
      emitInput() {
        this.$emit('input', (this.$refs.input as HTMLInputElement).value);
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $toggle-visible-size: $building-unit-x2;
  $action-icon-size: $building-unit-x1_5;

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
    height: $toggle-visible-size;
    width: $toggle-visible-size;
    padding: $building-unit_x0_25;
    cursor: pointer;

    .action-icon {
      @include absolute-fit;
      background: center center / $action-icon-size $action-icon-size no-repeat;
      opacity: 1;
      transition: $transition-default;

      &.is-show {
        background-image: url('./assets/visible_outline.svg');
      }

      &.is-hide {
        background-image: url('./assets/invisible_outline.svg');
      }

      &.is-hidden {
        opacity: 1;
      }
    }
  }

</style>
