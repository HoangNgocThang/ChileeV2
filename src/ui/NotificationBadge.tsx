import {Text, View} from "react-native";
import React, {Component} from "react";
import CartStore from '../store/CartStore';
import storage from "../utils/storage";
import {getRemoteConfigSync} from "../utils";
import NotificationStore from "../store/NotificationStore";

export interface Prop {
    count: number,
    name: string
}
export interface State {
    unread: number
}
export  default class Badget extends Component<Prop, State>{
    private _isMounted = false;
    constructor(props: any) {
        super(props);
        this.state = {
            unread: 0
        }
    }

    async componentDidMount() {
        let config = getRemoteConfigSync();

        this.setState({
            unread: config.notification.unread
        });

        NotificationStore.setUnread(config.notification.unread);
        NotificationStore.onChange((unread: number) => {
            this.setState({
                unread: unread
            });
        });
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    render() {
        if (this.state.unread === 0) {
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
                {this.state.unread}
            </Text>
        </View>
    }

}
