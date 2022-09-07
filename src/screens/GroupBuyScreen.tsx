import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet} from "react-native";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import config from "../config";
import BtnMore from "../ui/BtnMore";
import GroupBuyItem2 from "../themes/Components/GroupBuyItem2";
import GroupItem from "../themes/Components/GroupItem";
import BannerHome from "./BannerHome"


export default class GroupBuyScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingMore: false,
            showLoadMore: true,
            page: 1,
            products: [],
            listItem: null
        }
    }

    asyncInit = async () => {
      //  const res = await HomeRequest.getFrontData();
        const {products, sliders} = await HomeRequest.getSharedProduct();


        this.setState({
            listBanner: sliders,
            isLoading: false,
            products: products,
        });
    }


    onFocus = async () => {
        await this.asyncInit();
    };

    componentDidMount(): void {
        this.asyncInit();
        this.listener = this.props.navigation.addListener('focus', this.onFocus)
    }

    componentWillUnmount(): void {
        if (this.listener) {
            this.listener();
        }
    }

    loadingMore = async () => {

    }

    renderItem = ({item, index}) => {
        return (
            <View style={styles.item}>
                <GroupBuyItem2
                    ProductItem={item}
                    navigation={this.props.navigation}
                />
               {/* <GroupItem
                    navigation={this.props.navigation}
                />*/}
            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner/>
        }

        return (
            <ScrollView style={styles.scrollWrapper}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingVertical: 15}}
            >
                <View style={styles.banner}>
                    <BannerHome navigation={this.props.navigation} listBanner={this.state.listBanner} />
                </View>
                <FlatList
                    ListEmptyComponent={() => {
                        return <View style={styles.textWrapper}>
                            <Text>Chưa có sản phẩm nào</Text>

                        </View>
                    }}
                    style={styles.listWrapper}
                    data={this.state.products}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                />
                {/*{this.state.showLoadMore &&  <BtnMore isLoading={this.state.isLoadingMore} loadingMore={this.loadingMore}/>}*/}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollWrapper: { flex: 1, backgroundColor: "#f6f6fa"},
    listWrapper: {flex: 1},
    textWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    item: {marginBottom: 5, backgroundColor: "#fff", paddingHorizontal: 15},
    banner: {backgroundColor: "#fff", paddingBottom: 10}
})
