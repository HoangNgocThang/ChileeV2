import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import config from "../config";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeRequest from "../api/requests/HomeRequest";
import {AboutInfo} from "../api/interfaces";
// @ts-ignore

/**
 * File này để copy/paste khi tạo màn hình mới cho tiện
 */
export default class InfoScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            menuItems2: []
        }
    }

    asyncInit = async () => {
        const menus = await HomeRequest.getAboutInfo();
        this.setState({menuItems2: menus})
    }
    componentDidMount(): void {
        this.asyncInit();
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={[styles.profileMenu, {height: 50*this.state.menuItems2.length}]}>
                    {this.state.menuItems2.map((item: AboutInfo,index) => {
                        const addedStyle: any = {};
                        if (index === this.state.menuItems2.length -1) {
                            addedStyle.borderBottomWidth = 0;
                        }

                        return (
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('PrivacyScreen',
                                    {uri: item.uri, title: item.name})
                            }} key={item.id.toString()} style={[styles.menuBox,addedStyle]}>

                                <View style={{flex:9,marginTop:5}}>
                                    <Text style={{fontSize:15}}>{item.name}</Text>
                                </View>
                                <View style={{marginTop:5}}>
                                    <MaterialCommunityIcons color={config.secondaryColor} name="chevron-right" size={18}/>
                                </View>
                            </TouchableOpacity>
                        )
                    })}


                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    fbLoginBtn: {backgroundColor: '#1877F2', height: 45, padding:10, borderRadius: 5},
    ggLoginBtn: {backgroundColor: '#f23f3e', height: 45, padding:10, borderRadius: 5},
    textCenter: {
        textAlign: 'center'
    },
    profileMenu: {
        padding: 10,
        marginLeft: 10,
        marginRight:10,
        marginTop:5,
        borderRadius:10,
        backgroundColor: '#fff',

    },
    menuBox: {
        flexDirection: 'row',
        height:40,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
        justifyContent: 'center',
        marginBottom:10
    },
    myOrders: {
        height:150,
        padding: 15,
        marginTop: 10,
        marginLeft: 10,
        marginRight:10,
        borderRadius:10,
        backgroundColor: '#fff',

    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        overflow: "hidden",
        borderWidth: 0,
    }
})
