import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    Platform, TextInput as Input, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Keyboard
} from "react-native";
import config from "../config";
import OrderItem from "../themes/Components/OrderItem"
import platform from "../themes/Variables/platform";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from '../ui/Spinner';
import InputText from "../ui/InputText";
import { $alert, confirm } from "../ui/Alert";
import messages from "../locale/messages";
import CartStore from "../store/CartStore";
import { debounce, getAuthSync, getRemoteConfigSync, isPhoneValid, isStrEmptyOrSpaces, numberFormat } from "../utils";
import OrderRequest from "../api/requests/OrderRequest";
import { Address } from "../api/interfaces";
import { CommonActions } from '@react-navigation/native';
import { navigate } from "../navigation/RootNavigation";
import DatePickerCheckout from "../ui/DatePickerCheckout";
import { RadioButton } from "../ui/RadioButton";
import { CheckBox } from "../ui/CheckBox";
import TimePickerCheckout from "../ui/TimePickerCheckout";
import storage from "../utils/storage";
import { TextInput } from 'react-native-gesture-handler';
const BOOK_TIME_NONE = 0;
const BOOK_TIME_OPTION = 1;
const BOOK_TIME_ANY = 2;
const BOOK_TIME_ANY_DATE = 3;
const IS_IOS = (Platform.OS === "ios");
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
    navigation: any
}

export default class CheckoutScreen extends Component<Props, any>{

    private shipFee: number = 0;
    private fastShipFee: number = 0;
    private address: Address;
    private note: string;
    private fastShippingNote: string;
    private date: string = 0;
    private time: string = 0;
    private buyerName = '';
    private buyerPhone = '';
    private buyerPhone2 = '';
    private paymentMethod = 0;
    private listener: any;


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

        this.shipFee = parseInt(this.address.ship_fee) || 0;


