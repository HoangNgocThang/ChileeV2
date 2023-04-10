import React, { Component } from 'react';
import {
    Image, Text, View, FlatList,
    TouchableOpacity, SafeAreaView,
    StyleSheet, Alert, TextInput, PermissionsAndroid,
    ActivityIndicator, Keyboard, Linking, Platform
} from "react-native";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import CategoryItem from "../themes/Components/CategoryItem";
import platform from "../themes/Variables/platform";
import ProductTab from "../themes/Components/ProductTab";
// @ts-ignored
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CartBadge from '../ui/CartBadge';
import config from "../config";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';
import ProductItemChildren from '../themes/Components/ProductItemChildren';
import { debounce, isScrollCloseToBottom } from '../utils';
import ProductRequest from '../api/requests/ProductRequest';
import { $alert } from '../ui/Alert';
import messaging from '@react-native-firebase/messaging';
// import { request, PERMISSIONS } from 'react-native-permissions';
const ic_search = require('../../src/assets/ic_searchpro.png');
const close = require('../../src/assets/close.png');

interface Props {
    navigation: any
}

interface State {
    // isLoading: boolean,
    needReset: boolean
    // category: any,

    searchText: string,
    data: any[],
    hasNextPage: boolean,
    loadingSearch: boolean,
    visible: boolean
}

class ProductsScreen extends Component<Props, State>{

    page = 1;
    unsubscribe = null;

