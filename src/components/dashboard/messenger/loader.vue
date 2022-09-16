<template>
  <v-container fluid class="pa-0 px-1">
    <v-row>
      <v-col class="col-spacer" v-for="i in 4" :key="i" cols="3">
        <v-skeleton-loader class="card-stats" type="image" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-spacer" cols="12" md="6">
        <v-skeleton-loader type="image" height="300" />
      </v-col>

      <v-col class="col-spacer" cols="12" md="6">
        <v-skeleton-loader type="image" height="300" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'MessengerLoader',
};
</script>

<style lang="scss" scoped>
::v-deep .v-skeleton-loader.v-skeleton-loader--is-loading {
  .v-skeleton-loader__image {
    height: 100%;
  }
}
</style>
