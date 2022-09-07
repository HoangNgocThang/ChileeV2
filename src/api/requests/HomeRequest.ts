import BaseRequest from "../BaseRequest";
import {AboutInfo, Campaign, Category, PaginateOption, Product, RemoteConfig, Shop} from '../interfaces';


export interface FrontResponse {
    sliders: Array<any>,
    campaigns: Array<Campaign>,
    suggestion: Array<Product>,
    featured: Array<Category>
}

export interface ShopDetailResponse {
    err_code: number,
    message: string,
    shop: Shop,
    products: Array<Product>
}

export interface CategoryV2Response {
    products: Array<Product>,
    banner: any,
    sliders: Array<any>
}


class HomeRequest extends BaseRequest {
    constructor() {
        super('HomeRequest');
    }

    async getFrontData(): Promise<FrontResponse> {
        return super.dispatch('getFrontData')
    }

    async getFrontDataV2(): Promise<FrontResponse> {
        return super.dispatch('getFrontDataV2')
    }

    async getProductDetail(id: string): Promise<Product> {
        return super.dispatch('getProductDetail', id)
    }

    /**
     * @deprecated See ConfigRequest::getConfigs
     * @param device
     */
    async getConfigs(device: any): Promise<RemoteConfig> {
        return super.dispatch('getConfigs', device)
    }

    async getProvinceConfigs(): Promise<any> {
        return super.dispatch('getProvinceConfigs')
    }

    async getCategories(): Promise<Array<Category>> {
        return super.dispatch('getCategories')
    }

    async getProductByCategory(id: string, option?: PaginateOption): Promise<Array<Product>> {
        return super.dispatch('getProductByCategory', id, option)
    }

    async getProductByCategoryV2(id: number, option?: PaginateOption): Promise<CategoryV2Response> {
        return super.dispatch('getProductByCategoryV2', id, option)
    }

    async search(keyword: string, option?: PaginateOption): Promise<Array<Product>> {
        return super.dispatch('search', keyword, option);
    }

    async getAboutInfo(): Promise<Array<AboutInfo>> {
        return super.dispatch('getAboutInfo');
    }

    async getGroupBySharedId(id: number, keyword: string = '', showMyGroup = false): Promise<Array<any>> {
        return super.dispatch('getGroupBySharedId', id, keyword, showMyGroup);
    }

    async getGroupMembers(groupId: number): Promise<any> {
        return super.dispatch('getGroupMembers', groupId);
    }

    async getSharedProduct (): Promise<any> {
        return super.dispatch('getSharedProduct');
    }

    async getProductByShop (shopId: number): Promise<ShopDetailResponse> {
        return super.dispatch('getProductByShop', shopId);
    }
}

export default new HomeRequest()
