import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProductsScreen from "../screens/ProductsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import { StackOption } from '../ui/StackOption';
import ListProductScreen from "../screens/ListProductScreen";
import GroupCreateScreen from "../screens/GroupCreateScreen";
import SelectPickerScreen from "../screens/SelectPickerScreen";
import ListGroupScreen from "../screens/ListGroupScreen";
import DetailGroupScreen from "../screens/DetailGroupScreen";
import AddressScreen from "../screens/AddressScreen";
import AddressFormScreen from "../screens/AddressFormScreen";
import ShopDetailScreen from "../screens/ShopDetailScreen";
import ProductShopDetail from "../screens/ProductShopDetail";
import ProductSearchScreen from '../screens/ProductSearchScreen';

const Stack = createStackNavigator();

export default function ProductStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                // options={StackOption('Danh mục', false)}
                options={{ headerShown: false }}
                name="ProductsScreen" component={ProductsScreen} />
            <Stack.Screen 
              options={{ headerShown: false }}
              name="ProductSearchScreen" component={ProductSearchScreen}/>    
            <Stack.Screen
                // options={StackOption('Chi tiết', false)}
                options={{ headerShown: false }}
                name="ProductDetailScreen" component={ProductDetailScreen} />
            <Stack.Screen
                options={({ route }) => {
                    return StackOption(route.params.title || 'Chilee', false)
                }}
                name="ListProductScreen" component={ListProductScreen} />
            <Stack.Screen
                options={({ route }) => {
                    return StackOption('Tạo nhóm', false, true)
                }}
                name="GroupCreateScreen" component={GroupCreateScreen} />
            <Stack.Screen
                options={({ route }) => {
                    return StackOption(route.params.title || 'SelectPicker', false)
                }}
                name="SelectPickerScreen" component={SelectPickerScreen} />
            <Stack.Screen
                options={({ route }) => {
                    return StackOption(route.params.title || 'Danh sách nhóm', false, false)
                }}
                name="ListGroupScreen" component={ListGroupScreen} />
            <Stack.Screen
                options={({ route }) => {
                    return StackOption('Chi tiết nhóm', false, false)
                }}
                name="DetailGroupScreen" component={DetailGroupScreen} />

            <Stack.Screen
                options={({ route }) => {
                    if (!route.params) {
                        route.params = { title: 'Địa chỉ nhận hàng' };
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
                name="AddressScreen" component={AddressScreen} />

            <Stack.Screen options={({ route }) => {
                return StackOption(route.params.title || 'Thêm địa chỉ', false)
            }} name="AddressFormScreen" component={AddressFormScreen} />
            <Stack.Screen options={({ route }) => {
                return StackOption(route.params.title || 'Chi tiết shop', false)
            }} name="ShopDetailScreen" component={ShopDetailScreen} />
            <Stack.Screen options={({ route }) => {
                return StackOption(route.params.title || 'Chi tiết', false)
            }} name="ProductShopDetail" component={ProductShopDetail} />
            <Stack.Screen
                // options={({ route }) => {
                //     return StackOption('Chi tiết', false, true)
                // }}
                options={{ headerShown: false }}
                name="DetailProduct" component={ProductDetailScreen} />
        </Stack.Navigator>
    );
}
