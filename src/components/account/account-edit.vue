<template>
  <div>
    <v-form ref="form" class="form-wrapper" @submit.prevent="validateForm">
      <v-row>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            v-model="form.name"
            label="Name"
            :rules="rules.requiredName"
            maxlength="50"
            @keypress="checkName($event)"
            @input="noEmojiName($event)"
          ></v-text-field>
        </v-col>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            v-model="form.jobTitle"
            label="Job Title"
            :rules="rules.requiredJob"
            @input="noEmojiJob($event)"
            maxlength="100"
          ></v-text-field>
        </v-col>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            v-model="form.accountPermission"
            label="Account Permission"
            disabled
          ></v-text-field>
        </v-col>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            v-model="form.companyName"
            label="Company Name"
            :rules="[rules.requiredCompanyName]"
            @input="noEmojiCompany($event)"
            :disabled="!form.isAdmin"
            maxlength="100"
          ></v-text-field>
        </v-col>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            v-model="form.email"
            label="Email Address"
            disabled
          ></v-text-field>
        </v-col>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            v-model="form.companyAddress"
            label="Company Address"
            :rules="[rules.requiredCompanyAddress]"
            @input="noEmojiAddress($event)"
            :disabled="!form.isAdmin"
            maxlength="100"
          ></v-text-field>
        </v-col>
        <v-col class="column" cols="12" sm="6" md="5">
          <v-text-field
            class="mNumber"
            :class="{ 'has-empty': form.number === '' }"
            v-model="form.number"
            label="Mobile Number"
            placeholder="9051234567"
            :rules="rules.requiredMobile"
            @keypress="numberOnly($event)"
            @input="noEmojiNumber($event)"
            maxlength="10"
            prefix="+63 |"
          >
            <template v-slot:prepend-inner>
              <img width="24" height="24" src="@/assets/icons/ph.svg" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <div class="form-btn">
        <v-btn
          type="submit"
          large
          depressed
          class="btn-large-default primary mr-4"
          :disabled="dsbldSave"
          :loading="isLoading"
          >Save Changes</v-btn
        >
        <v-btn
          large
          depressed
          class="btn-large-default btn-secondary"
          @click="clickCancel"
          >Cancel</v-btn
        >
      </div>
    </v-form>

    <ModalOTP
      v-if="otpDialog"
      @setActionOTP="getActionOTP"
      @setErrorOTP="getErrorOTP"
      :formData="form"
      :numberOnlyChanged="numberOnlyChanged"
    />

    <Confirm ref="dialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Confirm from '@/components/common/async-dialog';
import ModalOTP from '@/components/account/modalOTP';
import discardValidate from '@/utils/discardValidate';
import deepClone from 'lodash.clonedeep';

