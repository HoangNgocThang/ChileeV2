import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import config from "../config";
import CartItem from "../themes/Components/CartItem"
import CartStore from "../store/CartStore";
import { $alert, confirm } from "../ui/Alert";
import messages from "../locale/messages";
import { numberFormat } from "../utils";
import Spinner from "../ui/Spinner";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

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
            items: [],
            count: 0,
        }
    }

    asyncInit = async () => {
        this.isCheckoutReady = false;
        this.setState({
            isLoading: true,
            items: []
        })
        const res: any = await CartStore.get();
        console.log('res', res)
        this.isCheckoutReady = true;
        setTimeout(() => {
            this.setState({
                isLoading: false,
                items: res.items,
                isEmpty: res.items.length === 0,
                amount: res.cart.amount,
                amountOrigin: res.cart.amount_origin,
                count: res?.count
            });
        }, 200)
    };

    onFocus = () => {
        this.asyncInit();
    };

    componentWillUnmount() {
        this.focusListener();
    }

    componentDidMount() {
        this.setData()
        this.focusListener = this.props.navigation.addListener('focus', this.onFocus)
        CartStore.onChange(() => this.onFocus())
    }

    setData = async ()=> {
        await AsyncStorage.setItem('isErrorQuanity', 'false')
    }

    beforeQuantityChanged = () => {
        this.isCheckoutReady = false;
    }

    quantityChanged = (amount:any, amountOrigin:any) => {
        this.setState({ amount, amountOrigin }, () => {
            this.isCheckoutReady = true;
        })
    };

    removeItem = (item:any) => {
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

    pay = async () => {
        const check = await AsyncStorage.getItem('isErrorQuanity')
        if(check == 'true') {
            $alert('Bạn vui lòng kiểm tra số lượng sản phẩm');
            return; 
        }
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
                <View style={{ flex: 1, }}>
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
                    <View style={{ flex: 1 }}>
                        <Text style={styles.titleMoney}>Tổng số lượng</Text>
                        <Text style={styles.textMoney}>{`${this.state.count} sản phẩm`}</Text>
                    </View>

                    {this.state.items.length > 0 && <TouchableOpacity style={styles.buttonPay}
                        onPress={() => this.pay()}>
                        <Text style={styles.btnText}>Tiếp tục</Text>
                    </TouchableOpacity>}
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 10 },
    content: { 
       flex: 1,
       backgroundColor:'green'
    //    paddingHorizontal: 15 
    },
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
