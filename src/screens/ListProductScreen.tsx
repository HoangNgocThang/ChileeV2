import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet} from "react-native";
import CategoryRequest from "../api/requests/CategoryRequest";
import Spinner from '../ui/Spinner';
import config from "../config";
import BtnMore from "../ui/BtnMore";
import GroupBuyItem2 from "../themes/Components/GroupBuyItem2";
export default class ListProductScreen extends Component<any, any>{
    private detailScreen = 'DetailProduct';

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingMore: false,
            showLoadMore: true,
            page: 1
            //listItem: props.route.params.listItem || null
        }
    }

    asyncInit = async () => {
        let {params} = this.props.route;
        const res = await CategoryRequest.getProducts(params.id, {page: 1, limit: 10});
        if (params.detailScreen) {
            this.detailScreen = params.detailScreen;
        }

        setTimeout(() => {

            this.setState({
                isLoading: false,
                listItem: res.products,
                showLoadMore: res.hasNextPage
            });
        }, 500)
    }

    componentDidMount(): void {
        this.asyncInit();
    }

    loadingMore = async () => {
        const {params} = this.props.route;
        const {page, listItem} = this.state
        this.setState({isLoadingMore: true})
        const res = await CategoryRequest.getProducts(params.id, {page: page + 1, limit: 10});
        setTimeout(() => {


            this.setState({
                listItem: listItem.concat(res.products),
                isLoadingMore: false,
                page: page + 1,
                showLoadMore: res.hasNextPage
            });
        }, 250)
    }

    renderItem = ({item, index}) => {
        return (
            <GroupBuyItem2
                ProductItem={item}
                detailScreen={this.detailScreen}
                navigation={this.props.navigation}
                index={item.id}
            />
        )
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner/>
        }
        if (this.state.listItem.length === 0) {
            return <View style={styles.textWrapper}>
                <Text>Chưa có sản phẩm nào</Text>

            </View>
        }
        return (
            <ScrollView style={styles.scrollWrapper}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{padding: 15}}
            >
                <FlatList
                    style={styles.listWrapper}
                    data={this.state.listItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                />
                {this.state.showLoadMore &&  <BtnMore isLoading={this.state.isLoadingMore} loadingMore={this.loadingMore}/>}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollWrapper: { flex: 1, backgroundColor: "#fff"},
    listWrapper: {flex: 1},
    textWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
