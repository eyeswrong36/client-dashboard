<template>
  <v-dialog persistent ref="dialog" v-model="value" :width="width">
    <v-card
      class="d-flex flex-column align-center justify-center"
      style="padding: 55px 34px"
    >
      <img :src="isError ? errorIcon : defaultIcon" width="41.23px" />
      <h4 v-if="title" class="c-mt-5" :class="{ 'error--text': isError }">
        {{ title }}
      </h4>
      <p class="c-mt-4 font-weight-500 font-16 text-center">
        {{ description }}
      </p>

      <div v-if="mode == 'confirm'" class="actions c-mt-3">
        <v-btn
          v-if="secondaryOnly"
          depressed
          class="btn-secondary btn-large-default mx-2"
          @click="onCancel"
          >{{ secondaryLabel }}</v-btn
        >

        <v-btn
          v-else-if="primaryOnly"
          type="submit"
          depressed
          :class="`btn-large-default mx-2 ${primaryColor}`"
          @click="onConfirm"
          >{{ primaryLabel }}</v-btn
        >

        <div v-else class="d-flex">
          <v-btn
            depressed
            class="btn-secondary btn-large-default mx-2"
            @click="onCancel"
            >{{ secondaryLabel }}</v-btn
          >
          <v-btn
            type="submit"
            depressed
            :class="`btn-large-default mx-2 ${primaryColor}`"
            @click="onConfirm"
            >{{ primaryLabel }}</v-btn
          >
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import errorIcon from '@/assets/icons/error.svg';
import successIcon from '@/assets/icons/success.svg';

export default {
  props: {
    width: {
      type: [String, Number],
      default: 445,
    },
  },

  data: () => ({
    value: false,
    isError: false,
    title: '',
    description: '',
    mode: 'message',
    secondaryOnly: false,
    primaryOnly: false,
    soncondaryOnly: false,
    primaryColor: 'primary',
    defaultIcon: successIcon,
    errorIcon,
    successIcon,
    secondaryLabel: 'Cancel',
    primaryLabel: 'Submit',
    autoClose: true,
    resolve: null,
  }),

  methods: {
    /**
     *
     * @param {String} mode | confirm, message
     * @param {Object} {}
     */
    async show(
      mode,
      {
        title,
        description,
        secondaryOnly,
        primaryOnly,
        primaryColor,
        primaryLabel,
        secondaryLabel,
        icon,
        isError = false,
        autoClose = true,
      }
    ) {
      this.mode = mode;
      this.title = title;
      this.description = description;
      this.secondaryOnly = secondaryOnly ? secondaryOnly : this.secondaryOnly;
      this.primaryOnly = primaryOnly ? primaryOnly : this.primaryOnly;
      this.primaryColor = primaryColor ? primaryColor : this.primaryColor;
      this.primaryLabel = primaryLabel ? primaryLabel : this.primaryLabel;
      this.autoClose = autoClose;
      this.secondaryLabel = secondaryLabel
        ? secondaryLabel
        : this.secondaryLabel;
      this.defaultIcon = icon ? icon : this.defaultIcon;
      this.isError = isError;
      this.value = true;

      if (this.mode == 'message') {
        setTimeout(() => {
          this.resolve({ close: () => this.close() });
        }, 3000);
      }

      return await new Promise((resolve) => (this.resolve = resolve));
    },

    onConfirm() {
      this.resolve({ confirm: true, close: () => this.close() });

      if (this.autoClose) this.value = false;
    },

    onCancel() {
      this.resolve({ confirm: false, close: () => this.close() });
      this.value = false;
    },

    close() {
      this.value = false;
    },
  },
};
</script>
<style lang="scss" scoped>
p {
  max-width: 295px !important;
}
</style>
