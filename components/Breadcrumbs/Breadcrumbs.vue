<i18n src="./Breadcrumbs.yml"></i18n>

<template>
  <div class="breadcrumbs is-flex">
    <div
      class="breadcrumb is-flex"
      v-for="route in matchedRoutes">
      <router-link
        :to="route.path || '/'"
        class="breadcrumb-link is-size-7">
        {{ $t(route.meta.title) }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {RouteRecord} from 'vue-router';

  export default Vue.extend({
    computed: {
      matchedRoutes(): RouteRecord[] {
        return this.$route.matched.filter(route => route.meta && route.meta.title);
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/components/breadcrumbs';
</style>
