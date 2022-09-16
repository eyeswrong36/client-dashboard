<template>
  <v-container fluid class="pa-0">
    <v-form
      ref="form"
      @submit.prevent="onSubmit"
      class="change-password-form my-5"
    >
      <v-row>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                ref="current_password"
                v-model="form.current_password.value"
                label="Current Password"
                :rules="[requiredRule('Current Password is required')]"
                :type="showCurrentPwd ? 'text' : 'password'"
                :append-icon="
                  showCurrentPwd ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                :error="form.current_password.error"
                :error-messages="form.current_password.errorMessages"
                @click:append="showCurrentPwd = !showCurrentPwd"
                @input="preventEmoji($event, 'current_password')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                ref="new_password"
                v-model="form.new_password.value"
                label="New Password"
                :type="showNewPwd ? 'text' : 'password'"
                :append-icon="
                  showNewPwd ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                :rules="[
                  requiredRule('New Password is required'),
                  passwordRule('Does not follow password criteria'),
                ]"
                :error="form.new_password.error"
                :error-messages="form.new_password.errorMessages"
                @click:append="showNewPwd = !showNewPwd"
                @input="preventEmoji($event, 'new_password')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                ref="confirm_new_password"
                v-model="form.confirm_new_password.value"
                label="Confirm Password"
                :rules="[
                  requiredRule('Confirm Password is required'),
                  isMatchRule(
                    'New Password and Confirm Password does not match',
                    form.new_password.value
                  ),
                ]"
                :type="showConfirmPwd ? 'text' : 'password'"
                :append-icon="
                  showConfirmPwd ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                @click:append="showConfirmPwd = !showConfirmPwd"
                @input="preventEmoji($event, 'confirm_new_password')"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4" class="password-guide-container">
          <h5>Password must have:</h5>
          <ul>
            <li v-for="(guide, idx) in passwordGuide" :key="idx">
              <span v-html="guide" />
            </li>
          </ul>
        </v-col>
      </v-row>

      <div class="actions c-mt-3">
        <v-btn
          type="submit"
          depressed
          class="primary btn-large-default mr-4"
          :disabled="!form.valid"
          :loading="form.isLoading"
          >Update</v-btn
        >
        <router-link :to="{ name: 'account' }">
          <v-btn depressed class="btn-secondary btn-large-default"
            >Cancel</v-btn
          >
        </router-link>
      </div>
    </v-form>

    <Dialog ref="dialog" />
  </v-container>
</template>
<script>
import Dialog from '@/components/common/async-dialog';
import { requiredRule, passwordRule, isMatchRule } from '@/utils/form-rules';
import { PASSWORD_GUIDE } from '@/components/account/constants';
import discardValidate from '@/utils/discardValidate';
import deepClone from 'lodash.clonedeep';
export default {
  components: {
    Dialog,
  },

  data: () => ({
    showCurrentPwd: false,
    showNewPwd: false,
    showConfirmPwd: false,

    form: {
      valid: false,
      isLoading: false,
      current_password: {
        value: '',
        error: false,
        errorMessages: '',
      },
      new_password: {
        value: '',
        error: false,
        errorMessages: '',
      },
      confirm_new_password: {
        value: '',
      },
    },
    submitted: false,
    preventDiscard: false,
    cloneForm: {},
    passwordGuide: PASSWORD_GUIDE,
  }),

  watch: {
    'form.current_password.value'(val) {
      this.form.current_password.error = false;
      this.form.current_password.errorMessages = '';

      if (!this.requiredRule('')(val)) {
        this.form.valid = false;
        this.form.current_password.error = true;
        this.form.current_password.errorMessages =
          'Current Password is required';
      }
    },

    'form.new_password.value'(val) {
      this.form.new_password.error = false;
      this.form.new_password.errorMessages = '';

      if (this.form.confirm_new_password.value && val)
        setTimeout(() => this.$refs.confirm_new_password.validate(), 100);

      if (!this.passwordRule('')(val)) {
        this.form.new_password.error = true;
        this.form.valid = false;
        this.form.new_password.errorMessages =
          'Does not follow password criteria';
      }

      if (!this.requiredRule('')(val)) {
        this.form.new_password.error = true;
        this.form.valid = false;
        this.form.new_password.errorMessages = 'New Password is required';
      }
    },

    form: {
      deep: true,
      handler(form) {
        setTimeout(() => {
          if (
            !this.$refs['current_password']?.validate() ||
            !this.$refs['new_password']?.validate() ||
            !this.$refs['confirm_new_password']?.validate()
          ) {
            form.valid = false;
          } else form.valid = true;
        }, 100);
      },
    },
  },
  mounted() {
    this.cloneForm = deepClone({
      currentPassword: this.form.current_password.value,
      newPassword: this.form.new_password.value,
      confirmPassword: this.form.confirm_new_password.value,
    });
  },

  methods: {
    hasChange() {
      const updatedForm = {
        currentPassword: this.form.current_password.value,
        newPassword: this.form.new_password.value,
        confirmPassword: this.form.confirm_new_password.value,
      };
      return discardValidate(this.cloneForm, updatedForm);
    },

    async onSubmit() {
      this.clearError();

      const isValid = this.$refs.form.validate();

      if (!isValid) return;

      try {
        this.form.isLoading = true;
        const res = await this.$store.dispatch(
          'account/onChangePassword',
          this.form
        );
        if (!res.code === 200) return;

        const dialog = await this.$refs.dialog.show('message', {
          title: 'Password Changed!',
          description: 'You have successfully updated your password.',
        });
        dialog.close();
        this.preventDiscard = true;
        if (!dialog.value) {
          this.$store.dispatch('auth/clearAuth');
          this.$router.push({ name: 'login' });
        }
      } catch (error) {
        this.preventDiscard = false;
        this.clearError();
        if (error.code === 400) {
          /**
           * distribute inline errors to text-field
           */
          for (const err of error.message) {
            const field = Object.keys(err);
            this.form = {
              ...this.form,
              [field]: {
                value: this.form[field]?.value,
                error: true,
                errorMessages: err[field][0]?.toString().replace('.', ''),
              },
            };
          }
          return;
        }

        const dialog = await this.$refs.dialog.show('confirm', {
          isError: true,
          title: 'An Error Occured!',
          description:
            'The changes you have made cannot be saved. Please try again in a few minutes.',
          primaryOnly: true,
          primaryLabel: 'Go Back to Profile',
          primaryColor: 'btn-secondary',
          autoClose: false,
        });
        if (dialog.confirm) this.$router.push({ name: 'account' });

        dialog.close();
      } finally {
        this.submitted = true;
        this.form.isLoading = false;
      }
    },

    clearError() {
      this.form.current_password.error = false;
      this.form.new_password.error = false;
      this.form.confirm_new_password.error = false;
      this.form.new_password.errorMessages = '';
      this.form.current_password.errorMessages = '';
      this.form.confirm_new_password.errorMessages = '';
    },

    requiredRule,
    passwordRule,
    isMatchRule,

    async preventEmoji(e, model) {
      this.form[model].value = await e.replace(
        /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]/gm,
        ''
      );
    },
  },
};
</script>
<style lang="scss">
.change-password-form {
  .v-icon {
    font-size: 18px !important;
    color: #151c36 !important;
  }
}
.password-guide-container {
  h5,
  li {
    font-size: 14px !important;
    line-height: 18px !important;
    font-weight: 500;
    margin-bottom: 5px;
  }
}
</style>
