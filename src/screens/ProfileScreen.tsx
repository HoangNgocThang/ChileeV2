import React, {Component} from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
// @ts-ignored
import storage from "../utils/storage";
import {$alert, confirm} from "../ui/Alert";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignored
import {User} from '../api/interfaces';
import FastImage from "react-native-fast-image";
import config from "../config";
import {debounce, getAuthSync, getRemoteConfigSync, numberFormat, setAuthSync} from "../utils";
import AddressScreen from "./AddressScreen";
import CartStore from "../store/CartStore";
import MixStore from "../store/MixStore";
import messages from "../locale/messages";
import AuthRequest from "../api/requests/AuthRequest";
import {fcm} from "../native/MrBen";
const imgBoCongThuong = require('../assets/bocongthuong.png');
const defaultAvatar = require('../assets/default-avatar.png');

interface State {
    menuItems: Array<any>,
    menuItems2: Array<any>,
    user: User,
    hasCredit: boolean,
    credit: number
}

const defaultUser = {name: 'Chưa đăng nhập', address: '', avatar: defaultAvatar};
export default class ProfileScreen extends Component<any, State>{
    private focusListener: any;
    private firstTime = true;

    constructor(props: any) {
        super(props);
        const auth = getAuthSync();
        const remoteConfig = getRemoteConfigSync();
        if (auth && !auth.user.avatar) {
            auth.user.avatar = defaultAvatar;
        }

        const isDev = __DEV__;
        let version = config.version;
        if (isDev) {
            version = version + '.1';
        }

        this.state = {
            user: auth ? auth.user : defaultUser,
            hasCredit: false,
            credit: 0,
            menuItems: this.getMenu(),
            menuItems2: [
                {
                    id: 'phone',
                    icon: 'phone',
                    show: true,
                    text: <Text>Hotline: <Text style={{color: config.secondaryColor}}>{1900.3524}</Text></Text>,
                    action: () => {
                        this.handleCall('19003524')
                    }
                },
                {id: '2', icon: 'account',
                    text: 'Phiên bản ứng dụng',
                    left: <Text style={{color: 'gray'}}>{version}</Text>,
                    action: () => {}},
                {id: '3', icon: 'info',
                    text: 'Điều khoản & chỉnh sách',
                    action: () => {
                        this.props.navigation.navigate('InfoScreen')
                    }}
            ]
        }

        this.firstTime = false;
    }

    getMenu() {
        const auth = getAuthSync();
        const remoteConfig = getRemoteConfigSync();
        let menu = [

        ];

        if (auth) {
            let authenticatedMenu = [
                {
                    id: '1', icon: 'map-marker', text: 'Địa chỉ nhận hàng', action: () => {

                        this.props.navigation.navigate('AddressScreen')
                    }, show: true
                }
                // ,
                // {
                //     id: 'logout', icon: 'logout', text: 'Đăng xuất', action: async () => {
                //         setAuthSync(null);
                //         CartStore.clear();
                //         await storage.clearAuth();
                //         this.props.navigation.navigate('LoginScreen')
                //     }
                // }
            ];
            if (remoteConfig.payment.show) {
                authenticatedMenu.push(...[
                    {id: '5', icon: 'credit-card',
                        text: 'Thanh toán',
                        action: async () => {
                            const auth = await storage.getAuth();
                            this.props.navigation.navigate('PaymentScreen', {auth: auth})
                        }},
                    {id: '6', icon: 'history',
                        text: 'Lịch sử thanh toán',
                        action: async () => {
                            const auth = await storage.getAuth();
                            this.props.navigation.navigate('PaymentHistoryScreen', {auth: auth})
                        }}
                ])
            }
            menu = [
                ...authenticatedMenu
               ,
                ...menu];

        } else {

            menu = [
                // {id: 'login', icon: 'lock', text: 'Đăng nhập', action: () => {
                //         this.props.navigation.navigate('LoginScreen')
                //     }},
                // {id: 'register', icon: 'account', text: 'Đăng kí', action: () => {
                //         this.props.navigation.navigate('RegisterScreen')
                //     }}

                ,...menu];
        }
        return menu;
    }

    handleCall = (phone: string) => {
        confirm('Gọi: ' + phone + '?', (ok) => {
            if (ok) {
                const $phone = 'tel:'+phone.replace(/./, '');
                Linking.canOpenURL($phone)
                    .then(supported => {
                        if (!supported) {
                            $alert('Phone number is not available');
                        } else {
                            return Linking.openURL($phone);
                        }
                    });
            }
        })
    }

    asyncInit = debounce(async () => {
        let res = await AuthRequest.getProfile();
        if (res.user && getRemoteConfigSync().payment.show) {
            this.setState({hasCredit: true, credit: res.user.credit});
        } else {
            this.setState({hasCredit: false, credit: 0})
        }
    })

    onFocus = async () => {
        if (!this.firstTime) {
            const auth = await storage.getAuth();
            setAuthSync(auth);
            if (auth && !auth.user.avatar) {
                auth.user.avatar = defaultAvatar;
            }
            this.setState({menuItems: this.getMenu(), user: auth ?  auth.user : defaultUser});
        }
        this.asyncInit();
    };


    componentDidMount(): void {
        this.focusListener = this.props.navigation.addListener('focus', this.onFocus)
    }

    componentWillUnmount(): void {
        if (this.focusListener) {
            this.focusListener();
        }

    }


