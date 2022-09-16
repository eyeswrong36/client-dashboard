import Vue from 'vue';
import store from '@/store';
import IdleVue from 'idle-vue';

const idleTime = 1000; // consider the user idle on the first second of inactivity
const eventsHub = new Vue();
const options = {
  store,
  idleTime,
  eventEmitter: eventsHub,
};

Vue.use(IdleVue, options);
