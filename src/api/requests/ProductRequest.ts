import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse} from '../interfaces';
export interface CalculatePriceResponse {
    err_code: number,
    price: number,
    amount: number,
    amount_origin: number,
}
class ProductRequest extends BaseRequest {
    constructor() {
        super('ProductRequest');
    }

    async show(id: number): Promise<any> {
        return super.dispatch('show', id)
    }

    async calculatePrice(productId: number, quantity: number, pack: any): Promise<CalculatePriceResponse>  {
        return super.dispatch('calculatePrice', productId, quantity, pack)
    }
}

export default new ProductRequest()
