<template>
  <v-app id="app">
    <global-loader />

    <v-main>
      <v-row no-gutters style="height: 100%" class="account-layout__container">
        <v-col cols="12" md="6">
          <v-container
            fluid
            class="pa-0 content__container mx-auto"
            :style="loading ? 'height: 100%' : ''"
          >
            <v-row
              no-gutters
              justify="center"
              style="height: 100%"
              :class="loading ? '' : !$largeView ? 'c-my-1' : 'c-my-3'"
            >
              <v-col
                v-if="loading"
                cols="12"
                class="text-center"
                align-self="center"
              >
                <v-progress-circular indeterminate color="primary" :size="55" />
              </v-col>
              <v-col v-else cols="12">
                <v-row
                  no-gutters
                  justify="center"
                  :class="`c-px-4 c-mb-${$largeView ? '5' : '1'}`"
                >
                  <v-col :style="`max-width: ${!$largeView ? 177 : 126}px;`">
                    <a
                      href="https://m360.com.ph/"
                      exact
                      class="d-flex align-items-center"
                    >
                      <img
                        src="@/assets/icons/m360-Logo.png"
                        class="mx-auto"
                        :height="`${!$largeView ? 66 : 47}px`"
                      />
                    </a>
                  </v-col>
                </v-row>

                <router-view />

                <p class="subtext-content text-center c-px-3 ins-1 mb-0">
                  Copyright © {{ currentYear }} m360. All Rights Reserved.
                </p>

                <p class="subtext-content text-center c-px-3 ins-1 mb-0">
                  <a
                    target="_blank"
                    :href="`${domain}terms-and-conditions`"
                    class="primary--text link"
                  >
                    Terms and Conditions
                  </a>
                  &nbsp;and&nbsp;
                  <a
                    target="_blank"
                    :href="`${domain}data-privacy-policy`"
                    class="primary--text link"
                  >
                    Privacy Policy
                  </a>
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col v-if="$largeView" cols="6" style="position: fixed; right: 0">
          <v-img
            src="@/assets/images/login-bg.jpg"
            height="100vh"
            :aspect-ratio="490 / 659"
          />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import GlobalLoader from '@/components/global-loader';

export default {
  name: 'AccountsLayout',
  components: { GlobalLoader },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },

    loading() {
      return this.$store.state.auth.loading;
    },

    domain() {
      return 'https://m360.com.ph/';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
@import '@/css/variables';

.account-layout__container {
  .ins-1 {
    line-height: 20px;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.01em;
    }
  }

  .content__container {
    max-width: 359px + ($spacing-3 * 2);
  }
}
</style>
