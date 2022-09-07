import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import config from "../config";
import platform from "../themes/Variables/platform";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from '../ui/Spinner';
import InputText from "../ui/InputText";
import {$alert} from "../ui/Alert";
import messages from "../locale/messages";
import {getAuthSync, isPhoneValid, isStrEmptyOrSpaces, numberFormat} from "../utils";
import OrderRequest from "../api/requests/OrderRequest";
import {Address, Product, ShareInfo} from "../api/interfaces";

import OrderGroupItem from "../themes/Components/OrderGroupItem";

const BOOK_TIME_NONE = 0;
const BOOK_TIME_OPTION = 1;
const BOOK_TIME_ANY = 2;
const BOOK_TIME_ANY_DATE = 3;

export default class GroupCreateScreen extends Component<any, any> {
    private shipFee: number = 0;
    private address: Address;
    private product: Product;
    private shareInfo: ShareInfo;
    private discountedUnitPrice = 0;
    private quantity = 1;
    private groupName: string = '';

    private receiptType = 1;

    constructor(props: any) {
        super(props);
        if (!props.route.params) {
            $alert(messages.defaultAddrAlert);
            return;
        }
        this.address = props.route.params.address;
        if (!this.address) {
            $alert(messages.defaultAddrAlert);
            return;
        }

        this.shipFee = 0;

        this.product = props.route.params.product;
        this.shareInfo = this.product.shareInfo[0];

        this.discountedUnitPrice = this.shareInfo.price - this.shareInfo.price_discount;

        this.state = {
            item: {product: this.product},
            note: '',
            isLoading: true,
            discounted: this.discountedUnitPrice,
            amount: this.shareInfo.price_discount,
            amountTotal: this.shareInfo.price_discount,
            shipFee: 0,
            items: [],
            shipmentNote: ''
        }
    }

    asyncInit = async () => {

        const feeData = await OrderRequest.getSharedShipFee({
            product_id: this.product.id
        });

        this.setState({
            shipFee: feeData.shipFee,
            amountTotal: feeData.shipFee + this.shareInfo.price_discount,
            isLoading: false
        })

    }

    onQuantityChange = (quantity: number) => {
        this.quantity = quantity;
        let amount = quantity*this.shareInfo.price_discount;
        this.setState({
            amount: amount,
            amountTotal: this.state.shipFee + amount,
            discounted: quantity*this.discountedUnitPrice,
            isLoading: false
        })
    }

    componentDidMount(): void {
        this.asyncInit();
    }


    checkOut = async () => {

        if (isStrEmptyOrSpaces(this.groupName)) {
            $alert('Vui lòng nhập tên nhóm');
            return;
        }

        if (this.groupName.length > 50) {
            $alert('Tên nhóm phải nhỏ hơn 50 kí tự');
            return;
        }

        if (this.state.isLoading) {
            return;
        }

        this.setState({isLoading: true});

        const res = await OrderRequest.createSharedGroup({
            groupName: this.groupName,
            shipFee: this.state.shipFee,
            shareInfo: this.shareInfo,
            quantity: this.quantity,
            addressId: this.address.id,
        });
        $alert(res.message, () => {
            this.setState({isLoading: false});
            this.props.navigation.goBack();
            this.props.navigation.goBack();
        });

    };


    render() {
        let phone = this.address.phone;
        if (this.address.phone2) {
            phone += '(' + this.address.phone2 + ')';
        }
        let buyerPhone = this.address.buyer_phone;
        if (this.address.buyer_phone2) {
            buyerPhone += '(' + this.address.buyer_phone2 + ')';
        }
        return (
            <View style={styles.container}>
                {this.state.isLoading && <Spinner/>}
                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.secondCard}>

                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="account-box" color={"#000000"} size={24}/>
                            </View>
                            <Text style={styles.cardTitle}>Tên nhóm</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{width: 30}}/>
                            <View style={{flex:1}}>
                                <InputText onChangeText={(value:string) => {
                                    this.groupName = value;
                                }} placeholder="Tên nhóm"/>
                            </View>
                        </View>
                    </View>

