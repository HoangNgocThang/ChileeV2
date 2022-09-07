import React, {PureComponent} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet} from "react-native";
import BtnMore from "../../ui/BtnMore";
import GroupBuyItem2 from "../../themes/Components/GroupBuyItem2";
import {Campaign, Product} from "../../api/interfaces";
import BannerHome from "../../screens/BannerHome";
import ProductItem2 from "./ProductItem2";
import HomeRequest from "../../api/requests/HomeRequest";
import {debounce} from "../../utils";
import Spinner from "../../ui/Spinner";
import ModalLocationOption from "./ModalLocationOption";
import platform from "../Variables/platform";


interface Props {
    campaign: Campaign,
    navigation: any,
    banner: any,
    products: Array<Product>
    loading: boolean
    show: boolean
    onLoadMore: Function
    hasReadMore: boolean
    isLoadingMore: boolean
}



export default class HomeTabItem extends PureComponent<Props, State>{

    constructor(props: any) {
        super(props);
        this.state = {

        }
    }

    renderItem = ({item, index}) => {
        return (
            <ProductItem2
                ProductItem={item}
                navigation={this.props.navigation}
                index={item.id}
            />
        )
    }

    renderHeader = () => {
        const {banner, navigation} = this.props;
        if (banner) {
            return (
                <View style={{paddingVertical: 10, backgroundColor: "#f6f6fa"}}>
                    <BannerHome navigation={navigation} listBanner={banner} />
                </View>
            )
        }
        return null
    }

    renderFooter = () => {
        const {campaign, hasReadMore, isLoadingMore, onLoadMore} = this.props;
        if (hasReadMore) {
            return (
                <BtnMore isLoading={isLoadingMore} loadingMore={() => {
                    onLoadMore();
                }}/>
            )
        }
        return null
    }

    renderContent = () => {
        const {products} = this.props;
        if (products.length > 0) {
            return (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.renderFooter}
                    // ListHeaderComponent={this.renderHeader}
                    style={styles.listWrapper}
                    data={products}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    numColumns={2}
                    contentContainerStyle={{paddingTop: 15, paddingBottom: 15}}
                />
            )
        }
        return (
            <View style={styles.textWrapper}>
                <Text>Chưa có sản phẩm nào</Text>
            </View>
        )
    }

    render() {
        if (this.props.loading || !this.props.show) {
            return <View style={styles.textWrapper}>
                <Text style={{fontSize: 18}}>Đang tải sản phẩm...</Text>
            </View>
        }

        return (
            <View style={styles.container}>

                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 10},
    listWrapper: {},
    textWrapper: { flex: 1, alignItems: 'center', paddingTop:35, width: "100%", height: platform.deviceHeight },
})
