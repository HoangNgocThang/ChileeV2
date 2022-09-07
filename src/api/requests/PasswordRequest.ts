import BaseRequest from "../BaseRequest";
import {GeneralResponse, User} from "../interfaces";


export class PasswordRequest extends BaseRequest {
    constructor() {
        super("PasswordRequest");
    }

    async forgot(email: string): Promise<GeneralResponse> {
        return super.dispatch('forgot', email)
    }

    async revert(email: string, code: string, newPassword: string): Promise<GeneralResponse> {
        return super.dispatch('revert', email, code, newPassword)
    }

}

export default new PasswordRequest()
