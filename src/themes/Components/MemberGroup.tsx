import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import add from "../../assets/add.png";
import ModalCartItemOption from "./ModalCartItemOption"
import {numberFormat} from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    avatar: any,
    name: string
}

const defaultWidth = platform.deviceWidth;
const defaultAvatar = require('../../assets/default-avatar.png')
export default class MemberGroup extends PureComponent<Props>{

    constructor(props: any) {
        super(props);
    }

    render() {
        const {item} = this.props;
        return (
            <View style={styles.itemWrapper}>
                <View style={styles.avatarWrap}>
                    <Image source={item.avatar || defaultAvatar} style={styles.avatar}/>
                </View>
                <View style={styles.content}>
                    <Text style={styles.textName}>{item.username}</Text>
                </View>
            </View>
        );
    }
}
const deviceWidth = platform.deviceWidth;
const styles = StyleSheet.create({
    avatar: {width: deviceWidth * 0.12, height: deviceWidth * 0.12},
    avatarWrap: {width: deviceWidth * 0.12, height: deviceWidth * 0.12, borderRadius: deviceWidth * 0.06, overflow: "hidden"},
    itemWrapper: {width: defaultWidth - 30, flexDirection: "row", alignItems: "center", paddingVertical: 5},
    imageWrapper: {
        justifyContent: "center", alignItems: "center", width: defaultWidth * 0.15, height: defaultWidth * 0.15,
        borderRadius: defaultWidth * 0.08, backgroundColor: "#E6DFDE", overflow: "hidden"
    },
    content: {flex: 1, justifyContent: "center", marginLeft: 15},
    textName: {fontSize: 18, fontWeight: "700", color: config.secondaryColor, padding: 0},
});
