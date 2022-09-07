import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse, PaginateOption, Product} from '../interfaces';

export interface SearchResponse {
    products: Array<Product>,
    hasNextPage: boolean
}

class SearchRequest extends BaseRequest {
    constructor() {
        super('SearchRequest');
    }

    async search(keyword: string, option?: PaginateOption): Promise<SearchResponse> {
        return super.dispatch('search', keyword, option);
    }

}

export default new SearchRequest()
