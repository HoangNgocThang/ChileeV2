import React, {Component} from 'react';
import {Text, View} from "react-native";
// @ts-ignore
import { WebView } from 'react-native-webview';
import config from "../config";
import storage from "../utils/storage";
import {getRemoteConfigSync} from "../utils";
/**
 * File này để copy/paste khi tạo màn hình mới cho tiện
 */
export default class PaymentHistoryScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);

    }

    async componentDidMount() {

    }

    render() {
        let remoteConfig = getRemoteConfigSync();
        let auth = this.props.route.params.auth;
        console.log(auth);
        return (
            <WebView source={{ uri:  remoteConfig.payment.historyUrl+'?token='+auth.token  }} />
        )
    }
}
