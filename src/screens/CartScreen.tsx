import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import config from "../config";
import CartItem from "../themes/Components/CartItem"
import CartStore from "../store/CartStore";
import { $alert, confirm } from "../ui/Alert";
import messages from "../locale/messages";
import { numberFormat } from "../utils";
import Spinner from "../ui/Spinner";

export default class CartScreen extends Component<any, any>{

    private focusListener: any;
    private isCheckoutReady = false;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            amount: 0,
            amountOrigin: 0,
            isEmpty: false,
            items: []
        }
    }

    asyncInit = async () => {
        this.isCheckoutReady = false;
        const res = await CartStore.get();
        this.isCheckoutReady = true;
        this.setState({
            isLoading: false,
            items: res.items,
            isEmpty: res.items.length === 0,
            amount: res.cart.amount,
            amountOrigin: res.cart.amount_origin
        });
    };


    onFocus = () => {
        this.asyncInit();
    };

    componentWillUnmount(): void {
        this.focusListener();
    }

    componentDidMount(): void {
        this.focusListener = this.props.navigation.addListener('focus', this.onFocus)
        CartStore.onChange(() => this.onFocus())
    }

    beforeQuantityChanged = () => {
        console.log('beforeQuantityChanged');
        this.isCheckoutReady = false;
    }

    quantityChanged = (amount, amountOrigin) => {
        this.setState({ amount, amountOrigin }, () => {
            this.isCheckoutReady = true;
        })
    };

    removeItem = (item) => {
        confirm(messages.confirmRemoveCartItem, async (ok) => {
            if (ok) {
                const index = this.state.items.indexOf(item);
                if (index !== - 1) {
                    const res = await CartStore.remove(item);
                    if (res.err_code === 0) {
                        this.state.items.splice(index, 1);
                        this.setState({ items: this.state.items, amount: res.amount });
                    } else {
                        $alert(res.message);
                    }


                }
            }
        });
    }

    pay = () => {
        if (!this.isCheckoutReady) {
            $alert('Bạn vui lòng đợi trong giây lát');
            return;
        }
        this.props.navigation.navigate("AddressScreen", { payment: true })
    }

    onNavigate = () => {
        this.props.navigation.navigate("HomeScreen")
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Spinner />
                </View>
            )
        }
        if (this.state.items.length === 0) {
            return <View style={styles.emptyWrapper}>
                <Text>Bạn chưa có sản phẩm nào trong giỏ hàng</Text>
                {/* <TouchableOpacity style={styles.emptyButton} onPress={this.onNavigate}>
                    <Text style={styles.emptyButtonText}>Đặt hàng ngay</Text>
                </TouchableOpacity> */}
            </View>
        }
        const ios = Platform.OS === 'ios';

        return (
            <KeyboardAvoidingView
                behavior={ios ? "padding" : null}
                keyboardVerticalOffset={ios ? 100 : 0}
                style={styles.container}>
                <View style={styles.content} >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={styles.flatList}
                        data={this.state.items}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <CartItem
                                    removeItem={this.removeItem}
                                    beforeQuantityChanged={this.beforeQuantityChanged}
                                    quantityChanged={this.quantityChanged}
                                    item={item}
                                    index={index}
                                    navigation={this.props.navigation}
                                />
                            )
                        }}
                    />
                </View>
                <View style={styles.footer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.titleMoney}>Tổng tiền</Text>
                        {
                            this.state.amount < this.state.amountOrigin
                            &&
                            <Text style={styles.textMoneyOrigin}>{numberFormat(this.state.amountOrigin)}</Text>
                        }
                        <Text style={styles.textMoney}>{numberFormat(this.state.amount)}</Text>
                    </View>
                    {this.state.items.length > 0 && <TouchableOpacity style={styles.buttonPay}
                        onPress={() => this.pay()}>
                        <Text style={styles.btnText}>Tiến hành thanh toán</Text>
                    </TouchableOpacity>}
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    content: { flex: 1, paddingHorizontal: 15 },
    flatList: { flex: 1, paddingVertical: 5 },
    emptyWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 18, paddingVertical: 10 },
    emptyButton: {
        paddingVertical: 5, paddingHorizontal: 10, backgroundColor: config.secondaryColor,
        borderRadius: 5, marginTop: 20
    },
    emptyButtonText: { fontSize: 18, color: "#fff" },
    footer: {
        backgroundColor: "#fff", flexDirection: "row", alignItems: "center",
        paddingHorizontal: 15, paddingVertical: 10
    },
    buttonPay: { backgroundColor: config.secondaryColor, borderRadius: 5 },
    btnText: { paddingVertical: 7.5, paddingHorizontal: 10, fontSize: 18, color: "#fff" },
    titleMoney: { fontSize: 15, color: "#a0a0a0", fontWeight: "500" },
    textMoney: { fontSize: 18, color: config.secondaryColor, marginTop: 2 },
    textMoneyOrigin: { fontSize: 14, color: 'gray', marginTop: 2, textDecorationLine: "line-through" },
});
