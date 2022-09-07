import BaseRequest from "../BaseRequest";
import {Address, GeneralResponse} from '../interfaces';

class TestRequest extends BaseRequest {
    constructor() {
        super('TestRequest');
    }

    async test(data: any): Promise<any> {
        return super.dispatch('test', data)
    }


}

export default new TestRequest()
