import {Text, View} from "react-native";
import React, {Component} from "react";
import CartStore from '../store/CartStore';

export interface Prop {
    count: number,
    name: string
}
export interface State {
    count: number
}
export  default class CartBadge extends Component<Prop, State>{
    private _isMounted = false;
    constructor(props: any) {
        super(props);
        this.state = {
            count: CartStore.count()
        }
    }

    componentDidMount(): void {
        this._isMounted = true;
        CartStore.onChange(() => {
            if (this._isMounted) {
                this.setState({count: CartStore.count()})
            }

        })
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    render() {
        if (this.state.count === 0) {
            return null;
        }

        return <View
            style={{
                // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                position: 'absolute',
                right: -6,
                top: -3,
                zIndex: 2,
                backgroundColor: '#FE3D2E',
                borderRadius:7,
                width: 14,
                height: 14,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
                {this.state.count}
            </Text>
        </View>
    }

}
