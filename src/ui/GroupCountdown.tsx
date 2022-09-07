import {View, StyleSheet, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import React, {PureComponent} from "react";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../config";
import {numberFormat} from "../utils";
import {ShareInfo} from '../api/interfaces';
import moment from "moment";

interface Props {
    shareInfo: ShareInfo
}

function zeroFill(n: number) {
    if (n < 10) {
        return '0' + n;
    }
    return n;
}

export interface State {
    duration: moment.Duration
}

export default class GroupCountdown extends PureComponent<Props, State>{
    private timeId = 0;
    private endTime = 0;

    constructor(props: any) {
        super(props);

        this.endTime = props.shareInfo.end_time;

        const  diff = Math.max(0, this.endTime - Date.now());
        let duration = moment.duration(diff);
        this.state = {
            duration: duration
        }

    }

    componentDidMount(): void {
        this.timeId = setInterval(() => {
            const diff = Math.max(0, this.endTime - Date.now());
            if (diff === 0) {
                clearInterval(this.timeId);
                return;
            }
            let duration = moment.duration(diff);
            this.setState({duration: duration})
        }, 1000)
    }

    componentWillUnmount(): void {
        clearInterval(this.timeId);
    }

    renderCountdown = (duration: moment.Duration) => {
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.textTime}>{duration.days()} ngày</Text>
                <Text style={styles.textSpace}>:</Text>
                <Text style={styles.textTime}>{zeroFill(duration.hours())}</Text>
                <Text style={styles.textSpace}>:</Text>
                <Text style={styles.textTime}>{zeroFill(duration.minutes())}</Text>
                <Text style={styles.textSpace}>:</Text>
                <Text style={styles.textTime}>{zeroFill(duration.seconds())}</Text>
            </View>
        )
    }

    render () {
        const {shareInfo} = this.props;

        return (
            <View style={styles.itemWrapper}>
                <View style={styles.rowPrice}>
                    <MaterialCommunityIcons name="cash-usd" color={"#fff"} size={18} />
                    <Text style={styles.textPrice}>{numberFormat(shareInfo.price_discount)}</Text>
                    {this.renderCountdown(this.state.duration)}
                </View>
                <View style={styles.rowGroup}>
                    <MaterialCommunityIcons name="account-group" color={"#fff"} size={18} />
                    <Text style={styles.textGroup}>Nhóm {shareInfo.required_member} thành viên</Text>
                    <Text style={styles.textSold}>{shareInfo.number_sold} người đã mua</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    itemWrapper: {width: "100%", paddingHorizontal: 15, paddingVertical: 5, backgroundColor: config.secondaryColor},
    rowPrice: {flexDirection: "row", alignItems: "center"},
    rowGroup: {flexDirection: "row", alignItems: "center", marginTop: 5},
    textPrice: {fontSize: 18, color: "#fff", paddingHorizontal: 15, fontWeight: "bold", flex: 1},
    textGroup: {fontSize: 14, color: "#fff", paddingHorizontal: 15, flex: 1},
    textSold: {fontSize: 14, color: "#fff"},
    textTime: {
        fontSize: 17, color: config.secondaryColor, fontWeight: "700", paddingHorizontal: 5, paddingVertical: 2,
        backgroundColor: "#fff", borderRadius: 3.5
    },
    textSpace: {
        fontSize: 17, color: "#fff", fontWeight: "700", paddingHorizontal: 5, paddingVertical: 2
    }
})
