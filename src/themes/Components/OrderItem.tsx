import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import platform from "../Variables/platform";
import { numberFormat } from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
const defaultWidth = platform.deviceWidth;


export default class OrderItem extends PureComponent<any, any>{

    constructor(props: any) {
        super(props);
    }

    render() {
        const item = this.props.item;
        let { product, pack, quantity, price, shop } = item;
        const { navigation } = this.props;

        return (
            <>
                <View style={styles.itemWrapper}>
                    <View style={styles.itemLeft}>
                        <Image source={product.thumb} style={styles.thumb} />
                    </View>
                    <View style={styles.itemRight}>
                        <View>
                            <Text style={styles.textName}>{product.name}</Text>
                            {shop != null && <TouchableOpacity style={styles.shopInfo}>
                                <Text style={styles.shopInfoText}>{shop.name}</Text>
                            </TouchableOpacity>}

                            {!!product.time_range && <Text style={{ fontSize: 14, paddingTop: 2, color: "#a0a0a0" }}>
                                Ngày giao hàng: {product.time_range}</Text>}

                            <View style={styles.quantityWrapper}>
                                <Text style={styles.textQuantity}>
                                    {'Đơn Giá:    '}
                                    <Text style={styles.textPrice}>
                                        {numberFormat(price) + ' '}
                                    </Text>x {quantity} {pack.name ? '(' + pack.name + ')' : ''}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, paddingTop: 2, color: config.textColor }}>
                                <Text >Tổng tiền: {' '}</Text>
                                <Text style={styles.price}>
                                    {numberFormat(item.price * item.quantity) + ' '}
                                </Text>

                                {item.price_origin > item.price &&
                                    <Text style={styles.priceOrigin}>
                                        {numberFormat(item.price_origin * item.quantity)}
                                    </Text>}

                            </Text>

                        </View>

                    </View>
                </View>
                <View style={{ width: '100%', height: 7.5, }} />
            </>
        );
    }
}

const deviceWidth = platform.deviceWidth;
const styles = StyleSheet.create({
    itemWrapper: {
        width: deviceWidth - 30, flexDirection: "row", paddingVertical: 10,
        // borderBottomWidth: 0.5, borderColor: "#a0a0a0"
        borderRadius: 7.5, backgroundColor: '#f6f6fa',
    },
    itemLeft: { justifyContent: "center", flex: 0, paddingRight: 15, paddingLeft: 7.5, },
    itemRight: { flex: 1, justifyContent: "space-between" },
    thumb: {
        width: defaultWidth * 0.14, height: defaultWidth * 0.14, borderRadius: 5
        // width: deviceWidth * 0.25, height: deviceWidth * 0.25, borderRadius: 5
    },
    textName: {
        fontSize: 14,
        fontWeight: "bold",
        color: config.secondaryColor
    },
    quantityWrapper: { flexDirection: "row", alignItems: "center", paddingTop: 2 },
    priceWrapper: { alignItems: "flex-end" },
    textPrice: { fontSize: 14, color: config.secondaryColor },
    textQuantity: { fontSize: 14, color: config.textColor },
    textUnit: { fontSize: 14, paddingTop: 2, flex: 1, color: config.textColor },
    shopInfo: {
        paddingTop: 2, color: config.textColor, alignSelf: 'flex-start',
        marginTop: 5, borderRadius: 5,
        padding: 5, borderWidth: 1, borderColor: config.secondaryColor
    },
    shopInfoText: { fontSize: 14, paddingTop: 2, color: config.secondaryColor, borderColor: config.secondaryColor },
    priceOrigin: {
        fontSize: 14, color: 'gray', textDecorationLine: "line-through", marginRight: 3, marginLeft: 5
    },
    price: {
        fontSize: 14, color: config.secondaryColor, marginRight: 3, marginLeft: 5, textAlign: 'right'
    }
})
