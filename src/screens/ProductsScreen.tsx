import React, { Component } from 'react';
import { Image, Text, View, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from "react-native";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import CategoryItem from "../themes/Components/CategoryItem";
import platform from "../themes/Variables/platform";
import ProductTab from "../themes/Components/ProductTab";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CartBadge from '../ui/CartBadge';
import config from "../config";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

const ic_search = require('../../src/assets/ic_searchpro.png');

interface Props {
    navigation: any
}

interface State {
    isLoading: boolean,
    needReset: boolean
    // category: any,
}

export default class ProductsScreen extends Component<Props, State>{

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            needReset: false
            // category: null
        }
    }

    // asyncInit = async () => {
    //     const res = await HomeRequest.getCategories();
    //     console.log('ress', res)
    //     setTimeout(() => {
    //         this.setState({
    //             isLoading: false,
    //             category: res,
    //         });
    //     }, 500)
    // }

    onFocus = async () => {
        this.setState({ needReset: false })
    }

    componentDidMount(): void {
        // this.asyncInit();
        this.listener = this.props.navigation.addListener('focus', this.onFocus)
    }

    componentWillUnmount(): void {
        this.listener()
    }

    renderItem = ({ item, index }) => {
        return (
            <CategoryItem
                product={item}
                layoutWidth={platform.deviceWidth / 3 - 20}
                layoutPadding={15}
                fontWeight={"normal"}
                navigation={this.props.navigation}
            />
        )
    }

    render() {
        // if (this.state.isLoading) {
        //     return <Spinner/>
        // }

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ width: '100%', height: 30, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Danh mục</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}>
                        <TouchableOpacity
                            onPress={()=> {
                               this.props.navigation.navigate('ProductSearchScreen')
                            }}
                            style={{ marginRight: 6, paddingHorizontal: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={ic_search} style={{ width: 30, height: 30 }} resizeMode='cover' />
                        </TouchableOpacity>
                    </View>
                </View>
                <ProductTab navigation={this.props.navigation} needReset={this.state.needReset} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    Wrapper: { flex: 1 },
    flatlist: { flex: 1, paddingHorizontal: 15 },
})
