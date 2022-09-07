import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CartScreen from "../screens/CartScreen";
const Stack = createStackNavigator();

export default function CartStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
);
}
