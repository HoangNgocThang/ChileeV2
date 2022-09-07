import React, {Component} from 'react';
import {Text, View} from "react-native";
// @ts-ignore

/**
 * File này để copy/paste khi tạo màn hình mới cho tiện
 */
export default class CopyPasteScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {

        }
    }


    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>CopyPasteScreen</Text>

            </View>
        )
    }
}
