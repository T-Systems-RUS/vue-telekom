<template>
  <div
    @click="handleItemClick"
    @keydown.enter="handleItemClick"
    @keydown.down="handleDownClick"
    @keydown.up="handleUpClick"
    :class="{'is-selected': isSelected, 'is-hidden': !isFiltered}"
    tabindex="0"
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
  @import '../../../styles/utilities/mixins';

  $item-padding: $building-unit $building-unit;

  .selectbox-item {
    display: flex;
    align-items: center;
    padding: $item-padding;
    background-color: $white;
    transition: $transition-default;
    cursor: pointer;
    white-space: nowrap;

    &:hover,
    &:focus {
      background-color: $gray-237;
      outline: none;
    }

    &.is-selected {
      background-color: $gray-248;

      &:hover,
      &:focus {
        background-color: $gray-237;
        outline: none;
      }
    }

    &.is-inactive {
      color: $gray-237;
    }

    .selectbox-item-checkbox {
      height: $building-unit-x2;
      flex-shrink: 0;

      label {
        height: $building-unit-x2;
      }
    }

    .selectbox-item-label {
      color: $white;
      background-color: $gray-56;
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
