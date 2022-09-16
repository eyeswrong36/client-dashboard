import store from '../store';
import router from './routes';
import goTo from 'vuetify/lib/services/goto';
import { getJWT } from '@/utils/request';

const env = process.env.NODE_ENV;
const appEnv = process.env.VUE_APP_ENV;
const prod = env === 'production';
const buildEnv = ` - ${appEnv}`;
const authRoutes = ['login', 'forgot-password'];

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = !!getJWT();
  const isAccessingAuthRoutes = !(authRoutes.indexOf(to.name) === -1);

  // Only for initial load
  if (!from.matched.length) {
    store.dispatch('ui/setLoading', true);

    if (isAuthenticated) {
      await Promise.all([
        store.dispatch('account/getAccountInfo'),
        store.dispatch('dashboard/getServices'),
      ]);
    }
  }

  if (
    (authRoutes.indexOf(from.name) !== -1 && !isAccessingAuthRoutes) ||
    !isAccessingAuthRoutes
  ) {
    store.dispatch('ui/setHideNavbar', false);
  }

  // const requiredRoles = to.matched.some((r) => r.meta.requiredRoles);

  if (!isAuthenticated && to.meta.requiredAuth !== false) {
    next({ name: 'login' });
  } else if (isAuthenticated && isAccessingAuthRoutes) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  // Always scroll user to the top after navigation change
  goTo(0, { duration: 300, offset: 0, easing: 'easeInOutQuad' });

  const pageTitle = `m360${prod ? '' : buildEnv}`;

  if (!to.meta?.skipTitle) {
    if (to.meta?.reverseTitle) {
      document.title = `${to.meta.title} - ${pageTitle}`;
    } else if (to.meta?.title) {
      document.title = `${pageTitle} - ${to.meta.title}`;
    } else {
      document.title = pageTitle;
    }
  }
});

router.beforeResolve(async (to, from, next) => {
  if (authRoutes.indexOf(to.name) !== -1) {
    store.dispatch('ui/setHideNavbar', true);
  }

  store.dispatch('auth/setLoading', false);
  store.dispatch('ui/setLoading', false);

  next();
});
