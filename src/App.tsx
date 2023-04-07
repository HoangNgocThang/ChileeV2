import 'react-native-gesture-handler';
import { StyleSheet, Text, View, YellowBox, Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';

import { Colors, } from 'react-native/Libraries/NewAppScreen';
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './navigation/HomeStack'
import CartStack from './navigation/CartStack'
import ProductStack from './navigation/ProductStack'
import ProfileStack from './navigation/ProfileStack'
import GroupBuyStack from './navigation/GroupBuyStack'
import config from "./config";
import CartBadge from "./ui/CartBadge";
import Spinner from "./ui/Spinner";
import { getRemoteConfig } from "./utils";
import CartStore from "./store/CartStore";
import { navigationRef } from './navigation/RootNavigation';
import { navigate } from "./navigation/RootNavigation";
import { fcm } from "./native/MrBen";
import { getDeviceId, getUniqueId } from 'react-native-device-info'
import AuthRequest from './api/requests/AuthRequest';
import { $alert } from './ui/Alert';
import storage from './utils/storage';
import { CommonActions } from "@react-navigation/native";
import NotiScreen from './screens/NotiScreen';
import NotiStack from './navigation/NotiStack';
import OrderStack from './navigation/OrderStack';
import ContactStack from './navigation/ContactStack';
import messaging from '@react-native-firebase/messaging';
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);
declare var global: { HermesInternal: null | {} };

if (!config.secondaryColor) {
    config.secondaryColor = '#c0576a';
    config.primaryColor = '#c0576a';
}
if (!config.version) {
    config.version = '1.0.0';
    config.versionCode = 1;
}

function SettingScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();



const Stack = createStackNavigator();

const RootStack = createStackNavigator();

function MyTabs(props: any) {

    return (
        <Tab.Navigator tabBarOptions={{
            activeTintColor: config.secondaryColor,
            allowFontScaling: false,
        }}>
            {/* <Tab.Screen
              name="HomeScreen"
              component={HomeStack}
              options={{
                  tabBarLabel: 'Trang chủ',
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="home" color={color} size={size} />
                  ),
              }}
          /> */}
            <Tab.Screen
                name="ProductsScreen"
                component={ProductStack}
                options={{
                    tabBarLabel: 'Danh mục',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="border-all" color={color} size={size} />
                    ),
                }}
            />
            {/*{!!props.showBuyShare && <Tab.Screen*/}
            {/*name="GroupScreen"*/}
            {/*component={GroupBuyStack}*/}
            {/*options={{*/}
            {/*tabBarLabel: 'Mua chung',*/}
            {/*tabBarIcon: ({ color, size }) => (*/}
            {/*<MaterialCommunityIcons name="account-group" color={color} size={size} />*/}
            {/*),*/}
            {/*}}*/}
            {/*/>}*/}
            <Tab.Screen
                name="CartScreen"
                component={CartStack}
                options={{
                    tabBarLabel: 'Giỏ hàng',
                    tabBarIcon: ({ color, size }) => {
                        return <View>
                            <CartBadge name={'tab1'} count={CartStore.count()} />
                            <MaterialCommunityIcons name="cart" color={color} size={size} />
                        </View>
                    },
                }}
            />
            {/* <Tab.Screen
                name="NotiScreen"
                component={NotiStack}
                options={{
                    tabBarLabel: 'Thông báo',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="ContactStack"
                component={ContactStack}
                options={{
                    tabBarLabel: 'Liên hệ',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chat-processing-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileStack}
                options={{
                    tabBarLabel: 'Thông tin',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
interface State {
    isLoading: boolean
}
class App extends Component<any, State>{
    private appConfig: any;
    private unsubscribe: any;
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    onLoginSucceed = () => {
        CartStore.clear();
        // this.props.navigation.dispatch(
        //     CommonActions.reset({
        //         index: 0,
        //         routes: [
        //             { name: 'ProfileScreen' },
        //         ],
        //     })
        // );
    };

    _init = async () => {
        this.appConfig = await getRemoteConfig();
        // const res1 = await getDeviceId()
        const res2 = await getUniqueId()
        console.log("pppp111", res2)
        const loginRes = await AuthRequest.login(res2);
        console.log("pppp3333", loginRes)
        if (loginRes.err_code !== 0) {
            $alert(loginRes.message);
        } else {
            await storage.setAuth(loginRes);
            this.onLoginSucceed();
        }
        this.setState({ isLoading: false })
    }

    handleDeepLink = (link: any) => {
        if (!link.url) {
            return;
        }
        let scheme = 'cluxapp://';
        if (!link.url.startsWith(scheme)) {
            return;
        }


        let uri = link.url.substr(scheme.length, link.url.length)
        let [group, id] = uri.split('/');
        if (group && id) {
            group = group.toLowerCase();
            let routeName: any;
            if (group === 'product') {
                routeName = 'DetailProduct';
            } else if (group === 'group') {
                routeName = 'DetailGroupScreen';
            }

            if (routeName) {
                setTimeout(() => {
                    navigate(routeName, { id })
                }, 500)
            }
        }
    }


    listnerNoti = () => {
        this.unsubscribe = messaging().onMessage(async remoteMessage => {
            console.warn("message when app opening...", remoteMessage)
        });
    }

    getToken = async () => {
        const token = await messaging().getToken();
        console.log("token11", token)
    }

    componentDidMount(): void {
        this._init();
        // this.listnerNoti();
        Linking.addEventListener('url', this.handleDeepLink);

        /* fcm.getToken().then((token: string) => {
             console.log('FCM_Toen=' + token);
         });
 
         fcm.onMessageReceived((data: any) => {
             console.log('onMessageReceived', data);
         });
 
         fcm.getInitialMessage().then((data:any) => {
             console.log({initialMessage: data});
         })*/

        this.listnerNoti()

        this.getToken()
    }

    componentWillUnmount(): void {
        this.unsubscribe
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner />
        }
        return <NavigationContainer ref={navigationRef}>
            {/* <MyTabs showBuyShare={this.appConfig.showBuyShare} /> */}
            <RootStack.Navigator
                screenOptions={{ gestureEnabled: false }}>
                <RootStack.Screen
                    options={{
                        // animationEnabled: false,
                        gestureEnabled: false,
                        headerShown: false
                    }}
                    name="Home"
                    component={MyTabs} />
                <RootStack.Screen
                    options={{
                        // animationEnabled: false,
                        gestureEnabled: false,
                        headerShown: false
                    }}
                    name="OrderStack"
                    component={OrderStack} />
            </RootStack.Navigator>
        </NavigationContainer>
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default App;
