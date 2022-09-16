import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import {
  dashboardRoute,
  apiRoute,
  tabMiddleware,
  apiServiceMiddleware,
} from '@/router/middleware';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'auth',
    component: () => import('@/layouts/auth'),
    redirect: { name: 'login' },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/account/auth/login'),
        meta: {
          requiredAuth: false,
          title: 'Login',
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () =>
          import(
            /* webpackChunkName: "forgot-password" */ '@/views/account/auth/forgot-password'
          ),
        meta: {
          requiredAuth: false,
          title: 'Forgot Password',
        },
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account'),
    meta: {
      requiredRoles: [],
      title: 'Account',
    },
  },
  {
    path: '/account/edit',
    name: 'account-edit',
    component: () => import('@/views/account/edit'),
    meta: {
      requiredRoles: [],
      title: 'Account Edit',
    },
  },
  {
    path: '/account/change-password',
    name: 'account-change-password',
    component: () =>
      import(
        /* webpackChunkName: "change-password" */ '@/views/account/ChangePassword'
      ),
    meta: {
      requiredRoles: [],
      title: 'Change Password',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard'),
    beforeEnter: dashboardRoute,
    children: [
      {
        path: 'sms',
        name: 'dashboard-sms',
        beforeEnter: tabMiddleware,
        component: () =>
          import(
            /* webpackChunkName: "dashboard-sms" */ '@/views/dashboard/sms.vue'
          ),
        meta: {
          requiredRoles: [],
          title: 'Dashboard SMS',
          groupActiveMenu: 'dashboard',
        },
      },
      {
        path: 'viber',
        name: 'dashboard-viber',
        beforeEnter: tabMiddleware,
        component: () =>
          import(
            /* webpackChunkName: "dashboard-viber" */ '@/views/dashboard/viber.vue'
          ),
        meta: {
          requiredRoles: [],
          title: 'Dashboard Viber',
          groupActiveMenu: 'dashboard',
        },
      },
      {
        path: 'messenger',
        name: 'dashboard-messenger',
        beforeEnter: tabMiddleware,
        component: () =>
          import(
            /* webpackChunkName: "dashboard-messenger" */ '@/views/dashboard/messenger.vue'
          ),
        meta: {
          requiredRoles: [],
          title: 'Dashboard Messenger',
          groupActiveMenu: 'dashboard',
        },
      },
      {
        path: 'api',
        name: 'dashboard-api',
        component: () => import('@/views/dashboard/api/index.vue'),
        beforeEnter: apiRoute,
        children: [
          {
            path: 'sms',
            name: 'dashboard-sms-api',
            beforeEnter: apiServiceMiddleware,
            component: () =>
              import(
                /* webpackChunkName: "dashboard-sms-api" */ '@/views/dashboard/api/sms.vue'
              ),
            meta: {
              requiredRoles: [],
              title: 'Dashboard SMS API',
              channel: 'api',
              groupActiveMenu: 'dashboard',
            },
          },
          {
            path: 'viber',
            name: 'dashboard-viber-api',
            beforeEnter: apiServiceMiddleware,
            component: () =>
              import(
                /* webpackChunkName: "dashboard-viber-api" */ '@/views/dashboard/api/viber.vue'
              ),
            meta: {
              requiredRoles: [],
              title: 'Dashboard Viber API',
              channel: 'api',
              groupActiveMenu: 'dashboard',
            },
          },
        ],
        meta: {
          groupActiveMenu: 'dashboard',
        },
      },
    ],
  },

  {
    path: '/not-found',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "not-found" */ '@/views/NotFound'),
    meta: {
      requiredAuth: false,
      title: 'Page not found',
    },
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/IS_AUTHENTICATED']) {
        store.dispatch('ui/setHideNavbar', true);
      }

      next();
    },
  },
  {
    path: '/dashboard-error',
    name: 'dashboard-error',
    component: () =>
      import(/* webpackChunkName: "not-found" */ '@/views/ErrorState'),
    meta: {
      requiredAuth: false,
      title: 'Dashboard Error',
    },
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/IS_AUTHENTICATED']) {
        store.dispatch('ui/setHideNavbar', true);
      }

      next();
    },
  },

  {
    path: '*',
    redirect: 'not-found',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
