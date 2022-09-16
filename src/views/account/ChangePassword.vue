<template>
  <AccountLayout
    title="Account Details"
    body-title="Change Password"
    :actions="actions"
  >
    <template #body>
      <Dialog ref="dialog" />
      <ChangePasswordForm ref="form" />
    </template>
  </AccountLayout>
</template>
<script>
import ChangePasswordForm from '@/components/account/change-password';
import AccountLayout from '@/layouts/account';
import Dialog from '@/components/common/async-dialog';
export default {
  components: {
    AccountLayout,
    ChangePasswordForm,
    Dialog,
  },

  data: () => ({
    actions: [
      {
        icon: require('@/assets/icons/Edit.svg'),
        label: 'Edit Profile',
        routeName: 'account-edit',
      },
    ],
  }),

  async beforeRouteLeave(to, from, next) {
    if (this.$refs.form.hasChange() && !this.$refs.form.preventDiscard) {
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
<style lang="scss"></style>
