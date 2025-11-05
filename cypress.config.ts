import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      on('before:run', () => {
        if (!process.env.CI) {
          require('cypress-plugin-retries/lib/plugin')(on);
        }
      });
      on('task', {
        checkServer() {
          return new Promise((resolve) => {
            require('is-port-reachable')('localhost', 4000).then((reachable) =>
              resolve(reachable)
            );
          });
        }
      });

      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 30000,
    responseTimeout: 30000,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0
    },
    experimentalOriginDependencies: true
  },
  env: {
    apiUrl: 'http://localhost:4000/api',
    local: true
  }
});
