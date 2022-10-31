import React, { Component, PureComponent } from 'react';
import { Text, View, TouchableOpacity, Button, StyleSheet, TextInput, Alert } from "react-native";
import platform from "../Variables/platform";
import { cloneObject, debounce, intVal, numberFormat } from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartRequest from "../../api/requests/CartRequest";
import { $alert } from "../../ui/Alert";
import storage from "../../utils/storage";
import messages from "../../locale/messages";
import { navigate } from "../../navigation/RootNavigation";
import { CartItem, Pack } from "../../api/interfaces";
import CartStore from "../../store/CartStore";
import ListProps from './ListProps';
import ProductRequest from '../../api/requests/ProductRequest';

const prodef = require('../../../src/assets/prodef.jpeg')
const defaultWidth = platform.deviceWidth;


interface Props {
    item: any
    navigation: any
}

interface State {
    quantity: number,
    valid: boolean
}

class ProductItemChildren extends PureComponent<Props, State> {

    private activePrice: number;

    constructor(props: Props) {
        super(props);
        this.activePrice = props.item?.price;
        this.state = {
            quantity: 1,
            valid: true,
        }
    }

    add = (value: number) => {
        const newQuantity = this.state.quantity + value;
        if (newQuantity <= 0) {
            return;
        }
        this.setState({ quantity: newQuantity });
    }

    onChangeText = (text: string) => {
        let quantity = intVal(text);
        if (quantity <= 0) {
            return;
        }
        this.setState({ quantity });
    }

    onEndEditing = () => {
        let { quantity } = this.state;
        if (quantity < 0) {
            quantity = 1;
        }
        this.setState({ quantity })
    }

    onNavigate = () => {
        const { item, navigation } = this.props;
        navigation.navigate("DetailProduct", { Item: item })
    }

    renderPopup = () => {
        const { item } = this.props;
        if (item.quantity < 1) {
            return (
                <View style={styles.outStock}>
                    <Text style={styles.textOutStock}>Hết hàng</Text>
                </View>
            )
        } else if (item.ship_fee_type == 0) {
            return (
                <View style={styles.freeShip}>
                    <Text style={styles.textFreeShip}>FREESHIP</Text>
                </View>
            )
        }
        return <></>
    }

    addCartBuyThangHN = async (item: any) => {
        console.log('addCartBuyThangHN', item)
        const res = await CartStore.add(item);
        setTimeout(() => {
            $alert(res.message);
        }, 200)
    }

    addToCart = async () => {
        const auth = await storage.getAuth();
        if (!auth) {
            $alert(messages.pleaseLogin, () => {
                // navigate('ProfileScreen');
            });
            return;
        }

        const product = this.props.item;
        if (product.quantity < this.state.quantity) {
            setTimeout(() => {
                $alert(messages.outOfQuantity);
            }, 200);
            return;
        }

        const item = {
            product: product,
            pack: {},
            price: this.activePrice,
            quantity: this.state.quantity
        };
        this.addCartBuyThangHN(item)
    }

    render() {
        const { item } = this.props
        const { quantity, valid } = this.state;
        return (
            <View style={[styles.item, { marginLeft: 12, width: defaultWidth - 115 - 12 }]}>
                <TouchableOpacity style={styles.imageWrapper} onPress={this.onNavigate}>
                    <Image source={valid ? item.thumb : prodef} style={styles.image} onError={() => { this.setState({ valid: false }) }} />
                    {this.renderPopup()}
                </TouchableOpacity>
                <View style={styles.content}>
                    <TouchableOpacity onPress={this.onNavigate}>
                        <Text style={styles.textName}>{item.name}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, marginTop: 4 }}>Đơn giá:
                        <Text style={styles.textPrice1} numberOfLines={1} ellipsizeMode="tail"> {numberFormat(item.price)}</Text>
                    </Text>
                    {quantity > 1 ? <Text style={{ fontSize: 12, marginTop: 4 }}>Tổng tiền:
                        <Text style={styles.textPrice1} numberOfLines={1} ellipsizeMode="tail"> {numberFormat(item.price * quantity)}</Text>
                    </Text> : <></>}
                    {item.quantity > 0 && item.saleable ?
                        <View style={{ marginTop: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity style={{ borderRadius: 15 }} onPress={(() => this.add(-1))}>
                                    <View style={styles.button}>
                                        <View style={styles.buttonBackground} />
                                        <View style={{ zIndex: 1 }}><MaterialCommunityIcons name="minus" color={"#fff"} size={15} /></View>
                                    </View>
                                </TouchableOpacity>
                                <TextInput
                                    value={this.state.quantity.toString()}
                                    onChangeText={this.onChangeText}
                                    onEndEditing={this.onEndEditing}
                                    keyboardType={"number-pad"}
                                    enablesReturnKeyAutomatically={true}
                                    returnKeyType={"done"}
                                    style={styles.textQuantity}
                                />
                                <TouchableOpacity
                                    onPress={(() => this.add(1))}
                                    style={{ backgroundColor: config.secondaryColor, borderRadius: 15 }}>
                                    <View style={styles.button}>
                                        <MaterialCommunityIcons name="plus" color={"#fff"} size={15} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={this.addToCart}>
                                <MaterialCommunityIcons name="cart-plus" color={config.secondaryColor} size={20} />
                            </TouchableOpacity>
                        </View>
                        : <></>
                    }
                </View>
            </View>
        );
    }

};

export default ProductItemChildren;

const styles = StyleSheet.create({
    item: { width: defaultWidth - 115, flexDirection: "row", padding: 7.5, borderRadius: 7.5, backgroundColor: "#fff", marginBottom: 7.5 },
    imageWrapper: { justifyContent: "center", flex: 0, paddingRight: 7.5 },
    image: { width: defaultWidth * 0.14, height: defaultWidth * 0.14, borderRadius: 5 },
    outStock: {
        position: "absolute", bottom: 10, right: 7.5, backgroundColor: "red",
        paddingHorizontal: 3.5
    },
    textOutStock: { fontSize: 10, color: "#fff" },
    freeShip: {
        position: "absolute", bottom: 7.5, right: 7.5, backgroundColor: config.secondaryColor,
        paddingHorizontal: 3.5
    },
    textFreeShip: { fontSize: 10, color: "#fff" },
    content: {
        flex: 1,
        // justifyContent: 'space-around'
    },
    textName: {
        fontSize: 12,
        // fontWeight: "bold",
        color: config.textColor
    },
    textPrice1: { fontSize: 12, color: config.secondaryColor, flex: 1 },
    buttonWrapper: { flexDirection: "row", alignItems: "center" },
    button: { alignItems: "center", width: 20, height: 20, justifyContent: "center", padding: 1 },
    buttonBackground: {
        position: "absolute", backgroundColor: config.secondaryColor,
        top: 0, bottom: 0, left: 0, right: 0, opacity: 0.3, borderRadius: 15
    },
    textQuantity: {
        fontSize: 14, color: config.secondaryColor, marginHorizontal: 5,
        minWidth: 20,
        paddingVertical: 0, textAlign: "center"
    },
});