    constructor(props: any) {
        super(props);
        this.state = {
            // isLoading: true,
            needReset: false,
            // category: null

            searchText: '',
            data: [],
            hasNextPage: false,
            loadingSearch: false,
            visible: false
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

    // onFocus = async () => {
    //     this.setState({ needReset: false })
    // }

    componentDidMount() {
        // this.asyncInit();
        // this.listener = this.props.navigation.addListener('focus', this.onFocus)
    }

    // componentWillUnmount() {
    //     this.listener()
    // }

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


    renderHeader = () => {
        return (
            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
                marginTop: Platform.OS == 'android' ? 10 : 0
            }}>
                <View style={{
                    height: 46,
                    borderColor: 'silver',
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderTopLeftRadius: 30,
                    borderBottomLeftRadius: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    flex: 1,
                    marginLeft: 15,
                    // backgroundColor:'red'
                    // marginHorizontal: 15,
                }}>
                    <TextInput
                        style={{
                            fontSize: 14,
                            lineHeight: 18,
                            color: 'black',
                            flex: 1,
                            marginHorizontal: 10,
                        }}
                        // maxLength={20}
                        placeholder={'Tìm kiếm tên hoặc mã sản phẩm'}
                        autoCapitalize={'none'}
                        returnKeyType={'search'}
                        placeholderTextColor={'black'}
                        // clearButtonMode={'while-editing'}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid={'transparent'}
                        numberOfLines={1}
                        autoCorrect={false}
                        value={this.state.searchText}
                        onChangeText={text => {
                            this.setState({
                                searchText: text
                            }, () => {
                                if (text == '') {
                                    this.setState({
                                        visible: false
                                    })
                                }
                            })
                            // setSearchText(text);
                            // onChangeSearchText(text);
                        }}
                        onSubmitEditing={() => {
                            this.page = 1;
                            this.setState({
                                data: [],
                                hasNextPage: false,
                                visible: true
                            }, () => {
                                this.onSearch()
                                Keyboard.dismiss();
                            })
                        }}
                    />
                    {
                        this.state.searchText != "" ? <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                            this.setState({
                                searchText: '',
                                visible: false,
                                needReset: true
                            }, () => {
                            })
                        }}>
                            <Image source={close} style={{ width: 24, height: 24 }} resizeMode='cover' />
                        </TouchableOpacity> : <></>
                    }
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.page = 1;
                        this.setState({
                            data: [],
                            hasNextPage: false,
                            visible: true
                        }, () => {
                            this.onSearch()
                            Keyboard.dismiss();
                        })
                    }}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 46,
                        backgroundColor: 'silver',
                        borderTopRightRadius: 30,
                        borderBottomRightRadius: 30,
                        // position: 'absolute',
                        // right: 0,
                        paddingHorizontal: 10,
                        marginRight: 15
                    }}>
                    <MaterialCommunityIcons name="magnify" color={"black"} size={24} />
                </TouchableOpacity>
            </View>
        )
    }

    // renderHeaderOld = () => {
    //     return (
    //         <View style={{ width: '100%', height: 30, flexDirection: 'row' }}>
    //             <View style={{ flex: 1 }}>
    //             </View>
    //             <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
    //                 <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Danh mục</Text>
    //             </View>
    //             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}>
    //                 <TouchableOpacity
    //                     onPress={() => {
    //                         this.props.navigation.navigate('ProductSearchScreen')
    //                     }}
    //                     style={{ marginRight: 6, paddingHorizontal: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    //                     <Image source={ic_search} style={{ width: 30, height: 30 }} resizeMode='cover' />
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     )
    // }

    renderItemList = (ele: any) => {
        const { item, index } = ele;
        return <ProductItemChildren maxWidth={true} key={`${item.id}`} item={item} navigation={this.props.navigation} />
    }

    onSearch = async () => {
        try {
            this.setState({ loadingSearch: true })
            setTimeout(async () => {
                const res: any = await ProductRequest.search(this.state.searchText, this.page);
                console.log('res999', res)
                this.setState({ loadingSearch: false })
                if (res?.err_code == 0) {
                    if (res?.hasNextPage) {
                        if (this.page == 1) {
                            this.setState({
                                data: res?.products,
                                hasNextPage: res?.hasNextPage
                            })
                        } else {
                            this.setState({
                                data: this.state.data.concat(res?.products),
                                hasNextPage: res?.hasNextPage
                            })
                        }
                    } else {
                        this.setState({
                            data: res?.products,
                            hasNextPage: res?.hasNextPage
                        })
                    }
                }
            }, 200)

        } catch (error) {
            console.log('err 99', error)
            $alert(`${error}`)
        }
    }

    onNextPage = debounce(() => {
        if (!this.state.hasNextPage) {
            return;
        }
        this.page++;
        this.onSearch()
    })

    renderContent = () => {
        if (this.state.visible) {
            return (
                <FlatList
                    data={this.state.data}
                    style={{ flex: 1, width: '100%', marginTop: 15, paddingHorizontal: 15 }}
                    contentContainerStyle={{ paddingBottom: 256 }}
                    // scrollEnabled={true}
                    // keyboardShouldPersistTaps={'always'}
                    // overScrollMode="always"
                    // keyboardDismissMode={'on-drag'}
                    keyExtractor={item => `${item?.id}`}
                    renderItem={this.renderItemList}
                    // refreshControl={
                    //   <RefreshControl
                    //     refreshing={pullingToRefresh}
                    //     onRefresh={handlePullToRefresh}
                    //     title="Kéo để làm mới"
                    //     tintColor={'white'}
                    //     titleColor={'white'}
                    //   />
                    // }
                    onScroll={({ nativeEvent }) => {
                        if (isScrollCloseToBottom(nativeEvent)) {
                            this.onNextPage();
                        }
                    }}
                    ListEmptyComponent={
                        <Text style={{
                            fontSize: 14,
                            lineHeight: 19,
                            textAlign: 'center',
                            marginTop: 20,
                        }}>
                            {'Dữ liệu trống'}
                        </Text>
                    }
                />
            )
        }

    }

    render() {
        // if (this.state.isLoading) {
        //     return <Spinner/>
        // }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                {this.renderHeader()}
                {this.state.loadingSearch ? <View style={{ marginVertical: 10 }}>
                    <ActivityIndicator size="small" />
                </View> : <></>}
                {this.renderContent()}
                <ProductTab navigation={this.props.navigation} needReset={this.state.needReset} visible={!this.state.visible} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    Wrapper: { flex: 1 },
    flatlist: { flex: 1, paddingHorizontal: 15 },
})


export default ProductsScreen;