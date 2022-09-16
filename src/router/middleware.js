import store from '../store';
import { toLowerCase } from '@/utils/helpers';
import { format } from 'date-fns';

/**
 * Set the default redirection Tab for the dashboard link menu
 * based on the User Services access.
 */
export const dashboardRoute = (to, from, next) => {
  const TAB_MENU = store.getters['dashboard/GET_TAB_MENU'];
  if (to.name === 'dashboard')
    for (const tab of TAB_MENU) {
      if (tab.show) {
        console.log('routeName', tab.routeName);
        next({ name: tab.routeName });
        break;
      }
    }

  // init date filter
  store.commit('dashboard/SET_DATE_FILTER', {
    startDate: format(new Date(), 'Y-MM-01'),
    endDate: format(new Date(), 'Y-MM-dd'),
  });

  next();
};

/**
 * Will prevent malicious User to accessing the Channel/Service or Tab
 * that are not included on the User Services access.
 * e.g. directly entering the link or path to the browser
 */
export const tabMiddleware = (to, from, next) => {
  const TAB_MENU = store.getters['dashboard/GET_TAB_MENU'];

  for (const tab of TAB_MENU) {
    if (to.name === tab.routeName && !tab.show) {
      next('/not-found');
      break;
    }
  }

  next();
};

/**
 * Set the default API Tab redirection based on the User Services access
 * e.g. Service SMS|Viber
 */
export const apiRoute = (to, from, next) => {
  const services = Object.values(
    store.getters['dashboard/GET_USER_SERVICES']['api'] || {}
  );
  if (to.name === 'dashboard-api') {
    const serviceName = services[0];
    const serviceRouteNam = serviceName
      ? `dashboard-${toLowerCase(serviceName)}-api`
      : 'not-found';

    next({ name: serviceRouteNam });
  }

  next();
};

/**
 * Will prevent malicious User to accessing the Service
 * that are not included on the User Services access.
 * e.g. directly entering the link or path to the browser
 */
export const apiServiceMiddleware = (to, from, next) => {
  const services = Object.values(
    store.getters['dashboard/GET_USER_SERVICES']['api'] || {}
  );
  const servicesRoutes = services.map(
    (service) => `dashboard-${toLowerCase(service)}-api`
  );

  if (!servicesRoutes.includes(to.name)) {
    next('/not-found');
  }

  next();
};
