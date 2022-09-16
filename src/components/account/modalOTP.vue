<template>
  <v-row justify="center">
    <v-dialog v-model="dialogOTP" persistent max-width="445">
      <v-card>
        <v-card-text>
          <div class="text-center">
            <h2>Update Mobile Number</h2>
            <p class="desc">
              Enter the verification code sent to your mobile number. Once
              verified, your information will be updated.
            </p>
            <!-- {{ otpEditMode }} -->
            <div class="input-group">
              <div class="form-otp">
                <div class="input-code">
                  <div class="text-group">
                    <!-- <div
                      v-show="!myValue1"
                      class="line-break"
                      :style="{
                        backgroundColor:
                          focusHolder == 'otp1' && blurHolder != 'otp1'
                            ? '#0460e9'
                            : '#898989',
                      }"
                    ></div> -->
                    <input
                      type="text"
                      class="otp-number-input input-number-only"
                      maxlength="1"
                      @keyup="otpCellChange(1)"
                      v-on:keydown.delete.prevent="otpDeleteChange(1)"
                      @focus="focusOTP"
                      v-model="myValue1"
                      @keypress="numberOnly($event)"
                      @input="noEmoji"
                      ref="myValue1"
                    />
                  </div>

                  <div class="text-group">
                    <!-- <div
                      v-show="!myValue2"
                      class="line-break"
                      :style="{
                        backgroundColor:
                          focusHolder == 'otp2' && blurHolder != 'otp2'
                            ? '#0460e9'
                            : '#898989',
                      }"
                    ></div> -->
                    <input
                      type="text"
                      class="otp-number-input input-number-only"
                      maxlength="1"
                      @keyup="otpCellChange(2)"
                      v-on:keydown.delete.prevent="otpDeleteChange(2)"
                      @focus="focusOTP"
                      v-model="myValue2"
                      @keypress="numberOnly($event)"
                      @input="noEmoji"
                      ref="myValue2"
                    />
                  </div>

                  <div class="text-group">
                    <!-- <div
                      v-show="!myValue3"
                      class="line-break"
                      :style="{
                        backgroundColor:
                          focusHolder == 'otp3' && blurHolder != 'otp3'
                            ? '#0460e9'
                            : '#898989',
                      }"
                    ></div> -->
                    <input
                      type="text"
                      class="otp-number-input input-number-only"
                      maxlength="1"
                      @keyup="otpCellChange(3)"
                      v-on:keydown.delete.prevent="otpDeleteChange(3)"
                      @focus="focusOTP"
                      v-model="myValue3"
                      @keypress="numberOnly($event)"
                      @input="noEmoji"
                      ref="myValue3"
                    />
                  </div>

                  <div class="text-group">
                    <!-- <div
                      v-show="!myValue4"
                      class="line-break"
                      :style="{
                        backgroundColor:
                          focusHolder == 'otp4' && blurHolder != 'otp4'
                            ? '#0460e9'
                            : '#898989',
                      }"
                    ></div> -->
                    <input
                      type="text"
                      class="otp-number-input input-number-only"
                      maxlength="1"
                      @keyup="otpCellChange(4)"
                      v-on:keydown.delete.prevent="otpDeleteChange(4)"
                      @focus="focusOTP"
                      v-model="myValue4"
                      @keypress="numberOnly($event)"
                      @input="noEmoji"
                      ref="myValue4"
                    />
                  </div>

                  <div class="text-group">
                    <!-- <div
                      v-show="!myValue5"
                      class="line-break"
                      :style="{
                        backgroundColor:
                          focusHolder == 'otp5' && blurHolder != 'otp5'
                            ? '#0460e9'
                            : '#898989',
                      }"
                    ></div> -->
                    <input
                      type="text"
                      class="otp-number-input input-number-only"
                      maxlength="1"
                      @keyup="otpCellChange(5)"
                      v-on:keydown.delete.prevent="otpDeleteChange(5)"
                      @focus="focusOTP"
                      v-model="myValue5"
                      @keypress="numberOnly($event)"
                      @input="noEmoji"
                      ref="myValue5"
                    />
                  </div>

                  <div class="text-group">
                    <!-- <div
                      v-show="!myValue6"
                      class="line-break"
                      :style="{
                        backgroundColor:
                          focusHolder == 'otp6' && blurHolder != 'otp6'
                            ? '#0460e9'
                            : '#898989',
                      }"
                    ></div> -->
                    <input
                      type="text"
                      class="otp-number-input input-number-only"
                      maxlength="1"
                      @keyup="otpCellChange(6)"
                      v-on:keydown.delete.prevent="otpDeleteChange(6)"
                      @focus="focusOTP"
                      v-model="myValue6"
                      @keypress="numberOnly($event)"
                      @input="noEmoji"
                      ref="myValue6"
                    />
                  </div>
                </div>
              </div>
              <p class="error-msg" v-if="otpError && motherOTP.length == 6">
                Incorrect verification code.
              </p>
            </div>
            <p class="reference">
              Reference no.
              {{
                newRefCode
                  ? newRefCode.substring(4)
                  : formData.refCode.substring(4)
              }}
            </p>
            <p class="resend-code">
              <span class="condition" v-if="timerCount"
                >If you did not receive the code in {{ timerCount }}s,
              </span>
              <span
                class="code"
                :class="{ disabled: timerCount }"
                @click="otpResend"
                >Resend Code</span
              >
            </p>
            <div class="btn-actions">
              <v-btn
                large
                depressed
                class="btn-large-default btn-secondary mr-4"
                @click="discardSave"
                :loading="isLoadingDiscard"
                >Discard Changes</v-btn
              >
              <v-btn
                large
                depressed
                class="btn-large-default primary"
                :disabled="btnDsbld"
                :loading="isLoadingSave"
                @click="verifyOTP"
                >Verify</v-btn
              >
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    numberOnlyChanged: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogOTP: true,
      isLoadingSave: false,
      isLoadingResend: false,
      isLoadingDiscard: false,
      myValue1: '',
      myValue2: '',
      myValue3: '',
      myValue4: '',
      myValue5: '',
      myValue6: '',
      motherOTP: '',
      focusHolder: '',
      blurHolder: '',
      timerCount: 150,
      otpError: false,
      otpEditMode: false,
      newRefCode: '',
    };
  },

  mounted() {
    this.$nextTick(() => this.$refs.myValue1.focus());
  },

  watch: {
    timerCount: {
      immediate: true,
      handler(val) {
        if (val > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
    },

    'motherOTP.length'(val) {
      if (val != 6) this.otpError = false;
    },

    myValue6(val) {
      this.otpEditMode = val ? true : false;
    },
  },

  computed: {
    btnDsbld() {
      return this.motherOTP.length == 6 ? false : true;
    },
  },

  methods: {
    async otpResend() {
      if (this.timerCount) return;
      if (this.isLoadingResend) return;
      this.isLoadingResend = true;

      try {
        const res = await this.$store.dispatch('account/otpRequest', {
          phone: this.formData.number,
        });
        if (res.code >= 200 && res.code <= 300) {
          this.isLoadingResend = false;
          this.newRefCode = res.data.ref_code;
          this.timerCount = 150;
        }
      } catch (error) {
        this.isLoadingResend = false;
        console.error(error);
      }
    },

    numberOnly(e) {
      var event = e || window.event;
      var keycode = e.which || event.keyCode;
      if (keycode >= 48 && keycode <= 57) return;
      e.preventDefault();
    },

    async verifyOTP() {
      // verify OTP api
      if (this.isLoadingSave) return;
      this.isLoadingSave = true;

      try {
        const res = await this.$store.dispatch('account/verifyOTP', {
          ref_code: this.newRefCode ? this.newRefCode : this.formData.refCode,
          pin: this.motherOTP,
        });

        if (res.code >= 200 && res.code <= 300) {
          // save details api
          try {
            const resA = await this.$store.dispatch(
              'account/updateInfo',
              this.formData
            );
            if (resA.code >= 200 && resA.code <= 300) {
              this.isLoadingSave = false;
              this.$store.dispatch('account/getAccountInfo');
              this.$emit('setActionOTP', true);
            }
          } catch (error) {
            this.isLoadingSave = false;
            this.$emit('setErrorOTP');
            console.log(error);
          }
        }
      } catch (error) {
        this.isLoadingSave = false;
        this.otpError = true;
        console.log(error);
      }
    },

    async discardSave() {
      if (this.numberOnlyChanged) {
        this.$emit('setActionOTP', false);
      } else {
        if (this.isLoadingDiscard) return;
        this.isLoadingDiscard = true;

        try {
          const res = await this.$store.dispatch('account/updateInfo', {
            name: this.formData.name,
            number: this.formData.oldNumber,
            jobTitle: this.formData.jobTitle,
            companyName: this.formData.companyName,
            companyAddress: this.formData.companyAddress,
          });
          if (res.code >= 200 && res.code <= 300) {
            this.isLoadingDiscard = false;
            this.$store.dispatch('account/getAccountInfo');
            this.$emit('setActionOTP', true);
          }
        } catch (error) {
          this.isLoadingDiscard = false;
          this.$emit('setErrorOTP');
          console.error(error);
        }
      }
    },

    async noEmoji() {
      let otpLength = this.motherOTP.length;
      switch (otpLength) {
        case 0:
          this.myValue1 = this.myValue1.replace(/[^0-9 ]/gm, '');
          break;
        case 1:
          this.myValue2 = this.myValue2.replace(/[^0-9 ]/gm, '');
          break;
        case 2:
          this.myValue3 = this.myValue3.replace(/[^0-9 ]/gm, '');
          break;
        case 3:
          this.myValue4 = this.myValue4.replace(/[^0-9 ]/gm, '');
          break;
        case 4:
          this.myValue5 = this.myValue5.replace(/[^0-9 ]/gm, '');
          break;
        case 5:
          this.myValue6 = this.myValue6.replace(/[^0-9 ]/gm, '');
          break;
        default:
          break;
      }
    },

    // blurOTP() {
    //   let otpLength = this.motherOTP.length;
    //   switch (otpLength) {
    //     case 0:
    //       this.blurHolder = 'otp1';
    //       break;
    //     case 1:
    //       this.blurHolder = 'otp2';
    //       break;
    //     case 2:
    //       this.blurHolder = 'otp3';
    //       break;
    //     case 3:
    //       this.blurHolder = 'otp4';
    //       break;
    //     case 4:
    //       this.blurHolder = 'otp5';
    //       break;
    //     case 5:
    //       this.blurHolder = 'otp6';
    //       break;
    //     case 6:
    //       this.blurHolder = 'otp6';
    //       break;
    //     default:
    //       break;
    //   }
    // },

    focusOTP() {
      let otpLength = this.motherOTP.length;
      if (!this.otpEditMode) {
        switch (otpLength) {
          case 0:
            this.$nextTick(() => this.$refs.myValue1.focus());
            this.focusHolder = 'otp1';
            this.blurHolder = '';
            break;
          case 1:
            this.$nextTick(() => this.$refs.myValue2.focus());
            this.focusHolder = 'otp2';
            this.blurHolder = '';
            break;
          case 2:
            this.$nextTick(() => this.$refs.myValue3.focus());
            this.focusHolder = 'otp3';
            this.blurHolder = '';
            break;
          case 3:
            this.$nextTick(() => this.$refs.myValue4.focus());
            this.focusHolder = 'otp4';
            this.blurHolder = '';
            break;
          case 4:
            this.$nextTick(() => this.$refs.myValue5.focus());
            this.focusHolder = 'otp5';
            this.blurHolder = '';
            break;
          case 5:
            this.$nextTick(() => this.$refs.myValue6.focus());
            this.focusHolder = 'otp6';
            this.blurHolder = '';
            break;
          case 6:
            // this.$nextTick(() => this.$refs.myValue6.focus());
            // this.focusHolder = 'otp6';
            // this.blurHolder = '';
            break;
          default:
            break;
        }
      } else {
        if (this.myValue1.length == 0) {
          this.$nextTick(() => this.$refs.myValue1.focus());
          return;
        }
        if (this.myValue2.length == 0) {
          this.$nextTick(() => this.$refs.myValue2.focus());
          return;
        }
        if (this.myValue3.length == 0) {
          this.$nextTick(() => this.$refs.myValue3.focus());
          return;
        }
        if (this.myValue4.length == 0) {
          this.$nextTick(() => this.$refs.myValue4.focus());
          return;
        }
        if (this.myValue5.length == 0) {
          this.$nextTick(() => this.$refs.myValue5.focus());
          return;
        }
      }
    },

    otpCellChange(val) {
      let input = val;
      if (input == 1) {
        if (this.myValue1.length == 1 && this.myValue2.length == 0) {
          this.$nextTick(() => this.$refs.myValue2.focus());
        } else {
          this.$nextTick(() => this.$refs.myValue1.focus());
        }
      } else if (input == 2 && this.myValue3.length == 0) {
        if (this.myValue2.length == 1) {
          this.$nextTick(() => this.$refs.myValue3.focus());
        } else {
          this.$nextTick(() => this.$refs.myValue2.focus());
        }
      } else if (input == 3 && this.myValue4.length == 0) {
        if (this.myValue3.length == 1) {
          this.$nextTick(() => this.$refs.myValue4.focus());
        } else {
          this.$nextTick(() => this.$refs.myValue3.focus());
        }
      } else if (input == 4 && this.myValue5.length == 0) {
        if (this.myValue4.length == 1) {
          this.$nextTick(() => this.$refs.myValue5.focus());
        } else {
          this.$nextTick(() => this.$refs.myValue4.focus());
        }
      } else if (input == 5 && this.myValue6.length == 0) {
        if (this.myValue5.length == 1) {
          this.$nextTick(() => this.$refs.myValue6.focus());
        } else {
          this.$nextTick(() => this.$refs.myValue5.focus());
        }
      }

      this.motherOTP = `${this.myValue1}${this.myValue2}${this.myValue3}${this.myValue4}${this.myValue5}${this.myValue6}`;
    },

    otpDeleteChange(val) {
      let input = val;
      if (input == 1) {
        // this.$nextTick(() => this.$refs.myValue1.focus());
        if (this.myValue1.length == 0) {
          this.$nextTick(() => this.$refs.myValue1.focus());
        } else {
          this.myValue1 = '';
        }
      } else if (input == 2) {
        if (this.myValue2.length == 0) {
          this.myValue1 = '';
          this.$nextTick(() => this.$refs.myValue1.focus());
        } else {
          this.myValue2 = '';
        }
      } else if (input == 3) {
        if (this.myValue3.length == 0) {
          this.myValue2 = '';
          this.$nextTick(() => this.$refs.myValue2.focus());
        } else {
          this.myValue3 = '';
        }
      } else if (input == 4) {
        if (this.myValue4.length == 0) {
          this.myValue3 = '';
          this.$nextTick(() => this.$refs.myValue3.focus());
        } else {
          this.myValue4 = '';
        }
      } else if (input == 5) {
        if (this.myValue5.length == 0) {
          this.myValue4 = '';
          this.$nextTick(() => this.$refs.myValue4.focus());
        } else {
          this.myValue5 = '';
        }
      } else if (input == 6) {
        if (this.myValue6.length == 0) {
          this.myValue5 = '';
          this.$nextTick(() => this.$refs.myValue5.focus());
        } else {
          this.myValue6 = '';
        }
      }

      this.motherOTP = `${this.myValue1}${this.myValue2}${this.myValue3}${this.myValue4}${this.myValue5}${this.myValue6}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  .v-card__text {
    padding: 55px 0;

    h2 {
      margin-bottom: 21px;
      font-weight: 700;
      font-size: 20px;
      line-height: 29px;
      letter-spacing: -0.01em;
      color: #151c36;
    }

    p {
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: -0.01em;
      color: #151c36;
      &.error-msg {
        color: #da4175;
        font-style: italic;
      }
      &.desc {
        padding: 0 40px;
        margin-bottom: 24px;
      }
      &.reference {
        margin-top: 24px;
        margin-bottom: 8px;
      }
      &.resend-code {
        margin-bottom: 55px;
        span {
          &.code {
            color: #008df0;
            cursor: pointer;
            &:not(.disabled) {
              padding-bottom: 3px;
              &:hover {
                border-bottom: #ffb839 2px solid;
              }
            }
            &.disabled {
              color: #9e9e9e;
              cursor: not-allowed;
              // pointer-events: none;
            }
          }
        }
      }
    }

    .input-group {
      // margin-bottom: 21px;
      .form-otp {
        padding: 0 30px 0 30px;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 8px;

        .input-code {
          // margin-top: 50px;
          display: flex;
          flex-direction: auto;
          // justify-content: space-around;
          justify-content: center;
          align-content: space-between;

          .text-group {
            position: relative;
            .line-break {
              position: absolute;
              height: 1px;
              width: 20px;
              bottom: 50%;
              // bottom: 0;
              right: 0;
              // background-color: red;
            }

            .otp-number-input {
              font-weight: 500;
              font-size: 20px;
              line-height: 24px;
              margin-left: 8px !important;
              color: #151c36;

              background-color: transparent;
              text-align: center;
              // line-height: 36px;
              // font-size: 30px;
              outline: none;
              // width: 10%;
              width: 20px;
              transition: all 0.2s ease-in-out;
              border-radius: none;
              border-top: none;
              border-left: none;
              border-right: none;
              border-bottom: 1px solid #898989;
              // margin-bottom: 50px;
              // border: 1px solid #898989;
              // caret-color: transparent;
              z-index: 5;

              // &:focus {
              //   border-bottom: 1px solid #0460e9;
              // }

              &::selection {
                background: transparent;
              }

              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
