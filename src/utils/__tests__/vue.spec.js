import { mount } from '@vue/test-utils';
import { useModel, syncProp } from '../vue';

const ParentComponent = {
  template: `
    <div>
      <child-component ref="child" :sync-here.sync="syncValue" />
    </div>
  `,
  data() {
    return { syncValue: '' };
  },
};

const ChildComponent = {
  template: `
    <div>
      <div class="value-div">{{ value }}</div>
      <div class="custom-div">{{ custom }}</div>
    </div>
  `,
  props: ['value', 'custom', 'syncHere'],
  computed: { syncHereModel: syncProp('syncHere') },
};

describe('utils/vue.js', () => {
  describe('useModel()', () => {
    it('makes use of v-model implementation on default params', () => {
      const expected = {
        get() {
          return 'Test';
        },
        set(value) {
          return this.$emit('input', value);
        },
      };

      const wrapper = mount(ChildComponent, {
        propsData: {
          value: 'Test',
        },
        computed: {
          model: useModel(),
        },
      });

      const val = wrapper.findComponent('.value-div');

      // assert value is the same
      expect(val.text()).toEqual(expected.get());

      wrapper.vm.model = 'New Value';
      // assert event has been emitted
      expect(wrapper.emitted().input).toBeTruthy();

      // assert event payload
      expect(wrapper.emitted().input[0]).toEqual(['New Value']);
    });

    it('implements get() to return prop, and set(v) to emit eventName with `v` as param', () => {
      const expected = {
        get() {
          return 'Custom Prop';
        },
        set(value) {
          return this.$emit('custom-event', value);
        },
      };

      const wrapper = mount(ChildComponent, {
        propsData: {
          custom: 'Custom Prop',
        },
        computed: {
          customModel: useModel('custom', 'custom-event'),
        },
      });

      const val = wrapper.findComponent('.custom-div');

      // assert that value is the same
      expect(val.text()).toEqual(expected.get());

      wrapper.vm.customModel = 'New Custom Value';
      // assert event has been emitted
      expect(wrapper.emitted()['custom-event']).toBeTruthy();

      // assert event payload
      expect(wrapper.emitted()['custom-event'][0]).toEqual([
        'New Custom Value',
      ]);
    });
  });

  describe('syncProp()', () => {
    it('makes use of v-bind:[prop].sync vue modifier via useModel()', () => {
      let syncValue = 'Initial Value';

      const wrapper = mount(ParentComponent, {
        components: { ChildComponent },
        data() {
          return { syncValue: '' };
        },
      });

      const childRef = wrapper.vm.$refs.child;
      childRef.syncHereModel = syncValue;

      // assert that syncValue is the same
      expect(wrapper.vm.$data.syncValue).toEqual(syncValue);

      syncValue = 'New Value';
      childRef.syncHereModel = syncValue;
      // assert that syncValue is still the same
      expect(wrapper.vm.$data.syncValue).toEqual(syncValue);
    });
  });
});
