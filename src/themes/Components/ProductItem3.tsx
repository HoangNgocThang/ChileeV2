import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import {hasShareInfo, numberFormat} from '../../utils';
import Image from 'react-native-fast-image'
import config from "../../config";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const defaultWidth = platform.deviceWidth;
export default class ProductItem3 extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            isVisible: false
        }
    }

    showModal = () => {
        this.setState({isVisible: !this.state.isVisible})
    }

    onNavigate = () => {
        const {ProductItem, navigation} = this.props;
        navigation.navigate("ProductShopDetail", {Item: ProductItem})
    }


    renderModal = () => {
        const {isVisible} = this.state;
        if (isVisible) {
            return (
                <TouchableOpacity
                    style={styles.modal}
                    activeOpacity={1}
                    onPress={this.showModal}
                >
                    <Text style={{fontSize: 16, color: "#fff"}}>Xem chi tiết</Text>
                </TouchableOpacity>
            )
        }
        return null
    }

    renderPopup = () => {
        const {ProductItem} = this.props;

        if (ProductItem.label) {
            return  <View style={styles.freeShip}>
                <Text style={styles.textFreeShip}>
                    {ProductItem.label.icon !=null && <MaterialCommunityIcons name={ProductItem.label.icon} />}
                    {ProductItem.label.text}</Text>
            </View>
        }

        return null
    }

    render() {
        let {ProductItem, index} = this.props;

        return (
            <TouchableOpacity key={index.toString()} onPress={this.onNavigate} style={styles.itemWrap} activeOpacity={1}>
                {this.renderModal()}
                <View style={styles.item}>
                    <View style={styles.imageWrapper}>
                        <Image source={ProductItem.thumb} style={styles.image}/>
                        {this.renderPopup()}
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.textName} numberOfLines={2}
                              ellipsizeMode="tail">{ProductItem.name}</Text>
                        <Text style={styles.textPrice} numberOfLines={1} ellipsizeMode="tail">
                            {numberFormat(ProductItem.price) + ' '}
                            {ProductItem.price_label != null &&
                            <Text style={ProductItem.price_label.style}>{ProductItem.price_label.text}</Text>
                            }
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.sold}>Đã bán: {ProductItem.number_sold}</Text>
                            <TouchableOpacity
                                onPress={this.showModal}
                                activeOpacity={1}
                            >
                                <MaterialCommunityIcons name="dots-horizontal" color={"#a0a0a0"} size={18} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemWrap: {marginHorizontal: 5, marginBottom: 5},
    item: {width: defaultWidth * 0.4 - 20, flex: 1, backgroundColor: "#fff", borderRadius: 10, overflow: "hidden"},
    imageWrapper: {justifyContent: "center", alignItems: "center", flex: 0},
    image: {width: defaultWidth * 0.4 - 20, height: defaultWidth * 0.4 - 20},
    content: {justifyContent: "space-between", flex: 1, padding: 10},
    textName: {fontSize: 16, fontWeight: "bold", color: config.secondaryColor},
    outStock: {
        position: "absolute", bottom: 10, right: 0, backgroundColor: "red", paddingHorizontal: 7.5,
        paddingVertical: 2.5
    },
    textOutStock: {fontSize: 14, color: "#fff"},
    freeShip: {
        position: "absolute", bottom: 10, right: 0, backgroundColor: config.secondaryColor,
        paddingHorizontal: 7.5, paddingVertical: 2.5
    },
    textFreeShip: {fontSize: 14, color: "#fff"},
    textPrice: {fontSize: 16, color: config.secondaryColor, marginTop: 10},
    textDiscount: {fontSize: 12, color: "#d57a4d"},
    sold: {fontSize: 11, color: config.textColor},
    modal: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 10,
        zIndex: 88
    },
});
