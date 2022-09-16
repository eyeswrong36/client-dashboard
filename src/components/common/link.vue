<template>
  <router-link :to="{ name: routeName }" class="btn-link link"
    ><v-img :src="icon" class="mr-2" />{{ label }}</router-link
  >
</template>
<script>
export default {
  props: {
    routeName: {
      type: String,
      default: null,
    },

    label: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss">
.btn-link {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  line-height: 16.2px;
  color: #151c36 !important;
}
</style>