    render() {
        const {user} = this.state;
        const auth = getAuthSync();

        return (
            <ScrollView style={{ flex: 1 }}>
                {/* <View style={{margin: 10,  height:50}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{width: 60}}>
                            <FastImage source={user.avatar} style={styles.avatar}/>
                        </View>
                        <View style={{marginTop:2}}>
                            <Text style={{ fontSize:18}}>{user.name}</Text>
                            {this.state.hasCredit && <Text style={styles.balance}>Số dư: {numberFormat(this.state.credit)}</Text>}
                        </View>
                    </View>
                </View> */}
                {/* <View style={styles.myOrders}>
                    <View style={{flexDirection: 'row', height:40}}>
                        <View style={{flex:1}}>
                            <Text style={{ fontSize:22}}>Đơn hàng của tôi</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                if (!auth) {
                                    return $alert(messages.loginRequired)
                                }
                                this.props.navigation.navigate("OrderHistory", {initialRoute: 0})
                            }}
                            >
                                <Text style={{ fontSize:14,color: config.secondaryColor}}>Xem thêm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex:1}}>
                            <TouchableOpacity  onPress={() => {
                                if (!auth) {
                                    return $alert(messages.loginRequired)
                                }
                                MixStore.isJumped = true;
                                this.props.navigation.navigate("OrderHistory", {initialRoute: 1})
                            }}>
                                <Text style={{ textAlign: 'center'}}>
                                    <MaterialCommunityIcons color={config.secondaryColor} name="update" size={50}/>
                                </Text>
                                <Text style={{ textAlign: 'center'}}> Đang xử lý</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={() => {
                                if (!auth) {
                                    return $alert(messages.loginRequired)
                                }
                                MixStore.isJumped = true;
                                this.props.navigation.navigate("OrderHistory", {initialRoute: 2});
                            }}>
                            <Text style={styles.textCenter}>
                                <MaterialCommunityIcons color={config.secondaryColor} name="truck" size={50}/>
                            </Text>
                            <Text style={{ textAlign: 'center'}}> Đang giao hàng</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={() => {
                                if (!auth) {
                                    return $alert(messages.loginRequired)
                                }
                                MixStore.isJumped = true;
                                this.props.navigation.navigate("OrderHistory", {initialRoute: 3});
                            }}>
                            <Text style={styles.textCenter}>
                                <MaterialCommunityIcons color={config.secondaryColor} name="checkbox-marked-circle" size={50}/>
                            </Text>
                            <Text style={styles.textCenter}> Thành công</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> */}

                <View style={[styles.profileMenu, {height: 50*this.state.menuItems.length}]}>
                    {this.state.menuItems.map((item,index) => {
                        const addedStyle = {};
                        if (index === this.state.menuItems.length -1) {
                            addedStyle.borderBottomWidth = 0;
                        }
                        return (
                            <TouchableOpacity onPress={() => {item.action()}} key={item.id} style={[styles.menuBox,addedStyle]}>
                                <View style={{flex:1}}>
                                    <MaterialCommunityIcons color={config.secondaryColor} name={item.icon} size={26}/>
                                </View>
                                <View style={{flex:9,marginTop:5}}>
                                    <Text style={{fontSize:15}}>{item.text}</Text>
                                </View>
                                <View style={{marginTop:5}}>

                                    <MaterialCommunityIcons color={config.secondaryColor} name="chevron-right" size={18}/>
                                </View>
                            </TouchableOpacity>
                        )
                    })}


                </View>

                <View style={[styles.profileMenu, {height: 50*this.state.menuItems2.length}]}>
                    {this.state.menuItems2.map((item,index) => {
                        const addedStyle: any = {};
                        if (index === this.state.menuItems2.length -1) {
                            addedStyle.borderBottomWidth = 0;
                        }

                        return (
                            <TouchableOpacity onPress={() => {item.action()}} key={item.id} style={[styles.menuBox,addedStyle]}>

                                <View style={{flex:9,marginTop:5}}>
                                    <Text style={{fontSize:15}}>{item.text}</Text>
                                </View>
                                <View style={{marginTop:5}}>

                                    {item.left}
                                </View>
                            </TouchableOpacity>
                        )
                    })}


                </View>
                {/*<View style={[styles.profileMenu]}>
                    <View style={{flex: 1, flexDirection: 'column', alignSelf: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            let config = getRemoteConfigSync();
                            if (config.boCongThuongUrl) {
                                Linking.openURL(config.boCongThuongUrl);
                            }

                        }}>
                            <Image style={{width: 150,height:50}} source={imgBoCongThuong}/>
                        </TouchableOpacity>
                    </View>

                </View>*/}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    fbLoginBtn: {backgroundColor: '#1877F2', height: 45, padding:10, borderRadius: 5},
    ggLoginBtn: {backgroundColor: '#f23f3e', height: 45, padding:10, borderRadius: 5},
    textCenter: {
        textAlign: 'center'
    },
    profileMenu: {
        padding: 15,
        marginLeft: 10,
        marginRight:10,
        marginTop:5,
        borderRadius:10,
        backgroundColor: '#fff',

    },
    menuBox: {
        flexDirection: 'row',
        height:40,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
        justifyContent: 'center',
        marginBottom:10
    },
    myOrders: {
        height:150,
        padding: 15,
        marginTop: 10,
        marginLeft: 10,
        marginRight:10,
        borderRadius:10,
        backgroundColor: '#fff',

    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        overflow: "hidden",
        borderWidth: 0,
    },
    balance: {fontSize: 17, color: config.secondaryColor, flex: 1, paddingVertical: 0, fontWeight: "500"},
})
