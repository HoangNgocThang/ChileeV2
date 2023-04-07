/**
 * @format
 */

 const isProd = !__DEV__;

 if (isProd) {
     const noop = () => {};
     //console.log('[INFO]', 'Disable console in production');
     console.log = noop;
     console.info = noop;
 }
 import 'react-native-gesture-handler';
 import {AppRegistry} from 'react-native';
 import App from './src/App';
 import {name as appName} from './app.json';
 import messaging from '@react-native-firebase/messaging';

 messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
  AppRegistry.registerComponent(appName, () => App);
