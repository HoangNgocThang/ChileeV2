import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import platform from "../Variables/platform";
import {numberFormat} from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {$alert} from "../../ui/Alert";
import messages from "../../locale/messages";
import CartStore from "../../store/CartStore";
import {ShareInfo} from "../../api/interfaces";


export default class OrderGroupItem extends PureComponent<any, any> {
    private shareInfo: ShareInfo;
    constructor(props: any) {
        super(props);
        this.shareInfo = this.props.item.product.shareInfo[0];

        this.state = {
            quantity: this.props.quantity || 1,
        }
    }

    add = (value: number) => {
        const newQuantity = this.state.quantity + value;
        if (newQuantity <= 0) {
            return;
        }

        if (newQuantity > this.shareInfo.quantity ) {
            return;
        }



        this.setState({quantity: newQuantity});
        if (this.props.onChange) {
            this.props.onChange(newQuantity);
        }
    };

    render() {
        let {product} = this.props.item;
        let canEdit = !this.props.readonly;
        return (
            <View style={styles.itemWrapper}>
                <View style={styles.itemLeft}>
                    <Image source={product.thumb} style={styles.thumb}/>
                </View>
                <View style={styles.itemRight}>
                    <View>
                        <Text style={styles.textName}>{product.name}</Text>
                        <Text style={{fontSize: 16, paddingTop: 2, color: config.textColor}}>{product.from}</Text>
                        {!!product.time_range && <Text style={{fontSize: 14, paddingTop: 2, color: "#a0a0a0"}}>
                            Ngày giao hàng: {product.time_range}</Text>}
                        <View style={styles.quantityWrapper}>
                            <Text style={styles.textUnit}>
                                {numberFormat( this.shareInfo.price_discount)}/1 SP
                                (<Text style={styles.textPriceDiscount}>
                                    {numberFormat( this.shareInfo.price)}
                                </Text>)
                            </Text>

                        </View>
                    </View>
                    <View style={{flex:1, alignSelf:'flex-end', paddingVertical:10}}>
                        <View style={styles.buttonWrapper}>
                            <Text style={{marginRight:5}}>
                                Số lượng:
                            </Text>
                            {canEdit &&<TouchableOpacity style={{backgroundColor: config.secondaryColor,borderRadius: 15}}    onPress={(() => this.add(-1))}>
                                <View style={styles.button}>
                                    <View style={styles.buttonBackground}/>
                                    <View style={{zIndex: 1}}>
                                        <MaterialCommunityIcons name="minus" color={"#fff"} size={20} /></View>
                                </View>
                            </TouchableOpacity>}

                            <Text style={styles.textQuantity}> {this.state.quantity}</Text>
                            {canEdit && <TouchableOpacity
                                onPress={(() => this.add(1))}
                                style={{backgroundColor: config.secondaryColor, borderRadius: 15}}>
                                <View style={styles.button}>
                                    <MaterialCommunityIcons name="plus" color={"#fff"} size={20} />
                                </View>
                            </TouchableOpacity>}
                        </View>
                        {canEdit && <View style={{marginTop:5}}>
                            <Text>Tối đa {this.shareInfo.quantity} SP/người</Text>
                        </View>}
                    </View>

                </View>
            </View>
        );
    }
}

const deviceWidth = platform.deviceWidth;
const styles = StyleSheet.create({
    textPriceDiscount: {color: config.textColor, textDecorationLine: "line-through", fontSize: 14},
    buttonBackground: {
        position: "absolute", backgroundColor: config.secondaryColor,
        top: 0, bottom: 0, left: 0, right: 0, opacity: 0.3, borderRadius: 15
    },
    button: {alignItems: "center", width: 25, height: 25, justifyContent: "center", padding: 1},
    buttonWrapper: {flexDirection: "row", alignItems: "center"},
    itemWrapper: {
        width: deviceWidth - 30,
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: "#a0a0a0"
    },
    itemLeft: {justifyContent: "center", flex: 0, paddingRight: 15},
    itemRight: {flex: 1, justifyContent: "space-between"},
    thumb: {width: deviceWidth * 0.25, height: deviceWidth * 0.25, borderRadius: 5},
    textName: {fontSize: 18, fontWeight: "bold", flex: 1, color: config.secondaryColor},
    quantityWrapper: {flexDirection: "row", alignItems: "center", paddingTop: 2},
    priceWrapper: {alignItems: "flex-end"},
    textPrice: {fontSize: 16, color: config.secondaryColor},
    textQuantity: {fontSize: 18, paddingHorizontal: 15, color: config.secondaryColor, fontWeight: "bold"},
    textUnit: {fontSize: 14, paddingTop: 2, flex: 1, color: config.textColor}
})
