<template>
  <div
    @click="handleItemClick"
    @keydown.enter="handleItemClick"
    @keydown.down.prevent="handleDownClick"
    @keydown.up.prevent="handleUpClick"
    :class="{'is-selected': isSelected, 'is-hidden': !isFiltered}"
    tabindex="0"
    class="selectbox-item">
    <Checkbox
      v-if="isMultiple"
      class="selectbox-item-checkbox is-small"
      :checked="isSelected"/>
    <div class="selectbox-item-content">
      <span
        ref="itemText"
        class="selectbox-item-text">
        <slot name="item-text"/>
      </span>
      <span class="selectbox-item-label"><slot name="item-label"/></span>
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
      }
    },
    data() {
      return {
        isFiltered: true
      };
    },
    mounted() {
      this.setIsFiltered();
    },
    watch: {
      searchString() {
        this.setIsFiltered();
      }
    },
    computed: {
      isMultiple(): boolean {
        return this.$parent.$props.isMultiple;
      },
      isSelected(): boolean {
        const selectboxValue = this.$parent.$props.value;
        if (this.isMultiple) {
          return selectboxValue.indexOf(this.value) > -1;
        }
        return selectboxValue === this.value;
      },
      searchString(): string {
        return this.$parent.$data.search;
      },
      index(): number {
        return this.$parent.$data.selectItems.indexOf(this);
      }
    },
    methods: {
      handleItemClick() {
        this.$parent.$emit('itemClick', this.value);
      },
      handleDownClick() {
        this.$parent.$emit('down', this.index);
      },
      handleUpClick() {
        this.$parent.$emit('up', this.index);
      },
      setIsFiltered() {
        const searchString = this.searchString.toLowerCase().trim();
        const item = this.$refs.itemText as HTMLElement;
        this.isFiltered = item ?
          (item.textContent || '').toLowerCase().trim().indexOf(searchString) > -1 :
          true;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../../styles/base/variables';
  @import '../../../styles/base/typography';
  @import '../../../styles/utilities/mixins';

  $item-border-size: 1px;
  $item-padding: ($building-unit_x0_5 - $item-border-size) ($building-unit-x0_66 - $item-border-size);
  $active-color: $gray-208;
  $hover-color: $gray-237;
  $focus-color: $blue-83;
  $label-height: $building-unit-x1_5;

  .selectbox-item {
    display: flex;
    align-items: center;
    padding: $item-padding;
    background-color: $white;
    transition: $transition-default;
    cursor: pointer;
    white-space: nowrap;
    @include font-size(7);
    line-height: $lh-6;
    border: $item-border-size solid transparent;
    outline: none;

    &.is-selected:hover,
    &:hover {
      background-color: $hover-color;
      border-color: $hover-color;
    }

    &:focus:not(:active) {
      background-color: $hover-color;
      border-color: $focus-color;
    }

    &:active {
      background-color: $active-color;
      border-color: $active-color;
    }

    &.is-selected {
      background-color: $gray-230;

      &:focus {
        background-color: $gray-230;
      }
    }

    &.is-inactive {
      color: $gray-237;
    }

    .selectbox-item-checkbox {
      flex-shrink: 0;
      margin-right: $building-unit;
    }

    .selectbox-item-label {
      @include font-size(8);
      line-height: $label-height;
      color: $white;
      background-color: $gray-164;
      padding: 0 $building-unit-x0_5;
      margin-left: $building-unit;
      font-weight: $font-weight-bold;
      height: $label-height;
      border-radius: $label-height;

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
