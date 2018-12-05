<template>
  <div
    @click="applySorting"
    class="table-cell is-head is-sortable">
    <span
      :class="{'is-asc': isFieldAscending(), 'is-desc': isFieldDescending()}"
      class="table-sorting"/>
    <slot/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {SortingOrder} from './SortingOrder';

  export default Vue.extend({
    props: {
      field: {
        type: String,
        required: true
      },
      orderGetter: {
        type: String,
        required: true
      },
      fieldGetter: {
        type: String,
        required: true
      },
      sortAction: {
        type: String,
        required: true
      }
    },
    computed: {
      isAscending(): boolean {
        return this.$store.getters[this.orderGetter] === SortingOrder.ASCENDING;
      },
      isSortingField(): boolean {
        return this.$store.getters[this.fieldGetter] === this.field;
      }
    },
    methods: {
      isFieldAscending() {
        return this.isSortingField && this.isAscending;
      },
      isFieldDescending() {
        return this.isSortingField && !this.isAscending;
      },
      applySorting() {
        this.$store.dispatch(this.sortAction, this.field);
      }
    }
  });
</script>
