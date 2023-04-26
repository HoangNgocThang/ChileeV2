/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param  n: length of decimal
 * @param  x: length of whole part
 * @param  s: sections delimiter
 * @param  c: decimal delimiter
 */
import {Product, ProductPrice, RemoteConfig} from "../api/interfaces";
import storage from "./storage";
import HomeRequest from "../api/requests/HomeRequest";
import {$alert} from "../ui/Alert";
import {getDeviceId, getUniqueId} from 'react-native-device-info'
import config from "../config";
import {Platform} from "react-native";
import CartStore from '../store/CartStore';
import SearchStore from "../store/SearchStore";
import ConfigStore from "../store/ConfigStore";
import {getProvinces} from "../assets/provinces";
import moment from 'moment';
import ConfigRequest from "../api/requests/ConfigRequest";
export function numberFormat(v: any, n: any = 0, x = 3, s= ',', c = null ) {
    if (!v) {
        return '0đ';
    }
    v = Number(v);
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = v.toFixed(Math.max(0, ~~n));

    let r = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    return r + 'đ';
};

export async function setRemoteConfig(config: RemoteConfig)  {
    return storage.set('app.configs', config);
}


let auth: any;
let appConfigs: RemoteConfig;
let provinces: any;

export async function getRemoteProvinces() {
    return getProvinces();
}

export function getRemoteProvincesSync() {
     return getProvinces();
}


export async function getRemoteConfig(): Promise<RemoteConfig> {

    if (appConfigs) {
        console.log('Loaded config from memory')
        return appConfigs;
    }

    try {
        await CartStore.unserialize();
        await SearchStore.unserialize();
        await ConfigStore.unserialize();
        auth = await storage.getAuth();
        let devices = {
            uuid: getUniqueId(),
            platform: Platform.OS,
            version: getDeviceId(),
            app_version: config.version,
            app_code: config.versionCode,
        };
        ///await getRemoteProvinces();
        appConfigs =  await ConfigRequest.getConfigs(devices);

        return appConfigs;
    } catch (err) {
        console.error(err);
        appConfigs = await storage.get('app.configs');
        // if (__DEV__) {
        //     $alert(err.message);
        // } else {
        //     if (!appConfigs) {
        //         $alert('Không thể kết nối đến máy chủ.Mã lỗi 01');
        //     }
        // }
    }

    return appConfigs;
}

export function getRemoteConfigSync(): RemoteConfig {
    return appConfigs;
}

export function getAuthSync() {
    return auth;
}

export function setAuthSync($auth: any) {
    auth = $auth;
}

export function isStrEmptyOrSpaces(str: string){
    return str === null || str.match(/^ *$/) !== null;
}

export function isDisplayNameValid(name: string) {
    if (isStrEmptyOrSpaces(name)) {
        return false;
    }
    return /[^\w\.\-]/.test(name)
}

export function isPhoneValid(phone: string) {
    return /^\d{8,13}$/.test(phone);
}

export function isEmailValid(email:string) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function hasShareInfo(product: Product) {
    if (!product.shareable) {
        return false;
    }

    if (!product.shareInfo || product.shareInfo.length === 0) {
        return false;
    }

    return true;
}

export function isEmpty(obj: any) {
    if (!obj) {
        return true;
    }

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;

}

export function timeRange2Str(start: number, end:number) {
    const a = moment(start * 1000).format('DD/MM HH:mm');
    if (!end) {
        return 'Từ ' + a;
    }

    const b = moment(end * 1000).format('DD/MM HH:mm');
    return 'Từ ' + a + ' đến ' + b;
}

export function debounce(func, wait = 500, immediate = false) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const holderImage = require('../assets/holder.png');

export function thumbHolder(thumb: any) {
    if (thumb) {
        if (!thumb.uri) {
            thumb.uri = '';
        }
        if (!thumb.uri.startsWith('https://') && !thumb.uri.startsWith('http://')) {
            thumb = holderImage;
        }
    } else {
        thumb = holderImage;
    }

    return thumb;
}

export function cloneObject(a: any) {
    return JSON.parse(JSON.stringify(a));
}


export function intVal(v: any, defaultValue = 0): number {
    return parseInt(v) || 0;
}

export function validQuantity(v: any): number {
    let quantity = parseInt(v) || 1;
    if (quantity <= 0) {
        quantity = 1;
    }

    if (quantity > 100000) {
        quantity = 100000
    }

    return quantity;
}


export async function waitForRef(parent: any, key: string) {

    return new Promise(((resolve, reject) => {
        let i = 0;
        function callee() {
            console.log('waitForRef:' + i);
            i++;
            if (i > 20) {
                reject(new Error("WaitingForRef Timeout"));
                return;
            }

            if (parent[key]) {
                console.log('waitForRef:Succeed')
                resolve(parent[key]);
            } else {
                setTimeout(callee, 500)
            }
        }

        setTimeout(callee, 500);
    }))

}


export function isScrollCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
}
