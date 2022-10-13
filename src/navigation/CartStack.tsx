import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CartScreen from "../screens/CartScreen";
import config from "../config";
import AddressScreen from "../screens/AddressScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import AddressFormScreen from "../screens/AddressFormScreen";
import {StackOption} from "../ui/StackOption";
import SelectPickerScreen from "../screens/SelectPickerScreen";
import PaymentScreen from "../screens/PaymentScreen";
import ShopDetailScreen from "../screens/ShopDetailScreen";
import ProductShopDetail from "../screens/ProductShopDetail";
import CheckoutSucceedScreen from '../screens/CheckoutSucceedScreen';

const Stack = createStackNavigator();

function getOption(title: string, headerLeft = true) {
    return {
        title: title,
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: config.primaryColor,

            //alignContent: "center"
        },
        headerTintColor: config.textColor,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };
}

export default function CartStack() {
    return (
            <Stack.Navigator>
                <Stack.Screen
                    options={{
                        title: "Giỏ hàng",
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: config.primaryColor,

                            //alignContent: "center"
                        },
                        headerTintColor: config.textColor,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        }
                    }}
                    name="CartScreen" component={CartScreen} />
                <Stack.Screen
                    options={{
                        title: "Địa chỉ nhận hàng",
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: "#fff",

                            //alignContent: "center"
                        },
                        headerTintColor: config.textColor,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        }
                    }}
                    name="AddressScreen" component={AddressScreen} />
                <Stack.Screen
                    options={getOption('Xác nhận thông tin đơn hàng', false)}
                    name="CheckoutScreen" component={CheckoutScreen} />
                <Stack.Screen
                    options={({route}) => {
                        return StackOption( 'Thông tin đơn hàng', false, false)
                    }}
                    name="CheckoutSucceedScreen" component={CheckoutSucceedScreen} />
                <Stack.Screen  options={({route}) => {
                    return getOption( route.params.title || 'Thêm địa chỉ', false)
                }} name="AddressFormScreen" component={AddressFormScreen} />

                <Stack.Screen
                    options={({route}) => {
                        return StackOption( route.params.title || 'SelectPicker', false)
                    }}
                    name="SelectPickerScreen" component={SelectPickerScreen} />
                 <Stack.Screen
                        options={({route}) => {
                            return StackOption( 'Thanh toán', false)
                        }}
                    name="PaymentScreen" component={PaymentScreen} />
                <Stack.Screen options={({route}) => {
                    return StackOption(route.params.title || 'Chi tiết shop', false)
                }} name="ShopDetailScreen" component={ShopDetailScreen}/>
                <Stack.Screen options={({route}) => {
                    return StackOption(route.params.title || 'Chi tiết', false)
                }} name="ProductShopDetail" component={ProductShopDetail}/>
            </Stack.Navigator>
    );
}
