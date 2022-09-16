export const useModel = (prop = 'value', event = 'input') => ({
  get() {
    return this[prop];
  },
  set(value) {
    return this.$emit(event, value);
  },
});

export const syncProp = (prop) => useModel(prop, `update:${prop}`);

export default {
  useModel,
  syncProp,
};
