<template>
  <section class="pagination">
    <span
      :class="{'is-disabled': currentPage === 1}"
      @click="setPage(currentPage - 1)"
      class="arrow is-left"/>
    <div class="pages-block">
      <span
        @click="setPage(startPage)"
        @keydown.enter="setPage(startPage)"
        tabindex="startPage"
        :class="{'is-active': currentPage === startPage}"
        class="page-item is-size-6">{{ startPage }}</span>
      <span
        v-if="hasLeftSpread && hasManyPages"
        class="page-item is-spread">...</span>
      <span
        v-for="page in pagesArray"
        @click="setPage(page)"
        @keydown.enter="setPage(page)"
        class="page-item is-size-6"
        :key="page"
        :tabindex="page"
        :class="{'is-active': page === currentPage}">
        {{ page }}
      </span>
      <span
        v-if="hasRightSpread && hasManyPages"
        class="page-item is-spread">...</span>
      <span
        @click="setPage(totalPages)"
        @keydown.enter="setPage(totalPages)"
        :tabindex="totalPages"
        :class="{'is-active': currentPage === totalPages}"
        class="page-item is-size-6">{{ totalPages }}</span>
    </div>
    <span
      :class="{'is-disabled': currentPage === totalPages}"
      @click="setPage(currentPage + 1)"
      class="arrow is-right"/>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';

  const START_PAGE = 1;
  const MAX_PAGES_IN_ROW_DEFAULT = 3;

  export default Vue.extend({
    data() {
      return {
        startPage: START_PAGE
      };
    },
    props: {
      currentPage: {
        required: true,
        type: Number
      },
      totalPages: {
        required: true,
        type: Number
      },
      // max pages count between spreads (only odd numbers allowed)
      maxPagesInRow: {
        type: Number,
        default: MAX_PAGES_IN_ROW_DEFAULT
      }
    },
    computed: {
      pagesArray(): number[] {
        return this.hasManyPages ?
          this.getManyPagesArray() :
          this.getPageRange(this.startPage + 1, this.totalPages - 1);
      },
      hasManyPages(): boolean {
        return this.totalPages > this.manyPagesTrigger;
      },
      hasLeftSpread(): boolean {
        return this.currentPage > this.maxPagesInRow;
      },
      hasRightSpread(): boolean {
        return this.currentPage < this.totalPages - (this.maxPagesInRow - 1);
      },
      manyPagesTrigger(): number {
        return this.maxPagesInRow + 4; // 4 = min page + max page + 2 pages
      }
    },
    methods: {
      setPage(page: number) {
        if (
          page !== this.currentPage &&
          page > 0 &&
          page <= this.totalPages
        ) {
          this.$emit('pagechange', page);
        }
      },
      getManyPagesArray(): number[] {
        // number of pages on the sides of currentPage < 1 ... (5 6) 7 (8 9) ... >, 7 - current page
        const step = Math.floor(this.maxPagesInRow / 2);
        let startRange: number;
        let endRange: number;

        if (!this.hasLeftSpread && this.currentPage <= this.startPage + step) {
          // handle cases: < (1) 2 3... 15 >, < 1 (2) 3... 15 >
          startRange = this.startPage + 1;
          endRange = this.maxPagesInRow;
        } else if (!this.hasRightSpread && this.currentPage >= this.totalPages - step) {
          // handle cases: < 1 ... 13 (14) 15 >, < 1 ... 13 14 (15) >
          startRange = this.totalPages - (this.maxPagesInRow - 1);
          endRange = this.totalPages - 1;
        } else {
          // handle case: < 1 ... 5 (6) 7 ... 15 >
          startRange = this.currentPage - step;
          endRange = this.currentPage + step;
        }
        return this.getPageRange(startRange, endRange);
      },
      getPageRange(low: number, high: number): number[] {
        const pageRange: number[] = [];
        for (let i = low; i <= high; i += 1) {
          pageRange.push(i);
        }
        return pageRange;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/bulma/bulma-override-variables';
  @import '../../styles/utilities/mixins';

  $arrow-size: 8px;
  $arrow-width: $building-unit-x1_5;
  $arrow-height: $lh-6;
  $underline-h: 2px;
  $page-item-h-margin: 9px;
  $page-item-h-padding: $building-unit - $page-item-h-margin;

  .pagination {
    display: flex;
    justify-content: center;

    .arrow {
      width: $arrow-width;
      height: $arrow-height;
      position: relative;
      display: block;
      cursor: pointer;

      &.is-disabled {
        pointer-events: none;

        &::before {
          border-color: $gray-220;
        }
      }

      &::before {
        content: '';
        width: $arrow-size;
        height: $arrow-size;
        border-bottom: 1px solid $gray-117;
        border-left: 1px solid $gray-117;
        @include absolute-xy-center;
      }

      &.is-left {
        &::before {
          transform: translate(-30%, -60%) rotate(45deg);
        }
      }

      &.is-right {
        &::before {
          transform: translate(-70%, -60%) rotate(225deg);
        }
      }
    }

    .pages-block {
      display: flex;
      justify-content: center;
      align-items: center;

      .page-item {
        cursor: pointer;
        margin: 0 $page-item-h-margin;
        padding: 0 $page-item-h-padding;
        position: relative;

        &::after {
          content: '';
          @include absolute-x-center;
          bottom: -$underline-h;
          height: $underline-h;
          width: 100%;
          background-color: transparent;
        }

        &:hover {
          &::after {
            background-color: $gray-237;
          }
        }

        &:focus {
          outline: 1px solid $blue;
          box-shadow: $input-focus-box-shadow-size rgba($blue, .5);

          &::after {
            content: none;
          }
        }

        &.is-active {
          color: $magenta;

          &::after {
            background-color: $magenta;
          }

          &:hover {
            &::after {
              background-color: $magenta;
            }
          }
        }

        &.is-spread {
          pointer-events: none;
        }
      }
    }
  }
</style>
