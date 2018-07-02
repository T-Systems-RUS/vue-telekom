<template>
  <span
    @click="handleTabClick"
    class="tab"
    :class="{'is-active': isActive}">
    <slot/>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      value: {
        type: String,
        required: true
      }
    },
    computed: {
      isActive(): boolean {
        return this.value === this.$parent.$props.value;
      }
    },
    methods: {
      handleTabClick() {
        this.$emit('tabClick', this.value);
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../../styles/components/tabs';
</style>
