<template>
  <v-overlay :value="model" color="white" opacity="1">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
</template>

<script>
export default {
  name: 'GlobalLoader',
  computed: {
    model() {
      return this.$store.state.ui.loading;
    },
    modelTitle() {
      return this.$store.state.ui.loadingMessage.title;
    },
    modelBody() {
      return this.$store.state.ui.loadingMessage.body;
    },
  },
};
</script>
