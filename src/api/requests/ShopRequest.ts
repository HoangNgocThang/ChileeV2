import BaseRequest from "../BaseRequest";
import {Address, CategoryProduct, GeneralResponse, Product, Shop} from '../interfaces';

export interface ShopHomeData {
    sliders: Array<any>,
    shop: Shop,
    categories: Array<CategoryProduct>
}

export interface ShopProductData {
    products: Array<Product>,
    hasNextPage: boolean
}

export interface ShopCategoryData {
    categories: Array<CategoryProduct>
}

class ShopRequest extends BaseRequest {
    constructor() {
        super('ShopRequest');
    }

    async getHomeData(shopId: number): Promise<ShopHomeData> {
        return super.dispatch('getHomeData', shopId)
    }

    async getCategories(shopId: number): Promise<ShopCategoryData> {
        return super.dispatch('getCategories', shopId)
    }

    async getProducts(page: number, type: number, shopId: number): Promise<ShopProductData> {
        return super.dispatch('getProducts', page, type, shopId)
    }

}

export default new ShopRequest()
