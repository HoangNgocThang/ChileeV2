import React, { Component } from 'react';
import {
    FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
    TextInput
} from "react-native";
import platform from "../themes/Variables/platform";
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../config";
import AddressRequest from '../api/requests/AddressRequest';

interface Props {
    navigation: any
}

interface State {
    provinces: any[],
    searchText: string,
    searchValues: any[]
}

export default class SelectProvinceScreen extends Component<Props, State>{

    constructor(props: any) {
        super(props);
        // this.provinces =  getRemoteProvincesSync();
        // this.provinces = []
        // this.options = props.route.params.options || this.provinces;
        // this.value = props.route.params.value;
        this.onChange = props.route.params.onChange;
        this.state = {
            provinces: [],
            searchText: '',
            searchValues: []
        }
    }

    componentDidMount() {
        this.getProvinces()
    }

    getProvinces = async () => {
        try {
            const res = await AddressRequest.getProvinces()
            console.log("RES address", res)
            if (res?.err_code == 0) {
                this.setState({
                    provinces: res?.data
                })
            }
        } catch (error) {

        }
    }

    renderSearch = () => {
        const { searchText } = this.state;
        return (
            <View style={{
                marginTop: 5,
                width: '100%',
                height: 50,
                paddingHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignContent: 'center',
                backgroundColor: 'white',
                // borderRadius: 25,
                // borderWidth: 1,
                // borderColor: '#DDE3E9',
                // marginHorizontal: 15,
                borderRadius: 10,
            }}>
                <TextInput
                    style={{
                        fontSize: 14,
                        lineHeight: 19,
                        color: '#000000',
                        flex: 1,
                        marginLeft: 10,
                    }}
                    placeholder={'Tìm kiếm theo tên'}
                    underlineColorAndroid={'transparent'}
                    // placeholderTextColor={colors.black}
                    blurOnSubmit={true}
                    autoCorrect={false}
                    autoFocus={false}
                    returnKeyType="search"
                    value={searchText}
                    onChangeText={text => {
                        this.setState({ searchText: text }, () => {
                            const list = this.state.provinces.filter(
                                p =>
                                    p.name
                                        .toLowerCase()
                                        .indexOf(text.toLowerCase()) >= 0,
                            );
                            this.setState({
                                searchValues: [...list]
                            })
                        });

                    }}
                    onSubmitEditing={() => { }}
                />
            </View>
        )
    }

    render() {
        /*const options = getRemoteProvincesSync()[0].districts;
        options[0].checked = true;*/
        // const options = this.options;
        const { searchText, searchValues, provinces } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderSearch()}
                    <FlatList
                        // ListHeaderComponent={}
                        style={{ marginTop: 5 }}
                        data={searchText != '' ? searchValues : provinces}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                    this.onChange(item)
                                }}
                                style={styles.option} key={index.toString()}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                                </View>
                                {item.id == this.value && <View style={{ paddingRight: 20 }}>
                                    <MaterialCommunityIcons name="checkbox-marked-circle" color={config.secondaryColor} size={16} />
                                </View>}
                            </TouchableOpacity>;
                        }}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        // extraData={this.state}
                        // maxToRenderPerBatch={15}
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
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 18,
        width: platform.deviceWidth,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec'
    }
})
