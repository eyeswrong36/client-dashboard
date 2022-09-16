<template>
  <v-container fluid class="pa-0 px-1">
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col class="col-spacer" v-for="i in 4" :key="i" cols="6">
            <v-skeleton-loader
              class="card-stats"
              type="image"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col class="col-spacer" cols="12">
            <v-skeleton-loader type="image" height="300" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mb-3 mt-5">
      <v-col class="col-spacer" cols="4" sm="3">
        <v-skeleton-loader type="image" height="30" />
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
export default {};
</script>
<style lang="scss" scoped>
::v-deep .v-skeleton-loader.v-skeleton-loader--is-loading {
  .v-skeleton-loader__image {
    height: 100%;
  }
}
</style>
