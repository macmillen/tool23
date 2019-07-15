// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyD0oOzBDEDgfGEKmbl2CH0fHhhw735Xey4',
    authDomain: 'verleihapp.firebaseapp.com',
    databaseURL: 'https://verleihapp.firebaseio.com',
    projectId: 'verleihapp',
    storageBucket: 'verleihapp.appspot.com',
    messagingSenderId: '1038727690377',
    appId: '1:1038727690377:web:35fede7a14827134'
  }
};

export const SERVER_URL = 'http://localhost:3000';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
