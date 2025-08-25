import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kahitoz.zenkanji',
  appName: 'ZenKanji',
  webDir: 'out',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '430978898167-crns1otvqj1sjkna19el4cm5ful8odiq.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  android: {

    path: '../kahitoz-japanese-android-app/android',
  },
};

export default config;
