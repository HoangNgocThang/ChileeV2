import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse, Notification} from '../interfaces';
import {getDeviceId, getUniqueId} from "react-native-device-info";
import {Platform} from "react-native";
import config from "../../config";

class NotificationRequest extends BaseRequest {
    constructor() {
        super('NotificationRequest');
    }

    async get(page = 1): Promise<Array<Notification>> {
        return super.dispatch('get', page)
    }

    async show(id: number): Promise<Notification> {
        return super.dispatch('show', id)
    }

    async register(token: string): Promise<GeneralResponse> {
        let device = {
            uuid: getUniqueId(),
            platform: Platform.OS,
            version: getDeviceId(),
            app_version: config.version,
            app_code: config.versionCode,
            token: token
        };

        return super.dispatch('register', device);
    }


}

export default new NotificationRequest()
