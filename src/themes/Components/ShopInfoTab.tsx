import React, {Component} from 'react';
import {Animated, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../../config";
import ShopRequest from "../../api/requests/ShopRequest";
import platform from "../Variables/platform";
import BannerHome from "../../screens/BannerHome";
import ProductItem3 from "./ProductItem3";
import {waitForRef} from "../../utils";

interface Props {
    onScroll: Function
    banner: Array<any>
    campaigns: any
    navigation: any
    scrollY: any
    index: number
    tabKey: any
}

interface State {
    listItem: Array<any>
    isLoading: boolean,
    scrollY: any
    index: number
}

const DELAY_TIME = 1000;
export default class ShopInfoTab extends Component<Props, State>{
    scrollViewRef: any;
    constructor(props: any) {
        super(props);

        this.state = {
            index: props.index,
            listItem: [],
            isLoading: true,
            scrollY: new Animated.Value(0),
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.index !== prevState.index){
            return { index: nextProps.index };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.index !== this.state.index) {
            this.updateScrollPosition()
        }
    }

    updateScrollPosition = () => {
        const {scrollY, tabKey} = this.props
        if (this.state.index !== tabKey) return null
        const value = this.state.scrollY._value;
        if (scrollY._value > deviceWidth * 0.4) {
            if (value < deviceWidth * 0.4) {
                waitForRef(this, 'scrollViewRef')
                    .then((ref: any) => {
                        ref.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false})
                    })

            }
        } else {
            waitForRef(this, 'scrollViewRef')
                .then((ref: any) => {
                    ref.getNode().scrollTo({x: 0, y: scrollY._value, animated: false})
                })

        }
    }

    onNavigate = (id) => {
        this.props.navigation.navigate("ListProductScreen", {id: id, detailScreen: 'ProductShopDetail'})
    }

    renderItem = ({item}) => {
        return (
            <ProductItem3
                ProductItem={item}
                navigation={this.props.navigation}
                index={item.id}
            />
        )
    }

    renderCampaigns = () => {
        const {campaigns} = this.props;
        return (
            <View>
                {campaigns.map((item: any) => {
                    return (
                        <View style={styles.campaignWrap} key={item.id}>
                            <View style={styles.campaignTitle}>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                    style={styles.textTitle}>{item.name}</Text>
                                <TouchableOpacity
                                    style={{flexDirection: "row", alignItems: "center"}}
                                    activeOpacity={1}
                                    onPress={this.onNavigate.bind(this, item.id)}
                                >
                                    <Text style={styles.textMore}>Xem thêm</Text>
                                    <Icon name="chevron-right" color={config.textColor} size={14}/>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                contentContainerStyle={{paddingHorizontal: 10}}
                                style={styles.listCampaignItem}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={item.products}
                                renderItem={this.renderItem}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    )
                })}
            </View>
        )
    }

    renderContent = () => {
        const {onScroll, banner} = this.props;
        return (
            <Animated.ScrollView
                style={styles.scroll}
                ref={(ref) => { this.scrollViewRef = ref; }}
                contentContainerStyle={{paddingBottom: 15}}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: {
                            contentOffset: {
                                y: this.state.scrollY
                            }
                        },
                    }],
                    {listener: (event) => onScroll(event.nativeEvent.contentOffset.y),
                        useNativeDriver: true}
                )}
            >
                <View style={styles.content}>
                    <BannerHome detail={'ProductShopDetail'}  navigation={this.props.navigation} listBanner={banner}/>
                    {this.renderCampaigns()}
                </View>
            </Animated.ScrollView>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        );
    }
}

const {deviceWidth, deviceHeight} = platform
const styles = StyleSheet.create({
    container: {flex: 1},
    scroll: {flex: 1, backgroundColor: "#f6f6fa"},
    content: {flex: 1, minHeight: deviceHeight * 1.3, paddingTop: deviceWidth * 0.4 + 60},
    campaignWrap: {marginTop: 10, backgroundColor: "#fff"},
    campaignTitle: {flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 7.5},
    textTitle: {fontSize: 18, color: config.secondaryColor, flex: 1, paddingRight: 5},
    textMore: {fontSize: 14, color: config.textColor, marginRight: 2.5},
    listCampaignItem: {paddingTop: 15, backgroundColor: "#f6f6fa"},
});
