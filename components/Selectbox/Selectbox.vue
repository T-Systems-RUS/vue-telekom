<template>
  <div
    v-outer-click="close"
    :class="{'is-active': isOpen, 'is-disabled': disabled}"
    class="selectbox">
    <button
      class="button selectbox-toggle"
      :class="{'is-disabled': disabled}"
      @blur="handleBlur"
      @click.stop="toggle">
      <slot name="placeholder"/>
      <span class="selectbox-toggle-arrow"/>
    </button>
    <div
      ref="menu"
      class="selectbox-menu">
      <div class="selectbox-content is-size-6">
        <SelectboxItem
          v-if="hasReset && isMultiple"
          is-reset="true"
          :value="null">
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

  function getChar(event: KeyboardEvent): string {
    const keyCode = event.which ? event.which : event.keyCode;
    let char = '';
    if (event.key && keyCode >= 32) {
      char = event.key;
    } else if (keyCode >= 32) {
      char = String.fromCharCode(keyCode);
    }
    return char.toLowerCase();
  }

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
      },
      disabled: {
        default: false
      }
    },
    created() {
      this.$on('itemClick', (value: {}) => this.handleChange(value));
      this.$on('reset', () => this.reset());
    },
    methods: {
      toggle() {
        if (!this.disabled) {
          (this.isOpen ? this.close : this.open)();
        }
      },
      handleBlur() {
        this.$emit('blur');
      },
      open() {
        this.isOpen = true;
        document.addEventListener('keydown', this.handleKeydown);
        // wait for DOM update
        Vue.nextTick(() => this.scrollMenuToSelectedElement());
      },
      close() {
        this.isOpen = false;
        document.removeEventListener('keydown', this.handleKeydown);
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
      },
      handleKeydown(event: KeyboardEvent) {
        const char = getChar(event);
        if (event.keyCode === 27) {
          // close when ESC is pressed
          this.close();
        } else if (char) {
          // scroll to first element which label starts with char
          const selectItem = this.getSelectItemElementByText(char);
          if (selectItem) {
            this.scrollMenuToElement(selectItem);
          }
        }
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
        const matchedItem = this.$children.find((selectItem: Vue) => {
          const selectItemValue = selectItem.$props.value;
          return value instanceof Array ?
            value.indexOf(selectItemValue) > -1 :
            selectItemValue === value;
        });
        if (matchedItem) {
          matchedItemElement = matchedItem.$el;
        }
        return matchedItemElement;
      },
      getSelectItemElementByText(text: string): HTMLElement | undefined {
        let matchedItemElement;
        const matchedItem = this.$children.find((selectItem: Vue) => {
          const textContent = (selectItem.$refs.itemText as HTMLElement).textContent || '';
          return textContent.toLowerCase().trim().indexOf(text) === 0;
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

  $arrow-size: 9px;
  $arrow-margin: -6px;
  $selectbox-padding: 5px $building-unit-x3 5px $building-unit;

  .selectbox {
    width: 100%;
    position: relative;

    &.is-danger {
      .selectbox-toggle {
        border-color: $red;
      }
    }

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
      z-index: 2;
    }

    &.is-active {
      .selectbox-menu {
        display: block;
      }

      .selectbox-toggle-arrow {
        transform: translateY(-20%) rotate(-135deg);
      }
    }

    &.is-disabled {
      .selectbox-toggle-arrow {
        opacity: .5;
      }
    }

  }
</style>
