<template>
  <div class="page-content-padded account">
    <h5 class="page-title muted-text">{{ title }}</h5>

    <div class="content-header">
      <h4>{{ bodyTitle }}</h4>
      <div class="ml-auto">
        <div class="d-flex">
          <Link
            v-for="(i, idx) in actions"
            :key="idx"
            :icon="i.icon"
            :label="i.label"
            :routeName="i.routeName"
            class="ml-6"
          />
        </div>
      </div>
    </div>

    <div class="body">
      <slot name="body" />
    </div>
  </div>
</template>
<script>
import Link from '@/components/common/link';
export default {
  props: {
    title: {
      type: String,
      default: 'Title',
    },

    bodyTitle: {
      type: String,
      default: 'Body Title',
    },

    actions: {
      type: [Array, Object],
      defautl: () => [],
    },
  },

  components: {
    Link,
  },
};
</script>
<style lang="scss" scoped>
.account {
  padding-bottom: 70px;
}
.page-title {
  padding: 47px 0;
  margin-left: 16px;
}
.content-header {
  display: flex;
  align-items: center;
  padding-bottom: 13px;
  border-bottom: 1px solid #f1f1f1;
}

.body {
  width: 100%;
  padding: 0;
}
</style>
