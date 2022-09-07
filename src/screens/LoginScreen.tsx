import React, {Component} from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Platform} from "react-native";
// @ts-ignored
// import {AccessToken, LoginManager} from 'react-native-fbsdk';
import AuthRequest from "../api/requests/AuthRequest";
import storage from "../utils/storage";
import {$alert} from "../ui/Alert";
import InputText from "../ui/InputText";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignored
// import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import AddressRequest from "../api/requests/AddressRequest";
import FastImage from "react-native-fast-image";
import config from "../config";
import Spinner from "../ui/Spinner";
import {getRemoteConfigSync, isEmailValid} from '../utils';
import {RemoteConfig} from "../api/interfaces";
import CartStore from "../store/CartStore";
import {CommonActions} from "@react-navigation/native";
import {navigate} from "../navigation/RootNavigation";
// import appleAuth, {
//     AppleButton,
//     AppleAuthRequestOperation,
//     AppleAuthRequestScope,
//     AppleAuthCredentialState,
//     AppleAuthError
// } from '@invertase/react-native-apple-authentication';
import TestRequest from "../api/requests/TestRequest";
const isIos = Platform.OS === 'ios';
const defaultAvatar = require('../assets/default-avatar.png');

interface LoginForm {
    email: string,
    password: string
}

const rememberKey = 'remember_email';
export default class LoginScreen extends Component<any, any>{
    private remoteConfig: RemoteConfig;

    constructor(props: any) {
        super(props);
        this.remoteConfig = getRemoteConfigSync();
        this.state = {
            isLoading: false,
            email: '',
            password: '',
            errors: {
                email: '',
                password: ''
            }
        }

    }

