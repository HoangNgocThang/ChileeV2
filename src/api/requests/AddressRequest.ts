import BaseRequest from "../BaseRequest";
import { Address, GeneralResponse } from '../interfaces';

class AddressRequest extends BaseRequest {
    constructor() {
        super('AddressRequest');
    }

    async get(): Promise<Array<Address>> {
        return super.dispatch('get')
    }

    async remove(addressId: number): Promise<GeneralResponse> {
        return super.dispatch('remove', addressId)
    }

    async save(address: Address): Promise<GeneralResponse> {
        return super.dispatch('save', address)
    }

    async setDefaultAddress(addressId: string): Promise<boolean> {
        return super.dispatch('setDefaultAddress', addressId)
    }

    async getProvinces(): Promise<any> {
        return super.dispatch('getProvinces')
    }

    async getDistricts(provinceId: any): Promise<any> {
        return super.dispatch('getDistricts', provinceId)
    }
}

export default new AddressRequest()
