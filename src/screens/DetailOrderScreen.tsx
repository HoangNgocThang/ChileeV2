import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import config from "../config";
import platform from "../themes/Variables/platform";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from '../ui/Spinner';
import Image from "react-native-fast-image";
import { numberFormat, thumbHolder } from "../utils";
import OrderRequest from "../api/requests/OrderRequest";
import { model } from "../themes/Variables/model";
import { $alert } from "../ui/Alert";
import storage from "../utils/storage";
import { CommonActions } from "@react-navigation/native";
import { navigate } from "../navigation/RootNavigation";
import { TextInput } from 'react-native-gesture-handler';

export default class DetailOrderScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            btnLoading: false,
            editNote: false,
            note: ''
        }
    }

    asyncInit = async () => {
        const order = await OrderRequest.show(this.props.route.params.code);


        setTimeout(() => {

            this.setState({
                isLoading: false,
                order: order,
                refreshing: false,
                note: order?.note || ''
            });
        }, 500)
    }

    componentDidMount(): void {
        this.asyncInit();
    }

    onCancel = async () => {
        this.setState({ btnLoading: true });
        const res: any = await OrderRequest.cancel(this.state.order.code);
        setTimeout(async () => {
            if (res.code !== 0) {
                $alert(res.message);
            } else {
                $alert(res.message);

                this.setState({ isLoading: true });
                this.asyncInit();
            }
            this.setState({ btnLoading: false });
        }, 250)
    }

    renderItem = (item: any, index: number) => {
        return (
            <View style={styles.itemWrapper} key={`${item?.id}`}>
                <View style={styles.thumbWrapper}>
                    <Image source={thumbHolder(item.thumb)} style={styles.thumb} />
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
        const { order, btnLoading } = this.state;
        if (order.status == model.STATUS_NEW) {
            return (
                <View style={styles.rowContent2}>
                    <TouchableOpacity style={styles.btnCancel} disabled={btnLoading} onPress={this.onCancel}>
                        {btnLoading ?
                            <ActivityIndicator size={20} color="#fff" />
                            : <Text style={styles.textCancel}>H???y ????n h??ng</Text>}
                    </TouchableOpacity>
                </View>
            )
        }

        return null;
    };

    renderBuyerInfo = (order: any) => {
        return <>
            <View style={styles.bodyRow}>
                <Text style={styles.titleBody}>T??n ng?????i mua</Text>
                <Text style={styles.textBody}>{order.buyer_name}</Text>
            </View>
            <View style={styles.bodyRow}>
                <Text style={styles.titleBody}>S??T ng?????i mua</Text>
                <Text style={styles.textBody}>{order.buyer_phone}</Text>
            </View>
        </>
    }

    renderBuyer = (item: any) => {
        let phone = item.buyer_phone;

        return <>
            <Text style={{ fontSize: 12, color: "#a0a0a0", marginTop: 2, fontStyle: 'italic' }}>Ng?????i mua: </Text>
            <Text style={{ fontSize: 14, color: "#a0a0a0", marginTop: 2 }}>{item.buyer_name}</Text>
            <Text style={{ fontSize: 14, color: "#a0a0a0", marginTop: 2 }}>{phone}</Text>
        </>
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner />
        }
        const { order } = this.state;
        return (

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.rowContent}>
                    <View style={styles.contentTop}>
                        <View style={styles.topLeft}>
                            <MaterialCommunityIcons name="information-outline" color={"#000000"} size={24} />
                        </View>
                        <Text style={styles.titleTop}>Th??ng tin ????n h??ng</Text>
                    </View>
                    <View style={styles.contentBody}>
                        <View style={styles.bodyLeft} />
                        <View style={styles.bodyRight}>
                            {order.shop != null &&
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
                                <Text style={styles.titleBody}>M?? ????n h??ng</Text>
                                <Text style={styles.textBody}>#{order.code}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Tr???ng th??i</Text>
                                <Text style={styles.textBody}>{order.statusText}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Th???i gian ?????t h??ng</Text>
                                <Text style={styles.textBody}>{order.created}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Th???i gian giao h??ng</Text>
                                <Text style={styles.textBody}>{order.receipt_date}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Giao h??ng </Text>
                                <Text style={styles.textBody}>
                                    {order.receipt_type == 1 ? 'Gi??? h??nh ch??nh' : 'Ngo??i gi??? h??nh ch??nh'}
                                </Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Lo???i ?????t h??ng</Text>
                                <Text style={styles.textBody}>{order.order_type ? 'Qu?? t???ng' : 'Mua cho ch??nh m??nh'}</Text>
                            </View>

                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>H??nh th???c mua</Text>
                                <Text style={styles.textBody}>{order.is_shared == 1 ? 'Mua chung' : 'Mua th?????ng'}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.titleBody}>Ghi ch??</Text>
                                </View>
                                {
                                    this.state.editNote ?
                                        <TouchableOpacity onPress={ async() => {
                                            const res = await OrderRequest.updateNote({code: order.code, note: this.state.note})
                                            console.log('res', res);
                                            if(res?.code ==0) {
                                                this.setState({
                                                    editNote: false
                                                })
                                            }
                                        }}>
                                            <MaterialCommunityIcons name={"content-save"} color={"#000000"} size={24} />
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                editNote: true
                                            })
                                        }}>
                                            <MaterialCommunityIcons name={"clipboard-edit-outline"} color={"#000000"} size={24} />
                                        </TouchableOpacity>
                                }
                            </View>
                            {
                                this.state.editNote ? (
                                    <View style={[styles.bodyRow, { alignItems: 'flex-start' }]}>
                                        <TextInput
                                            onChangeText={(text) => {
                                                this.setState({
                                                    note: text
                                                })
                                            }}
                                            multiline
                                            value={this.state.note}
                                            style={[{ color: config.secondaryColor, padding: 4, borderRadius: 4, borderWidth: 1, borderColor: 'grey', flex: 1, height: 50, alignItems: 'flex-start', justifyContent: 'flex-start' }]} />
                                    </View>
                                ) : <Text style={[styles.textBody, { textAlign: 'left' }]}>{this.state.note}</Text>
                            }
                            {order.order_type === 1 && this.renderBuyerInfo(order)}
                        </View>
                    </View>
                </View>
                <View style={styles.rowContent2}>
                    <View style={styles.contentTop}>
                        <View style={styles.topLeft}>
                            <MaterialCommunityIcons name="map-marker-radius" color={"#000000"} size={24} />
                        </View>
                        <Text style={styles.titleTop}>?????a ch??? ng?????i nh???n</Text>
                    </View>
                    <View style={styles.contentBody}>
                        <View style={styles.bodyLeft} />
                        <View style={styles.bodyRight}>
                            <Text style={{ fontSize: 15, color: "#a0a0a0" }}>
                                {order.receiver_name}
                            </Text>
                            <Text style={{ fontSize: 15, color: "#a0a0a0", marginTop: 2 }}>
                                {order.receiver_address}
                            </Text>
                            <Text style={{ fontSize: 15, color: "#a0a0a0", marginTop: 2 }}>
                                {order.receiver_phone}
                            </Text>
                        </View>
                    </View>
                </View>
                {!!order.shipment_note && <View style={styles.rowContent2}>
                    <View style={styles.contentTop}>
                        <View style={styles.topLeft}>
                            <MaterialCommunityIcons name="truck" color={"#000000"} size={24} />
                        </View>
                        <Text style={styles.titleTop}>Ghi ch?? v???n chuy???n</Text>
                    </View>
                    <View style={styles.contentBody}>
                        <View style={styles.bodyLeft} />
                        <View style={styles.bodyRight}>
                            <Text style={{ fontSize: 15, color: "#a0a0a0" }}>
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
                        <Text style={styles.titleTop}>Th??ng tin thanh to??n</Text>
                    </View>
                    <View style={styles.contentBody}>
                        <View style={styles.bodyLeft} />
                        <View style={styles.bodyRight}>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>T???ng ti???n s???n ph???m</Text>
                                <Text style={styles.textBody}>{numberFormat(order.amount_origin)}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Khuy???n m??i</Text>
                                <Text style={styles.textBody}>{numberFormat(order.amount_discount)}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Ph?? giao h??ng</Text>
                                <Text style={styles.textBody}>{numberFormat(order.ship_fee)}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={styles.titleBody}>Ph?? giao h??ng nhanh</Text>
                                <Text style={styles.textBody}>{numberFormat(order.fast_shipping_fee)}</Text>
                            </View>
                            <View style={styles.bodyRow}>
                                <Text style={{ fontSize: 15, color: "#000000", flex: 1, fontWeight: "500" }}>T???ng ti???n</Text>
                                <Text style={{ fontSize: 15, color: config.secondaryColor, fontWeight: "500", paddingLeft: 5 }}>
                                    {numberFormat(order.amount_total)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* <View style={styles.rowContent2}>
                        <View style={styles.contentTop}>
                            <View style={styles.topLeft}>
                                <MaterialCommunityIcons name="credit-card" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.titleTop}>Ph????ng th???c thanh to??n</Text>
                        </View>
                        <View style={styles.contentBody}>
                            <View style={styles.bodyLeft}/>
                            <Text style={{fontSize: 15, color: "#a0a0a0", paddingVertical: 0, paddingLeft: 15, flex: 1}}>
                                {order.payment_status==1 ? '???? thanh to??n': 'Thanh to??n khi nh???n h??ng'}
                            </Text>
                        </View>
                    </View> */}
                <View style={styles.rowContent2}>
                    <View style={styles.contentTop}>
                        <View style={styles.topLeft}>
                            <MaterialCommunityIcons name="package-variant-closed" color={"#000000"} size={24} />
                        </View>
                        <Text style={styles.titleTop}>Danh s??ch s???n ph???m</Text>
                    </View>
                    {/* <FlatList
                            style={{flex: 1, paddingVertical: 5, marginTop: 5}}
                            data={this.state.order.OrderItem}
                            keyExtractor={(item, index) => item.id.toString()}
                            renderItem={this.renderItem}
                        /> */}
                    {this.state.order.OrderItem.map((item: any, index: number) => {
                        return this.renderItem(item, index)
                    })}
                </View>
                {this.renderCancelButton()}
            </ScrollView>

        )
    }
}
const deviceWidth = platform.deviceWidth
const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: "#f6f6fa" },
    rowContent: { backgroundColor: "#fff", width: deviceWidth, paddingVertical: 10, paddingHorizontal: 15 },
    rowContent2: {
        backgroundColor: "#fff", width: platform.deviceWidth, paddingVertical: 10,
        paddingHorizontal: 15, marginTop: 5
    },
    contentTop: { flexDirection: "row", alignItems: "center" },
    contentBody: { flexDirection: "row" },
    titleTop: { fontSize: 16, color: "#000000", flex: 1, paddingVertical: 0, fontWeight: "500", paddingLeft: 15 },
    titleBody: { fontSize: 15, color: "#a0a0a0" },
    textBody: { fontSize: 15, color: config.secondaryColor, paddingLeft: 5, flex: 1, textAlign: "right" },
    topLeft: { width: 30, alignItems: "center" },
    bodyRight: { flex: 1, paddingLeft: 15 },
    bodyLeft: { width: 30 },
    bodyRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    itemWrapper: {
        width: deviceWidth - 30, flexDirection: "row", paddingVertical: 10,
        borderBottomWidth: 0.5, borderColor: "#a0a0a0"
    },
    thumbWrapper: { justifyContent: "center", flex: 0, paddingRight: 15 },
    thumb: { width: deviceWidth * 0.25, height: deviceWidth * 0.25, borderRadius: 5 },
    itemContent: { flex: 1, justifyContent: "space-between" },
    itemName: { fontSize: 18, fontWeight: "bold", flex: 1, color: config.secondaryColor },
    itemInfo: { fontSize: 16, paddingTop: 2, color: config.textColor },
    itemQuantityWrapper: { flexDirection: "row", alignItems: "center", paddingTop: 2 },
    itemUnit: { fontSize: 14, paddingTop: 2, color: "#a0a0a0", flex: 1 },
    itemQuantity: { fontSize: 16, paddingLeft: 10, color: config.textColor },
    itemPriceWrapper: { alignItems: "flex-end" },
    itemPrice: { fontSize: 16, color: config.secondaryColor },
    btnCancel: { paddingVertical: 10, backgroundColor: config.secondaryColor, alignItems: "center", borderRadius: 10 },
    textCancel: { fontSize: 16, color: "#fff" },
    shopInfo: {
        paddingTop: 2, color: config.textColor, alignSelf: 'flex-end',
        marginTop: 5, borderRadius: 5,
        padding: 5, borderWidth: 1, borderColor: config.secondaryColor
    },
    shopInfoText: { fontSize: 14, paddingTop: 2, color: config.secondaryColor, borderColor: config.secondaryColor },
})
