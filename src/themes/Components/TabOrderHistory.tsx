import React, {PureComponent} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import platform from "../Variables/platform";
import config from "../../config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {debounce, numberFormat} from "../../utils";
import Image from "react-native-fast-image";
import Spinner from "../../ui/Spinner";
import BtnMore from "../../ui/BtnMore";
import {thumbHolder} from "../../utils";
import {navigate} from "../../navigation/RootNavigation";
import OrderHistoryRequest from "../../api/requests/OrderHistoryRequest";

interface Props {
    status: number
}
const defaultWidth = platform.deviceWidth;
let timeoutId = 0;
const LIMIT = 10;
export default class TabOrderHistory extends PureComponent<Props>{
    private initialRoute: string;
    private listener: any;
    private page = 1;

    constructor(props: any) {
        super(props);
        this.initialRoute = props.initialRoute;

        this.state = {
            isLoading: true,
            loadingMore: false,
            showLoadingMore: false,
            orders: []
        }
    }

    asyncInit  = debounce(async () => {

        const res = await OrderHistoryRequest.get({status: this.props.status, page: this.page});
        const orders = res.orders;
        if (orders.length > 0) {

            setTimeout(() => {
                if (this.page === 1) {
                    this.setState({
                        orders: orders,
                        isLoading: false,
                        showLoadingMore: res.hasNextPage
                    });
                } else {
                    const newOrders = [...this.state.orders,...orders];
                    this.setState({
                        orders: newOrders,
                        isLoading: false,
                        loadingMore: false,
                        showLoadingMore: res.hasNextPage
                    });
                }

            }, 500)
        } else {
            this.setState({showLoadingMore: false, isLoading: false});
        }

    })

    onFocus = () => {
        this.page = 1;
        this.setState({isLoading: true});
        //console.log('asyncinit')
        this.asyncInit();
    }

    componentDidMount(): void {
        this.listener = this.props.navigation.addListener('focus', this.onFocus)

        this.asyncInit();
        // if (this.initialRoute &&  MixStore.isJumped ) {
        //     MixStore.isJumped = false;
        //     setTimeout(() => {
        //         this.props.jumpTo(this.initialRoute);
        //         this.initialRoute = null;
        //     }, 1000)
        // }

    }

    onNavigate = () => {
        this.props.navigation.navigate("HomeScreen")
    }

    renderItem = (product: any, order: any) => {

        return  <View style={styles.itemWrapper}>
            <View style={styles.itemLeft}>
                <Image source={thumbHolder(product.thumb)} style={styles.imageProduct}/>
            </View>
            <View style={styles.itemRight}>
                <View>
                    <Text style={styles.itemName}>{product.name}</Text>
                    {order.shop !=null && <TouchableOpacity style={styles.shopInfo} onPress={() => {
                        navigate('ShopDetailScreen', {
                            id: order.shop.id
                        })
                    }}>
                        <Text style={styles.shopInfoText}>{order.shop.name}</Text>
                    </TouchableOpacity>}
                    <View style={styles.itemUnitWrapper}>
                        <Text style={styles.itemUnit}>{product.unit}</Text>
                        <Text style={styles.itemQuantity}>x {product.quantity}</Text>
                    </View>
                    <Text style={styles.itemTime}>{order.created}</Text>
                </View>
                <View style={styles.itemPriceWrapper}>
                    <Text style={styles.itemPrice}>
                        {numberFormat(product.price)}
                    </Text>
                </View>
            </View>
        </View>
    }

