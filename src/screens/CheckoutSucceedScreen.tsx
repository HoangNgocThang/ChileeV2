import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import config from "../config";
// @ts-ignored
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
   navigate:any
}

export default class CheckoutSucceedScreen extends Component<Props, any>{
    private focusListener: any;
    
    constructor(props: any) {
        super(props);
        this.orderCode = props.route.params.orderCode;
    }

    componentWillUnmount(): void {
    }

    componentDidMount(): void {

    }

    render() {
        const text = 'Cảm ơn bạn đã mua hàng.\nChúng tôi sẽ liên hệ để xác nhận đơn\nhàng trong thời gian sớm nhất';
        return <View style={{ flex: 1, alignSelf: 'center', marginTop: 80}}>
            <View style={{  alignSelf: 'center'}}>
                <MaterialCommunityIcons color={config.secondaryColor} name="checkbox-marked-circle" size={100}/>
            </View>
            <View style={{  alignSelf: 'center'}}>
                <Text style={{textAlign: 'center', fontSize:22}}>
                    Đặt hàng thành công
                </Text>
            </View>
            <View style={{  alignSelf: 'center'}}>
                <Text style={{textAlign: 'center', fontSize:14}}>
                    {text}
                </Text>
            </View>
            <View style={{  alignSelf: 'center'}}>
                <Text style={{textAlign: 'center', fontSize:14, color: config.secondaryColor}}>
                    Mã đơn hàng: #{this.orderCode}
                </Text>
            </View>

            <View style={{  alignSelf: 'center', marginTop: 20}}>
                <TouchableOpacity style={styles.addBtn} onPress={() => {
                    this.props.navigation.goBack();
                }} >
                    <Text style={{fontSize: 16, paddingVertical: 5, color: "#fff"}}>Tiếp tục mua hàng</Text>
                </TouchableOpacity>
            </View>

        </View>

    }
}

const styles = StyleSheet.create({

    addBtn: {width: 200, alignItems: "center", backgroundColor: config.secondaryColor,
        borderRadius: 5, height:40, marginBottom:10, paddingTop:5}
})
