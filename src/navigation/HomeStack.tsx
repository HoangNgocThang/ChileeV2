import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
// @ts-ignore
import PhotoScreen from "../screens/PhotoScreen";
import ListProductScreen from "../screens/ListProductScreen";
import SearchScreen from "../screens/SearchScreen";
import CheckoutSucceedScreen from "../screens/CheckoutSucceedScreen";
import {StackOption} from '../ui/StackOption';
import messages from "../locale/messages";
import SelectPickerScreen from "../screens/SelectPickerScreen";
import config from "../config";
import ListGroupScreen from "../screens/ListGroupScreen";
import DetailGroupScreen from "../screens/DetailGroupScreen";
import GroupCreateScreen from "../screens/GroupCreateScreen";
import AddressScreen from "../screens/AddressScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import DetailNotiScreen from "../screens/DetailNotiScreen";
import AddressFormScreen from "../screens/AddressFormScreen";
import {getRemoteConfigSync} from "../utils";
import ShopDetailScreen from "../screens/ShopDetailScreen";
import ProductShopDetail from "../screens/ProductShopDetail";

const Stack = createStackNavigator();

export default function HomeStack() {

    return (
        <Stack.Navigator>

            <Stack.Screen
                options={({route}) => {
                    return StackOption(messages.title,false, true, {headerStyle: {
                        backgroundColor: config.primaryColor, elevation:0}, showNoti: true})
                }}
                name="Home" component={HomeScreen}/>

            <Stack.Screen
                options={({route}) => {
                    return StackOption('Chi tiết', false, true)
                }}
                name="DetailProduct" component={ProductDetailScreen}/>
            <Stack.Screen
                options={({route}) => {
                    return StackOption('Tạo nhóm', false, true)
                }}
                name="GroupCreateScreen" component={GroupCreateScreen}/>
            <Stack.Screen
                name="PhotoScreen" component={PhotoScreen}/>
            <Stack.Screen
                options={({route}) => {
                    return StackOption(route.params.title || messages.title, false)
                }}
                name="ListProductScreen" component={ListProductScreen}/>
            <Stack.Screen
                name="SearchScreen" component={SearchScreen}
                options={({route}) => {
                        return StackOption( 'Tim kiem', false, false, {headerShown: false})
                    }}
                    />

                <Stack.Screen
                    options={({route}) => {
                        return StackOption( 'Thông tin đơn hàng', false, false)
                    }}
                    name="CheckoutSucceedScreen" component={CheckoutSucceedScreen} />
                <Stack.Screen
                    options={({route}) => {
                        return StackOption( route.params.title || 'SelectPicker', false)
                    }}
                    name="SelectPickerScreen" component={SelectPickerScreen} />
            <Stack.Screen
                options={({route}) => {
                    return StackOption(route.params.title||'Danh sách nhóm', false, false)
                }}
                name="ListGroupScreen" component={ListGroupScreen}/>
            <Stack.Screen
                options={({route}) => {
                    return StackOption('Chi tiết nhóm', false, false)
                }}
                name="DetailGroupScreen" component={DetailGroupScreen}/>

            <Stack.Screen
                options={({route}) => {
                    if (!route.params) {
                        route.params = {title: 'Địa chỉ nhận hàng'};
                    }
                    return {
                        title: route.params.title,
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: "#fff",

                            //alignContent: "center"
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        }
                    }
                }}
                name="AddressScreen" component={AddressScreen}/>

            <Stack.Screen options={({route}) => {
                return StackOption(route.params.title || 'Thêm địa chỉ', false)
            }} name="AddressFormScreen" component={AddressFormScreen}/>
            <Stack.Screen
                options={({route}) => {
                    return StackOption('Thông báo', false, false)
                }}
                name="NotificationsScreen" component={NotificationsScreen}/>
            <Stack.Screen
                options={({route}) => {
                    return StackOption('Chi tiết thông báo', false, false)
                }}
                name="DetailNotiScreen" component={DetailNotiScreen}/>
            <Stack.Screen options={({route}) => {
                return StackOption(route.params.title || 'Chi tiết shop', false)
            }} name="ShopDetailScreen" component={ShopDetailScreen}/>
            <Stack.Screen options={({route}) => {
                return StackOption(route.params.title || 'Chi tiết', false)
            }} name="ProductShopDetail" component={ProductShopDetail}/>
        </Stack.Navigator>
    );
}
