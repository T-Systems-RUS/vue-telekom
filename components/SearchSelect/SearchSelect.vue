<i18n src="./SearchSelect.yml"></i18n>

<template>
  <div
    v-outer-click="close"
    :class="{'is-active': isOpen, 'is-disabled': disabled}"
    class="selectbox">
    <!--input-->
    <div
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.down.prevent="handleArrowSelection(-1, true)"
      tabindex="0"
      class="selectbox-toggle input">
      <div class="selectbox-toggle-content">
        <div
          v-if="hasValue"
          class="selectbox-value-tag is-size-7">
          <div class="selectbox-value">
            <!--when single item is selected -> show single item value-->
            <slot
              name="single-value"
              v-if="!atLeastTwoSelected"/>
            <!--for multiselect: when multiple items are selected
            show single label (e.g 'users') instead of all values-->
            <slot
              name="multiple-value"
              v-else/>
            <span
              v-if="atLeastTwoSelected"
              class="selectbox-value-count">{{ value.length }}</span>
          </div>
          <span
            @click.stop="reset"
            class="selectbox-value-reset"/>
        </div>
        <span
          v-else
          class="selectbox-placeholder">
          <slot name="placeholder">{{ placeholder }}</slot>
        </span>
      </div>
      <span class="selectbox-toggle-arrow"/>
    </div>
    <!--flyout-->
    <div class="selectbox-menu">
      <div
        v-if="hasItems"
        class="selectbox-filter">
        <div
          v-if="hasSearch"
          class="search-input">
          <input
            ref="search"
            v-model="search"
            @keydown.down.prevent="handleArrowSelection(-1, true)"
            @keydown.enter.prevent="handleArrowSelection(-1, true)"
            :placeholder="$t('Search')"
            class="input"
            type="text">
        </div>
      </div>
      <div
        ref="menu"
        class="selectbox-content is-size-6">
        <slot/>
        <span
          class="selectbox-no-results is-size-7"
          v-if="!isAnyItemFiltered || !hasItems">
          <slot
            v-if="!hasItems"
            name="no-items">{{ $t('noOptions') }}</slot>
          <slot
            v-else-if="!isAnyItemFiltered"
            name="no-results">{{ $t('noResults') }}</slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {OuterClick} from '../../directives/outerClick';

  interface ISelectboxData {
    isOpen: boolean;
    search: string;
    selectItems: Vue[];
  }

  export default Vue.extend({
    directives: {OuterClick},
    data(): ISelectboxData {
      return {
        isOpen: false,
        search: '',
        selectItems: []
      };
    },
    props: {
      isMultiple: {
        default: false
      },
      value: {
        required: true
      },
      disabled: {
        default: false
      },
      placeholder: String,
      hasSearch: {
        default: true
      }
    },
    created() {
      this.$on('itemClick', (value: {}) => this.handleChange(value));
      this.$on('up', (index: number) => this.handleArrowSelection(index, false));
      this.$on('down', (index: number) => this.handleArrowSelection(index, true));
      this.selectItems = this.$children;
    },
    computed: {
      hasValue(): boolean {
        return Boolean(this.isMultiple && this.value instanceof Array ? this.value.length : this.value);
      },
      atLeastTwoSelected(): boolean {
        return Boolean(this.isMultiple && this.value instanceof Array && this.value.length > 1);
      },
      isAnyItemFiltered(): boolean {
        return this.selectItems.some((selectItem: Vue) => selectItem.$data.isFiltered);
      },
      hasItems(): boolean {
        return this.selectItems.length > 0;
      }
    },
    methods: {
      toggle() {
        if (!this.disabled) {
          (this.isOpen ? this.close : this.open)();
        }
      },
      open() {
        this.isOpen = true;
        Vue.nextTick(() => {
          if (this.hasItems) {
            this.scrollMenuToSelectedElement();
            this.focusOnSearch();
          }
        });
      },
      close() {
        this.isOpen = false;
        this.resetSearchString();
      },
      reset() {
        if (!this.disabled) {
          this.emitValue(this.isMultiple ? [] : null);
        }
      },
      resetSearchString() {
        this.search = '';
      },
      focusOnSearch() {
        if (this.hasSearch) {
          (this.$refs.search as HTMLInputElement).focus();
        }
      },
      handleArrowSelection(index: number, isDown: boolean) {
        const itemToFocus = this.getNextFilteredElement(index, isDown);
        if (itemToFocus) {
          itemToFocus.focus();
        } else if (!isDown) {
          this.focusOnSearch();
        }
      },
      getNextFilteredElement(index: number, isDown: boolean): HTMLElement | undefined {
        let itemToFocus: HTMLElement | undefined;
        if (isDown) {
          // find first filtered select item after index
          for (let i = index + 1; i < this.selectItems.length; i += 1) {
            if (this.selectItems[i] && this.selectItems[i].$data.isFiltered) {
              itemToFocus = this.selectItems[i].$el;
              break;
            }
          }
        } else {
          // find first filtered select item before index
          for (let i = index - 1; i >= 0; i -= 1) {
            if (this.selectItems[i] && this.selectItems[i].$data.isFiltered) {
              itemToFocus = this.selectItems[i].$el;
              break;
            }
          }
        }
        return itemToFocus;
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
      emitValue(value: {} | null) {
        this.$emit('input', value);
      },
      scrollMenuToElement(element: HTMLElement) {
        const menu = this.$refs.menu as HTMLElement;
        const scrollValue: number = element.getBoundingClientRect().top - menu.getBoundingClientRect().top;
        menu.scrollTop += scrollValue;
      },
      scrollMenuToTop() {
        (this.$refs.menu as HTMLElement).scrollTop = 0;
      },
      scrollMenuToSelectedElement() {
        const item = this.getSelectItemElementByValue(this.value);
        if (item) {
          this.scrollMenuToElement(item);
        } else {
          this.scrollMenuToTop();
        }
      },
      getSelectItemElementByValue(value: {}): HTMLElement | undefined {
        let matchedItemElement;
        const matchedItem = this.selectItems.find((selectItem: Vue) => {
          const selectItemValue = selectItem.$props.value;
          return value instanceof Array ?
            value.indexOf(selectItemValue) > -1 :
            selectItemValue === value;
        });
        if (matchedItem) {
          matchedItemElement = matchedItem.$el;
        }
        return matchedItemElement;
      }
    }
  });
</script>
<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $selectbox-padding: 5px $building-unit-x3 5px $building-unit;
  $selectbox-height: $building-unit-x3;
  $arrow-container-width: 40px;
  $arrow-size: 9px;
  $menu-shadow: 0 $building-unit $building-unit-x3 0 rgba($black, .12);
  $search-icon-size: 14px;
  $tag-height: 30px;
  $tag-bg-color: $gray-220;
  $reset-size: $building-unit;
  $reset-icon-width: 9px;
  $reset-icon-height: 1px;
  $count-dot-margin: 4px;

  $select-item-height: $building-unit-x4;
  $max-select-items: 4;

  .selectbox {
    width: 100%;
    position: relative;

    &.is-danger {
      .selectbox-toggle {
        border-color: $red;
      }
    }

    &.is-active {
      .selectbox-menu {
        display: block;
      }
    }

    &.is-disabled {
      pointer-events: none;
      opacity: .5;

      .selectbox-toggle,
      .selectbox-value-reset {
        cursor: default;
      }
    }

    .selectbox-toggle {
      height: $selectbox-height;
      overflow: hidden;
      padding-right: $arrow-container-width;
      padding-top: 2px;
      padding-bottom: 2px;
      cursor: pointer;
    }

    .selectbox-placeholder {
      color: $gray-184;
    }

    .selectbox-toggle-arrow {
      position: absolute;
      width: $arrow-container-width;
      height: 100%;
      right: 0;
      top: 0;
      background-color: $gray-237;

      &::after {
        content: '';
        position: absolute;
        width: $arrow-size;
        height: $arrow-size;
        border-right: 1px solid $gray-56;
        border-bottom: 1px solid $gray-56;
        top: 30%;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }
    }

    .selectbox-filter {
      padding: $building-unit-x0_5 $building-unit;

      .search-input {
        &::before {
          width: $search-icon-size;
          height: $search-icon-size;
        }
      }
    }

    .selectbox-value-tag {
      background-color: $tag-bg-color;
      height: $tag-height;
      display: flex;
      align-items: center;
      padding: $building-unit-x0_5 $building-unit;
      position: relative;
      cursor: default;
    }

    .selectbox-value {
      margin-right: $building-unit;
      color: $gray-56;
      display: flex;
    }

    .selectbox-value-count {
      display: flex;
      align-items: center;

      &::before {
        content: '';
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: $gray-56;
        margin: -$count-dot-margin $count-dot-margin 0;
      }
    }

    .selectbox-value-reset {
      position: relative;
      width: $reset-size;
      height: $reset-size;
      border-radius: 50%;
      background-color: $gray-117;
      cursor: pointer;
      transition: $transition-default;

      &::after,
      &::before {
        @include absolute-xy-center;
        content: '';
        width: $reset-icon-width;
        height: $reset-icon-height;
        background-color: $white;
        transform-origin: center center;
      }

      &::after {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::before {
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      &:hover {
        background-color: $gray-56;
      }
    }

    .selectbox-menu {
      display: none;
      position: absolute;
      background: $white;
      top: calc(100% + #{$building-unit-x0_5});
      left: 0;
      min-width: 100%;
      max-width: $form-field-width;
      border: 1px solid $gray-237;
      border-radius: $telekom-radius;
      z-index: 2;
      box-shadow: $menu-shadow;
    }

    .selectbox-content {
      @include custom-scroll;
      width: 100%;
      max-height: $max-select-items * $select-item-height;
      overflow-y: auto;
    }

    .selectbox-no-results {
      height: $select-item-height;
      color: $gray-117;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
