import {TextInput, View, StyleSheet, Text, TouchableOpacity} from "react-native";
import React, {Component} from "react";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
// import { Appearance } from 'react-native-appearance';
import moment from "moment";
// const colorScheme = Appearance.getColorScheme();
export default class TimePickerCheckout extends Component<any>{

    constructor(props: any) {
        super(props);
        this.state = {
            showDatePicker: false,
            time: ""
        }
    }


    onOpen = () => {
        this.setState({showDatePicker: true})
    }

    onClose = () => {
        this.setState({showDatePicker: false})
    }

    onConfirm = (date: Date) => {
        this.onClose();
        let arrDate = date.toString().split(' ');
        let arrTime = arrDate[4].split(':');
        this.setState({time: arrTime[0] + ':' + arrTime[1]});
        this.props.onConfirm(moment(date).format('HH:mm:ss'));
    }

    render () {
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.onOpen}>
                <View style={styles.titleWrapper}>
                    <View style={styles.imgWrapper}>
                        <MaterialCommunityIcons name="clock-outline" color={"#000000"} size={24} />
                    </View>
                    <Text style={styles.cardTitle}>Tùy chọn giờ nhận hàng</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    <View style={{width: 30}}/>
                    <TextInput
                        style={styles.textInput}
                        value={this.state.time}
                        editable={false}
                        pointerEvents={"none"}
                        placeholder={"Bấm để chọn giờ"}
                        placeholderTextColor={"#a0a0a0"}
                    />
                </View>

                <DateTimePicker
                    cancelTextIOS={"Hủy"}
                    confirmTextIOS={"Xác nhận"}
                    headerTextIOS={"Chọn giờ giao hàng"}
                    mode={'time'}
                    is24Hour={true}
                    display={"spinner"}
                    isDarkModeEnabled={colorScheme === 'dark'}
                    isVisible={this.state.showDatePicker}
                    onCancel={this.onClose}
                    onConfirm={this.onConfirm}
                />
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    titleWrapper: {flexDirection: "row", alignItems: "center"},
    imgWrapper: {width: 30, alignItems: "center"},
    cardTitle: {fontSize: 16, color: "#000000", flex: 1, paddingVertical: 0, fontWeight: "500", paddingLeft: 15},
    textInput: {fontSize: 15, color: "#a0a0a0", paddingVertical: 0, paddingLeft: 15, flex: 1},
})
