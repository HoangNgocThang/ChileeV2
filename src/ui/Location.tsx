import {Text, View} from "react-native";
import React, {Component} from "react";
import CartStore from '../store/CartStore';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ConfigStore from "../store/ConfigStore";
import config from "../config";


export interface State {
    count: number
}
export  default class Location extends Component<any>{
    private _isMounted = false;
    constructor(props: any) {
        super(props);
        this.state = {
            value: ConfigStore.getProvince() || ""
        }
    }

    componentDidMount(): void {
        this._isMounted = true;
        ConfigStore.onChange(() => {
            if (this._isMounted) {
                this.setState({value: ConfigStore.getProvince()})
            }

        })
    }

    // componentWillUnmount(): void {
    //     this._isMounted = false;
    // }

    render() {
        return (
            <View style={{marginLeft: 10, flexDirection: "row", alignItems: "center"}}>
                <MaterialCommunityIcons name="map-marker" color={config.textColor} size={14} />
                <Text style={{fontSize: 13, color: config.textColor, marginLeft: 5}}>{this.state.value.name}</Text>
            </View>
        )
    }

}
