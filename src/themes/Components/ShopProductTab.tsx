import React, {Component} from 'react';
import {Animated, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../../config";
import ProductItem2 from "../../themes/Components/ProductItem2";
import ShopRequest from "../../api/requests/ShopRequest";
import Spinner from '../../ui/Spinner';
import platform from "../Variables/platform";
import {waitForRef} from "../../utils";
import BtnMore from "../../ui/BtnMore";

// interface State {
//     listItem: Array<any>
//     isLoading: boolean
// }
const DELAY_TIME = 2000;
export default class ShopProductTab extends Component<any>{
    scrollViewRef: any;
    page: number = 1;
    constructor(props: any) {
        super(props);

        this.state = {
            listItem: [],
            isLoading: true,
            index: props.index,
            scrollY: new Animated.Value(0),
            type: 0,
            isLoadingMore: false,
            showLoadMore: false,
        }
    }

    componentDidMount(): void {
        this.asyncInit()
    }

    asyncInit = async () => {
        const res = await ShopRequest.getProducts(1, this.state.type, this.props.shop.id);
        if (res) {
            setTimeout(() => {

                this.setState({
                    isLoading: false,
                    listItem: res.products,
                    showLoadMore: res.hasNextPage
                });
                this.checkScrollPosition()
            }, 500)
        }
    }

    onFilter = async (type: number) => {
        this.page = 1
        this.setState({type: type, isLoading: true})
        const res = await ShopRequest.getProducts(1, type, this.props.shop.id);
        if (res) {
            setTimeout(() => {

                this.setState({
                    isLoading: false,
                    listItem: res.products,
                    showLoadMore: res.hasNextPage
                });
                this.checkScrollPosition()
            }, 500)
        }
    }

    onLoadMore = async () => {
        const {listItem, type} = this.state;
        this.setState({isLoadingMore: true})
        const res = await ShopRequest.getProducts(this.page + 1, type, this.props.shop.id);
        if (res) {
            setTimeout(() => {
                this.page +=1;
                this.setState({
                    showLoadMore: res.hasNextPage,
                    isLoadingMore: false,
                    listItem: listItem.concat(res.products),
                });
            }, 250)
        }
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.index !== prevState.index){
            return { index: nextProps.index };
        }
        return null;
    }

    componentDidUpdate(prevProps: any, prevState: any) {
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
                    .then((ref:any) => {
                        ref.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false})
                    });

                /*setTimeout(() => {
                    this.scrollViewRef.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false})
                }, DELAY_TIME)*/
            }
        } else {
            waitForRef(this, 'scrollViewRef')
                .then((ref:any) => {
                    ref.getNode().scrollTo({x: 0, y: scrollY._value, animated: false})
                })
        }
    }

    checkScrollPosition = () => {
        const value = this.props.scrollY._value;
        if (value == 0) return;
        if (value > 0 && value < deviceWidth * 0.4) {
            waitForRef(this, 'scrollViewRef')
                .then((ref: any) => {
                    ref.getNode().scrollTo({x: 0, y: value, animated: false})
                });

       /*     setTimeout(() => {
                this.scrollViewRef.getNode().scrollTo({x: 0, y: value, animated: false})
            }, DELAY_TIME)*/
        }
        if (value >= deviceWidth * 0.4) {
            waitForRef(this, 'scrollViewRef')
                .then((ref: any) => {
                    ref.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false})
                });

          /*  setTimeout(() => {
                this.scrollViewRef.getNode().scrollTo({x: 0, y: deviceWidth * 0.4, animated: false})
            }, DELAY_TIME)*/
        }
    }

    _getHeaderPosition = () => {
        const {scrollY} = this.props;

        return scrollY.interpolate({
            inputRange: [0, deviceWidth * 0.4],
            outputRange: [0, - deviceWidth * 0.4],
            extrapolate: 'clamp',
        });
    };

    checkIcon = (type) => {
        if (type === 3) return "arrow-up"
        if (type === 4) return "arrow-down"
        return "unfold-more-horizontal"
    }

    renderItem = ({item, index}) => {
        return (
            <ProductItem2
                ProductItem={item}
                detailScreen={'ProductShopDetail'}
                navigation={this.props.navigation}
                index={item.id}
            />
        )
    }

    renderFilter = () => {
        const {listItem, type} = this.state
        if (listItem.length > 0) {
            return (
                <Animated.View style={[styles.filterWrap,{transform: [
                        {translateY: this._getHeaderPosition()},
                    ]}]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnFilter}
                        onPress={this.onFilter.bind(this, 0)}
                    >
                        <Text style={[styles.btnFilterTitle, {color: type === 0 ? config.secondaryColor : config.textColor}]}>Phổ biến</Text>
                    </TouchableOpacity>
                    <View style={{height: "100%", width: 1, backgroundColor: "#a0a0a0"}}/>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnFilter}
                        onPress={this.onFilter.bind(this, 1)}
                    >
                        <Text style={[styles.btnFilterTitle, {color: type === 1 ? config.secondaryColor : config.textColor}]}>Mới nhất</Text>
                    </TouchableOpacity>
                    <View style={{height: "100%", width: 1, backgroundColor: "#a0a0a0"}}/>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnFilter}
                        onPress={this.onFilter.bind(this, 2)}
                    >
                        <Text style={[styles.btnFilterTitle, {color: type === 2 ? config.secondaryColor : config.textColor}]}>Bán chạy</Text>
                    </TouchableOpacity>
                    <View style={{height: "100%", width: 1, backgroundColor: "#a0a0a0"}}/>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnFilter}
                        onPress={this.onFilter.bind(this, (type == 3) ? 4 : 3)}
                    >
                        <Text style={[styles.btnFilterTitle, {marginRight: 5, color: (type === 3 || type === 4) ? config.secondaryColor : config.textColor}]}>Giá</Text>
                        <Icon name={this.checkIcon(type)} color={(type === 3 || type === 4) ? config.secondaryColor : config.textColor} size={12}/>
                    </TouchableOpacity>
                </Animated.View>
            )
        }
        return null
    }

    renderEmpty = () => {
        return (
            <View style={{flex: 1, alignItems: "center", paddingTop: 30}}>
                <Text style={{fontSize: 16}}> Hiện chưa có sản phẩm nào!</Text>
            </View>
        )
    }

    renderFooter = () => {
        const {showLoadMore, isLoadingMore} = this.state;
        if (showLoadMore) {
            return <BtnMore isLoading={isLoadingMore} loadingMore={this.onLoadMore}/>
        }
        return null
    }

    renderContent = () => {
        const {isLoading, listItem} = this.state
        if (isLoading) {
            return <Spinner/>
        }
        return (
            <Animated.ScrollView
                contentOffset={{x: 0, y: this.props.scrollY._value}}
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
                    {listener: (event) => this.props.onScroll(event.nativeEvent.contentOffset.y),
                        useNativeDriver: true}
                )}
            >
                <FlatList
                    numColumns={2}
                    style={styles.listWrap}
                    ListEmptyComponent={this.renderEmpty}
                    data={listItem}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={this.renderFooter}
                />
            </Animated.ScrollView>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderFilter()}
                {this.renderContent()}
            </View>
        );
    }
}

const {deviceWidth, deviceHeight} = platform
const styles = StyleSheet.create({
    container: {flex: 1},
    listWrap: {
        backgroundColor: "#f6f6fa",
        paddingHorizontal: 10,
        paddingTop: deviceWidth * 0.4 + 100,
        minHeight: deviceHeight + deviceWidth * 0.4 - 95
    },
    filterWrap: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        height: 40,
        borderBottomWidth: 0.5,
        borderColor: "#a0a0a0",
        position: "absolute",
        top: deviceWidth * 0.4 + 45,
        left: 0,
        right: 0, zIndex: 999
    },
    btnFilter: {flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "center"},
    btnFilterTitle: {fontSize: 14},
});
