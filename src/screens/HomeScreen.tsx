import React, { Component } from 'react';
import {
    AppState,
    Alert,
    Platform,
    FlatList,
    Linking,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import ProductItem2 from "../themes/Components/ProductItem2"

import { Campaign, NotificationData, Product } from "../api/interfaces";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import config from "../config";
import { getRemoteConfig, getRemoteProvincesSync, debounce } from "../utils";

import platform from "../themes/Variables/platform";
import CategoryItem from "../themes/Components/CategoryItem";
import ModalLocationOption from "../themes/Components/ModalLocationOption";
import ConfigStore from "../store/ConfigStore";
import BtnMore from "../ui/BtnMore";
import GroupBuyItem2 from "../themes/Components/GroupBuyItem2";
import HomeTab from "../themes/Components/HomeTab";
import { fcm } from "../native/MrBen";

import storage from "../utils/storage";
import NotificationRequest from "../api/requests/NotificationRequest";
import { navigate } from "../navigation/RootNavigation";
const isIos = Platform.OS === 'ios';

interface State {
    isLoading: boolean,
    refreshing: boolean,
    listBanner: Array<any>,
    campaigns: Array<Campaign>,
    suggestion: Array<Product>
    category: Array<any>,
    icons: Array<any>,
    appState: string
}
let firstTimeVisit = true;
export default class HomeScreen extends Component<any, State>{
    private listener: any;
    constructor(props: any) {
        super(props);
        this.state = {
            appState: 'active',
            isLoading: true,
            refreshing: false,
            listBanner: [],
            campaigns: [],
            suggestion: [],
            category: []
        }
    }

    handleFcmToken = async () => {
        console.log('Handling fcm token')
        let fcmToken = await storage.get('fcmToken');
        if (!fcmToken) {
            fcm.requestPermission(async (code: string) => {
                if (code === fcm.PERMISSION_GRANTED) {
                    let token = await fcm.getToken();
                    await storage.set('fcmToken', token, 5 * 86400);
                    console.log('Saved fcm token:', token);
                    await NotificationRequest.register(token);
                }
            });
        } else {
            console.log('FcmToken=' + fcmToken);
        }
    }

    handleUpdate = async () => {
        const remoteConfig = await getRemoteConfig();
        const updates = remoteConfig.updates;
        if (updates.show && updates.latestVersionCode > config.versionCode) {
            let buttons = [
                {
                    text: 'Cập nhật ngay', onPress: () => {
                        Linking.canOpenURL(updates.link).then(supported => {
                            if (supported) {
                                Linking.openURL(updates.link);
                            }
                        });
                    }
                },
            ];

            if (!updates.force) {
                buttons.push({
                    text: 'Hủy', onPress: () => {

                    }
                })
            }

            Alert.alert(updates.title, updates.content, buttons)
        } else {
            this.handleFcmToken();
        }
    }

    asyncInit = debounce(async () => {
        const res = await HomeRequest.getFrontDataV2();
        this.setState({
            listBanner: res.sliders,
            isLoading: false,
            campaigns: res.campaigns,
            suggestion: res.suggestion,
            refreshing: false,
            icons: res.icons
        });
        setTimeout(() => {
            this.handleUpdate();
        }, 1000)
    });

    async checkLocation() {
        const provinces = getRemoteProvincesSync();
        if (!provinces) {
            return;
        }
        const location = await ConfigStore.hasProvince();
        if (!location) {
            this.refs.ModalLocationOption.onOpen();
        } else {
            this.asyncInit();
        }
    }

    onFocus = async () => {
        if (!firstTimeVisit) {
            firstTimeVisit = false;
            this.asyncInit();
        }
    }

    onReceivedNotification = async (data: NotificationData) => {
        if (data.screen) {
            let screen = data.screen;
            console.log(data);
            let props = data.props ? JSON.parse(data.props) : {};
            console.log('Navigate to: ' + screen, { props });
            navigate(screen, props);
        }
    }

    _handleAppStateChange = (nextAppState: any) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
            if (this.props.navigation.isFocused()) {
                this.asyncInit();
            }

            if (isIos) {
                fcm.getInitialNotification()
                    .then((data: NotificationData) => {
                        if (data) {
                            this.onReceivedNotification(data)
                        }

                    })
            }


        } else {
            console.log("App has come to the background!");
        }
        this.setState({ appState: nextAppState });
    };

    componentDidMount(): void {
        AppState.addEventListener("change", this._handleAppStateChange);

        this.listener = this.props.navigation.addListener('focus', this.onFocus)
        this.asyncInit();
        // ConfigStore.onProvinceChange(async () => {
        //     this.onRefresh();
        // });

        fcm.getInitialNotification()
            .then((data: NotificationData) => {
                if (data) {
                    this.onReceivedNotification(data)
                }
            });


    }

    componentWillUnmount(): void {
        AppState.removeEventListener("change", this._handleAppStateChange);
        if (this.listener) {
            console.log('componentWillUnmount')
            this.listener();
        }
    }

    onConfirmLocation = () => {
        this.asyncInit();
    }

    renderCampaign(item: Campaign) {
        return (
            <View key={item.id.toString()} style={styles.campaignWrapper}>
                <View style={styles.campaignTextWrapper}>
                    <Text style={styles.campaignTextLeft}>{item.name}</Text>
                    {item.readmore === 1 && <TouchableOpacity onPress={() => this.props.navigation.navigate("ListProductScreen", { id: item.id, title: item.name })}>
                        <Text style={styles.campaignTextRight}>Xem thêm</Text>
                    </TouchableOpacity>}
                </View>
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        style={{ marginTop: 5 }}
                        data={item.products}
                        horizontal={true}
                        renderItem={this.renderCampaignItem}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        maxToRenderPerBatch={5}
                        initialNumToRender={5}
                    />
                </SafeAreaView>

            </View>
        )
    }
    //onPress={() => this.props.navigation.navigate("ListProductScreen", {id: item.id, title: item.name})}
    renderCampaignVertical = (campaign) => {
        const hasReadMore = !!parseInt(campaign.readmore);
        return <View key={campaign.id.toString()} style={styles.bottomListWrapper}>
            <Text style={styles.textBottomList}>{campaign.name}</Text>
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    style={styles.bottomList}
                    data={campaign.products}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderFocusItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                />
                {hasReadMore && <View style={{ marginBottom: 5 }}>
                    <BtnMore isLoading={false} loadingMore={() => {
                        this.props.navigation.navigate("ListProductScreen", { id: campaign.id, title: campaign.name });
                    }} />
                </View>}
            </SafeAreaView>
        </View>
    }

    renderCampaignItem = ({ item, index }) => {
        return (
            <View key={index.toString()}>
                <ProductItem2
                    ProductItem={item}
                    index={index}
                    navigation={this.props.navigation}
                />
            </View>
        )
    }

    renderCategoryItem = ({ item, index }) => {
        return (
            <CategoryItem
                product={item}
                layoutWidth={platform.deviceWidth / 5 - 8}
                layoutPadding={5}
                fontWeight={"bold"}
                navigation={this.props.navigation}
            />
        )
    }

    renderFocusItem = ({ item, index }) => {
        return (
            <GroupBuyItem2
                ProductItem={item}
                navigation={this.props.navigation}
                index={item.id}
            />
        )
    }

    onRefresh = async () => {
        this.setState({ refreshing: true })
        this.asyncInit();
    }

    renderContent = () => {
        const { campaigns, listBanner, isLoading } = this.state
        if (isLoading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Spinner />
                    <ModalLocationOption ref={"ModalLocationOption"} onConFirm={this.onConfirmLocation} />
                </View>
            )
        }
        return <HomeTab
            campaigns={campaigns}
            icons={this.state.icons}
            navigation={this.props.navigation}
            listBanner={listBanner} />
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: '#f6f6fa' },
    container: { flex: 1 },
    searchBoxWrapper: { paddingHorizontal: 15, width: platform.deviceWidth, paddingTop: 10, backgroundColor: "#fff" },
    listCategory: {
        paddingHorizontal: 10, backgroundColor: "#fff", width: platform.deviceWidth,
        marginTop: 10, marginBottom: 5
    },
    bottomListWrapper: { width: "100%", backgroundColor: "#fff", marginTop: 10, paddingHorizontal: 15, paddingTop: 5 },
    textBottomList: { fontSize: 20, fontWeight: "bold", paddingVertical: 5, color: config.secondaryColor },
    bottomList: { flex: 1 },
    campaignWrapper: {
        width: "100%", alignItems: "center", backgroundColor: "#fff",
        marginTop: 10, paddingTop: 15, paddingBottom: 15
    },
    campaignTextWrapper: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        width: "100%", paddingHorizontal: 15
    },
    campaignTextLeft: { fontSize: 20, fontWeight: "bold", color: config.secondaryColor },
    campaignTextRight: { fontSize: 16, color: config.secondaryColor },

    spinner: {
        marginBottom: 50
    },

    btn: {
        marginTop: 20
    },

    text: {
        color: "white"
    }
});
