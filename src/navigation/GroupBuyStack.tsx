import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GroupBuyScreen from "../screens/GroupBuyScreen";
import config from "../config";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ListGroupScreen from "../screens/ListGroupScreen";
import DetailGroupScreen from "../screens/DetailGroupScreen";
import {StackOption} from "../ui/StackOption";
import messages from "../locale/messages";
import AddressScreen from "../screens/AddressScreen";
import AddressFormScreen from "../screens/AddressFormScreen";
import GroupCreateScreen from "../screens/GroupCreateScreen";
import SelectPickerScreen from "../screens/SelectPickerScreen";

const Stack = createStackNavigator();

export default function GroupBuyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{
                title: "Mua chung",
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: config.primaryColor,

                    //alignContent: "center"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }
            }} name="GroupBuyScreen" component={GroupBuyScreen} />
            <Stack.Screen name="ProductDetailScreen"
                          component={ProductDetailScreen}
                        //   options={({route}) => {
                        //       return StackOption( route.params.title || messages.title, false)
                        //   }}
                        options={{ headerShown: false }}
            />
            <Stack.Screen options={{
                title: "Danh sách nhóm",
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: config.primaryColor,

                    //alignContent: "center"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }
            }} name="ListGroupScreen" component={ListGroupScreen} />
            <Stack.Screen name="DetailGroupScreen"
                          component={DetailGroupScreen}
                          options={({route}) => {
                              return StackOption( route.params.title || "Chi tiết nhóm", false, false)
                          }}
            />
            <Stack.Screen
                options={({route}) => {
                    return StackOption('Tạo nhóm', false, true)
                }}
                name="GroupCreateScreen" component={GroupCreateScreen}/>
            <Stack.Screen
                options={{
                    title: "Địa chỉ nhận hàng",
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: "#fff",

                        //alignContent: "center"
                    },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
                name="AddressScreen"
                component={AddressScreen}
            />

            <Stack.Screen
                options={({route}) => {
                    return StackOption(
                        route.params.title || 'Thêm địa chỉ',
                        false,
                    );
                }}
                name="AddressFormScreen"
                component={AddressFormScreen}
            />
            <Stack.Screen
                options={({route}) => {
                    return StackOption(
                        route.params.title || 'SelectPicker',
                        false,
                    );
                }}
                name="SelectPickerScreen"
                component={SelectPickerScreen}
            />
        </Stack.Navigator>
    );
}
