<template>
  <Account
    title="Account Details"
    body-title="Edit Information"
    :actions="actions"
  >
    <template #body>
      <Confirm ref="dialog" />
      <AccountEdit ref="editForm" />
    </template>
  </Account>
</template>

<script>
import Account from '@/layouts/account';
import AccountEdit from '@/components/account/account-edit';
import Confirm from '@/components/common/async-dialog';

export default {
  components: {
    Account,
    AccountEdit,
    Confirm,
  },

  data() {
    return {
      actions: [
        {
          icon: require('@/assets/icons/Lock.svg'),
          label: 'Change Password',

          routeName: 'account-change-password',
        },
      ],
    };
  },

  async beforeRouteLeave(to, from, next) {
    if (
      (await this.$refs.editForm.isDiscard()) &&
      !this.$refs.editForm.guardPass
    ) {
      const dialog = await this.$refs.dialog.show('confirm', {
        icon: require('@/assets/icons/modal-trash.svg'),
        description: 'Discard Changes?',
        primaryLabel: 'Discard Changes',
        secondaryLabel: 'Keep Editing',
        primaryColor: 'success',
        autoClose: false,
      });

      if (dialog.confirm) next();

      dialog.close();
      return;
    }

    next();
  },
};
</script>
