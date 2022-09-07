import BaseRequest from "../BaseRequest";
import {Product, Campaign, PaginateOption, Category} from '../interfaces';
import {GeneralResponse} from "../interfaces";
export interface GetProductResponse {
    categories: Array<Category>,
    products: Array<Product>,
    hasNextPage: boolean
}

export interface GetParentCategoriesResponse {
    categories: Array<Category>
}

export interface GetSubCategoryResponse {
    sub_categories: Array<Category>
}

class CategoryRequest extends BaseRequest {
    constructor() {
        super('CategoryRequest');
    }

    getParentCategories(): Promise<GetParentCategoriesResponse> {
        return super.dispatch('getParentCategories');
    }

    getSubCategories(parentId: number): Promise<GetSubCategoryResponse> {
        return super.dispatch('getSubCategories', parentId);
    }

    getProducts(categoryId: number, options: PaginateOption): Promise<GetProductResponse> {
        return super.dispatch('getProducts', categoryId, options);
    }
}

export default new CategoryRequest()
