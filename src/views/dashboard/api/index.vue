<template>
  <div class="page-content-padded c-mb-1">
    <Select ref="channel" v-model="channel" :options="options" />
    <router-view />
  </div>
</template>
<script>
import Select from '@/components/common/select.vue';
import { toProperCase, toUpperCase, toLowerCase } from '@/utils/helpers';
export default {
  name: 'dashboard-api',

  components: {
    Select,
  },

  data: () => ({
    channel: '',
  }),

  computed: {
    options() {
      let apiOption = Object.values(
        this.$store.getters['dashboard/GET_USER_SERVICES']['api'] || {}
      );

      apiOption = apiOption.map((opt) => {
        return opt.length === 3 ? toUpperCase(opt) : toProperCase(opt);
      });

      return apiOption || [];
    },
  },

  mounted() {
    this.setSelectedService();
  },

  watch: {
    channel(val) {
      const routeName = `dashboard-${toLowerCase(val)}-api`;

      if (routeName !== this.$route.name)
        this.$router.push({
          name: `dashboard-${toLowerCase(val)}-api`,
        });
    },
  },

  methods: {
    setSelectedService() {
      const routeName = this.$route.name;
      switch (routeName) {
        case 'dashboard-sms-api':
          this.$refs.channel.value = 'SMS';
          break;
        case 'dashboard-viber-api':
          this.$refs.channel.value = 'Viber';
          break;
        default:
          this.$refs.channel.value = 'SMS';
      }
    },
  },
};
</script>