export default {
  components: {
    Confirm,
    ModalOTP,
  },
  data() {
    return {
      isLoading: false,
      otpDialog: false,
      form: {
        name: '',
        jobTitle: '',
        accountPermission: '',
        companyName: '',
        companyAddress: '',
        email: '',
        number: '',
      },
      cloneForm: {},
      formName: '',
      formJobTitle: '',
      formAccountPermission: '',
      formCompanyName: '',
      formCompanyAddress: '',
      formEmail: '',
      formNumber: '',

      numberOnlyChanged: false,
      dsbldSave: true,
      guardPass: false,
      rules: {
        requiredName: [(value) => !!value.trim() || 'Name field is required'],
        requiredJob: [(value) => !!value.trim() || 'Job Title is required'],
        requiredCompanyName: (value) =>
          !!value.trim() || 'Company Name is required',
        requiredCompanyAddress: (value) =>
          !!value.trim() || 'Company Address is required',
        requiredMobile: [
          (value) => !!value.trim() || 'Mobile Number is required',
          (value) =>
            (value && value.trim().length == 10) ||
            'Mobile Number must be atleast 10 digits',
        ],
      },
    };
  },

  async created() {
    this.populate();
  },

  mounted() {
    this.cloneForm = deepClone(this.form);
  },

  computed: {
    ...mapGetters({
      formHolder: 'account/GET_USER_INFO',
    }),
  },

  watch: {
    form: {
      handler(oldval, newval) {
        // if (!this.$refs.form.validate()) {
        //   this.dsbldSave = true
        //   return
        // }
        this.compareData(newval);
      },
      deep: true,
    },
  },

  methods: {
    async isDiscard() {
      this.form.name = await this.form.name.trim();
      this.form.jobTitle = await this.form.jobTitle.trim();
      this.form.companyName = await this.form.companyName.trim();
      this.form.companyAddress = await this.form.companyAddress.trim();
      this.form.number = await this.form.number.trim();
      return discardValidate(this.cloneForm, this.form);
    },

    async validateForm() {
      if (!this.$refs.form.validate()) return;
      if (this.formNumber !== this.form.number) {
        await this.checkUpdated();

        // send otp api
        try {
          const res = await this.$store.dispatch('account/otpRequest', {
            phone: this.form.number,
          });
          if (res.code >= 200 && res.code <= 300) {
            this.form.refCode = res.data.ref_code;
            this.form.oldNumber = this.formNumber;
            this.otpDialog = true;
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        // save details api
        if (this.isLoading) return;
        this.isLoading = true;
        this.guardPass = true;
        try {
          const res = await this.$store.dispatch(
            'account/updateInfo',
            this.form
          );
          if (res.code >= 200 && res.code <= 300) {
            this.isLoading = false;
            this.$store.dispatch('account/getAccountInfo');
            await this.$refs.dialog.show('message', {
              icon: require('@/assets/icons/success-saved.svg'),
              title: 'Changes Saved!',
              description:
                'You have successfully updated your account information.',
            });

            this.$router.push({ name: 'account' });
          }
        } catch (error) {
          console.error(error);
          this.isLoading = false;
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
        }
      }
    },

    async clickCancel() {
      this.$router.push({ name: 'account' });
      // await this.checkUpdated()
      // if (this.numberOnlyChanged && this.formNumber == this.form.number) {
      //   this.$router.push({ name: 'account' })
      // } else {
      //   const dialog = await this.$refs.dialog.show('confirm', {
      //     icon: require('@/assets/icons/modal-trash.svg'),
      //     description: 'Discard Changes?',
      //     primaryLabel: 'Discard Changes',
      //     secondaryLabel: 'Keep Editing',
      //     primaryColor: 'success',
      //     autoClose: false,
      //   });

      //   if (dialog.confirm) this.$router.push({ name: 'account' });

      //   dialog.close();
      // }
    },

    async getActionOTP(val) {
      this.otpDialog = false;
      this.guardPass = true;
      if (val) {
        await this.$refs.dialog.show('message', {
          icon: require('@/assets/icons/success-saved.svg'),
          title: 'Changes Saved!',
          description:
            'You have successfully updated your account information.',
        });
      }

      this.$router.push({ name: 'account' });
    },

    async getErrorOTP() {
      this.otpDialog = false;
      this.guardPass = true;
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
    },

    async checkUpdated() {
      if (
        this.formName === this.form.name &&
        this.formJobTitle === this.form.jobTitle &&
        this.formCompanyName === this.form.companyName &&
        this.formCompanyAddress === this.form.companyAddress
      ) {
        this.numberOnlyChanged = true;
      } else {
        this.numberOnlyChanged = false;
      }
    },

    async populate() {
      this.form.name = this.formHolder.name;
      this.form.jobTitle = this.formHolder.designation;
      this.form.accountPermission = this.formHolder.permission;
      this.form.companyName = this.formHolder.company_name;
      this.form.email = this.formHolder.email;
      this.form.companyAddress = this.formHolder.company_address;
      this.form.number = this.formHolder.phone;
      this.form.isAdmin = this.formHolder.is_admin;

      this.formName = this.form.name;
      this.formJobTitle = this.form.jobTitle;
      this.formCompanyName = this.form.companyName;
      this.formCompanyAddress = this.form.companyAddress;
      this.formNumber = this.form.number;
    },

    numberOnly(e) {
      var event = e || window.event;
      var keycode = e.which || event.keyCode;
      if (keycode >= 48 && keycode <= 57) return;
      e.preventDefault();
    },

    async noEmojiNumber(e) {
      this.form.number = await e.replace(/[^0-9 ]/gm, '');
    },

    async noEmojiAddress(e) {
      this.form.companyAddress = await e.replace(
        /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]/gm,
        ''
      );
    },

    async noEmojiCompany(e) {
      this.form.companyName = await e.replace(
        /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]/gm,
        ''
      );
    },

    async noEmojiJob(e) {
      this.form.jobTitle = await e.replace(
        /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]/gm,
        ''
      );
    },

    async noEmojiName(e) {
      this.form.name = await e.replace(/[^a-zA-Z-. ]/gm, '');
    },

    checkName(e) {
      var event = e || window.event;
      var keycode = e.which || event.keyCode;
      if (
        (keycode >= 97 && keycode <= 122) ||
        (keycode >= 65 && keycode <= 90) ||
        keycode == 45 ||
        keycode == 46 ||
        keycode == 32
      )
        return;
      e.preventDefault();
    },

    async compareData(val) {
      let currentData = await val;
      if (
        currentData.name.trim() === '' ||
        currentData.jobTitle.trim() === '' ||
        currentData.companyName.trim() === '' ||
        currentData.companyAddress.trim() === '' ||
        currentData.number.trim() === '' ||
        currentData.number.trim().length !== 10
      ) {
        this.dsbldSave = true;
        return;
      }
      if (
        this.formName !== currentData.name.trim() ||
        this.formJobTitle !== currentData.jobTitle.trim() ||
        this.formCompanyName !== currentData.companyName.trim() ||
        this.formCompanyAddress !== currentData.companyAddress.trim() ||
        this.formNumber !== currentData.number.trim()
      ) {
        this.dsbldSave = false;
      } else {
        this.dsbldSave = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin-top: 34px;

  ::v-deep .v-input {
    &.v-input--is-disabled {
      input {
        color: #898989 !important;
      }
    }
    label {
      color: #898989 !important;
    }
    input {
      color: #151c36 !important;
    }
  }

  ::v-deep .mNumber {
    // ::v-deep .v-text-field__prefix {
    //   color: #151C36;
    // }
    &.v-input--has-state.v-input--is-focused.error--text {
      label {
        left: -28px !important;
      }
    }
    &.v-input--has-state.v-input--is-focused.error--text {
      label {
        left: -28px !important;
      }
    }
    &.v-input--has-state.v-input--is-focused.error--text.has-empty {
      label {
        left: -28px !important;
      }
    }
    &.v-input--has-state.error--text.has-empty {
      label {
        left: 43px !important;
      }
    }
    // &.v-input--has-state.error--text {
    //   label {
    //     left: 43px !important;
    //   }
    // }
    .v-text-field__slot {
      label {
        left: -28px !important;
      }
      input {
        padding: 10px 0 !important;
      }
    }
  }

  .form-btn {
    margin-top: 20px;
  }
}
</style>
