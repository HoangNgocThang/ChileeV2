import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from "react-native";
import config from "../config";
import platform from "../themes/Variables/platform";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from '../ui/Spinner';
import Image from "react-native-fast-image";
import {numberFormat, thumbHolder} from "../utils";
import OrderRequest from "../api/requests/OrderRequest";
import {model} from "../themes/Variables/model";
import {$alert} from "../ui/Alert";
import storage from "../utils/storage";
import {CommonActions} from "@react-navigation/native";
import {navigate} from "../navigation/RootNavigation";

export default class DetailOrderScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            btnLoading: false
        }
    }

    asyncInit = async () => {
        const order = await OrderRequest.show(this.props.route.params.code);


        setTimeout(() => {

            this.setState({
                isLoading: false,
                order: order,
                refreshing: false
            });
        }, 500)
    }

    componentDidMount(): void {
        this.asyncInit();
    }

    onCancel = async () => {
        this.setState({btnLoading: true});
        const res = await OrderRequest.cancel(this.state.order.code);
        setTimeout(async () => {
            if (res.code !== 0) {
                $alert(res.message);
            } else {
                $alert(res.message);

                this.setState({isLoading: true});
                this.asyncInit();
            }
            this.setState({btnLoading: false});
        }, 250)
    }

    renderItem = ( item:any, index:number ) => {
        return  (
            <View style={styles.itemWrapper} key={`${item?.id}`}>
                <View style={styles.thumbWrapper}>
                    <Image source={thumbHolder(item.thumb)} style={styles.thumb}/>
                </View>
                <View style={styles.itemContent}>
                    <View>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemInfo}>{item.from}</Text>
                        <View style={styles.itemQuantityWrapper}>
                            <Text style={styles.itemUnit}>{item.unit}</Text>
                            <Text style={styles.itemQuantity}>x {item.quantity}</Text>
                        </View>
                    </View>
                    <View style={styles.itemPriceWrapper}>
                        <Text style={styles.itemPrice}>
                            {numberFormat(item.price)}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    renderCancelButton = () => {
        const {order, btnLoading} = this.state;
        if (order.status == model.STATUS_NEW) {
            return (
                <View style={styles.rowContent2}>
                    <TouchableOpacity style={styles.btnCancel} disabled={btnLoading} onPress={this.onCancel}>
                        {btnLoading ?
                            <ActivityIndicator size={20} color="#fff" />
                            : <Text style={styles.textCancel}>Hủy đơn hàng</Text>}
                    </TouchableOpacity>
                </View>
            )
        }

        return null;
    };

    renderBuyerInfo = (order) => {
        return <>
            <View style={styles.bodyRow}>
                <Text style={styles.titleBody}>Tên người mua</Text>
                <Text style={styles.textBody}>{order.buyer_name}</Text>
            </View>
            <View style={styles.bodyRow}>
                <Text style={styles.titleBody}>SĐT người mua</Text>
                <Text style={styles.textBody}>{order.buyer_phone}</Text>
            </View>
        </>
    }

    renderBuyer = (item) => {
        let phone = item.buyer_phone;

        return <>
            <Text style={{fontSize: 12, color: "#a0a0a0", marginTop: 2, fontStyle:'italic'}}>Người mua: </Text>
            <Text style={{fontSize: 14, color: "#a0a0a0", marginTop: 2}}>{item.buyer_name}</Text>
            <Text style={{fontSize: 14, color: "#a0a0a0", marginTop: 2}}>{phone}</Text>
        </>
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner/>
        }
        const {order} = this.state;
        return (

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.rowContent}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="information-outline" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Thông tin đơn hàng</Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.bodyLeft}/>
                            <View style={styles.bodyRight}>
                                {order.shop !=null &&
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>{'Shop '}</Text>
                                    <TouchableOpacity style={styles.shopInfo} onPress={() => {
                                        navigate('ShopDetailScreen', {
                                            id: order.shop.id
                                        })
                                    }}>
                                        <Text style={styles.shopInfoText}>
                                            {order.shop.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>}

                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Mã đơn hàng</Text>
                                    <Text style={styles.textBody}>#{order.code}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Trạng thái</Text>
                                    <Text style={styles.textBody}>{order.statusText}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Thời gian đặt hàng</Text>
                                    <Text style={styles.textBody}>{order.created}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Thời gian giao hàng</Text>
                                    <Text style={styles.textBody}>{order.receipt_date}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Giao hàng </Text>
                                    <Text style={styles.textBody}>
                                        {order.receipt_type==1?'Giờ hành chính' : 'Ngoài giờ hành chính'}
                                    </Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Loại đặt hàng</Text>
                                    <Text style={styles.textBody}>{order.order_type?'Quà tặng':'Mua cho chính mình'}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Ghi chú</Text>
                                    <Text style={styles.textBody}>{order.note}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Hình thức mua</Text>
                                    <Text style={styles.textBody}>{order.is_shared==1 ? 'Mua chung': 'Mua thường'}</Text>
                                </View>
                                {order.order_type===1 && this.renderBuyerInfo(order)}
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowContent2}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="map-marker-radius" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Địa chỉ người nhận</Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.bodyLeft}/>
                            <View style={styles.bodyRight}>
                                <Text style={{fontSize: 15, color: "#a0a0a0"}}>
                                    {order.receiver_name}
                                </Text>
                                <Text style={{fontSize: 15, color: "#a0a0a0", marginTop: 2}}>
                                    {order.receiver_address}
                                </Text>
                                <Text style={{fontSize: 15, color: "#a0a0a0", marginTop: 2}}>
                                    {order.receiver_phone}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {!!order.shipment_note&&<View style={styles.rowContent2}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="truck" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Ghi chú vận chuyển</Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.bodyLeft}/>
                            <View style={styles.bodyRight}>
                                <Text style={{fontSize: 15, color: "#a0a0a0"}}>
                                    {order.shipment_note}
                                </Text>

                            </View>
                        </View>
                    </View>}
                    <View style={styles.rowContent2}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="cash-refund" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Thông tin thanh toán</Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.bodyLeft}/>
                            <View style={styles.bodyRight}>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Tổng tiền sản phẩm</Text>
                                    <Text style={styles.textBody}>{numberFormat(order.amount)}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Khuyến mãi</Text>
                                    <Text style={styles.textBody}>{numberFormat(order.amount_discount)}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Phí giao hàng</Text>
                                    <Text style={styles.textBody}>{numberFormat(order.ship_fee)}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={styles.titleBody}>Phí giao hàng nhanh</Text>
                                    <Text style={styles.textBody}>{numberFormat(order.fast_shipping_fee)}</Text>
                                </View>
                                <View style={styles.bodyRow}>
                                    <Text style={{fontSize: 15, color: "#000000", flex: 1, fontWeight: "500"}}>Tổng tiền</Text>
                                    <Text style={{fontSize: 15, color: config.secondaryColor, fontWeight: "500", paddingLeft: 5}}>
                                        {numberFormat(order.amount_total)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowContent2}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="credit-card" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Phương thức thanh toán</Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.bodyLeft}/>
                            <Text style={{fontSize: 15, color: "#a0a0a0", paddingVertical: 0, paddingLeft: 15, flex: 1}}>
                                {order.payment_status==1 ? 'Đã thanh toán': 'Thanh toán khi nhận hàng'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowContent2}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="package-variant-closed" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Danh sách sản phẩm</Text>
                        </View>
                        {/* <FlatList
                            style={{flex: 1, paddingVertical: 5, marginTop: 5}}
                            data={this.state.order.OrderItem}
                            keyExtractor={(item, index) => item.id.toString()}
                            renderItem={this.renderItem}
                        /> */}
                        {this.state.order.OrderItem.map((item:any,index:number)=> {
                            return this.renderItem(item,index)
                        })}
                    </View>
                    {this.renderCancelButton()}
                </ScrollView>

        )
    }
}
const deviceWidth= platform.deviceWidth
const styles = StyleSheet.create({
    scrollView: {flex: 1, backgroundColor: "#f6f6fa"},
    rowContent: {backgroundColor: "#fff", width: deviceWidth, paddingVertical: 10, paddingHorizontal: 15},
    rowContent2: {
        backgroundColor: "#fff", width: platform.deviceWidth, paddingVertical: 10,
        paddingHorizontal: 15, marginTop: 5
    },
    contentTop: {flexDirection: "row", alignItems: "center"},
    contentBody: {flexDirection: "row"},
    titleTop: {fontSize: 16, color: "#000000", flex: 1, paddingVertical: 0, fontWeight: "500", paddingLeft: 15},
    titleBody: {fontSize: 15, color: "#a0a0a0"},
    textBody: {fontSize: 15, color: config.secondaryColor, paddingLeft: 5, flex: 1, textAlign: "right"},
    topLeft: {width: 30, alignItems: "center"},
    bodyRight: {flex: 1, paddingLeft: 15},
    bodyLeft: {width: 30},
    bodyRow: {flexDirection: "row", alignItems: "center", marginTop: 2},
    itemWrapper: {
        width: deviceWidth - 30, flexDirection: "row", paddingVertical: 10,
        borderBottomWidth: 0.5, borderColor: "#a0a0a0"
    },
    thumbWrapper: {justifyContent: "center", flex: 0, paddingRight: 15},
    thumb: {width: deviceWidth * 0.25, height: deviceWidth * 0.25, borderRadius: 5},
    itemContent: {flex: 1, justifyContent: "space-between"},
    itemName: {fontSize: 18, fontWeight: "bold", flex: 1, color: config.secondaryColor},
    itemInfo: {fontSize: 16, paddingTop: 2, color: config.textColor},
    itemQuantityWrapper: {flexDirection: "row", alignItems: "center", paddingTop: 2},
    itemUnit: {fontSize: 14, paddingTop: 2, color: "#a0a0a0", flex: 1},
    itemQuantity: {fontSize: 16, paddingLeft: 10, color: config.textColor},
    itemPriceWrapper: {alignItems: "flex-end"},
    itemPrice: {fontSize: 16, color: config.secondaryColor},
    btnCancel: {paddingVertical: 10, backgroundColor: config.secondaryColor, alignItems: "center", borderRadius: 10},
    textCancel: {fontSize: 16, color: "#fff"},
    shopInfo: {paddingTop: 2, color: config.textColor, alignSelf: 'flex-end',
        marginTop:5, borderRadius: 5,
        padding:5,  borderWidth: 1, borderColor: config.secondaryColor},
    shopInfoText: {fontSize: 14, paddingTop: 2, color: config.secondaryColor,borderColor:config.secondaryColor},
})
