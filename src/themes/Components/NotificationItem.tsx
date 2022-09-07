import React, {Component, PureComponent} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from "react-native";
import platform from "../Variables/platform";
import config from "../../config";
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';

const defaultWidth = platform.deviceWidth;

interface Props {
    NotificationItem: object,
    navigation: any
}

export default class NotificationItem extends PureComponent<Props, any>{

    constructor(props: any) {
        super(props);
    }


    onNavigate = () => {
        let {NotificationItem} = this.props
        this.props.navigation.navigate("DetailNotiScreen", {id: NotificationItem.id})
    }


    renderIcon = () => {
        let {NotificationItem} = this.props
        if (NotificationItem.read == 1) {
            return (
                <View style={styles.iconWrapper}>
                    <Icon name="email-open" color={config.secondaryColor} size={16} />
                </View>
            )
        }
        return (
            <View style={[styles.iconWrapper, {backgroundColor: config.secondaryColor}]}>
                <Icon name="email" color={"#fff"} size={16} />
            </View>
        )
    }

    render() {
        let {NotificationItem} = this.props
        return (
            <TouchableOpacity onPress={this.onNavigate} style={styles.itemWrapper} activeOpacity={0.5}>
                <View style={styles.item}>
                    {this.renderIcon()}
                    <View style={styles.contentWrap}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>{NotificationItem.title}</Text>
                        <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>{NotificationItem.summary}</Text>
                        <Text style={styles.time}>{NotificationItem.created_at}</Text>
                    </View>
                    <Icon name="chevron-right" color={"#a0a0a0"} size={20} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemWrapper: {paddingVertical: 10, borderBottomWidth: 0.4, borderColor: "#a0a0a0"},
    item: {flexDirection: "row", alignItems: "center", width: defaultWidth - 40},
    iconWrapper: {width: 30, height: 30, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: config.secondaryColor},
    contentWrap: {flex: 1, paddingRight: 2.5, marginLeft: 10, justifyContent: "center"},
    title: {fontSize: 15, fontWeight: "bold", color: config.textColor},
    content: {fontSize: 13, color: config.textColor},
    time: { color: '#b6b6b6', fontSize: 14 },

});
