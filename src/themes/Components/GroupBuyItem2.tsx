import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import ModalCartItemOption from "./ModalCartItemOption"
import {hasShareInfo, numberFormat} from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
import moment from "moment";

const defaultWidth = platform.deviceWidth;

export default class GroupBuyItem2 extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    // componentDidMount() {
    //     this.setState({progress: 1})
    // }

    onNavigate = () => {
        const {ProductItem, navigation} = this.props;
        if (this.props.detailScreen) {
            navigation.navigate(this.props.detailScreen, {Item: ProductItem})
        } else {
            navigation.navigate("DetailProduct",{Item: ProductItem})
        }

    }

    renderPopup = (duration: moment.Duration) => {
        const {ProductItem} = this.props;
        return(
            <View style={styles.timeRemain}>
                <Text style={styles.textTime}>{duration.days()} ngày {duration.hours()} giờ</Text>
            </View>
        )
    }

    render() {
        let {ProductItem} = this.props;
        const hadShareItem = hasShareInfo(ProductItem);

        const shareInfo = hadShareItem ? ProductItem.shareInfo[0] : null;
        let diff, duration;
        if (shareInfo) {
             diff = Math.max(0, shareInfo.end_time - Date.now());
             duration = moment.duration(diff);
        } else if (ProductItem.countdown_show === 1) {
            diff = Math.max(0, ProductItem.discount_end_at - Date.now());
            duration = moment.duration(diff);
        }


        return (
            <TouchableOpacity style={styles.itemWrapper} activeOpacity={1} onPress={this.onNavigate}>
                <View style={styles.item}>
                    <View style={styles.imageWrapper}>
                        <Image source={ProductItem.thumb} style={styles.image}/>
                        {duration != null && this.renderPopup(duration)}
                    </View>
                    <View style={styles.content}>
                        {hadShareItem && <View style={styles.groupWrapper}>
                            <MaterialCommunityIcons name="account-group" color={"#a0a0a0"} size={14} />
                            <Text style={styles.textGroup}>Mua chung nhóm {shareInfo.required_member} thành viên</Text>
                        </View>}
                        <Text style={styles.textName}>{ProductItem.name}</Text>
                        <View style={styles.priceWrapper}>
                            <View style={styles.left}>

                                <Text style={styles.textPrice} numberOfLines={1} ellipsizeMode="tail">
                                    {numberFormat(ProductItem.price) + ' '}
                                    {ProductItem.price_label != null &&
                                    <Text style={ProductItem.price_label.style}>{ProductItem.price_label.text}</Text>
                                    }
                                </Text>
                            </View>
                           <View style={styles.right}>
                                <Progress.Circle
                                    borderWidth={0}
                                    unfilledColor={"#E6DFDE"}
                                    size={40}
                                    progress={ProductItem.sold_percent}
                                    formatText={() => {
                                        let percent = Math.round(ProductItem.sold_percent*100);
                                        return percent +'%'
                                    }}
                                    showsText={true}
                                    color={config.secondaryColor}
                                    allowFontScaling={false}
                                    textStyle={{fontSize: 10, color: "#000"}}
                                    strokeCap={"round"}
                                />
                                <Text style={styles.sold}>Đã bán {ProductItem.number_sold}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemWrapper: {paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#a0a0a0"},
    item: {width: defaultWidth - 30, flexDirection: "row", alignItems: "center"},
    imageWrapper: {justifyContent: "center", flex: 0, marginRight: 15},
    image: {width: defaultWidth * 0.25, height: defaultWidth * 0.25, borderRadius: 7.5},
    timeRemain: {
        position: "absolute", bottom: 0,left: 0, right: 0, backgroundColor: config.secondaryColor,
        paddingHorizontal: 7.5, paddingVertical: 2, alignItems: "center", borderBottomLeftRadius: 7.5, borderBottomRightRadius: 7.5
    },
    textTime: {fontSize: 12, color: "#fff"},
    content: {flex: 1, justifyContent: "space-between"},
    textName: {fontSize: 16, fontWeight: "bold", color: config.textColor},
    groupWrapper: {flexDirection: "row", alignItems: "center"},
    textGroup: {fontSize: 11, color: "#a0a0a0", marginLeft: 5},
    textPack: {fontSize: 14, paddingTop: 2, color: "#a0a0a0"},
    priceWrapper: {flexDirection: "row", alignItems: "flex-end", paddingTop: 5},
    textPrice: {fontSize: 16, color: config.secondaryColor},
    textDiscount: {fontSize: 13, color: "#d57a4d"},
    textPriceDiscount: {color: config.textColor, textDecorationLine: "line-through"},
    left: {flex: 1, paddingRight: 5},
    right: {justifyContent: "center", alignItems: "flex-end"},
    sold: {fontSize: 11, color: config.textColor, marginTop: 5}
});
