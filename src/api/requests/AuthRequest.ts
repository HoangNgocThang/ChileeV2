import BaseRequest from "../BaseRequest";
import {GeneralResponse, User} from "../interfaces";

export interface LoginResponse {
    err_code: number,
    user: User,
    token: string,
    message: string
}

export interface RegisterPayload {
    email: string,
    name: string
    password: string
}

export class AuthRequest extends BaseRequest {
    constructor() {
        super("AuthRequest");
    }

    async forgot(email: string): Promise<LoginResponse> {
        return super.dispatch('forgot', email)
    }

    // async login(email: string, password: string): Promise<LoginResponse> {
    //     return super.dispatch('login', email, password)
    // }

    async login(deviceId: string): Promise<LoginResponse> {
        return super.dispatch('login', deviceId)
    }

    async register(params: RegisterPayload): Promise<LoginResponse> {
        return super.dispatch('register', params)
    }

    async loginFacebook(accessToken: string): Promise<LoginResponse> {
        return super.dispatch('loginFacebook', accessToken)
    }

    async loginGoogle(idToken: string): Promise<LoginResponse> {
        return super.dispatch('loginGoogle', idToken)
    }

    async loginApple(token: string): Promise<LoginResponse> {
        return super.dispatch('loginApple', token);
    }

    async getProfile(): Promise<any> {
        return super.dispatch('getProfile')
    }
}

export default new AuthRequest()
