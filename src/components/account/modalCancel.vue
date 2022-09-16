<template>
  <v-row justify="center">
    <v-dialog v-model="dialogCancel" persistent max-width="445">
      <v-card>
        <v-card-text>
          <div class="text-center">
            <div class="d-flex justify-center icon-img">
              <v-img
                :src="require(`@/assets/icons/${icon}`)"
                max-width="41"
                max-height="37"
              ></v-img>
            </div>
            <h4 class="title" :class="{ confirmation: !isConfirmation }">
              {{ title }}
            </h4>
            <p v-if="!isConfirmation" class="desc">{{ message }}</p>
            <div v-if="isConfirmation" class="btn-actions">
              <v-btn
                large
                depressed
                :class="`btn-large-default ${cancelButtonClass} mr-4`"
                @click="$emit('setAction', false)"
                >{{ cancelButtonText }}</v-btn
              >
              <v-btn
                large
                depressed
                :class="`btn-large-default ${confirmButtonClass}`"
                @click="$emit('setAction', true)"
                >{{ confirmButtonText }}</v-btn
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
    isConfirmation: {
      type: Boolean,
      default: true,
    },
    icon: {
      Type: String,
      default: '',
    },
    title: {
      Type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirmButtonText: {
      Type: String,
      default: '',
    },
    cancelButtonText: {
      Type: String,
      default: '',
    },
    confirmButtonClass: {
      Type: String,
      default: '',
    },
    cancelButtonClass: {
      Type: String,
      default: '',
    },
  },

  data() {
    return {
      dialogCancel: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  .v-card__text {
    padding: 55px 0;

    .icon-img {
      margin-bottom: 13px;
    }

    .title {
      margin: 0;
      font-weight: 500;
      font-size: 16px !important;
      line-height: 29px;
      letter-spacing: -0.01em !important;
      color: #000;
      &.confirmation {
        margin-bottom: 21px;
        font-weight: 700;
        font-size: 20px !important;
        line-height: 24px;
      }
    }

    .desc {
      margin: 0;
      padding: 0 75px;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.01em;
      color: #000;
    }

    .btn-actions {
      margin-top: 55px;
    }
  }
}
</style>
