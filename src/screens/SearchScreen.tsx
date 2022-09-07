import React, {Component} from 'react';
import {FlatList, SafeAreaView, ScrollView, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import ProductItem from "../themes/Components/ProductItem"
import SearchBox from "../ui/SearchBox";
import platform from "../themes/Variables/platform";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import BtnMore from "../ui/BtnMore";
import SortMenu from "../ui/SortMenu";
import SearchStore from "../store/SearchStore";
import GroupBuyItem2 from "../themes/Components/GroupBuyItem2";
import SearchRequest from "../api/requests/SearchRequest";

const data = [{id: 0, key: "Phù hợp nhất"}, {id: 1, key: "Giá thấp"}, {id: 2, key: "Giá cao"}];
export default class SearchScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            listItem: [],
            isLoading: false,
            isLoadingMore: false,
            page: 1,
            key: "",
            activeTab: 0,
            recentSearch: [],
            order: "id",
            direction: "desc",
            showLoadMore: false
        }
    }

    componentDidMount(): void {
        this.getRecentSearch();
    }

    async getRecentSearch() {
        const recent = await SearchStore.getItems();
        this.setState({recentSearch: recent})
    }

    search = async (key: string) => {
        const {order, direction} = this.state
        this.setState({activeTab: 1, isLoading: true, key: key, page: 1})
        SearchStore.add(key);
        const res = await SearchRequest.search(key, {page: 1, limit: 10, order: order, direction: direction});
        setTimeout(() => {
            this.setState({
                isLoading: false,
                listItem: res.products,
                showLoadMore: res.hasNextPage
            });
        }, 500)
    }

    loadingMore = async () => {
        const {page, listItem, key, order, direction} = this.state
        this.setState({isLoadingMore: true})
        const res = await SearchRequest.search(key, {page: page + 1, limit: 10, order: order, direction: direction});
        setTimeout(() => {

            this.setState({
                listItem: listItem.concat(res.products),
                isLoadingMore: false,
                page: page + 1,
                showLoadMore: res.hasNextPage
            });
        }, 250)
    }

    sort = async (type: number) => {
        let {order, direction, key} = this.state;
        if (type < 1) {
            order = "id";
            direction = "desc";
        } else if (type === 1) {
            order = "price";
            direction = "asc";
        } else {
            order = "price";
            direction = "desc";
        }
        this.setState({isLoading: true, page: 1, order: order, direction: direction});
        const res = await SearchRequest.search(key, {page: 1, limit: 10, order: order, direction: direction});
        setTimeout(() => {
            this.setState({
                isLoading: false,
                listItem: res.products,
            });
        }, 250)
    }

    changeTab = () => {
        const {activeTab} = this.state;
        if (activeTab === 1) this.setState({activeTab: 0})
    }

    pressRecent = (key: string) => {
        this.refs.SearchBox.setValue(key);
        this.search(key);
    }

    renderItem = ({item, index}) => {
        return (
            <GroupBuyItem2
                ProductItem={item}
                index={index}
                navigation={this.props.navigation}
            />
        )
    }

    renderSearchResult = ({item}) => {
        return (
            <TouchableOpacity style={styles.recentWrapper} onPress={this.pressRecent.bind(this, item.key)}>
                <Text style={styles.textRecent}>{item.key}</Text>
            </TouchableOpacity>
        )
    }

    renderTabSearch() {
        return (
            <View style={styles.container}>
                <Text style={styles.textSearch}>Tìm kiếm gần đây</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.listWrapper}
                    data={this.state.recentSearch}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderSearchResult}
                />
            </View>
        )
    }

    renderTabResult() {
        const {listItem, isLoading} = this.state;
        return (
            <SortMenu data={data} onPress={this.sort}>
                {!isLoading ?
                    <View style={styles.container}>
                        {listItem.length === 0 ?
                            <View style={styles.textWrapper}>
                                <Text style={styles.textResult}>Rất tiếc, không tìm thấy sản phẩm phù hợp với lựa chọn của bạn</Text>
                            </View>
                            :
                            <ScrollView style={styles.scrollWrapper}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.contentScroll}
                            >
                                <FlatList
                                    style={styles.listWrapper}
                                    data={listItem}
                                    keyExtractor={(item, index) => item.id.toString()}
                                    renderItem={this.renderItem}
                                />
                                {this.state.showLoadMore &&  <BtnMore isLoading={this.state.isLoadingMore} loadingMore={this.loadingMore}/>}
                            </ScrollView>
                        }
                    </View>
                : <Spinner/>
                }
            </SortMenu>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
                            <MaterialCommunityIcons name="arrow-left" color={"#000000"} size={24} />
                        </TouchableOpacity>
                        <View style={styles.searchWrapper}>
                            <SearchBox
                                ref={"SearchBox"}
                                config={{placeholder :"Bạn tìm gì hôm nay...", placeholderTextColor: "#a0a0a0", autoFocus: true}}
                                style={{backgroundColor: "#E3E3E8"}}
                                onSearch={this.search}
                                changeTab={this.changeTab}
                            />
                        </View>
                    </View>
                </SafeAreaView>
                <View style={styles.tabWrapper}>
                    {this.state.activeTab === 0 ? this.renderTabSearch() : this.renderTabResult()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {flex: 1},
    scrollWrapper: { flex: 1},
    contentScroll: {paddingBottom: 15, paddingTop: 5, paddingHorizontal: 15},
    listWrapper: {flex: 1},
    header: {
        paddingHorizontal: 15, width: platform.deviceWidth, flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", paddingVertical: 5, borderBottomWidth: 0.5, borderColor: "#a0a0a0"
    },
    searchWrapper: {flex: 1, marginLeft: 10},
    tabWrapper: { flex: 1, backgroundColor: "#fff"},
    textSearch: {fontSize: 18, padding: 15},
    textResult: {fontSize: 14, textAlign: "center"},
    textWrapper: {flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 15},
    recentWrapper: {marginHorizontal: 15, borderBottomWidth: 0.5, borderColor: "#a0a0a0"},
    textRecent: {fontSize: 14, paddingVertical: 10, paddingHorizontal: 5},
})
