import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import config from "../../config";

const defaultWidth = platform.deviceWidth;

export default class GroupItem extends Component<any, any>{

    constructor(props: any) {
        super(props);
    }

    onNavigate = () => {
        const {ProductItem, navigation} = this.props;
        navigation.navigate("DetailGroupScreen")
    }

    renderIcon = () => {
        return (
            <View style={styles.iconRow}>
                <View style={styles.icon1}>
                    <MaterialCommunityIcons name="account" color={"#fff"} size={16} />
                </View>
                <View style={styles.icon2}>
                    <MaterialCommunityIcons name="account" color={"#fff"} size={16} />
                </View>
                <View style={styles.icon3}>
                    <View style={styles.iconBg}>
                        <View style={styles.bg}/>
                        <Text style={styles.textBg}>+1</Text>
                    </View>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons name="account" color={"#fff"} size={17} />
                    </View>
                </View>
            </View>
        )
    }

    renderStatus = () => {
        return (
            <View style={styles.statusWrapper}>
                <Text style={styles.textStatus}>Tham gia</Text>
            </View>
        )
    }

    render() {
        let {ProductItem} = this.props
        return (
            <TouchableOpacity style={styles.itemWrapper} activeOpacity={1} onPress={this.onNavigate}>
                <View style={styles.item}>
                    <View style={styles.itemRow}>
                        <View style={styles.customerWrapper}>
                            {this.renderIcon()}
                            <Text style={styles.textName} numberOfLines={1}
                                  ellipsizeMode="tail">Customer 1, Customer 2, Customer 3</Text>
                        </View>
                        <Text style={styles.textTime}>09 giờ 10 phút</Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.textMember}>Thành viên: 04/10</Text>
                        <View style={styles.progressWrapper}>
                            <Progress.Bar
                                progress={0.4}
                                useNativeDriver={true}
                                width={null}
                                height={5}
                                borderRadius={2.5}
                                borderWidth={0}
                                unfilledColor={"#E6DFDE"}
                                color={config.secondaryColor}
                            />
                        </View>
                        {this.renderStatus()}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemWrapper: {paddingVertical: 10},
    item: {width: defaultWidth - 30},
    itemRow: {flexDirection: "row", alignItems: "center"},
    customerWrapper: {flexDirection: "row", flex: 1, alignItems: "center", marginRight: 10},
    textName: {flex: 1, fontSize: 16, marginLeft: 10, left: -20, color: config.textColor},
    textTime: {fontSize: 14, color: config.textColor},
    statusWrapper: {paddingVertical: 2.5, paddingHorizontal: 7.5, borderRadius: 5, backgroundColor: config.secondaryColor},
    textStatus: {fontSize: 14, color: "#fff"},
    iconRow: {flexDirection: "row", alignItems: "center"},
    textMember: {fontSize: 12, color: "#a0a0a0", marginTop: 5},
    progressWrapper: {flex: 1, marginHorizontal: 10},
    icon1: {width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center", backgroundColor: "#E6DFDE", zIndex: 3, borderWidth: 1, borderColor: "#fff"},
    icon2: {width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center", backgroundColor: "#E6DFDE", left: -10, zIndex: 2, borderWidth: 1, borderColor: "#fff"},
    icon3: {width: 32, height: 32, borderRadius: 20, left: -20, zIndex: 1},
    iconBg: {position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "center", zIndex: 1, overflow: "hidden", borderRadius: 16},
    bg: {position: "absolute", top: 0, right: 0, left: 0, bottom: 0, backgroundColor: "#000", opacity: 0.3},
    textBg: {fontSize: 14, color: "#fff", zIndex: 1},
    iconWrapper: {width: 32, height: 32, justifyContent: "center", alignItems: "center", borderRadius: 20, backgroundColor: "#E6DFDE"}
});
