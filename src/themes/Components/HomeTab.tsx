import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Animated, FlatList, Text, Image} from "react-native";
import config from "../../config";
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import platform from "../../themes/Variables/platform";
import Spinner from '../../ui/Spinner';
import HomeTabItem from "../../themes/Components/HomeTabItem";
import {Campaign, Product} from "../../api/interfaces";
import SearchBox from "../../ui/SearchBox";
import BannerHome from "../../screens/BannerHome";
import HomeRequest from "../../api/requests/HomeRequest";
import BannerCategory from "../../ui/BannerCategory";
import CategoryRequest, {GetProductResponse} from "../../api/requests/CategoryRequest";

const img = require("../../assets/logo.jpg");

interface Props {
    campaigns: Array<Campaign>,
    navigation: any,
    listBanner: Array<any>,
}

interface State {
    index: number,
    isLoading: boolean,
    routes: Array<any>,
    products: Array<Product>,
    scrollY: any,
    tabLoading: boolean
    hasReadMore: boolean
    isLoadingMore: boolean,
    categories: []
}

const productCache: any = {};
export default class HomeTab extends Component<Props, State>{
    flatListRef: any;
    scrollViewRef: any
    page: number = 1;
    constructor(props: any) {
        super(props);

        this.state = {
            index : 0,
            isLoading: true,
            tabLoading: true,
            routes: [],
            products: [],
            scrollY: new Animated.Value(0),
            isLoadingMore: false,
            hasReadMore: false,
            categories: [],
        }
    }

    asyncInit = async () => {

        const {campaigns} = this.props
        if (campaigns && campaigns.length > 0) {
            let routes = campaigns.map((value, index, res) => {
                let item: any = {};
                item["title"] = value.name;
                item["key"] = value.id;
                item["index"] = index;
                return item
            });
            await this.loadCampaign(campaigns[0].id);

            setTimeout(() => {

                this.setState({
                    isLoading: false,
                    routes: routes
                });
            }, 500)
        }

    }

    componentDidMount(): void {
        this.asyncInit();

    }

    onLoadMore = async (campaignId: number) => {
        this.page += 1;
        this.setState({isLoadingMore: true});
        const res = await CategoryRequest.getProducts(campaignId, {page: this.page, limit: 26});

        this.setState({products: this.state.products.concat(res.products),
            isLoadingMore: false, hasReadMore: res.hasNextPage})
    }

    loadCampaign = (campaignId: number) => {
        if (productCache[campaignId]) {
            const res:GetProductResponse = productCache[campaignId];

            this.setState({products: res.products, tabLoading: false,
                hasReadMore: res.hasNextPage, categories: res.categories})
        } else {
            this.setState({products: [], tabLoading: true});
            CategoryRequest.getProducts(campaignId, {}).then((res: GetProductResponse) => {

                productCache[campaignId] = res;
                this.setState({products: res.products, tabLoading: false,
                    hasReadMore: res.hasNextPage,
                    categories: res.categories})
            });
        }
    }

    onIndexChange = (index: number) => {
        if (this.state.index != index) {
            this.page = 1;
            const campaignId = this.props.campaigns[index].id;
            this.loadCampaign(campaignId);
            this.setState({index: index});
            if (this.state.scrollY._value > deviceWidth * 0.7 + 80) {
                setTimeout(() => {
                    this.scrollViewRef.getNode().scrollTo({x: 0, y: deviceWidth * 0.7 + 80, animated: true})
                }, 1)
            }
            this.flatListRef.scrollToIndex({animated: true, index: index, viewPosition: 0.5});
        }
    }

    renderScene = ({ route }) => {
        const {listBanner, navigation, campaigns} = this.props;

        return <HomeTabItem
            loading={this.state.tabLoading}
            products={this.state.products}
            campaign={campaigns[route.index]}
            navigation={navigation}
            banner={listBanner}
            show={route.index === this.state.index}
            onLoadMore={() => this.onLoadMore(campaigns[route.index].id)}
            hasReadMore={this.state.hasReadMore}
            isLoadingMore={this.state.isLoadingMore}
        />
    };

