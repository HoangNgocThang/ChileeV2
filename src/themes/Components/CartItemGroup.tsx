import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import platform from "../Variables/platform";
import {numberFormat} from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartStore from "../../store/CartStore";
import {$alert} from "../../ui/Alert";
import messages from "../../locale/messages";

const defaultWidth = platform.deviceWidth;
export default class CartItem extends PureComponent<any, any>{
    private item:any;

    constructor(props: any) {
        super(props);
        this.item = this.props.item;
        let {product, quantity, pack} = this.item;

        this.state = {
            product: product,
            quantity: quantity,
            pack: pack,
            amount: pack.price * quantity
        }
    }

    add = (value: number) => {
        const newQuantity = this.state.quantity + value;
        if (newQuantity <= 0) {
            return;
        }

        if (this.state.product.quantity < newQuantity) {
            $alert(messages.outOfQuantity2);
            return;
        }

        const {pack} = this.state;
        const incrValue = value *pack.price;
        const newPrice = pack.price * newQuantity;
        this.setState({quantity: newQuantity, amount: newPrice});
        this.item.quantity = newQuantity;
        CartStore.add( this.item);
        this.props.quantityChanged(incrValue);
    };

    render() {
        let {product, quantity, pack} = this.props.item;
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.imageWrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate("DetailProduct",{Item: product})}>
                        <Image source={product.thumb} style={styles.thumb}/>
                    </TouchableOpacity>

                </View>
                <View style={styles.contentWrapper}>
                    <Text style={styles.textName}>{product.name}</Text>
                    <Text style={styles.textName}>{product.name}</Text>
                    <Text style={styles.textBanner}>Mua chung</Text>
                    <View style={styles.contentFooter}>
                        <Text style={styles.textAmount} numberOfLines={1} ellipsizeMode="tail">
                            {numberFormat(this.state.amount)}
                        </Text>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={{borderRadius: 15}}    onPress={(() => this.add(-1))}>
                                <View style={styles.button}>
                                    <View style={styles.buttonBackground}/>
                                    <View style={{zIndex: 1}}><MaterialCommunityIcons name="minus" color={"#fff"} size={20} /></View>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.textQuantity}>{this.state.quantity}</Text>
                            <TouchableOpacity
                                onPress={(() => this.add(1))}
                                style={{backgroundColor: config.secondaryColor, borderRadius: 15}}>
                                <View style={styles.button}>
                                    <MaterialCommunityIcons name="plus" color={"#fff"} size={20} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {width: defaultWidth - 30, flexDirection: "row", alignItems: "center", paddingVertical: 5},
    imageWrapper: {justifyContent: "center", paddingRight: 15},
    thumb: {width: defaultWidth * 0.3, height: defaultWidth * 0.3, borderRadius: 7.5},
    contentWrapper: {flex: 1, justifyContent: "space-between"},
    textName: {fontSize: 18, fontWeight: "bold", color: config.secondaryColor},
    contentFooter:{flexDirection: "row", alignItems: "center"},
    textAmount: {fontSize: 18, color: config.secondaryColor, flex: 1, fontWeight: "bold"},
    buttonWrapper: {flexDirection: "row", alignItems: "center"},
    button: {alignItems: "center", width: 25, height: 25, justifyContent: "center", padding: 1},
    buttonBackground: {
        position: "absolute", backgroundColor: config.secondaryColor,
        top: 0, bottom: 0, left: 0, right: 0, opacity: 0.3, borderRadius: 15
    },
    textQuantity: {fontSize: 18, paddingHorizontal: 15, color: config.secondaryColor, fontWeight: "bold"},
    textBanner: {fontSize: 14, color: "#fff", backgroundColor: config.secondaryColor, paddingHorizontal: 10, paddingVertical: 2.5}
})
