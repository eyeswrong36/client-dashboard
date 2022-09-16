<template>
  <v-col cols="12" md="6">
    <v-row>
      <v-col class="col-spacer" v-for="i in 4" :key="i" cols="6">
        <v-skeleton-loader class="card-stats" type="image"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {};
</script>

<style></style>
