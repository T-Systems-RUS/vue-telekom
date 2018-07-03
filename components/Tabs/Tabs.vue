<template>
  <section class="tabs-wrap">
    <div class="tabs">
      <slot/>
    </div>
  </section>
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
    mounted() {
      this.$children.forEach(child => {
        child.$on('tabClick', (value: string) => this.setTab(value));
      });
    },
    methods: {
      setTab(value: string) {
        if (this.value !== value) {
          this.$emit('input', value); // to allow v-model
          this.$emit('change', value); // to detect @change on Tabs component
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/components/tabs';
</style>
