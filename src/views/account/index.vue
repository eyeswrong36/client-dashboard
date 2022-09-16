<template>
  <Account
    title="Account Details"
    body-title="Basic Information"
    :actions="actions"
  >
    <template #body>
      <AccountInfo />
    </template>
  </Account>
</template>

<script>
import Account from '@/layouts/account';
import AccountInfo from '@/components/account/account-information';

export default {
  components: {
    Account,
    AccountInfo,
  },

  data() {
    return {
      actions: [
        {
          icon: require('@/assets/icons/Edit.svg'),
          label: 'Edit Profile',
          routeName: 'account-edit',
        },
        {
          icon: require('@/assets/icons/Lock.svg'),
          label: 'Change Password',
          routeName: 'account-change-password',
        },
      ],
    };
  },
};
</script>
