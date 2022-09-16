<template>
  <v-container class="not-found__container">
    <v-row class="text-center" style="height: 100%" justify="center">
      <v-col cols="12" align-self="center">
        <img class="my-3" contain src="@/assets/icons/404.svg" height="201" />
        <h2 class="mx-auto c-py-4" style="width: 392px; max-width: 100%">
          We’re sorry, but this page can’t be found
        </h2>
        <h5
          class="mx-auto font-weight-medium c-mb-2"
          style="width: 392px; max-width: 100%"
        >
          Don’t worry, we’re still sending thousands of messages at this very
          moment.
        </h5>

        <template v-if="!isAuthenticated">
          <h5 class="ins-1 c-mb-5">Here’s a helpful link for you:</h5>
          <h5 class="font-weight-medium">
            <router-link :to="{ name: 'login' }" class="link"
              >Login</router-link
            >
          </h5>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound',
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/IS_AUTHENTICATED'];
    },
  },
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
