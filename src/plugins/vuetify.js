import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

Vue.mixin({
  computed: {
    $largeView() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    $phoneView() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
});

// add global overrides here
export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#008DF0',
        secondary: '#DA4175',
        accent: '#D0F9F5',
        info: '#18E2CE',
        warning: '#FFB839',
        error: '#DA4175',
        success: '#FFB838',
        insightfulPurle: '#6D3D91',
      },
    },
  },
  breakpoint: {
    mobileBreakpoint: 'xs',
  },
});
