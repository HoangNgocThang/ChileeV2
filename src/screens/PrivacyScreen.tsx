import React, {Component} from 'react';
import {Text, View} from "react-native";
// @ts-ignore
import HTML from 'react-native-render-html';
import platform from "../themes/Variables/platform";
import {getRemoteConfigSync} from "../utils";
const ignoredStyles = ['display', 'width', 'height', 'font-family', 'padding', 'line-height', 'transform', 'text-align', 'background-color', 'white-space', 'text-decoration-style', 'text-decoration-color'];
import { WebView } from 'react-native-webview';
export default class PrivacyScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {

        }

    }

    render() {
        return (
            <WebView source={{ uri:  this.props.route.params.uri }} />
        )
    }
}
