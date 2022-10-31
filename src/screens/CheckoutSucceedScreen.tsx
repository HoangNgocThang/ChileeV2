import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import config from "../config";
// @ts-ignored
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { $alert, confirm } from "../ui/Alert";
import { CommonActions } from "@react-navigation/native";

interface Props {
    navigation: any
    route: any
}

export default class CheckoutSucceedScreen extends Component<Props, any>{
    private focusListener: any;
    orderCode = this.props.route.params.orderCode;

    constructor(props: any) {
        super(props);
        this.state = {

        }
    }

    componentWillUnmount(): void {
    }

    componentDidMount(): void {

    }

    handleCall = (phone: string) => {
        confirm('Gọi: ' + phone + '?', (ok) => {
            if (ok) {
                const $phone = 'tel:' + phone.replace(/./, '');
                Linking.canOpenURL($phone)
                    .then(supported => {
                        if (!supported) {
                            $alert('Phone number is not available');
                        } else {
                            return Linking.openURL($phone);
                        }
                    });
            }
        })
    }

    render() {
        const text = 'Cảm ơn bạn đã mua hàng.\nChúng tôi sẽ liên hệ để xác nhận đơn\nhàng trong thời gian sớm nhất';
        return <View style={{ flex: 1, alignSelf: 'center', marginTop: 80 }}>
            <View style={{ alignSelf: 'center' }}>
                <MaterialCommunityIcons color={config.secondaryColor} name="checkbox-marked-circle" size={100} />
            </View>
            <View style={{ alignSelf: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 22 }}>
                    Đặt hàng thành công
                </Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 14 }}>
                    {text}
                </Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 14, color: config.secondaryColor }}>
                    Mã đơn hàng: #{this.orderCode}
                </Text>
            </View>

            <TouchableOpacity
                style={{ alignSelf: 'center', paddingVertical: 15 }}
                onPress={() => {
                    this.handleCall('19003524')
                }}
            >
                <Text>Hotline: <Text style={{ color: config.secondaryColor }}>{1900.3524}</Text></Text>
            </TouchableOpacity>

            <View style={{ alignSelf: 'center', marginTop: 20 }}>
                <TouchableOpacity style={styles.addBtn} onPress={() => {
                    // this.props.navigation.goBack();
                    // this.props.navigation.navigate('HomeScreen')
                    // this.props.navigation.dispatch(
                    //     CommonActions.reset({
                    //         index: 0,
                    //         routes: [
                    //             { name: 'HomeScreen' },
                    //         ],
                    //     })
                    // );
                    this.props.navigation.navigate('Home', {
                        screen: 'ProductsScreen',
                    
                    })
              }} >
                    <Text style={{ fontSize: 16, paddingVertical: 5, color: "#fff" }}>Tiếp tục mua hàng</Text>
                </TouchableOpacity>
            </View>

        </View>

    }
}

const styles = StyleSheet.create({

    addBtn: {
        width: 200, alignItems: "center", backgroundColor: config.secondaryColor,
        borderRadius: 5, height: 40, marginBottom: 10, paddingTop: 5
    }
})
