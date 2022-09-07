/**
 * @author quantm.tb@gmail.com
 * @date 6/14/2020.
 */

import {NativeModules, NativeEventEmitter} from 'react-native';
import {Platform} from "react-native";
const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const MrBen = NativeModules.MrBen;
class FCMModule {
    PERMISSION_GRANTED = 'GRANTED';
    PERMISSION_DENIED = 'DENIED';

    messageListeners: Array<any> = []

    constructor() {

    }

    getInitialNotification(): Promise<any> {

        return new Promise<any>(((resolve, reject) => {

            if (isIos) {
                MrBen.getInitialNotification(function (data: any) {
                    // console.log({noti: data});
                    if (data) {
                        console.log({title: data.title, cid: data.cid})
                    }

                    resolve(data);
                })
            } else {
                Promise.all([
                    MrBen.getNotificationScreen(),
                    MrBen.getNotificationProps()
                ]).then((r: any) => {
                    if (r[0]) {
                        let screen = r[0];
                        let props = r[1];
                        resolve({screen, props});
                    }

                })
            }
        }))

    }


    getToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!MrBen) {
                reject('MrBen is not available');
                return;
            }

            if (isIos) {
                MrBen.getRemoteToken((error:any, token:string) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(token);
                    }
                });
                return;
            }

            MrBen.getRemoteToken().then((token: string) => {
				if (token) {
					resolve(token);
				} else {
					reject('Token not found');
				}
			});

        })
    }

    requestPermission(cb: any) {
        if (isIos) {
            MrBen.requestPermission(cb);
        } else {
            cb(this.PERMISSION_GRANTED);
        }
    }

    onMessageReceived(callback: any) {
        this.messageListeners.push(callback)
    }
}

export const fcm = new FCMModule();

/*
if (MrBen) {
    const eventEmitter = new NativeEventEmitter(NativeModules.MrBen);
    if (isAndroid) {
        eventEmitter.addListener('FCM.onMessageReceived', (event) => {
            //  alert(event.cid);
            console.log({noti: event})
            fcm.messageListeners.forEach((cb: any) => {
                cb(event);
            });
            //console.log({event})
        });
    }
}
*/



