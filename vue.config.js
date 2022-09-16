/* eslint-disable */
const env = process.env.NODE_ENV;
const appEnv = process.env.VUE_APP_ENV;
const prod = env === 'production';
const buildEnv = ` - ${appEnv}`;

const config = {
  lintOnSave: false,

  transpileDependencies: ['vuetify'],

  pages: {
    index: {
      entry: 'src/main.js',
      title: `m360${prod ? '' : buildEnv}`,
    },
  },

  pluginOptions: {
    
  },

  configureWebpack: {
    optimization: { minimize: true },
  },
};

console.log(`building ${env} with ${appEnv} environment`);
module.exports = config;
/* eslint-enable */
