import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'todoUI',
  webDir: 'www',
  plugins: {
    GoogleSignIn: {
      // Only the web client ID is needed here
      clientId: '42163742929-prljatpmgokpedijts35qdut0bnoslui.apps.googleusercontent.com',
      // The Drive scope that gives you hidden app folder access (like WhatsApp)
      scopes: ['https://www.googleapis.com/auth/drive.appdata']
    }
  }
};

export default config;