        this.state = {
            note: '',
            isLoading: true,
            amount: 0,
            amountOrigin: 0,
            amountTotal: 0,
            items: [],
            chooseTime: true,
            allowBookingTime: BOOK_TIME_NONE,
            orderType: 0,//0=mua cho chính mình,1=tặng người khác,
            fastShipping: true,
            allowFastShipping: false,
            fastShipping: false,
            discounted: 0,
            shipmentNote: '',
            currentCredit: 0,
            saleId: '',
        }
    }

    confirmDate = (date: string) => {
        this.date = date;
    }

    confirmTime = (date: string) => {
        this.time = date;
    }

    asyncInit = debounce(async () => {

        const res = await CartStore.get();
        const amount = res.cart.amount;
        const amountOrigin = res.cart.amount_origin;
        //this.state.items = res.items;

        const feeData = res.fee;
        this.setState({ allowBookingTime: feeData.allowBookingTime });
        this.shipFee = feeData.shipFee;
        this.fastShipFee = feeData.fastShipFee;
        this.fastShippingNote = feeData.fastShippingNote;

        console.log("AAA", res, 'tt', amount + feeData.shipFee, 'ori', amountOrigin + feeData.shipFee)
        this.setState({
            allowFastShipping: feeData.allowFastShipping,
            isLoading: false,
            items: res.items,
            discounted: res.cart.discounted,
            amount: amount,
            amountTotal: amount + feeData.shipFee,
            amountOrigin: amountOrigin + feeData.shipFee,
            shipmentNote: feeData.shipmentNote,
            currentCredit: 0,
            shipFee: feeData.shipFee
        });
    })

    calculateAmount = (items) => {
        let amount = 0;
        items.forEach(item => {
            amount += item.price * item.quantity;
        });

        return amount;
    }

    onFocus = async () => {
        await this.asyncInit();
    };


    componentDidMount(): void {
        this.asyncInit();
        this.listener = this.props.navigation.addListener('focus', this.onFocus)
    }

    getOrderParams = () => {
        const shortItems = this.state.items.map(item => {
            //console.log(item);
            return {
                product: { id: item.product.id },
                pack: item.pack,
                quantity: item.quantity,
                price: item.price
            }
        });

        let params = {
            note: this.note || '',
            addressId: this.address.id,
            items: shortItems,
            amount: this.state.amount,
            amountTotal: this.state.amountOrigin + this.shipFee,
            receipt_type: this.receiptType,
            receipt_date: '',
            order_type: this.address.type,
            fast_shipping: this.state.fastShipping ? 1 : 0,
            buyer_name: this.address.buyer_name,
            buyer_phone: this.address.buyer_phone,
            buyer_phone2: this.address.buyer_phone2,
            shipment_note: this.state.shipmentNote,
            payment_method: this.paymentMethod,
            sale_id: this.state.saleId
        };

        if (this.date.length > 4) {
            params.receipt_date = this.date;
        }
        if (this.time.length > 3) {
            params.receipt_date += ' ' + this.time;
        }

        return params;
    }

    checkOut = async () => {

        if (this.state.isLoading) {
            return;
        }

        if (this.state.orderType) {
            if (isStrEmptyOrSpaces(this.buyerName)) {
                $alert('Vui lòng nhập tên người mua');
                return;
            }
            if (!isPhoneValid(this.buyerPhone)) {
                $alert('Vui lòng nhập SĐT người mua hợp lệ');
                return;
            }
        }
        if (this.paymentMethod) {
            if (this.state.currentCredit < this.state.amountTotal) {
                $alert('Số dư không đủ để thanh toán ngay');
                return;
            }
        }
        this.setState({ isLoading: true });

        const res: any = await OrderRequest.createV4(this.getOrderParams());
        console.log('ress OrderRequest', res)
        setTimeout(() => {
            this.setState({ isLoading: false });
            CartStore.clear();
            if (res.err_code === 0) {
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'CartScreen' },
                        ],
                    })
                );
                // this.props.navigation.navigate('CheckoutSucceedScreen', { orderCode: res.orderCode })
                navigate('OrderStack', {
                    screen: 'CheckoutSucceedScreen',
                    params: {
                        orderCode: res.orderCode
                    },
                })
            } else {
                $alert(res.message);
            }
        }, 500)
    };

    onChangeReceiptOption = (option: any) => {
        this.receiptType = option.id;
    };

    renderBuyerInfo = () => {
        return <View>
            <InputText
                placeholder={"Tên người mua"}
                onChangeText={(text) => { this.buyerName = text; }}
                placeholdercolor={"#a0a0a0"}
                style={{ fontSize: 16, paddingVertical: 0, width: platform.deviceWidth - 30, color: "#000000" }}
                showplaceholder={true}
            />
            <View style={{ flex: 1, borderBottomWidth: 1, borderColor: '#ccc' }} />
            <InputText
                placeholder={"SĐT người mua"}

                onChangeText={(text) => { this.buyerPhone = text; }}
                placeholdercolor={"#a0a0a0"}
                style={{ fontSize: 16, paddingVertical: 0, width: platform.deviceWidth - 30, color: "#000000" }}
                showplaceholder={true}
            />
            <View style={{ flex: 1, borderBottomWidth: 1, borderColor: '#ccc' }} />
            <InputText
                placeholder={"SĐT khác"}

                onChangeText={(text) => { this.buyerPhone2 = text; }}
                placeholdercolor={"#a0a0a0"}
                style={{ fontSize: 16, paddingVertical: 0, width: platform.deviceWidth - 30, color: "#000000" }}
                showplaceholder={true}
            />
            <View style={{ flex: 1, borderBottomWidth: 1, borderColor: '#ccc' }} />
        </View>
    }

    onPayNow = (value: any) => {
        this.paymentMethod = value.id;
        if (value.id == 1) {
            if (this.state.amountTotal <= 0) {
                return;
            }

            if (this.state.currentCredit < this.state.amountTotal) {
                let missed = this.state.amountTotal - this.state.currentCredit;
                confirm(`Tài khoản của bạn không đủ. Bạn cần nạp thêm: ${numberFormat(missed)}. Ấn OK để tiếp tục`,
                    async (ok: boolean) => {
                        if (ok) {
                            const auth = await storage.getAuth();
                            this.props.navigation.navigate('PaymentScreen', { auth, amount: missed })
                        }
                    })
            }

        }

    }

    render() {
        let phone = this.address.phone;
        if (this.address.phone2) {
            phone += '(' + this.address.phone2 + ')';
        }
        let buyerPhone = this.address.buyer_phone;
        if (this.address.buyer_phone2) {
            buyerPhone += '(' + this.address.buyer_phone2 + ')';
        }
        const paymentEnabled = getRemoteConfigSync().payment.show;
        return (
            <View style={styles.container}>
                {this.state.isLoading && <Spinner />}
                {/* <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}> */}
                {/* <KeyboardAvoidingView
                    style={styles.scroll}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                // keyboardVerticalOffset={IS_IOS ? 100 : 0}
                > */}
                <KeyboardAwareScrollView style={styles.scroll}>


                    <View style={styles.firstCard}>
                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="map-marker-radius" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.cardTitle}>Địa chỉ người nhận</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{ width: 30 }} />
                            <View style={{ flex: 1, paddingLeft: 15 }}>
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
                        <Input
                            placeholder={"Ghi chú cho người bán"}
                            // keyboardType="default"
                            // onBlur={() => {
                            //     Keyboard.dismiss();
                            // }}
                            // numberOfLines={4}
                            // blurOnSubmit={false}
                            multiline
                            onChangeText={(text) => { this.note = text; }}
                            placeholderTextColor={'#a0a0a0'}
                            style={{
                                fontSize: 16,
                                paddingVertical: 0,
                                width: platform.deviceWidth - 30,
                                color: "#000000",
                                height: 80,
                                // alignSelf: 'flex-start',
                                // backgroundColor:'red',
                                textAlignVertical: 'top'
                            }}

                        // blurOnSubmit={false} 
                        />

                        <View style={{ width: "100%", height: 1, backgroundColor: "#a0a0a0" }} />
                    </View>

                    {/* <View style={styles.secondCard}>
                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="credit-card" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
                        </View>
                        {paymentEnabled && <View style={styles.cardLeft}>

                            <Text style={styles.cardTitle9}>Số dư: {numberFormat(this.state.currentCredit)}</Text>
                            <View style={{ backgroundColor: config.secondaryColor, borderRadius: 5 }}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        const auth = await storage.getAuth();
                                        this.props.navigation.navigate('PaymentScreen', { auth })
                                    }}
                                    style={styles.chargeBtn}>
                                    <Text style={{ color: '#fff' }}>
                                        <MaterialCommunityIcons name="currency-usd" color={"#fff"} size={14} />
                                        Nạp tiền</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                        <View style={styles.cardRight}>
                            {paymentEnabled ? <RadioButton value={this.paymentMethod} onChange={this.onPayNow} items={[
                                { id: '0', label: 'Thanh toán khi nhận hàng' },
                                { id: '1', label: 'Thanh toán ngay' }
                            ]} /> : <Text>Thanh toán khi nhận hàng</Text>}

                        </View>
                    </View> */}
                    {!!this.state.shipmentNote && <View style={styles.secondCard}>

                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="truck" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.cardTitle}>Ghi chú vận chuyển</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{ width: 30 }} />
                            <Text style={styles.cardText}>{this.state.shipmentNote}</Text>
                        </View>
                    </View>}
                    <View style={[styles.thirdCard,]}>
                        <View style={[styles.cardLeft, { paddingVertical: 10 }]}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="package-variant-closed" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.cardTitle}>Danh sách sản phẩm</Text>
                        </View>
                        {this.state.items.map((item: any) => {
                            return (
                                <OrderItem
                                    // key={item.product.id.toString() + "/" + item.pack.id.toString()}
                                    item={item}
                                />
                            )
                        })}

                    </View>
                    {this.state.allowBookingTime > 0 &&
                        <View style={styles.secondCard}>
                            <DatePickerCheckout onConfrim={this.confirmDate} />

                        </View>}
                    {this.state.allowBookingTime === BOOK_TIME_ANY &&
                        <View style={styles.secondCard}>
                            <TimePickerCheckout onConfirm={this.confirmTime} />

                        </View>
                    }
                    {
                        this.state.allowBookingTime === BOOK_TIME_OPTION &&
                        <View style={styles.secondCard}>
                            <View style={styles.cardLeft}>
                                <View style={styles.cardIcon}>
                                    <MaterialCommunityIcons name="clock-outline" color={"#000000"} size={24} />
                                </View>
                                <Text style={styles.cardTitle}>Tùy chọn nhận hàng</Text>
                            </View>
                            <View style={{ paddingTop: 5 }}>
                                <RadioButton
                                    paddingVertical={5}
                                    value={1}
                                    onChange={(value) => { this.onChangeReceiptOption(value) }}
                                    items={[{ id: 1, label: 'Trong giờ hành chính' }, { id: 2, label: 'Ngoài giờ hành chính' }]}
                                    label={'giờ hành chính'} selected={true} />

                            </View>
                        </View>
                    }
                    {this.state.allowFastShipping && <View style={styles.secondCard}>

                        <View style={{ paddingTop: 5 }}>
                            <CheckBox
                                paddingVertical={5}
                                checked={false}
                                onChange={(value) => {
                                    this.fastShipping = value;
                                    let amountTotal = 0;
                                    const amount = this.calculateAmount(this.state.items);
                                    if (this.fastShipping) {
                                        amountTotal = amount + this.shipFee + this.fastShipFee;
                                    } else {
                                        amountTotal = amount + this.shipFee;
                                    }
                                    this.setState({ amountTotal: amountTotal, fastShipping: value })
                                }}
                                items={[{ id: 1, label: this.fastShippingNote }]}
                                label={'giờ hành chính'} selected={true} />

                        </View>
                    </View>
                    }
                    <View style={styles.secondCard}>
                        <View style={styles.cardLeft}>
                            <View style={styles.cardIcon}>
                                <MaterialCommunityIcons name="cash-refund" color={"#000000"} size={24} />
                            </View>
                            <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
                        </View>
                        <View style={styles.cardRight}>
                            <View style={{ width: 30 }} />
                            <View style={{ flex: 1, paddingLeft: 15 }}>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Tổng tiền sản phẩm</Text>
                                    <Text style={styles.textInfo}>{numberFormat(this.state.amountOrigin)}</Text>
                                </View>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Khuyến mãi</Text>
                                    <Text style={styles.textInfo}>{numberFormat(this.state.discounted)}</Text>
                                </View>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Phí giao hàng</Text>
                                    <Text style={styles.textInfo}>{numberFormat(this.state.shipFee)}</Text>
                                </View>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo}>Phí giao hàng nhanh</Text>
                                    <Text style={styles.textInfo}>
                                        {numberFormat(this.state.fastShipping ? this.fastShipFee : 0)}
                                    </Text>
                                </View>
                                <View style={styles.rowInfo}>
                                    <Text style={styles.titleInfo2}>Tổng tiền</Text>
                                    <Text style={styles.textInfo2}>{numberFormat(this.state.amountTotal)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, }}>
                        <View style={[styles.secondCard, {}]}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                // justifyContent:'space-between',
                            }}>
                                <Text style={{ color: 'silver' }}>Tư vấn viên</Text>
                                <TextInput
                                    value={this.state.sale_id}
                                    onChangeText={(text) => { this.setState({ saleId: text }) }}
                                    placeholder='Mã NV(khách hàng vui lòng k nhập)'
                                    style={{ padding: 4, backgroundColor: 'white', marginHorizontal: 10, width: '100%', height: 30 }}
                                />
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ width: '100%', height: 300 }}>
                    </View> */}
                </KeyboardAwareScrollView>

                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        <Text style={styles.footerTitle}>Cần Thanh Toán</Text>
                        <Text style={styles.footerText}>
                            {this.state.amountOrigin > this.state.amountTotal &&
                                <Text style={styles.textAmountOrigin}>
                                    {numberFormat(this.state.amountOrigin)}
                                </Text>
                            }
                            {' ' + numberFormat(this.state.amountTotal)}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.footerRight} onPress={this.checkOut}>
                        <Text style={styles.footerBtnText}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    addrInfo: { fontSize: 15, color: "#a0a0a0", marginTop: 2 },
    container: { flex: 1, alignItems: 'center' },
    scroll: { flex: 1, backgroundColor: "#f6f6fa" },
    firstCard: { backgroundColor: "#fff", width: platform.deviceWidth, paddingVertical: 10, paddingHorizontal: 15 },
    secondCard: { backgroundColor: "#fff", width: platform.deviceWidth, paddingVertical: 10, marginTop: 5, paddingHorizontal: 15 },
    thirdCard: { backgroundColor: "#fff", width: platform.deviceWidth, marginTop: 5, paddingHorizontal: 15 },
    cardTitle: { fontSize: 16, color: "#000000", flex: 1, paddingVertical: 0, fontWeight: "500", paddingLeft: 15 },
    cardTitle9: { fontSize: 17, color: config.secondaryColor, flex: 1, paddingVertical: 0, fontWeight: "500", paddingLeft: 15 },
    cardText: { fontSize: 15, color: "#a0a0a0", paddingVertical: 0, paddingLeft: 15, flex: 1 },
    footer: { backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10, borderTopWidth: 0.5, borderColor: "#a0a0a0" },
    rowInfo: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    titleInfo: { fontSize: 15, color: "#a0a0a0" },
    textInfo: { fontSize: 15, color: "#a0a0a0", paddingLeft: 5, flex: 1, textAlign: "right" },
    titleInfo2: { fontSize: 15, color: "#000000", fontWeight: "500" },
    textInfo2: { fontSize: 15, color: config.secondaryColor, fontWeight: "500", paddingLeft: 5, flex: 1, textAlign: "right" },
    cardLeft: { flexDirection: "row", alignItems: "center" },
    cardRight: { flexDirection: "row" },
    cardIcon: { width: 30, alignItems: "center" },
    footerLeft: { flex: 1 },
    footerRight: { backgroundColor: config.secondaryColor, borderRadius: 5 },
    footerTitle: { fontSize: 15, color: "#a0a0a0", fontWeight: "500" },
    footerText: { fontSize: 18, color: config.secondaryColor, marginTop: 2 },
    footerBtnText: { paddingVertical: 7.5, paddingHorizontal: 10, fontSize: 18, color: "#fff" },
    chargeBtn: { paddingVertical: 2, paddingHorizontal: 10, fontSize: 18, color: "#fff" },
    textAmountOrigin: { fontSize: 16, color: 'gray', textDecorationLine: "line-through", marginRight: 5 },
})
