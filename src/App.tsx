import 'react-native-gesture-handler';
import { StyleSheet, Text, View, YellowBox, Linking, Platform, Dimensions, Image ,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
// import { request, PERMISSIONS } from 'react-native-permissions';
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
// YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);
// declare var global: { HermesInternal: null | {} };
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
const { width, height } = Dimensions.get('window');
const logo2 = require('../src/assets/logo2.png');

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


const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showNoti, setShowNoti] = useState(false);
    const [objectNoti, setObjectNoti] = useState<any>(null);
    const [isShowModalInternet, setIsShowModalInternet] = useState(false);

    const onLoginSucceed = () => {
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

    const _init = async () => {
        await getRemoteConfig();
        // const res1 = await getDeviceId()
        const fcmToken = await messaging().getToken();
        const res2 = await getUniqueId()
        console.log("pppp111", res2)
        const loginRes = await AuthRequest.login(res2, fcmToken);
        console.log("pppp3333", loginRes)
        if (loginRes.err_code !== 0) {
            // $alert(loginRes.message);
        } else {
            await storage.setAuth(loginRes);
            onLoginSucceed();
        }
        // this.setState({ isLoading: false })
    }

    const getPer = async () => {
        // if (Platform.OS == 'android') {
        //     // const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        //     const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        //     console.log('aaa, result', result)
        // }

        if (Platform.OS == 'ios') {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
            }
        }

        // return true
    }

    useEffect(() => {

        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            // console.log('Connection type listener', state.type);
            // console.log('Is connected listener?', state.isConnected);
            if (state.isConnected) {
                setIsShowModalInternet(false)
            } else {
                setIsShowModalInternet(true)
            }
        });

        _init()

        getPer()

        messaging().subscribeToTopic('all_user').then(() => {
            console.log('Subscribed to topic!')
        });

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log("message when app opening...", remoteMessage)
            if (remoteMessage) {
                setTimeout(() => {
                    setShowNoti(true)
                    setObjectNoti(remoteMessage)
                }, 200)
            }
        });

        return () => {
            unsubscribeNetInfo()
            unsubscribe()
            messaging().unsubscribeFromTopic('all_user').then(() => {
                console.log('Unsubscribed fom the topic!')
            });
        };

    }, [])

    useEffect(() => {
        if (showNoti) {
            const timer = setTimeout(() => {
                setShowNoti(false)
                setObjectNoti(null)
            }, 8000)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [showNoti])

    const renderImageNoti = () => {
        // if (objectNoti?.notification?.android?.imageUrl) {
        //     return { uri: objectNoti?.notification?.android?.imageUrl }
        // }
        return logo2
    }

    const renderModalInternet = () => {
        if (isShowModalInternet) {
            return (
                <View style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    backgroundColor: '#cccc',
                    position: 'absolute',
                    bottom: 0,
                    paddingTop: 15,
                    paddingBottom: 35 ,
                    // + StaticSafeAreaInsets.safeAreaInsetsBottom,
                    zIndex: 10
                }}>
                    <View
                        style={{
                            width: Dimensions.get('window').width,
                            flex: 1,
                            backgroundColor: 'white',
                            paddingHorizontal: 0,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            alignContent: 'center',
                            position: 'absolute',
                            bottom: 0,
                            paddingTop: 15,
                            paddingBottom: 35 ,
                            // + StaticSafeAreaInsets.safeAreaInsetsBottom,
                            borderTopLeftRadius: 40,
                            borderTopRightRadius: 40,
                        }}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 15,
                                paddingVertical: 15,
                            }}>
                            <Text
                                style={{
                                    color:'black',
                                    fontSize: 16,
                                    lineHeight: 22,
                                    fontWeight: '600',
                                    width: '100%',
                                    textAlign: 'center',
                                }}>
                                {'Kết nối không thành công'.toUpperCase()}
                            </Text>
                        </View>
    
                        <View
                            style={{
                                width: '100%',
                                flex: 1,
                                paddingHorizontal: 35,
                            }}>
                            <Text
                                style={{
                                    color:'black',
                                    fontSize: 14,
                                    lineHeight: 24,
                                    fontWeight: '400',
                                    textAlign: 'center',
                                }}>
                                {`Xin vui lòng kiểm tra lại kết nối internet của bạn.`}
                            </Text>
    
                            <Image
                                source={require('../src/assets/error.png')}
                                resizeMode="contain"
                                style={{ width: 280, height: 200, marginTop: 25 }}
                            />
    
                            <View style={{ width: '100%', height: 45, marginTop: 25 }}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        // dispatch(actions.ptiHideModalNotConnect())
                                        // props.onCloseModalInternet()
                                        setIsShowModalInternet(false)
                                    }}>
                                    <View
                                        style={{
                                            width: '100%',
                                            height: 45,
                                            borderRadius: 22.5,
                                            backgroundColor: config.secondaryColor,
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                lineHeight: 19,
                                                color: 'white',
                                                fontWeight: '600',
                                            }}>
                                            {'Đóng'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>)
        } else {
            return <></>
        }
    }

    return <>
        <NavigationContainer ref={navigationRef}>
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
        {renderModalInternet()}
        {
            showNoti ? <View style={{
                // backgroundColor: 'white',
                position: 'absolute',
                top: 0, right: 0,
                width: width,
            }}>
                <View style={{
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    margin: 10,
                    height: 60,
                    width: width - 20,
                    backgroundColor: 'white',
                    flexDirection: 'row'
                }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14 }}>{objectNoti?.notification?.title}</Text>
                        <Text numberOfLines={2} style={{ fontSize: 12, color: 'grey' }}>{objectNoti?.notification?.body}</Text>
                    </View>
                    <Image style={{ width: 42, height: 42 }} source={renderImageNoti()} />
                </View>
            </View> : <></>
        }
    </>
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
