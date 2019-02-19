<template>
  <div
    @click="handleItemClick"
    :class="{'is-selected': isSelected}"
    class="selectbox-item is-size-6">
    <div
      v-if="isMultiple"
      class="selectbox-item-checkbox">
      <Checkbox :checked="isSelected"/>
    </div>
    <div class="selectbox-item-content">
      <span
        ref="itemText"
        class="selectbox-item-text">
        <slot name="item-text"/>
      </span>
      <span class="selectbox-item-label is-size-6"><slot name="item-label"/></span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Checkbox from '../../Checkbox/Checkbox.vue';

  export default Vue.extend({
    components: {Checkbox},
    props: {
      value: {
        required: true
      },
      isReset: {
        default: false
      }
    },
    computed: {
      isMultiple(): boolean {
        return this.$parent.$props.isMultiple && !this.isReset;
      },
      isSelected(): boolean {
        const selectboxValue = this.$parent.$props.value;

        if (this.isReset) {
          return !selectboxValue.length;
        } else if (this.isMultiple) {
          return selectboxValue.indexOf(this.value) > -1;
        }
        return selectboxValue === this.value;
      }
    },
    methods: {
      handleItemClick() {
        this.$parent.$emit(this.isReset ? 'reset' : 'itemClick', this.value);
      }
    }
  });
</script>
<style lang="scss" scoped>
  @import '../../../styles/base/variables';
  @import '../../../styles/utilities/mixins';

  $item-padding: $building-unit-x0_5 $building-unit;

  .selectbox-item {
    display: flex;
    align-items: center;
    padding: $item-padding;
    background-color: $white;
    transition: $transition-default;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: $gray-237;
    }

    &.is-selected {
      background-color: $gray-220;

      &:hover {
        background-color: $gray-199;
      }
    }

    &.is-inactive {
      color: $gray-237;
    }

    .selectbox-item-checkbox {
      height: $building-unit-x2;
      flex-shrink: 0;
      margin-right: $building-unit;

      label {
        height: $building-unit-x2;
      }
    }

    .selectbox-item-label {
      color: $white;
      background-color: $gray-56;
      border-radius: $telekom-radius;
      padding: 0 $building-unit;
      margin-left: $building-unit;

      &:empty {
        display: none;
      }
    }

    .selectbox-item-content {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
