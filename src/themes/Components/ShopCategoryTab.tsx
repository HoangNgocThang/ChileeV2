import React, {Component} from 'react';
import {Animated, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import config from "../../config";
import ShopRequest from "../../api/requests/ShopRequest";
import Spinner from '../../ui/Spinner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import platform from "../Variables/platform";
import FastImage from "react-native-fast-image";
import {waitForRef} from "../../utils";
import {Category} from "../../api/interfaces";

const img = require("../../assets/logo.jpg");

interface Props {
    onScroll: Function
    category: any
    navigation: any
    scrollY: any
    index: number
    tabKey: any
}

interface State {
    scrollY: any
    isLoading: boolean
    index: number,
    categories: Array<Category>
}

export default class ShopCategoryTab extends Component<Props, State>{
    scrollViewRef: any;
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            index: props.index,
            scrollY: new Animated.Value(0),
            categories: []
        }
    }

    asyncInit = async () => {
        const res = await ShopRequest.getCategories(this.props.shop.id);
        this.setState({
            categories: res.categories
        })
    };

    componentDidMount(): void {
        this.checkScrollPosition();
        this.asyncInit();
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
                        ref.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false});
                    })

            }
        } else {
            waitForRef(this, 'scrollViewRef')
                .then((ref: any) => {
                    ref.getNode().scrollTo({x: 0, y: scrollY._value, animated: false})
                })
        }
    }

    checkScrollPosition = () => {
        const value = this.props.scrollY._value;
        if (value == 0) return;
        if (value > 0 && value < deviceWidth * 0.4) {
            waitForRef(this, 'scrollViewRef')
                .then((ref:any) => {
                    ref.getNode().scrollTo({x: 0, y: value, animated: false})
                });

        }
        if (value >= deviceWidth * 0.4) {
            waitForRef(this, 'scrollViewRef')
                .then((ref:any) => {
                    ref.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false})
                });

        }
    }

    onNavigate = (item: any) => {
        this.props.navigation.navigate("ListProductScreen",
            {id: item.id, detailScreen: 'ProductShopDetail', title: item.name})
    }


    renderItem = ({item}) => {
        return (
            <TouchableOpacity
                style={styles.itemWrap}
                activeOpacity={1}
                onPress={this.onNavigate.bind(this, item)}
            >
                <FastImage
                    source={item.thumb}
                    style={styles.icon}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{flex: 1, marginHorizontal: 10}}>
                    <Text style={styles.itemName} numberOfLines={1} ellipsizeMode={"tail"}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>{item.total} sản phẩm</Text>
                </View>
                <Icon name="chevron-right" color={config.textColor} size={18}/>
            </TouchableOpacity>
        )
    }

    renderContent = () => {
        const {onScroll, scrollY, category} = this.props
        // const {isLoading} = this.state
        // if (isLoading) {
        //     return <Spinner/>
        // }
        return (
            <Animated.ScrollView
                contentOffset={{x: 0, y: scrollY._value}}
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
                    <FlatList
                        data={this.state.categories}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
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
    content: {flex: 1, minHeight: deviceHeight * 1.3, paddingTop: deviceWidth * 0.4 + 45},
    itemWrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#a0a0a0"
    },
    icon: {width: deviceWidth/10, height: deviceWidth/10},
    itemName: {fontSize: 15, color: config.secondaryColor, fontWeight: "700"},
    itemQuantity: {fontSize: 12, color: config.textColor, marginTop: 5},
});
