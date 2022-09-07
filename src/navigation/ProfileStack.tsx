import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterSreen";
import OrderHistory from "../screens/OrderHistory";
import DetailOrderScreen from "../screens/DetailOrderScreen"
import AddressScreen from "../screens/AddressScreen";
import PassForgotScreen from "../screens/PassForgotScreen";
import PassRevertScreen from "../screens/PassRevertScreen";
import AddressFormScreen from "../screens/AddressFormScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import {StackOption} from "../ui/StackOption";
import SelectPickerScreen from "../screens/SelectPickerScreen";
import InfoScreen from "../screens/InfoScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import ShopDetailScreen from "../screens/ShopDetailScreen";
import ProductShopDetail from "../screens/ProductShopDetail";

const Stack = createStackNavigator();

export default function ProfileStack() {
    return (
            <Stack.Navigator>
                <Stack.Screen options={StackOption('Cá nhân', false)} name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen options={StackOption('Đăng nhập', false)} name="LoginScreen" component={LoginScreen} />
                <Stack.Screen options={StackOption('Đăng ký', false)} name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen options={StackOption('Quên mật khẩu', false)} name="PassForgotScreen" component={PassForgotScreen} />
                <Stack.Screen options={StackOption('Phục hồi mật khẩu', false)} name="PassRevertScreen" component={PassRevertScreen} />
                <Stack.Screen options={StackOption('Địa chỉ nhận hàng', false)} name="AddressScreen" component={AddressScreen} />
                <Stack.Screen  options={({route}) => {
                    return StackOption( route.params.title || 'Thêm địa chỉ', false)
                }} name="AddressFormScreen" component={AddressFormScreen} />
                <Stack.Screen
                    options={({route}) => {
                        return StackOption( route.params.title || 'SelectPicker', false)
                    }}
                    name="SelectPickerScreen" component={SelectPickerScreen} />
                <Stack.Screen options={StackOption('Đơn hàng của tôi', false)} name="OrderHistory" component={OrderHistory} />
                <Stack.Screen options={StackOption('Thông tin đơn hàng', false)} name="DetailOrderScreen" component={DetailOrderScreen} />
                <Stack.Screen options={({route}) => {
                    return StackOption(route.params.title || '', false, false)
                }}
                              name="PrivacyScreen" component={PrivacyScreen} />
                <Stack.Screen options={StackOption('Thông tin', false, false)}
                              name="InfoScreen" component={InfoScreen} />
                <Stack.Screen
                    options={({route}) => {
                        return StackOption(  'Thanh toán', false)
                    }}
                    name="PaymentScreen" component={PaymentScreen} />
                <Stack.Screen
                    options={({route}) => {
                        return StackOption(  'Lịch sử', false)
                    }}
                    name="PaymentHistoryScreen" component={PaymentHistoryScreen} />
                <Stack.Screen options={({route}) => {
                    return StackOption(route.params.title || 'Chi tiết shop', false)
                }} name="ShopDetailScreen" component={ShopDetailScreen}/>
                <Stack.Screen options={({route}) => {
                    return StackOption(route.params.title || 'Chi tiết', false)
                }} name="ProductShopDetail" component={ProductShopDetail}/>
            </Stack.Navigator>
    );
}
