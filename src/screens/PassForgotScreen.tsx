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
import {getRemoteConfigSync, isEmailValid} from '../utils';
import {RemoteConfig} from "../api/interfaces";

const defaultAvatar = require('../assets/default-avatar.png');


const rememberKey = 'remember_username';
export default class PassForgotScreen extends Component<any, any>{
    private remoteConfig: RemoteConfig;

    constructor(props: any) {
        super(props);
        this.remoteConfig = getRemoteConfigSync();
        this.state = {
            isLoading: false,
            user: {
                email: '',
            },
            errors: {
                username: '',
                password: ''
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
        if (!isEmailValid(user.email)) {
            return this.setValueAndError('email', 'Vui lòng nhập email hợp lệ', user.email);
        }


        this.setState({isLoading: true});
        const forgotRes = await PasswordRequest.forgot(user.email);
        setTimeout(() => {
            this.setState({isLoading: false})
            $alert(forgotRes.message, () => {
                this.props.navigation.navigate('PassRevertScreen', {email: user.email})
            });


        },2000)


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
                    <InputText value={user.email}
                               err={errors.email}
                               onChangeText={(text: string) => {
                                   if (!isEmailValid(text)) {
                                       return this.setValueAndError('email', 'Vui lòng nhập email hợp lệ', text)
                                   }

                                   this.setValueAndError('email', '', text)
                               }}
                               placeholder="Email" />
                </View>


                <View style={{height: 50, width: 300, marginTop: 15}}>

                    <TouchableOpacity style={styles.addBtn} onPress={this.iForgot}>
                        <Text style={{fontSize: 16, paddingVertical: 5, color: "#fff"}}>Gửi email phục hồi mật khẩu</Text>
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
