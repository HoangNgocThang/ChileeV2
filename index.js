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
 import {Alert, AppRegistry} from 'react-native';
 import App from './src/App';
 import {name as appName} from './app.json';
 import messaging from '@react-native-firebase/messaging';
 import React from 'react';

 messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // Alert.alert('')
  });
  function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      console.log('App has been launched in the background by iOS, ignore')
      return null;
    }
    return <App />
  }
  
  AppRegistry.registerComponent(appName, () => HeadlessCheck);