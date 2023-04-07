import {TextInput, View, StyleSheet, Text, TouchableOpacity} from "react-native";
import React, {Component} from "react";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
// import { Appearance } from 'react-native-appearance';
import moment from "moment";

// const colorScheme = Appearance.getColorScheme();
export default class DatePickerCheckout extends Component<any>{

    constructor(props: any) {
        super(props);
        this.state = {
            showDatePicker: false,
            date: ""
        }
    }

    checkMonth(month) {
        switch (month) {
            case 'Jan': return '01'
            case 'Feb': return '02'
            case 'Mar': return '03'
            case 'Apr': return '04'
            case 'May': return '05'
            case 'Jun': return '06'
            case 'Jul': return '07'
            case 'Aug': return '08'
            case 'Sep': return '09'
            case 'Oct': return '10'
            case 'Nov': return '11'
            case 'Dec': return '12'
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

        var arrDate = date.toString().split(' ');
        this.setState({date: arrDate[2] + '/' + this.checkMonth(arrDate[1]) + '/' + arrDate[3]})
        this.props.onConfrim(moment(date).format('YYYY-MM-DD'));
    }

    render () {
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.onOpen}>
                <View style={styles.titleWrapper}>
                    <View style={styles.imgWrapper}>
                        <MaterialCommunityIcons name="calendar-month" color={"#000000"} size={24} />
                    </View>
                    <Text style={styles.cardTitle}>Thời gian nhận hàng</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    <View style={{width: 30}}/>
                    <TextInput
                        style={styles.textInput}
                        value={this.state.date}
                        editable={false}
                        pointerEvents={"none"}
                        placeholder={"Bấm để chọn ngày"}
                        placeholderTextColor={"#a0a0a0"}
                    />
                </View>

                <DateTimePicker
                    cancelTextIOS={"Hủy"}
                    confirmTextIOS={"Xác nhận"}
                    headerTextIOS={"Chọn ngày"}
                    mode={'date'}
                    locale={"vi"}
                    display={"spinner"}
                    isDarkModeEnabled={colorScheme === 'dark'}
                    isVisible={this.state.showDatePicker}
                    minimumDate={new Date()}
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