                    <View style={styles.firstCard}>
                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="map-marker-radius" color={"#000000"} size={24}/>
                            </View>
                            <Text style={styles.cardTitle}>Địa chỉ người nhận</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{width: 30}}/>
                            <View style={{flex: 1, paddingLeft: 15}}>
                                <Text style={styles.addrInfo}>{this.address.name}</Text>
                                <Text style={styles.addrInfo}>{this.address.decoded}</Text>
                                <Text style={styles.addrInfo}>{phone}</Text>
                                {this.address.type == 1 && <View>
                                    <Text>Người mua</Text>
                                    <Text style={styles.addrInfo}>{this.address.buyer_name + ' - ' + buyerPhone}</Text>
                                </View>}
                            </View>
                        </View>
                    </View>


                    <View style={styles.secondCard}>

                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="credit-card" color={"#000000"} size={24}/>
                            </View>
                            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{width: 30}}/>
                            <Text style={styles.cardText}>Thanh toán khi nhận hàng</Text>
                        </View>
                    </View>

                    <View style={styles.thirdCard}>
                        <View style={[styles.cardLeft, {paddingVertical: 10}]}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="package-variant-closed" color={"#000000"} size={24}/>
                            </View>
                            <Text style={styles.cardTitle}>Danh sách sản phẩm</Text>
                        </View>
                        <OrderGroupItem
                            onChange={(n) => {this.onQuantityChange(n)}}
                            item={this.state.item}
                        />

                    </View>


                    <View style={styles.secondCard}>
                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="cash-usd" color={"#000000"} size={24}/>
                            </View>
                            <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{width: 30}}/>
                            <View style={{flex: 1, paddingLeft: 15}}>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Tổng tiền sản phẩm</Text>
                                    <Text style={styles.textInfo}>{numberFormat(this.state.amount)}</Text>
                                </View>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Tiết kiệm</Text>
                                    <Text style={styles.textInfo}>{numberFormat(this.state.discounted)}</Text>
                                </View>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Phí giao hàng</Text>
                                    <Text style={styles.textInfo}>{numberFormat(this.state.shipFee)}</Text>
                                </View>

                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo2}>Tổng tiền</Text>
                                    <Text style={styles.textInfo2}>{numberFormat(this.state.amountTotal)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>

                    <View style={styles.footerLeft}>
                        <Text style={styles.footerTitle}>Tổng tiền</Text>
                        <Text style={styles.footerText}>{numberFormat(this.state.amountTotal)}</Text>
                    </View>
                    <TouchableOpacity style={styles.footerRight} onPress={this.checkOut}>
                        <Text style={styles.footerBtnText}>Tạo nhóm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    addrInfo: {fontSize: 15, color: "#a0a0a0", marginTop: 2},
    container: {flex: 1, alignItems: 'center'},
    scroll: {flex: 1, backgroundColor: "#f6f6fa"},
    firstCard: {backgroundColor: "#fff", width: platform.deviceWidth, paddingVertical: 10, paddingHorizontal: 15},
    secondCard: {
        backgroundColor: "#fff",
        width: platform.deviceWidth,
        paddingVertical: 10,
        marginTop: 5,
        paddingHorizontal: 15
    },
    thirdCard: {backgroundColor: "#fff", width: platform.deviceWidth, marginTop: 5, paddingHorizontal: 15},
    cardTitle: {fontSize: 16, color: "#000000", flex: 1, paddingVertical: 0, fontWeight: "500", paddingLeft: 15},
    cardText: {fontSize: 15, color: "#a0a0a0", paddingVertical: 0, paddingLeft: 15, flex: 1},
    footer: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderColor: "#a0a0a0"
    },
    rowInfo: {flexDirection: "row", alignItems: "center", marginTop: 2},
    titleInfo: {fontSize: 15, color: "#a0a0a0"},
    textInfo: {fontSize: 15, color: "#a0a0a0", paddingLeft: 5, flex: 1, textAlign: "right"},
    titleInfo2: {fontSize: 15, color: "#000000", fontWeight: "500"},
    textInfo2: {
        fontSize: 15,
        color: config.secondaryColor,
        fontWeight: "500",
        paddingLeft: 5,
        flex: 1,
        textAlign: "right"
    },
    cardLeft: {flexDirection: "row", alignItems: "center"},
    cardRight: {flexDirection: "row"},
    cardIcon: {width: 30, alignItems: "center"},
    footerLeft: {flex: 1},
    footerRight: {backgroundColor: config.secondaryColor, borderRadius: 5},
    footerTitle: {fontSize: 15, color: "#a0a0a0", fontWeight: "500"},
    footerText: {fontSize: 18, color: config.secondaryColor, marginTop: 2},
    footerBtnText: {paddingVertical: 7.5, paddingHorizontal: 10, fontSize: 18, color: "#fff"},
})
