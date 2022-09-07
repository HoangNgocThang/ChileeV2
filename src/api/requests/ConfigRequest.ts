import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse, RemoteConfig} from '../interfaces';

class ConfigRequest extends BaseRequest {
    constructor() {
        super('ConfigRequest');
    }

    async getConfigs(device: any): Promise<RemoteConfig> {
        return super.dispatch('getConfigs', device)
    }

    async getProvinceConfigs(): Promise<any> {
        return super.dispatch('getProvinceConfigs')
    }
}

export default new ConfigRequest()
