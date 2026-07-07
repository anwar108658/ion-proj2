import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', // Agar aapne package name change kiya hai to wo likhein
  appName: 'todoUI',
  webDir: 'www',
  plugins: {
    GoogleSignIn: {
      scopes: ['profile', 'email', 'https://google.com'],
      // Aapki JSON string se extracted client_id yahan paste kar di hai
      serverClientId: '42163742929-prljatpmgokpedijts35qdut0bnoslui.apps.googleusercontent.com',
    }
  }
};

export default config;
