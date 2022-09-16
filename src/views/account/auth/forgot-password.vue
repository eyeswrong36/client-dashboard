<template>
  <div class="forgot-password__container">
    <h4 class="text-center primary--text c-mt-2 c-mb-5 c-px-3 header-text">
      Forgot your password?
    </h4>

    <v-stepper v-model="step" flat>
      <v-stepper-items>
        <v-stepper-content step="1" class="pa-0">
          <h5 class="text-center mx-auto c-mb-3 normal-text-spacing c-px-3">
            Just enter the email address you used to sign up with, and we’ll
            send you instructions to recover your account.
          </h5>

          <v-form @submit.prevent class="c-px-3">
            <h5 class="primary--text c-mb-5">Email</h5>
            <v-text-field
              v-model="email"
              flat
              required
              outlined
              hide-details
              class="c-mb-5 fp-fields"
              placeholder="Enter your Email"
              :error="showError"
            />
            <!-- Error Message -->
            <div v-if="showError" class="d-flex align-items-center">
              <v-icon color="secondary"> mdi-alert-outline </v-icon>

              <span class="subtext-content c-pl-6 secondary--text my-auto">
                Email must be valid.
              </span>
            </div>

            <v-btn
              block
              x-large
              depressed
              type="submit"
              color="primary"
              class="c-mb-4 c-mt-3 submit-btn"
              height="48"
              :loading="submitLoading"
              @click="onClickSubmit"
            >
              Submit
            </v-btn>
          </v-form>
        </v-stepper-content>

        <v-stepper-content step="2" class="py-0 c-px-3">
          <h5 class="text-center mx-auto c-mb-5 ins-1">
            Please check your Email.
          </h5>
          <h5 class="text-center mx-auto c-mb-3 normal-text-spacing">
            If your email is valid, we will send an email for further
            instructions. Contact your account manager if you're still having
            issues.
          </h5>

          <p
            class="subtext-content text-center normal-text-spacing c-mb-3 ins-2"
          >
            Didn’t receive an email?&nbsp;
            <span
              class="primary--text cursor-pointer link font-weight-bold"
              @click="step = 1"
            >
              Re-enter email address.
            </span>
          </p>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <div :class="`c-px-3 c-mb-${$largeView ? '3' : step === 2 ? '3' : '1'}`">
      <v-btn
        block
        x-large
        outlined
        class="back-btn"
        height="48"
        :disabled="submitLoading"
        @click="$router.push({ name: 'login' })"
      >
        Back to Login
      </v-btn>
    </div>
  </div>
</template>

<script>
import { requiredRule, emailRule } from '@/utils/form-rules';

export default {
  name: 'AccountForgotPassword',
  layout: 'account',
  data() {
    return {
      step: 1,
      email: '',
      submitLoading: false,
      showError: false,
      emailRule: emailRule(),
      requiredRule: requiredRule(),
    };
  },

  methods: {
    async onClickSubmit() {
      this.showError = false;

      const hasError =
        this.requiredRule(this.email) !== true ||
        this.emailRule(this.email) !== true;

      if (hasError) {
        this.showError = true;
        return;
      }

      try {
        this.submitLoading = true;
        await this.$store.dispatch('auth/forgotPassword', this.email);
      } catch (error) {
        // Error handling here
        console.error(error);
      } finally {
        this.submitLoading = false;
        this.step = 2;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.forgot-password__container {
  .ins-1 {
    line-height: 24px;
    letter-spacing: unset;
  }

  .ins-2 {
    letter-spacing: 0.02em;
  }

  .header-text {
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 20px;
      line-height: 29px;
    }
  }

  .back-btn.v-btn {
    border-color: rgb(172, 181, 189);
  }

  .fp-fields.v-text-field.v-text-field--outlined {
    .v-input__slot input {
      line-height: 24px;
      font-weight: 500;
      color: rgb(130, 130, 130);

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        line-height: 21px;
      }
    }

    &:not(:hover, .v-input--is-focused, .error--text) {
      .v-input__slot fieldset {
        border-color: rgb(130, 130, 130);
      }
    }
  }

  .submit-btn.v-btn {
    .v-btn__loader {
      color: white;
    }
  }
}
</style>
