<template>
  <span
    class="tooltip"
    :tooltip="text">
    <slot/>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props: {
      text: {
        required: true,
        type: String
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import "../../styles/components/tooltip";
</style>
