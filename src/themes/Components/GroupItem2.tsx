import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import config from "../../config";
import moment, {Duration} from "moment";
import Image from 'react-native-fast-image';
const defaultAvatar = require('../../assets/default-avatar.png');
const defaultWidth = platform.deviceWidth;

export default class GroupItem2 extends Component<any, any>{

    constructor(props: any) {
        super(props);
    }

    onNavigate = () => {
        const {ProductItem, navigation, group} = this.props;
        navigation.navigate("DetailGroupScreen", {group})
    }

    renderStatus = () => {
        let { group} = this.props
        const diff = Math.max(0, group.end_time - Date.now());

        if (diff > 0) {
            let duration: Duration = moment.duration(diff);
            return (
                <View style={styles.statusWrapper}>
                    <Text style={styles.textTime}>{duration.hours()} giờ {duration.minutes()} phút</Text>
                    <View style={styles.statusAvailable}>
                        <Text style={styles.textAvailable}>{group.joined?'Đã tham gia':'Tham gia'}</Text>
                    </View>
                </View>
            )
        }


        return (
            <View style={styles.statusWrapper}>
                <Text style={styles.textTime}>  </Text>
                <View style={styles.statusConfirm}>
                    <Text style={styles.textConfirm}>Hết hạn</Text>
                    <MaterialCommunityIcons name="close" color={config.secondaryColor} size={14} />
                </View>
            </View>
        )
    }

    render() {
        let { group} = this.props
        return (
            <TouchableOpacity style={styles.itemWrapper} activeOpacity={1} onPress={this.onNavigate}>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <View style={styles.avatarWrap}>
                            <Image source={group.avatar || defaultAvatar} style={styles.avatar}/>
                        </View>

                    </View>
                    <View style={styles.bodyWrapper}>
                        <Text style={styles.textName}>{group.name}</Text>
                        <View style={styles.member}>
                            <Text style={styles.textMember}>{group.number_member}/{group.required_member}</Text>
                            <View style={styles.progressWrapper}>
                                <Progress.Bar
                                    progress={group.percent}
                                    useNativeDriver={true}
                                    width={null}
                                    height={5}
                                    borderRadius={2.5}
                                    borderWidth={0}
                                    unfilledColor={"#E6DFDE"}
                                    color={config.secondaryColor}
                                />
                            </View>
                        </View>
                    </View>
                    {this.renderStatus()}
                </View>
            </TouchableOpacity>
        );
    }
}
const deviceWidth = platform.deviceWidth
const styles = StyleSheet.create({
    avatar: {width: 36, height:  36},
    itemWrapper: {paddingVertical: 10},
    item: {width: defaultWidth - 30, flexDirection: "row", alignItems: "center"},
    icon: {width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#E6DFDE"},
    bodyWrapper: {flex: 1, paddingHorizontal: 10},
    textName: {width: "100%", fontSize: 14, color: config.textColor},
    member: {flexDirection: "row", alignItems: "center"},
    textMember: {fontSize: 14, color: "#a0a0a0", marginBottom: 2.5},
    textTime: {fontSize: 13, color: config.textColor, marginBottom: 2.5},
    statusWrapper: {alignItems: "center"},
    avatarWrap: {width: 36, height: 36, borderRadius: 18, overflow: "hidden"},
    statusAvailable: {
        paddingVertical: 2.5, paddingHorizontal: 7.5, borderRadius: 5, backgroundColor: config.secondaryColor,
        alignItems: "center", justifyContent: "center", width: "100%"
    },
    textAvailable: {fontSize: 14, color: "#fff"},
    statusConfirm: {flexDirection: "row", alignItems: "center", justifyContent: "center"},
    textConfirm: {fontSize: 14, color: config.secondaryColor, paddingRight: 2.5},
    progressWrapper: {flex: 1, marginLeft: 10},
});
