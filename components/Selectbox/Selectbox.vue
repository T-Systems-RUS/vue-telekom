<template>
  <div
    v-outer-click="close"
    :class="{'is-active': isOpen}"
    class="selectbox">
    <button
      class="button selectbox-toggle"
      @click.stop="toggle">
      <slot name="placeholder"/>
      <span class="selectbox-toggle-arrow"/>
    </button>
    <div class="selectbox-menu">
      <div class="selectbox-content is-size-6">
        <SelectboxItem
          v-if="hasReset && isMultiple"
          is-reset="true"
          :value="null"
          @reset="reset">
          <slot
            name="reset"
            slot="item-text"/>
        </SelectboxItem>
        <slot name="menu"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SelectboxItem from './SelectboxItem/SelectboxItem.vue';
  import {OuterClick} from '../../directives/outerClick';

  export default Vue.extend({
    components: {SelectboxItem},
    directives: {OuterClick},
    data() {
      return {
        isOpen: false
      };
    },
    props: {
      isMultiple: {
        default: false
      },
      value: {
        required: true
      },
      hasReset: {
        default: false
      }
    },
    mounted() {
      this.$children.forEach(child => {
        child.$on('itemClick', (value: {}) => this.handleChange(value));
      });
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
      },
      close() {
        this.isOpen = false;
      },
      handleChange(value: {}) {
        if (this.isMultiple) {
          this.handleMultipleChange(value);
        } else {
          this.emitValue(value);
          this.close();
        }
      },
      handleMultipleChange(value: {}) {
        if (this.value instanceof Array) {
          const newValue = [...this.value];
          const itemValueIndex = newValue.indexOf(value);

          if (itemValueIndex > -1) {
            newValue.splice(itemValueIndex, 1);
          } else {
            newValue.push(value);
          }
          this.emitValue(newValue);
        }
      },
      emitValue(value: {}) {
        this.$emit('input', value);
      },
      reset() {
        this.emitValue([]);
      }
    }
  });
</script>
<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $arrow-size: 9px;
  $arrow-margin: -6px;
  $selectbox-padding: 5px $building-unit-x3 5px $building-unit;

  .selectbox {
    width: 100%;
    position: relative;

    .selectbox-toggle {
      width: 100%;
      justify-content: flex-start;
      position: relative;
      padding: $selectbox-padding;
    }

    .selectbox-toggle-arrow {
      position: absolute;
      width: $arrow-size;
      height: $arrow-size;
      right: $building-unit;
      border-right: 1px solid $gray-56;
      border-bottom: 1px solid $gray-56;
      top: 50%;
      transform:  translateY(-60%) rotate(45deg);
    }

    .selectbox-menu {
      @include custom-scroll;
      display: none;
      position: absolute;
      background: $white;
      top: calc(100% + #{$building-unit-x0_5});
      left: 0;
      min-width: 100%;
      max-width: $form-field-width;
      border: 1px solid $gray-178;
      border-radius: $telekom-radius;
      overflow-y: auto;
      max-height: 5 * $building-unit-x3;
      z-index: 1;
    }

    &.is-active {
      .selectbox-menu {
        display: block;
      }

      .selectbox-toggle-arrow {
        transform: translateY(-20%) rotate(-135deg);
      }
    }

  }
</style>
