<template>
  <v-stepper v-model="step" flat class="login__container">
    <v-stepper-items>
      <v-stepper-content :step="1" class="pa-0">
        <h4 class="text-center c-mb-3 c-px-3 login-text">
          Log in to your Account
        </h4>

        <v-form @submit.prevent class="c-px-3">
          <h5 class="primary--text c-mb-5">Email</h5>
          <v-text-field
            v-model="user.username"
            flat
            outlined
            full-width
            hide-details
            class="login-fields"
            placeholder="Enter your Email"
            :error="!!errorMessage"
          />

          <h5 class="primary--text c-mb-5 c-pt-3">Password</h5>
          <v-text-field
            v-model="user.password"
            flat
            outlined
            full-width
            hide-details
            class="mt-2 login-fields"
            placeholder="Enter your Password"
            :error="!!errorMessage"
            :type="showPwd ? 'text' : 'password'"
            :append-icon="showPwd ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            @click:append="showPwd = !showPwd"
          />

          <!-- Error Message -->
          <div v-if="errorMessage" class="d-flex align-items-center c-mt-5">
            <v-icon color="secondary"> mdi-alert-outline </v-icon>

            <span class="subtext-content c-pl-6 secondary--text my-auto">
              {{ errorMessage }}
            </span>
          </div>

          <v-row no-gutters class="c-my-3">
            <v-col cols="6" align-self="center">
              <div class="d-flex">
                <v-checkbox
                  v-model="rememberMe"
                  color="primary"
                  hide-details
                  class="mt-0 pt-0"
                >
                  <template #label>
                    <span class="subtext-content primary--text ins-1">
                      Remember me
                    </span>
                  </template>
                </v-checkbox>
              </div>
            </v-col>
            <v-col cols="6" class="text-right" align-self="center">
              <div class="d-flex justify-end">
                <router-link
                  class="subtext-content primary--text link ins-1"
                  :to="{ name: 'forgot-password' }"
                >
                  Forgot password?
                </router-link>
              </div>
            </v-col>
          </v-row>

          <v-btn
            block
            x-large
            depressed
            type="submit"
            color="primary"
            height="48"
            class="white--text"
            :loading="loginLoading"
            @click="onClickLogin"
          >
            Log In
          </v-btn>
        </v-form>

        <p
          v-if="$largeView"
          class="subtext-content text-center c-my-4 c-px-3 ins-2"
        >
          Don’t have an account yet?&nbsp;
          <a
            href="https://m360.com.ph/contact-us/"
            target="_blank"
            class="primary--text link"
          >
            Contact us now!
          </a>
        </p>

        <div v-else class="text-center c-px-3 c-mb-1">
          <p class="subtext-content c-mt-4 c-mb-6 ins-2">
            Don’t have an account yet?
          </p>
          <a href="https://m360.com.ph/contact-us/" target="_blank">
            <p class="primary--text subtext-content ins-2 mb-0">
              Contact us now!
            </p>
          </a>
        </div>
      </v-stepper-content>

      <v-stepper-content :step="2" class="pa-0">
        <h4
          class="text-center primary--text c-mb-3 c-px-3 auth-code-text"
          :class="{ 'c-mt-2': $largeView }"
        >
          Authentication Code
        </h4>
        <h5 class="text-center mx-auto c-mb-3 normal-text-spacing c-px-3">
          Please enter the 6-digit authentication sent to your mobile number.
        </h5>

        <v-form @submit.prevent class="c-px-3">
          <v-text-field
            v-model="otp"
            flat
            outlined
            hide-details
            class="login-fields"
            maxlength="6"
            placeholder="Enter 6-digit authentication code"
            :error="showOtpError"
            @input="onInput"
          />

          <!-- Error Message -->
          <div v-if="showOtpError" class="d-flex align-items-center c-mt-5">
            <v-icon color="secondary"> mdi-alert-outline </v-icon>

            <span class="subtext-content c-pl-6 secondary--text my-auto">
              Invalid code. Try again.
            </span>
          </div>

          <p class="subtext-content normal-text-spacing c-mt-5 mb-0 ref-code">
            Reference no. {{ refCodeDisplay }}
          </p>

          <div class="d-flex justify-center c-my-3 align-items-center">
            <span
              :class="resendCodeClasses"
              @click="onClickResend"
              class="resend-text"
            >
              Resend Code
              <v-progress-circular
                v-show="otpResendLoading"
                indeterminate
                color="primary"
                :size="12"
                :width="1"
                style="vertical-align: super"
              />
              <span v-show="!otpResendLoading">
                {{ resendTimer ? ` (${resendTimer}s)` : '' }}
              </span>
            </span>
          </div>

          <v-btn
            block
            x-large
            depressed
            type="submit"
            color="primary"
            height="48"
            :class="`white--text c-mb-${$largeView ? '3' : '1'}`"
            :loading="otpSubmitLoading"
            @click="onClickSubmit"
          >
            Submit
          </v-btn>
        </v-form>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { addDays } from 'date-fns';