    renderOrderCard = ({item, index}) => {
        const order = item;
        const product = item.OrderItem[0];
        const totalItem = item.OrderItem.length;
        const remainItem = totalItem - 1;

        return (
            <View style={styles.cardWrapper}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderCode}>
                        #{order.code}
                        {order.is_shared==1 && <Text style={{fontSize: 14}}>
                            <MaterialCommunityIcons name="account-group" />
                            </Text>}
                    </Text>

                    <Text style={styles.cardHeaderStatus}>{order.statusText}</Text>
                </View>
                {this.renderItem(product, order)}
                <TouchableOpacity style={styles.cardBodyButton}
                                  onPress={() => this.props.navigation.navigate("DetailOrderScreen", {code: order.code})}>
                    <Text style={styles.bodyButtonText}>
                       Chi tiết {remainItem > 0 ? remainItem + ' sản phẩm' : ''}
                    </Text>
                </TouchableOpacity>
                <View style={styles.cardFooter}>
                    <Text style={styles.footerItem}>{totalItem} sản phẩm</Text>
                    <View style={styles.footerIconWrapper}>
                        <MaterialCommunityIcons name="receipt" color={config.secondaryColor} size={14} />
                        <Text style={styles.footerIconText}>Tổng tiền</Text>
                    </View>
                    <Text style={styles.footerTotal}>{numberFormat(order.amount_total)}</Text>
                </View>
            </View>
        )

    }

    loadingMore = () => {
        this.page++;
        this.setState({loadingMore: true});
        this.asyncInit();

    }
    render() {
        if (this.state.isLoading) {
            return <Spinner/>
        }

        return (
            <View style={styles.container}>
                {this.state.orders.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ref="Status"
                        style={styles.flatList}
                        data={this.state.orders}
                        renderItem={this.renderOrderCard}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={() => {
                            if (!this.state.showLoadingMore) {
                                return null;
                            }
                            return <BtnMore isLoading={this.state.loadingMore} loadingMore={this.loadingMore}/>
                        }}
                        extraData={this.state}
                        maxToRenderPerBatch={10}
                        initialNumToRender={4}
                    />
                    :
                    <View style={styles.emptyWrapper}>
                        <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={this.onNavigate}>
                            <Text style={styles.emptyButtonText}>Đặt hàng ngay</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{ flex: 1},
    flatList: {width: platform.deviceWidth, flex: 1},
    emptyWrapper: {alignItems: "center", flex: 1, justifyContent: "center"},
    emptyText: {fontSize: 18, paddingVertical: 10},
    emptyButton: {paddingVertical: 5, paddingHorizontal: 10, backgroundColor: config.secondaryColor, borderRadius: 5},
    emptyButtonText: {fontSize: 18, color: "#fff"},
    cardWrapper: {paddingHorizontal: 15, marginBottom: 5, backgroundColor: "#fff", paddingTop: 10},
    cardHeader: {flexDirection: "row", alignItems: "center", justifyContent: "space-between"},
    cardHeaderCode: {fontSize: 18, color: config.secondaryColor, fontWeight: "500"},
    cardHeaderStatus: {fontSize: 14, color: config.textColor, marginLeft: 10},
    cardBodyButton: {borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: "#a0a0a0", alignItems: "center"},
    bodyButtonText: {fontSize: 14, color: "#a0a0a0", paddingVertical: 5},
    cardFooter: {flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10},
    footerItem: {fontSize: 14, color: "#a0a0a0"},
    footerTotal: {fontSize: 14, color: config.secondaryColor},
    footerIconWrapper: {flexDirection: "row", alignItems: "center", marginHorizontal: 5},
    footerIconText: {fontSize: 14, fontWeight: "bold", marginLeft: 5, color: config.secondaryColor},
    itemWrapper: {width: defaultWidth - 30, flexDirection: "row", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#a0a0a0"},
    itemLeft: {justifyContent: "center", flex: 0, paddingRight: 15},
    itemRight: {flex: 1, justifyContent: "space-between"},
    imageProduct: {width: defaultWidth * 0.25, height: defaultWidth * 0.25, borderRadius: 5},
    itemName: {fontSize: 18, fontWeight: "bold", flex: 1, color: config.secondaryColor},
    itemTime: {fontSize: 14, paddingTop: 2, color: config.textColor, flex: 1},
    itemUnit: {fontSize: 14, paddingTop: 2, color: config.textColor, flex: 1},
    itemQuantity: {fontSize: 16, paddingLeft: 10, color: config.textColor},
    itemPrice: {fontSize: 16, color: config.secondaryColor},
    itemUnitWrapper: {flexDirection: "row", alignItems: "center", paddingTop: 2},
    itemPriceWrapper: {alignItems: "flex-end"},
    shopInfo: {paddingTop: 2, color: config.textColor, alignSelf: 'flex-start',
        marginTop:5, borderRadius: 5,
        padding:5,  borderWidth: 1, borderColor: config.secondaryColor},
    shopInfoText: {fontSize: 14, paddingTop: 2, color: config.secondaryColor,borderColor:config.secondaryColor},
});
