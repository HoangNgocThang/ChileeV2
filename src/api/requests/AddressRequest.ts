import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse} from '../interfaces';

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

}

export default new AddressRequest()
