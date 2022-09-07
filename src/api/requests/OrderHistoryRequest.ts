import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse} from '../interfaces';

export interface OrderHistoryResponse {
    orders: Array<any>,
    hasNextPage: boolean
}

class OrderHistoryRequest extends BaseRequest {
    constructor() {
        super('OrderHistoryRequest');
    }

    async get(data: any): Promise<OrderHistoryResponse> {
        return super.dispatch('get', data)
    }

}

export default new OrderHistoryRequest()
