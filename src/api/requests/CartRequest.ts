import BaseRequest from "../BaseRequest";
import {Product, Campaign, Cart, CartItem, FeeData, GeneralResponse} from '../interfaces';


export interface CartGetResponse {
    cart: Cart,
    items: Array<CartItem>,
    fee: FeeData
}

export interface UpdateQuantityResponse {
    err_code: number,
    message: string,
    amount: number,
    amount_origin: number,
    price: number,
    price_origin: number
}

class CartRequest extends BaseRequest {
    constructor() {
        super('CartRequest');
    }

    async get(): Promise<CartGetResponse> {
        return super.dispatch('get');
    }

    async add(item: CartItem): Promise<any> {
        return super.dispatch('add', item);
    }

    async remove(cartItemId: number): Promise<GeneralResponse> {
        return super.dispatch('remove', cartItemId);
    }

    async updateQuantity(cartItemId: number, quantity: number): Promise<UpdateQuantityResponse> {
        return super.dispatch('updateQuantity', cartItemId, quantity);
    }

    async amount(): Promise<GeneralResponse> {
        return super.dispatch('amount');
    }
}

export default new CartRequest()
