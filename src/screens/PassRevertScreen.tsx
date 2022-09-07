import React, {Component} from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
// @ts-ignored
import PasswordRequest from "../api/requests/PasswordRequest";
import {$alert} from "../ui/Alert";
import InputText from "../ui/InputText";
// @ts-ignored
// @ts-ignored
import FastImage from "react-native-fast-image";
import config from "../config";
import Spinner from "../ui/Spinner";
import {getRemoteConfigSync, isStrEmptyOrSpaces} from '../utils';
import {RemoteConfig} from "../api/interfaces";

const defaultAvatar = require('../assets/default-avatar.png');


const rememberKey = 'remember_username';
export default class PassRevertScreen extends Component<any, any>{
    private remoteConfig: RemoteConfig;

    constructor(props: any) {
        super(props);
        this.remoteConfig = getRemoteConfigSync();

        this.state = {
            isLoading: false,
            showInputPassword: true,
            user: {
                code: '',
                password: '',
                repassword: '',
                email: props.route.params.email
            },
            errors: {
                code: '',
                password: '',
                repassword: ''
            }
        }

    }

    setValueAndError(field: string, message: string, value: string) {
        const {errors,user} = this.state;
        errors[field] = message;
        user[field] = value;
        return this.setState({errors, user})
    }

    componentDidMount(): void {

    }

    iForgot = async () => {
        if (this.state.isLoading) {
            return;
        }
        const {user} = this.state;
        if (!user.code) {
            return this.setValueAndError('code', 'Vui lòng nhập', user.code);
        }
        if (!user.password || user.password.length < 6) {
            return this.setValueAndError('password', 'Mật khẩu phải có tối thiểu 6 kí tự', user.password)
        }

        if (user.repassword !== user.password) {
            return this.setValueAndError('repassword', 'Bạn nhập lại mật khẩu không đúng', user.repassword )
        }


        this.setState({isLoading: true});
        const res = await PasswordRequest.revert(user.email, user.code, user.password );
        setTimeout(() => {
            this.setState({isLoading: false})
            $alert(res.message, () => {
                if (res.err_code === 0) {
                    this.props.navigation.navigate('LoginScreen')
                }
            })



        },3000)


    }


    render() {
        const {errors, user} = this.state;
        return (
            <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop:60 }}>
                {this.state.isLoading && <Spinner/>}
                <View style={{height: 120}}>
                    <FastImage source={defaultAvatar} style={styles.avatar}/>
                </View>
                <View style={{width: 300, height: 50}}>
                    <InputText value={user.code}
                               err={errors.code}
                               onChangeText={(text: string) => {
                                   if (isStrEmptyOrSpaces(text)) {
                                       return this.setValueAndError('code', 'Vui lòng nhập', text)
                                   }

                                   this.setValueAndError('code', '', text)
                               }}
                               placeholder="Mã xác thực" />
                </View>

                <View style={{width: 300, height: 50}}>
                    <InputText value={user.password}
                               err={errors.password}
                               onChangeText={(text: string) => {
                                   if (!text || text.length < 6) {
                                       return this.setValueAndError('password', 'Mật khẩu phải có tối thiểu 6 kí tự', text)
                                   }

                                   this.setValueAndError('password', '', text)
                               }}
                               secureTextEntry={true}
                               placeholder="Mật khẩu mới" />
                </View>
                <View style={{width: 300, height: 50}}>
                    <InputText value={user.repassword}
                               err={errors.repassword}
                               onChangeText={(text: string) => {
                                   if (text !== user.password) {
                                       return this.setValueAndError('repassword', 'Bạn nhập lại mật khẩu không đúng', text)
                                   }

                                   this.setValueAndError('repassword', '', text)
                               }}
                               secureTextEntry={true}
                               placeholder="Xác nhận mật khẩu" />
                </View>
                <View style={{height: 50, width: 300, marginTop: 15}}>

                    <TouchableOpacity style={styles.addBtn} onPress={this.iForgot}>
                        <Text style={{fontSize: 16, paddingVertical: 5, color: "#fff"}}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
                </View>


            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    fbLoginBtn: {width: 150, backgroundColor: '#1877F2', height: 45, padding:10, borderRadius: 5},
    ggLoginBtn: {width: 150, backgroundColor: '#EA4335', height: 45, padding:10, borderRadius: 5},
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        overflow: "hidden",
        borderWidth: 0,
    },
    addBtn: {width: "100%", alignItems: "center", backgroundColor: config.secondaryColor,
        borderRadius: 10, height:40, marginBottom:10, paddingTop:5}
})
