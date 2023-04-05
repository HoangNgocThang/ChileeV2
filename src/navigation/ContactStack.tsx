import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

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
import { StackOption } from "../ui/StackOption";
import SelectPickerScreen from "../screens/SelectPickerScreen";
import InfoScreen from "../screens/InfoScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import ShopDetailScreen from "../screens/ShopDetailScreen";
import ProductShopDetail from "../screens/ProductShopDetail";
import NotiScreen from '../screens/NotiScreen';
import NotiDetailScreen from '../screens/NotiDetailScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createStackNavigator();

export default function ContactStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={StackOption('Liên hệ', false, false)} name="ContactScreen" component={ContactScreen} />
        </Stack.Navigator>
    );
}
