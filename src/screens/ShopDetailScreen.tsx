import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet, TouchableOpacity, Animated, Linking} from "react-native";
import ShopRequest from "../api/requests/ShopRequest";
import Spinner from '../ui/Spinner';
import config from "../config";
import FastImage from "react-native-fast-image";
import platform from "../themes/Variables/platform";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TabBar, TabView} from "react-native-tab-view";
import ShopProductTab from "../themes/Components/ShopProductTab";
import ShopInfoTab from "../themes/Components/ShopInfoTab";
import ShopCategoryTab from "../themes/Components/ShopCategoryTab";

const img = require("../assets/logo.jpg");
const slide = require("../assets/slide4.png");

interface Props {
}

interface State {
    isLoading: boolean
    scrollY: any
    shop: any
    index: number
    campaigns: any
    sliders: any
}

const routes = [
    {key: 0, title: 'Shop'},
    {key: 1, title: 'Sản phẩm'},
    {key: 2, title: 'Danh mục'},
    // {key: '3', title: 'Bài viết'},
]
export default class ShopDetailScreen  extends Component<Props,State> {
    flatListRef: any;
    constructor(props: any) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            isLoading: true,
            campaigns: [],
            sliders: [],
            shop: {},
            index: 0,
        }
    }

    asyncInit = async () => {
        let {params} = this.props.route;
        const res = await ShopRequest.getHomeData(params.id);
        if (res) {
            setTimeout(() => {

                this.setState({
                    isLoading: false,
                    shop: res.shop,
                    sliders: res.sliders,
                    campaigns: res.categories
                });
            }, 500)
        }

    }

    componentDidMount(): void {
        this.asyncInit();
    }

    _getHeaderPosition = () => {
        const {scrollY} = this.state;

        return scrollY.interpolate({
            inputRange: [0, deviceWidth * 0.4],
            outputRange: [0, -deviceWidth * 0.4],
            extrapolate: 'clamp',
        });
    };

    onScroll = (value) => {
        this.state.scrollY.setValue(value)
    }

    onIndexChange = (index: number) => {
        this.setState({index: index});
        if (this.state.index != index) {
            this.flatListRef.scrollToIndex({animated: true, index: index, viewPosition: 0.5});
            // this.page = 1;
            // const campaignId = this.props.campaigns[index].id;
            // this.loadCampaign(campaignId);
            // if (this.state.scrollY._value > deviceWidth * 0.8 + 80) {
            //     setTimeout(() => {
            //         this.scrollViewRef.getNode().scrollTo({x: 0, y: deviceWidth * 0.8 + 80, animated: true})
            //     }, 1)
            // }

        }
    }

    renderScene = ({ route }) => {
        let {scrollY, sliders, campaigns, index} = this.state;
        switch (route.key) {
            case 0:
                return <ShopInfoTab
                    tabKey={0}
                    index={index}
                    scrollY={scrollY}
                    onScroll={(value) => this.onScroll(value)}
                    banner={sliders}
                    campaigns={campaigns}
                    navigation={this.props.navigation}
                />;
            case 1:
                return <ShopProductTab
                    tabKey={1}
                    index={index}
                    scrollY={scrollY}
                    shop={this.state.shop}
                    onScroll={(value) => this.onScroll(value)}
                    navigation={this.props.navigation}
                />
            case 2:
                return <ShopCategoryTab
                    tabKey={2}
                    index={index}
                    scrollY={scrollY}
                    category={campaigns}
                    shop={this.state.shop}
                    onScroll={(value) => this.onScroll(value)}
                    navigation={this.props.navigation}
                />
            default:
                return null;
        }
    };

    renderTabBar = props =>  {
        return null
    }

    renderItem = ({ item, index}) => {
        return (
            <TouchableOpacity
                style={[styles.tabItem, {borderColor: config.secondaryColor, borderBottomWidth: this.state.index === index ? 2 : 0}]}
                activeOpacity={1}
                onPress={this.onIndexChange.bind(this, index)}
            >
                <Text style={[styles.tabLabel, {color: this.state.index === index ? config.secondaryColor : "#4b4b4b"}]}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    onOpenChat = (shop: any) => {
        const url = shop.chat_url;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }

    renderContent = () => {
        const {isLoading, index, shop} = this.state
        if (isLoading) {
            return <Spinner/>
        }

        const hasChatUrl = shop.chat_url != null;

        return (
            <View style={{flex: 1}}>
                <Animated.View style={[styles.header, {transform: [
                        {translateY: this._getHeaderPosition()},
                    ]}]}>
                    {/*fake slide*/}
                    <View>
                        <FastImage
                            source={{uri: shop.banner}}
                            style={styles.bannerShop}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                        <View style={styles.shopInfo}>
                            <View style={styles.infoWrap}>
                                {/*fake avatar*/}
                                <FastImage
                                    source={{uri: shop.avatar}}
                                    style={styles.avatarShop}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                                <View style={{marginLeft: 15, flex: 1}}>
                                    <Text style={styles.shopName}>{shop.name}</Text>
                                    <Text style={styles.shopAddress}>{shop.address}</Text>
                                  {/*  <Text style={styles.shopFollow}>Người theo dõi 50k</Text>*/}
                                </View>
                                <View style={{marginLeft: 15, flex: 0}}>
                                    {/*<TouchableOpacity activeOpacity={0.8} style={styles.btnChat}>
                                        <Icon name="plus" color={"#fff"} size={14}/>
                                        <Text style={styles.btnTitle}>Theo dõi</Text>
                                    </TouchableOpacity>*/}
                                    {hasChatUrl && <TouchableOpacity activeOpacity={0.8} onPress={() => {this.onOpenChat(shop)}} style={styles.btnChat}>
                                        <Icon name="chat-processing" color={"#fff"} size={14}/>
                                        <Text style={styles.btnTitle}>Chat</Text>
                                    </TouchableOpacity>}
                                </View>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        style={styles.tabBar}
                        ref={(ref) => { this.flatListRef = ref; }}
                        keyExtractor={(item) => item.key.toString()}
                        data={routes}
                        renderItem={this.renderItem}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </Animated.View>
                <TabView
                    swipeEnabled={false}
                    lazy={true}
                    navigationState={ {index: index, routes: routes}}
                    renderScene={this.renderScene}
                    onIndexChange={this.onIndexChange}
                    initialLayout={styles.initialLayout}
                    renderTabBar={this.renderTabBar}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        )
    }
}

const {deviceWidth} = platform
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff"},
    initialLayout: { width: deviceWidth},
    header: {position: "absolute", zIndex: 999, left: 0, right: 0, top: 0},
    shopInfo: {position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, justifyContent: "center", backgroundColor: 'rgba(0, 0, 0, 0.4)'},
    infoWrap: {flexDirection: "row", alignItems: "center", paddingHorizontal: 15},
    bannerShop: {width: deviceWidth, height: deviceWidth * 0.4},
    avatarShop: {width: deviceWidth * 0.14, height: deviceWidth * 0.14, borderRadius: deviceWidth * 0.08, borderWidth: 1, borderColor: "#fff"},
    shopName: {fontSize: 18, fontWeight: "bold", color: "#fff"},
    shopAddress: {fontSize: 14, color: "#fff", marginTop: 2.5},
    shopFollow: {fontSize: 14, color: "#fff", opacity: 0.7, marginTop: 2.5},
    btnChat: {alignItems: "center", flex: 1, paddingVertical: 1.5, paddingHorizontal: 5, borderRadius: 5, flexDirection: "row", borderWidth: 1, borderColor: "#fff", justifyContent: "center", marginVertical: 5},
    btnTitle: {fontSize: 14, color: "#fff", marginLeft: 5},
    tabBar: {width: deviceWidth, backgroundColor: "#fff", borderBottomWidth: 0.5, borderColor: "#a0a0a0"},
    tabItem: {alignItems: 'center', justifyContent: 'center', height: 45, width: deviceWidth/3, paddingHorizontal: 5},
    tabLabel: {fontSize: 17, textTransform: "capitalize", margin: 4, backgroundColor: 'transparent'},
})
