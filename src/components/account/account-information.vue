<template>
  <div class="form-info">
    <v-row>
      <v-col cols="12" sm="6">
        <p class="label">Name</p>
        <p class="detail">{{ accountInfo.name }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="label">Job Title</p>
        <p class="detail">{{ accountInfo.designation }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="label">Account Permission</p>
        <p class="detail">{{ accountInfo.permission }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="label">Company Name</p>
        <p class="detail">{{ accountInfo.company_name }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="label">Email Address</p>
        <p class="detail">{{ accountInfo.email }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="label">Company Address</p>
        <p class="detail">{{ accountInfo.company_address }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="label">Mobile Number</p>
        <p class="detail">+63{{ accountInfo.phone }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      // isLoading: false,
      // accountInfo: {},
    };
  },

  computed: {
    ...mapGetters({
      isLoading: 'account/GET_LOADING',
      accountInfo: 'account/GET_USER_INFO',
    }),
  },
};
</script>

<style lang="scss" scoped>
.form-info {
  margin-top: 35px;

  p {
    &.label {
      margin-bottom: 3px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #898989;
    }
    &.detail {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      word-wrap: break-word;
      color: #151c36;
    }
  }
}
</style>