    _getTabBarOpacity = () => {
        const {scrollY} = this.state;

        return scrollY.interpolate({
            inputRange: [deviceWidth * 0.7 + 79, deviceWidth * 0.7 + 80],
            outputRange: [0, 1],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    _getTabBarPosition = () => {
        const {scrollY} = this.state;

        return scrollY.interpolate({
            inputRange: [0, deviceWidth * 0.7 + 80],
            outputRange: [deviceWidth * 0.7 + 80, 0],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    renderTabBar = props =>  {

        return  <TabBar
            {...props}
            indicatorStyle={styles.indicatorStyle}
            style={styles.tabBarStyle}
            tabStyle={styles.tabStyle}
            scrollEnabled={true}
            pressOpacity={1}
            bounces={false}
            swipeEnabled={false}
            labelStyle={styles.labelStyle}
            inactiveColor={"#4b4b4b"}
            activeColor={config.secondaryColor}
        />
    }

    renderCategoryItem = ({item, index}) => {
        return (
            <TouchableOpacity
                style={styles.btnCategory}
                activeOpacity={1}
                onPress={() => this.props.navigation.navigate("ListProductScreen", {id: item.id, title: item.name})}
            >
                <Image source={item.thumb} style={styles.iconCategory} resizeMode={"contain"}/>
                <Text style={styles.categoryName} numberOfLines={1} ellipsizeMode={"tail"}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    renderHeader = () => {
        const {listBanner, navigation, campaigns} = this.props;
        if (listBanner) {
            return (
                <View style={{backgroundColor: "#f6f6fa"}}>
                    <BannerHome navigation={navigation} listBanner={listBanner} />
                    <FlatList
                        numColumns={5}
                        keyExtractor={(item, index) => item.id.toString()}
                        style={{marginTop: 15, marginBottom: 5}}
                        showsVerticalScrollIndicator={false}
                        data={this.state.categories}
                        renderItem={this.renderCategoryItem}
                    />
                </View>
            )
        }
        return null
    }

    renderContent = () => {
        const {isLoading, index, routes} = this.state
        if (isLoading) {
            return <View style={{flex:1, backgroundColor:'#fff'}}>
                <Spinner/>
            </View>
        }
        return (
            <View>
                {this.renderHeader()}
                <TabView
                    swipeEnabled={true}
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

    render() {
        const {isLoading, index, routes} = this.state
        return (
            <View style={{flex: 1}}>
                <Animated.View  style={[styles.tabWrap,{
                    opacity: this._getTabBarOpacity(),
                    transform: [
                        {translateY: this._getTabBarPosition()},
                    ]
                }]}>
                    <FlatList
                        ref={(ref) => { this.flatListRef = ref; }}
                        keyExtractor={(item) => item.key.toString()}
                        contentContainerStyle={styles.contentContainerStyle}
                        data={routes}
                        renderItem={this.renderItem}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </Animated.View>
                <Animated.ScrollView
                    ref={(ref) => { this.scrollViewRef = ref; }}
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: this.state.scrollY}}
                            }
                        ]
                    )}
                >
                    <View style={styles.searchBoxWrapper}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("SearchScreen")}>
                            <SearchBox
                                config={{placeholder :"Bạn tìm gì hôm nay...", placeholderTextColor: "#a0a0a0", editable: false, pointerEvents: "none"}}
                                style={{backgroundColor: "#ededed"}}
                            />
                        </TouchableOpacity>
                    </View>
                    {this.renderContent()}
                </Animated.ScrollView>
            </View>
        )
    }
}
const {deviceWidth, deviceHeight} = platform
const styles = StyleSheet.create({
    container:{ flex: 1},
    indicatorStyle: { backgroundColor: config.secondaryColor },
    tabBarStyle: { backgroundColor: "#fff"},
    tabStyle: {width: "auto", paddingHorizontal: 5, minHeight: 45},
    labelStyle: {fontSize: 17, textTransform: "capitalize"},
    initialLayout: { width: deviceWidth},
    searchBoxWrapper: {
        paddingHorizontal: 15,
        width: deviceWidth,
        justifyContent: "flex-end",
        backgroundColor: "#fff",
        height: 60, paddingBottom: 10
    },
    contentContainerStyle: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
            height: StyleSheet.hairlineWidth,
            width: 0,
        },
        zIndex: 1
    },
    tabWrap: {position: "absolute", top: 0, backgroundColor: "#fff", minHeight: 45, left: 0, right: 0, zIndex:99},
    tabItem: {alignItems: 'center', justifyContent: 'center', paddingVertical: 10, minHeight: 45, width: "auto", paddingHorizontal: 5},
    tabLabel: {fontSize: 17, textTransform: "capitalize", margin: 4, backgroundColor: 'transparent'},
    btnCategory: {width: deviceWidth*0.2, height: deviceWidth*0.2, alignItems: "center"},
    iconCategory: {width: deviceWidth/5 -30, height: deviceWidth/5 - 30},
    categoryName: {fontSize: 14, color: config.textColor, paddingVertical: 0, marginTop: 5},
});
