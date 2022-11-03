import React, {Component} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import platform from "../themes/Variables/platform";
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../config";
import {getRemoteProvincesSync} from "../utils";
import AddressRequest from '../api/requests/AddressRequest';

export default class SelectProvinceScreen extends Component<any, any>{
    
    // private options: Array<any>;
    // private value: string;
    // private provinces: any = [];

    constructor(props: any) {
        super(props);
        // this.provinces =  getRemoteProvincesSync();
        // this.provinces = []
        // this.options = props.route.params.options || this.provinces;
        // this.value = props.route.params.value;
        this.onChange = props.route.params.onChange;
        this.state = {
            provinces: []
        }
    }

    componentDidMount() {
       this.getProvinces()
    }

    getProvinces = async () => {
        try {
            const res = await AddressRequest.getProvinces()
            console.log("RES address", res)
            if(res?.err_code == 0) {
                this.setState({
                    provinces: res?.data
                })
            }
        } catch (error) {
            
        }
    }

    render() {
        /*const options = getRemoteProvincesSync()[0].districts;
        options[0].checked = true;*/
        // const options = this.options;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        style={{marginTop: 5}}
                        data={this.state.provinces}

                        renderItem={({ item, index }) => {
                            return <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                    this.onChange(item)
                                }}
                                style={styles.option} key={index.toString()}>
                                <View style={{flex:1}}>
                                    <Text style={{    fontSize: 18}}>{item.name}</Text>
                                </View>
                                    {item.id == this.value && <View style={{paddingRight:20}}>
                                    <MaterialCommunityIcons name="checkbox-marked-circle" color={config.secondaryColor} size={16} />

                                </View>  }
                            </TouchableOpacity>;
                        }}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        maxToRenderPerBatch={15}
                    />
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    option: {
        backgroundColor: '#fff',
        height: 60,
        flex:1,
        flexDirection:'row',
        paddingLeft: 20,
        paddingTop:18,
        width: platform.deviceWidth,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec'
    }
})
