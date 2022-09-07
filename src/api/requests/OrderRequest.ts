import BaseRequest from "../BaseRequest";
import {GeneralResponse} from '../interfaces';


class OrderRequest extends BaseRequest {
    constructor() {
        super('OrderRequest');
    }

    async get(data: any): Promise<Array<any>> {
        return super.dispatch('get', data)
    }


    async show(code: string): Promise<any> {
        return super.dispatch('show', code)
    }


    async create(data: any): Promise<GeneralResponse> {
        return super.dispatch('create', data)
    }

    async createV2(data: any): Promise<GeneralResponse> {
        return super.dispatch('createV2', data)
    }

    async createV3(data: any): Promise<GeneralResponse> {
        return super.dispatch('createV3', data)
    }

    async createV4(data: any): Promise<GeneralResponse> {
        return super.dispatch('createV4', data)
    }

    async cancel(orderCode: string): Promise<GeneralResponse> {
        return super.dispatch('cancel', orderCode)
    }

    /**
     * @deprecated Please use getShipFeeV2
     * @param data
     */
    async getShipFee(data: any): Promise<number> {
        return super.dispatch('getShipFee', data)
    }

    async getShipFeeV2(data: any): Promise<number> {
        return super.dispatch('getShipFeeV2', data)
    }

    async getSharedShipFee(data:any): Promise<any> {
        return super.dispatch('getSharedShipFee', data)
    }

    async createSharedGroup(data: any): Promise<any> {
        return super.dispatch('createSharedGroup', data)
    }

    async joinSharedGroup(data: any): Promise<any> {
        return super.dispatch('joinSharedGroup', data)
    }

    async leaveSharedGroup(groupId: number): Promise<any> {
        return super.dispatch('leaveSharedGroup', groupId)
    }
}

export default new OrderRequest()
