import debug from 'debug';

export const logger = (namespace) => {
  if (process.env.VUE_APP_ENV === 'production') debug.disable();

  return debug(`m360-clientdashboard:${namespace}`);
};
