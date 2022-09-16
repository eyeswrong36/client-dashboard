<template>
  <v-container class="not-found__container">
    <v-row class="text-center" style="height: 100%" justify="center">
      <v-col cols="12" align-self="center">
        <img
          class="my-3"
          contain
          src="@/assets/icons/error-state.png"
          height="201"
        />
        <h2 class="mx-auto c-py-4" style="width: 392px; max-width: 100%">
          Error Occured
        </h2>
        <h5
          class="mx-auto font-weight-medium c-mb-2"
          style="width: 392px; max-width: 100%"
        >
          Don’t worry, we’re still sending thousands of messages at this very
          moment.
        </h5>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DashboardError',
};
</script>

<style lang="scss" scoped>
.not-found__container {
  height: 100%;

  h2 {
    font-size: 32px;
    line-height: 36px;
  }

  h5 {
    line-height: 20px;
  }

  .ins-1 {
    letter-spacing: -0.02em;
  }
}
</style>
