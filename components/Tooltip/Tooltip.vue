<template>
  <div
    ref="tooltip"
    class="tooltip">
    <span
      ref="tooltipText"
      class="tooltip-text">{{ text }}</span>
    <slot/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      text: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        initialCssClass: '',
        initialPosition: {
          left: 0,
          right: 0
        }
      };
    },
    mounted() {
      this.setInitial();
      this.setPosition();
      window.addEventListener('resize', this.setPosition);
    },
    destroyed() {
      window.removeEventListener('resize', this.setPosition);
    },
    methods: {
      setPosition() {
        const tooltip = this.$refs.tooltip as HTMLElement;

        if (this.isOutsideLeft()) {
          tooltip.classList.remove('is-right');
          tooltip.classList.add('is-left');
        } else if (this.isOutsideRight()) {
          tooltip.classList.remove('is-left');
          tooltip.classList.add('is-right');
        } else {
          tooltip.className = this.initialCssClass;
        }
      },
      getTooltipTextPosition(): ClientRect {
        return (this.$refs.tooltipText as HTMLElement).getBoundingClientRect();
      },
      getTooltipPosition(): ClientRect {
        return (this.$refs.tooltip as HTMLElement).getBoundingClientRect();
      },
      isOutsideLeft(): boolean {
        return this.getTooltipPosition().left + this.initialPosition.left < 0;
      },
      isOutsideRight(): boolean {
        return this.getTooltipPosition().right + this.initialPosition.right >
          (window.innerWidth || document.documentElement.clientWidth);
      },
      setInitial() {
        this.initialCssClass = (this.$refs.tooltip as HTMLElement).className;
        this.initialPosition.left = this.getTooltipTextPosition().left - this.getTooltipPosition().left;
        this.initialPosition.right = this.getTooltipTextPosition().right - this.getTooltipPosition().right;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import "../../styles/components/tooltip";
</style>