    onLoginSucceed = () => {
        CartStore.clear();
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'ProfileScreen' },
                ],
            })
        );
    };

    componentDidMount(): void {

        // this.initGoogle();
        storage.get(rememberKey).then(value => {
            if (value) {
                this.setState({email: value})
            }

        })
    }

    // initGoogle() {
    //     GoogleSignin.configure({
    //         scopes: ['https://www.googleapis.com/auth/userinfo.email'], // what API you want to access on behalf of the user, default is email and profile
    //         webClientId: '931288246018-04p6k4nk4bn6ns6l94vog6pg4amqqnpk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //         offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //         hostedDomain: '', // specifies a hosted domain restriction
    //         loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    //         // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the [docs](https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInOptions.Builder#public-googlesigninoptions.builder-requestserverauthcode-string-serverclientid,-boolean-forcecodeforrefreshtoken).
    //         accountName: '', // [Android] specifies an account name on the device that should be used
    //         //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    //     });
    // }

    passwdLogin = async () => {
        if (this.state.isLoading) {
            return
        }

        if (!isEmailValid(this.state.email)) {
            this.setState({errors: {email: 'Vui lòng nhập email hợp lệ'}})
            return;
          //  $alert('Vui lòng nhập tên đăng nhập');
            return;
        }

        if (!this.state.password) {
            this.setState({errors: {password: 'Vui lòng nhập'}})
            return;
        }

        storage.set(rememberKey, this.state.email);
        this.setState({isLoading: true});
        const loginRes = await AuthRequest.login(this.state.email, this.state.password);
        setTimeout(async () => {
            if (loginRes.err_code !== 0) {
                $alert(loginRes.message);
            } else {

                await storage.setAuth(loginRes);
                this.onLoginSucceed();
            }
            this.setState({isLoading: false});
        }, 500)
    };

    // ggLogin = async () => {
    //     const self = this;
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const userInfo = await GoogleSignin.signIn();
    //         if (!userInfo.idToken) {
    //             throw new Error("Đăng nhập thất bại");
    //         }
    //         const idToken = userInfo.idToken.toString();
    //         const authData = await AuthRequest.loginGoogle(idToken);
    //         if (authData.err_code !== 0) {
    //             $alert(authData.message);
    //             return;
    //         }
    //         console.log('Login succeed')

    //         await storage.setAuth(authData);
    //         this.onLoginSucceed();

    //     } catch (error) {
    //         $alert('Đăng nhập Google thất bại. Mã Lỗi: ' + error.message);
    //         console.log(error);
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //             console.log('SIGN_IN_CANCELLED')
    //             // user cancelled the login flow
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //             // operation (e.g. sign in) is in progress already
    //             console.log('IN_PROGRESS')
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //             // play services not available or outdated
    //             console.log('PLAY_SERVICES_NOT_AVAILABLE')
    //         } else {
    //             // some other error happened
    //         }
    //     }
    // };

    // fbLogin = () => {
    //     const self = this;
    //     LoginManager.logInWithPermissions(["public_profile", 'email']).then(
    //         function(result: any) {
    //             if (result.isCancelled) {
    //                 console.log("Login cancelled");
    //             } else {
    //                 console.log(
    //                     "Login success with permissions: " +
    //                     result.grantedPermissions.toString()
    //                 );
    //                 AccessToken.getCurrentAccessToken().then(
    //                     async (data: any) => {
    //                         const token = data.accessToken.toString();
    //                         const authData = await AuthRequest.loginFacebook(token);
    //                         if (authData.err_code !== 0) {
    //                             $alert(authData.message);
    //                             return;
    //                         }

    //                         await storage.setAuth(authData);
    //                         self.onLoginSucceed();


    //                     }
    //                 )
    //             }
    //         },
    //         function(error: Error) {
    //             console.log("Login fail with error: " + error);
    //         });
    // }

    // onAppleButtonPress = async () => {
    //     let self = this;

    //     //let self = this;
    //     const requestOptions = {
    //         requestedOperation: AppleAuthRequestOperation.LOGIN,
    //         requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    //     };

    //     const responseObject = await appleAuth.performRequest(requestOptions);

    //     try {
    //         const credentialState = await appleAuth.getCredentialStateForUser(responseObject.user);
    //         if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
    //             // authorized
    //             let test = {
    //                 user: responseObject.user,
    //                 email: responseObject.email,
    //                 fullName: responseObject.fullName,
    //                 token: responseObject.identityToken
    //             };
    //             if (!responseObject.identityToken) {
    //                 $alert('Đăng nhập thất bại');
    //                 return;
    //             }

    //             AuthRequest.loginApple(responseObject.identityToken).then(async (authData) => {
    //                 if (authData.err_code !== 0) {
    //                     $alert(authData.message);
    //                     return;
    //                 }

    //                 await storage.setAuth(authData);
    //                 self.onLoginSucceed();
    //             });
    //            // TestRequest.test(test);
    //             //$alert(JSON.stringify(test));

    //         }
    //     } catch (error) {
    //         if (error.code === AppleAuthError.CANCELED) {
    //             $alert('AppleAuthError.CANCELED')
    //         }
    //         if (error.code === AppleAuthError.FAILED) {
    //             $alert('AppleAuthError.FAILED')
    //         }
    //         if (error.code === AppleAuthError.INVALID_RESPONSE) {
    //             $alert('AppleAuthError.INVALID_RESPONSE')
    //         }
    //         if (error.code === AppleAuthError.NOT_HANDLED) {
    //             $alert('AppleAuthError.NOT_HANDLED')
    //         }
    //         if (error.code === AppleAuthError.UNKNOWN) {
    //             $alert('AppleAuthError.UNKNOWN')
    //         }
    //     }
    // }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop:60 }}>
                {this.state.isLoading && <Spinner/>}
                <View style={{height: 120}}>
                    <FastImage source={defaultAvatar} style={styles.avatar}/>
                </View>
                <View style={{width: 300, height: 50}}>
                    <InputText value={this.state.email}
                               err={this.state.errors.email}
                               onChangeText={(text: string) => {
                                   if (!isEmailValid(text)) {
                                       return this.setState({errors: {email: 'Vui lòng nhập email hợp lệ'}, email: text})
                                   }

                                  this.setState({email: text, errors: {email: ''}})
                               }}
                               placeholder="Email" />
                </View>

                <View style={{width: 300, height: 50,marginTop: 10}}>
                    <InputText
                        err={this.state.errors.password}
                        value={this.state.password}
                        onChangeText={(text: string) => {
                            if (!text) {
                                return this.setState({errors: {password: 'Vui lòng nhập'}, password: text})
                            }
                            this.setState({password: text, errors: {password: ''}})
                        }}

                         secureTextEntry={true} placeholder="Mật khẩu" />
                </View>

                <View style={{height: 50, width: 300, marginTop: 15}}>

                    <TouchableOpacity style={styles.addBtn} onPress={this.passwdLogin}>
                        <Text style={{fontSize: 16, paddingVertical: 5, color: "#fff"}}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 90, width: 350}}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('RegisterScreen');
                    }}>
                        <Text style={{fontSize: 14, paddingVertical: 5, color: config.secondaryColor, textAlign: 'center'}}>Đăng ký</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('PassForgotScreen');
                    }}>
                        <Text style={{fontSize: 14, paddingVertical: 5, color: config.secondaryColor, textAlign: 'center'}}>Quên mật khẩu</Text>
                    </TouchableOpacity>
                    {/* <Text style={{fontSize: 12, paddingVertical: 5, color: config.secondaryColor, textAlign: 'center'}}>
                        Hoặc đăng nhập với</Text> */}
                </View>
                {/* {isIos && this.remoteConfig.socialAuth.apple && <View style={{height:50}}>
                    <AppleButton
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.SIGN_IN}
                        style={{
                            width: 160,
                            height: 45,
                        }}
                        onPress={() => this.onAppleButtonPress()}
                    />
                </View>}
                <View style={{height: 50, flex:1, flexDirection: 'row'}}>

                    {this.remoteConfig.socialAuth.facebook &&
                    <TouchableOpacity style={styles.fbLoginBtn} onPress={this.fbLogin}>

                        <Text style={{color: '#fff', flex: 1, flexDirection: 'row', textAlign: 'center'}}>
                            <MaterialCommunityIcons name="facebook" color={"#fff"} size={20}/>
                            <Text> Facebook</Text>
                        </Text>
                    </TouchableOpacity>
                    }

                    {this.remoteConfig.socialAuth.google && <TouchableOpacity style={[styles.ggLoginBtn, {marginLeft: 5}]} onPress={this.ggLogin}>

                        <Text style={{color: '#fff', flex:1, flexDirection: 'row', textAlign: 'center'}}>
                            <MaterialCommunityIcons name="google" color={"#fff"} size={20}/>
                            <Text > Google</Text>
                        </Text>
                    </TouchableOpacity>}

                </View> */}


            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    fbLoginBtn: {width: 150, backgroundColor: '#4267B2', height: 45, padding:10, borderRadius: 5},
    ggLoginBtn: {width: 150, backgroundColor: '#DB4437', height: 45, padding:10, borderRadius: 5},
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
