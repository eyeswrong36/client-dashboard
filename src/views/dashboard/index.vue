<template>
  <v-container fluid class="pa-0 c-mb-1">
    <Tabs :tabMenu="tabMenu" />
    <router-view />
  </v-container>
</template>
<script>
import Tabs from '@/components/dashboard/tabs';
export default {
  components: {
    Tabs,
  },

  computed: {
    tabMenu() {
      return this.$store.getters['dashboard/GET_TAB_MENU'];
    },
  },
};
</script>
<style lang="scss"></style>
