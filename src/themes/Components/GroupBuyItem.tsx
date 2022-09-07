import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import add from "./../../assets/add.png"
import ModalCartItemOption from "./ModalCartItemOption"
import {numberFormat} from '../../utils';
import Image from 'react-native-fast-image'
import config from "../../config";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';

const defaultWidth = platform.deviceWidth;

export default class GroupBuyItem extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    componentDidMount() {
        this.setState({progress: 0.9})
    }

    onNavigate = () => {
        const {ProductItem, navigation} = this.props;
        navigation.navigate("DetailProduct",{Item: ProductItem})
    }

    renderPopup = () => {
        const {ProductItem} = this.props;
        return(
            <View style={styles.timeRemain}>
                <Text style={styles.textTime}>4 ngày 12 giờ</Text>
            </View>
        )
    }

    renderGroupIcon = () => {
        const {ProductItem} = this.props;
        return(
            <View style={styles.groupWrapper}>
                <MaterialCommunityIcons name="account-group" color={"#fff"} size={18} />
                <Text style={styles.textGroup}>10</Text>
            </View>
        )
    }

    render() {
        let {ProductItem, index} = this.props
        return (
            <TouchableOpacity key={index.toString()} style={styles.itemWrapper} activeOpacity={1} onPress={this.onNavigate}>
                <View style={styles.item}>
                    <View style={styles.imageWrapper}>
                        <Image source={ProductItem.thumb} style={styles.image}/>
                        {this.renderGroupIcon()}
                        {this.renderPopup()}
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.textName} numberOfLines={2}
                              ellipsizeMode="tail">{ProductItem.name}</Text>
                        <View style={styles.priceWrapper}>
                            <View style={styles.left}>
                                <Text style={styles.textPack} numberOfLines={1}
                                      ellipsizeMode="tail">{ProductItem.pack[0]}</Text>
                                <Text style={styles.textDiscount}>-20%<Text>  </Text>
                                    <Text style={styles.textPriceDiscount}>{numberFormat(ProductItem.price)}</Text>
                                </Text>
                                <Text style={styles.textPrice} numberOfLines={1} ellipsizeMode="tail">
                                    {numberFormat(ProductItem.price  * 0.8)}
                                </Text>
                            </View>
                            <View style={styles.right}>
                                <Progress.Circle
                                    borderWidth={0}
                                    unfilledColor={"#E6DFDE"}
                                    size={35}
                                    progress={this.state.progress}
                                    showsText={true}
                                    color={config.secondaryColor}
                                    allowFontScaling={false}
                                    textStyle={{fontSize: 9, color: "#000"}}
                                    strokeCap={"round"}
                                />
                                <Text style={styles.sold}>Đã bán 100</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ModalCartItemOption ref="ModalCartItemOption" item={ProductItem}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemWrapper: {paddingVertical: 5, flex: 1},
    item: {width: defaultWidth * 0.4 + 20, paddingHorizontal: 10, flex: 1},
    imageWrapper: {justifyContent: "center", alignItems: "center", flex: 0},
    image: {width: defaultWidth * 0.4, height: defaultWidth * 0.4, borderRadius: 7.5},
    timeRemain: {
        position: "absolute", bottom: 0,left: 0, right: 0, backgroundColor: config.secondaryColor,
        paddingHorizontal: 7.5, paddingVertical: 3, alignItems: "center", borderBottomLeftRadius: 7.5, borderBottomRightRadius: 7.5
    },
    textTime: {fontSize: 14, color: "#fff"},
    groupWrapper: {
        position: "absolute",top : 5, right: 5, backgroundColor: config.secondaryColor,
        paddingHorizontal: 10, paddingVertical: 2.5, alignItems: "center", borderRadius: 15,
        flexDirection: "row"
    },
    textGroup: {fontSize: 14, color: "#fff", paddingLeft: 5},
    content: {justifyContent: "space-between", flex: 1},
    textName: {fontSize: 18, fontWeight: "bold", marginTop: 5, color: config.secondaryColor},
    textFrom: {fontSize: 16, marginTop: 5, color: config.textColor},
    textPack: {fontSize: 16, marginTop: 5, color: "#a0a0a0"},
    priceWrapper: {flexDirection: "row", alignItems: "center", paddingTop: 5},
    textPrice: {fontSize: 18, color: config.secondaryColor, flex: 1},
    textDiscount: {fontSize: 12, color: "red"},
    textPriceDiscount: {color: config.textColor, textDecorationLine: "line-through"},
    left: {flex: 1, paddingRight: 5},
    right: {justifyContent: "center", alignItems: "flex-end"},
    sold: {fontSize: 10, color: config.textColor, marginTop: 5}
});
