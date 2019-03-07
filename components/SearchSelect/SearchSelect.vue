<i18n src="./SearchSelect.yml"></i18n>

<template>
  <div
    v-outer-click="close"
    :class="{'is-disabled': disabled}"
    class="selectbox">
    <div
      :class="{'is-open': isOpen}"
      class="selectbox-inner">
      <!--input-->
      <div
        @click="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.down.prevent="handleArrowSelection(-1, true)"
        tabindex="0"
        :class="{'is-open': isOpen}"
        class="selectbox-toggle">
        <div class="selectbox-toggle-content">
          <slot
            v-if="hasValue"
            name="value">
            <div class="selectbox-tag">
              <div class="selectbox-tag-value">
                <!--when single item is selected -> show single item value-->
                <slot
                  name="tag-single-value"
                  v-if="!atLeastTwoSelected"/>
                <!--for multiselect: when multiple items are selected
                show single label (e.g 'users') instead of all values-->
                <slot
                  name="tag-multiple-value"
                  v-else/>
                <span
                  v-if="atLeastTwoSelected"
                  class="selectbox-tag-value-count">{{ value.length }}</span>
              </div>
              <span
                @click.stop="reset"
                class="selectbox-tag-value-reset"/>
            </div>
          </slot>
          <span
            v-else
            class="selectbox-placeholder">
            <slot name="placeholder">{{ placeholder }}</slot>
          </span>
        </div>
        <span
          :class="{'is-open': isOpen}"
          class="selectbox-toggle-arrow"/>
      </div>
      <!--flyout-->
      <div
        :class="{'is-open': isOpen}"
        class="selectbox-menu">
        <div
          v-if="hasItems && hasSearch"
          class="selectbox-filter">
          <div class="search-input">
            <input
              ref="search"
              v-model="search"
              @keydown.down.prevent="handleArrowSelection(-1, true)"
              @keydown.enter.prevent="handleArrowSelection(-1, true)"
              :placeholder="$t('Search')"
              class="input"
              type="text">
            <span
              v-if="search"
              @click="resetSearchString"
              class="search-input-reset"/>
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
        this.$emit('blur');
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
  @import '../../styles/base/typography';

  $selectbox-height: $building-unit-x3;
  $selectbox-min-width: 70px;
  $selectbox-shadow-focus: 0 0 8px 0 rgba($blue-83, 0.25);
  $arrow-container-width: 40px;
  $arrow-size: 9px;
  $selectbox-open: 0 $building-unit $building-unit-x3 0 rgba($black, 0.24);
  $search-icon-size: 14px;
  $tag-height: $building-unit-x2;
  $tag-bg-color: $gray-75;
  $reset-size: $building-unit-x1_5;
  $reset-icon-width: 9px;
  $reset-icon-height: 1px;
  $count-dot-margin: 4px;

  $select-item-height: $building-unit-x3;
  $max-select-items: 6;

  .selectbox {
    min-width: $selectbox-min-width;
    position: relative;
    height: $selectbox-height;
    clear: both;

    .selectbox-inner {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      transition: box-shadow $transition-default;
      border-radius: $telekom-radius;
      overflow: hidden;

      &.is-open {
        box-shadow: $selectbox-open;
        z-index: 2;
      }
    }

    &.is-danger {
      .selectbox-toggle {
        border-color: $red;
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
      position: relative;
      height: $selectbox-height;
      background-color: $white;
      overflow: hidden;
      padding-right: $arrow-container-width;
      padding-left: $building-unit;
      padding-top: 2px;
      padding-bottom: 2px;
      border: 1px solid $gray-237;
      border-radius: $telekom-radius;
      cursor: pointer;
      transition: $transition-default;
      font-size: $size-7;
      outline: none;
      display: flex;
      align-items: center;

      &:hover {
        background-color: $gray-237;
      }

      &:active {
        background-color: $gray-208;
      }

      &:focus:not(.is-open):not(:active) {
        background-color: $gray-237;
        box-shadow: $selectbox-shadow-focus;
        border-color: $blue-83;
      }

      &.is-open {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .selectbox-toggle-content {
      display: flex;
      align-items: center;
    }

    .selectbox-placeholder {
      color: $gray-75;
    }

    .selectbox-toggle-arrow {
      position: absolute;
      width: $arrow-container-width;
      height: 100%;
      right: 0;
      top: 0;

      &.is-open {
        transform: rotate(180deg);
      }

      &::after {
        content: '';
        position: absolute;
        width: $arrow-size;
        height: $arrow-size;
        border-right: 1px solid $gray-75;
        border-bottom: 1px solid $gray-75;
        top: 30%;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }
    }

    .selectbox-filter {
      padding: $building-unit-x0_33 $building-unit-x0_33 $building-unit-x0_66;

      .search-input {
        &::before {
          width: $search-icon-size;
          height: $search-icon-size;
        }

        @mixin placeholder-style() {
          @include font-size(7);
          line-height: $lh-6;
          color: $gray-184;
          font-family: $family-serif;
        }

        .input {
          @include font-size(7);
          line-height: $lh-6;
          padding-right: $building-unit-x3;

          &:not(:focus) {
            border-color: $gray-237;
          }

          &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            @include placeholder-style;
          }
          &::-moz-placeholder { /* Firefox 19+ */
            @include placeholder-style;
          }
          &:-ms-input-placeholder { /* IE 10+ */
            @include placeholder-style;
          }
          &:-moz-placeholder { /* Firefox 18- */
            @include placeholder-style;
          }
        }
      }
    }

    .selectbox-tag {
      @include font-size(8);
      line-height: $tag-height;
      border-radius: $tag-height;
      background-color: $tag-bg-color;
      height: $tag-height;
      display: inline-flex;
      align-items: center;
      padding-left: $building-unit-x0_5;
      padding-right: $building-unit-x0_25;
      position: relative;
      cursor: default;
    }

    .selectbox-tag-value {
      margin-right: $building-unit;
      color: $white;
      display: flex;
    }

    .selectbox-tag-value-count {
      display: flex;
      align-items: center;

      &::before {
        content: '';
        width: $building-unit-x0_25;
        height: $building-unit-x0_25;
        border-radius: 50%;
        background-color: $white;
        margin: 0 $count-dot-margin;
      }
    }

    .selectbox-tag-value-reset {
      position: relative;
      width: $reset-size;
      height: $reset-size;
      border-radius: 50%;
      background-color: $gray-164;
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
        background-color: $gray-124;
      }
    }

    .selectbox-menu {
      display: none;
      background: $white;
      margin-top: -1px;
      min-width: 100%;
      max-width: $form-field-width;
      border: 1px solid $gray-237;
      border-bottom-left-radius: $telekom-radius;
      border-bottom-right-radius: $telekom-radius;
      z-index: 2;
      padding: $building-unit-x0_33;

      &.is-open {
        display: block;
      }
    }

    .selectbox-content {
      @include custom-scroll-thin;
      width: 100%;
      max-height: $max-select-items * $select-item-height;
      overflow-y: auto;
      padding-right: $building-unit-x0_33;
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
