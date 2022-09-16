import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('dashboard', ['GET_DATE_FILTER']),
  },
};