import { v4 as uuid4, validate } from 'uuid';
import crypt from '@/utils/crypt';
import { logger } from '@/utils/logger';
import { DEVICE_ID_KEY, CREDENTIALS_KEY } from './constants';

const RESEND_TIMER = 150;
const RENTENTION_DAYS = 30;
const log = logger('account-login');

export default {
  name: 'AccountLogin',
  layout: 'account',

  data() {
    return {
      step: 1,
      user: {
        username: '',
        password: '',
      },
      userId: null,
      showPwd: false,
      rememberMe: false,
      loginLoading: false,
      errorMessage: '',
      otp: '',
      referenceNo: '',
      showOtpError: false,
      resendTimer: 0,
      resendTimerId: null,
      otpSubmitLoading: false,
      otpResendLoading: false,
      deviceUUID: '',
    };
  },

  computed: {
    resendCodeClasses() {
      return {
        link: !this.resendTimer,
        'subtext-content': true,
        'normal-text-spacing': true,
        'text-center': true,
        'primary--text': !this.resendTimer,
        'cursor-pointer': !this.resendTimer,
        'grey--text': !!this.resendTimer,
        'cursor-not-allowed': !!this.resendTimer,
      };
    },

    refCodeDisplay() {
      if (typeof this.referenceNo === 'number') return this.referenceNo;

      return this.referenceNo?.slice(4);
    },
  },

  mounted() {
    const deviceId = localStorage.getItem(DEVICE_ID_KEY);

    // Only generate the device_id once and generate a new one
    // only when the old device_id got cleared or is invalid.
    if (!!deviceId && validate(deviceId)) {
      this.deviceUUID = deviceId;
    } else {
      this.deviceUUID = uuid4();
      localStorage.setItem(DEVICE_ID_KEY, this.deviceUUID);
    }

    let credentials = localStorage.getItem(CREDENTIALS_KEY);
    credentials =
      credentials && typeof credentials === 'string'
        ? JSON.parse(credentials)[CREDENTIALS_KEY]
        : [];
    log('[mounted]#credentials: ', credentials);

    /**
     * Check whether remember me was ticked and whether it is not expired yet.
     * Otherwise, clear out the saved credentials.
     */
    if (credentials?.length === 3 && new Date() < new Date(credentials[2])) {
      log('[mounted]#credentials#deciphered');
      this.rememberMe = true;
      this.user.username = crypt.decipher(
        process.env.VUE_APP_CRYPT_SALT,
        credentials[0]
      );
      this.user.password = crypt.decipher(
        process.env.VUE_APP_CRYPT_SALT,
        credentials[1]
      );
    } else {
      log('[mounted]#credentials#cleared');
      localStorage.removeItem(CREDENTIALS_KEY);
    }
  },

  beforeDestroy() {
    clearInterval(this.resendTimerId);
  },

  methods: {
    startResendTimer() {
      this.resendTimerId = setInterval(() => {
        this.resendTimer -= 1;

        if (!this.resendTimer) clearInterval(this.resendTimerId);
      }, 1000);
    },

    async onClickLogin() {
      try {
        this.loginLoading = true;
        this.errorMessage = '';

        const payload = {
          ...this.user,
          is_remember: false,
          device_id: this.deviceUUID,
        };

        const res = await this.$store.dispatch('auth/login', payload);
        const data = res?.data;
        this.userId = data?.user_id;

        if (data?.two_fa_flag) {
          this.step = 2;
          this.referenceNo = data.ref_code;
          this.resendTimer = RESEND_TIMER;
          this.startResendTimer();
          return;
        }

        if (this.rememberMe) {
          this.storeCredentials();
        } else {
          localStorage.removeItem(CREDENTIALS_KEY);
        }

        await Promise.all([
          this.$store.dispatch('account/getAccountInfo'),
          this.$store.dispatch('dashboard/getServices'),
        ]);

        this.goToDashboard();
      } catch (error) {
        console.error(error);
        this.errorMessage = 'The email or password you entered is incorrect.';
      } finally {
        this.loginLoading = false;
      }
    },

    async onClickSubmit() {
      if (!this.otp) {
        this.showOtpError = true;
        return;
      }

      try {
        this.otpSubmitLoading = true;
        this.showOtpError = false;
        const ref_code =
          typeof this.referenceNo === 'number'
            ? 'REF#' + this.referenceNo
            : this.referenceNo;

        const payload = {
          ...this.user,
          user_id: this.userId,
          pin: this.otp,
          ref_code,
          device_id: this.deviceUUID,
          is_remember: false,
        };

        await this.$store.dispatch('auth/verify2FA', payload);

        if (this.rememberMe) {
          this.storeCredentials();
        } else {
          localStorage.removeItem(CREDENTIALS_KEY);
        }

        await Promise.all([
          this.$store.dispatch('account/getAccountInfo'),
          this.$store.dispatch('dashboard/getServices'),
        ]);

        this.goToDashboard();
      } catch (error) {
        console.error(error);
        this.showOtpError = true;
      } finally {
        this.otpSubmitLoading = false;
      }
    },

    async onClickResend() {
      // skip resend while in count down
      if (this.resendTimer) return;

      try {
        this.otpResendLoading = true;
        this.resendTimer = RESEND_TIMER;
        const res = await this.$store.dispatch('auth/send2FA', {
          ...this.user,
          user_id: this.userId,
        });

        this.referenceNo = res?.data.ref_code;
        this.startResendTimer();
      } catch (error) {
        console.error(error);
      } finally {
        this.otpResendLoading = false;
      }
    },

    onInput($event) {
      this.$nextTick(() => {
        this.otp = $event.replace(/[^0-9]/g, '');
      });
    },

    storeCredentials() {
      // NOTE: Storing objects/arrays must always be enclosed in curly braces
      const credentials = {
        [CREDENTIALS_KEY]: [
          crypt.cipher(process.env.VUE_APP_CRYPT_SALT, this.user.username),
          crypt.cipher(process.env.VUE_APP_CRYPT_SALT, this.user.password),
          addDays(new Date(), RENTENTION_DAYS),
        ],
      };

      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    },

    /**
     * Redirect to the first Tab/Channel based on
     * the User Services access
     */
    goToDashboard() {
      for (const tab of this.$store.getters['dashboard/GET_TAB_MENU']) {
        if (tab.show) return this.$router.push({ name: tab.routeName });
      }

      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.login__container {
  .ins-1 {
    line-height: 23px;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      line-height: 20px;
      font-size: 16px;
      letter-spacing: -0.01em;
    }
  }

  .ins-2 {
    line-height: 23px;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      line-height: 24px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .login-text {
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 20px;
      line-height: 29px;
    }
  }

  .resend-text {
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 16px;
      line-height: 29px;
    }
  }

  .login-fields.v-text-field.v-text-field--outlined {
    .v-input__slot input {
      line-height: 24px;
      font-weight: 500;
      color: rgb(130, 130, 130);

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        line-height: 21px;
      }
    }

    .v-input__icon--append button.error--text {
      color: rgba(0, 0, 0, 0.54) !important;
    }

    &:not(:hover, .v-input--is-focused, .error--text) {
      .v-input__slot fieldset {
        border-color: rgb(130, 130, 130);
      }
    }
  }

  .ref-code {
    line-height: 16px;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      line-height: 18px;
    }
  }

  .auth-code {
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 20px;
      line-height: 29px;
    }
  }

  .v-btn {
    .v-btn__loader {
      color: white;
    }
  }
}
</style>
