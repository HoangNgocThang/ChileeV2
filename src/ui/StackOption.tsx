import config from "../config";
import {Text, TouchableOpacity, View} from "react-native";
import {navigate} from "../navigation/RootNavigation";
import CartBadge from "./CartBadge";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import Location from "./Location";
import ConfigStore from "../store/ConfigStore";
import NotificationBadge from "./NotificationBadge";
export function StackOption(title: string, headerLeft = true, headerRight = true, props? : object) {
    return {
        title: title,
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: config.primaryColor,

            //alignContent: "center"
        },
        headerRight: headerRight ? () => (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                {props && props.showNoti &&
                    <TouchableOpacity style={{marginRight: 20}} onPress={() => navigate('NotificationsScreen')}>
                        <NotificationBadge name={'topright'} count={1}/>
                        <MaterialCommunityIcons name="bell-outline" color={config.textColor} size={22} />
                    </TouchableOpacity>
                }
                <TouchableOpacity style={{marginRight: 15}} onPress={() => navigate('CartScreen')}>
                    <CartBadge name={'topright'} count={0}/>
                    <MaterialCommunityIcons name="cart-outline" color={config.textColor} size={20} />
                </TouchableOpacity>
            </View>
        ) : undefined,
        headerLeft: headerLeft ? () => (
            <TouchableOpacity onPress={() => navigate('SelectPickerScreen', {
                title: 'Chọn khu vực mua hàng',
                onChange: (item) => {
                   ConfigStore.setProvince(item)
                }
            })}>
                <Location/>
            </TouchableOpacity>
        ) : undefined,
        headerTintColor: config.textColor,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        ...props
    };
}
