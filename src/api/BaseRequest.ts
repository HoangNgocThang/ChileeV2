import config from "../config";
import {$alert} from "../ui/Alert";
import storage from "../utils/storage";
import ConfigStore from '../store/ConfigStore';
import {getUniqueId} from "react-native-device-info";

export default class BaseRequest {
    private readonly className: string;

    constructor(className: string) {
        this.className = className;
        if (!config.apiUrl.endsWith('/api.php')) {
            $alert('End point must ends with api.php')
        }
    }

    dispatch(method: string, ...args: any): Promise<any> {
        const $args: Array<any> = [];
        for (const a of args) {
            $args.push(a);
        }

        const data = {
            className: this.className,
            method: method,
            args: $args,
            province: 18,
            uuid: getUniqueId()
        };

        return new Promise<any>(((resolve, reject) => {
            console.log('Request to '+ this.className + ':' + method, $args );
            const all = Promise.all([
                storage.getAuth()
            ]).then((allRes) => {
                const [auth] = allRes;
                const province = ConfigStore.getProvince();
                const token = auth ? auth.token : '';
                data.province = province ? province.id : 18;
                fetch(config.apiUrl, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(data),
                })
                    .then((response: any) => {
                        try {
                            const obj =  response.json();
                            return obj;
                        } catch (e1) {
                            console.error(response);
                            reject(e1);
                        }

                    })
                    .then((data: any) => {
                        if (data.code === 200) {
                            resolve(data.data)
                        } else {
                            // $alert(data.message);
                            reject(data.message);
                        }
                    }).catch(err => {
                    reject(err);
                    // if (__DEV__) {
                    //     $alert(err.message);
                    // } else {
                    //     $alert('Không thể kết nối đến máy chủ');
                    // }
                });
            });

        }))



    }
}
