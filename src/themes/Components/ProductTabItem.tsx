import React, { Component } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import XSpinner from "react-native-spinkit";
import CategoryRequest from "../../api/requests/CategoryRequest";
import config from "../../config";
import ProductItem from "../../themes/Components/ProductItem";
import { debounce } from "../../utils";

interface Props {
    id: number
    navigation: any
}

interface State {
    isLoading: boolean
    listItem: Array<any>
    hasNextPage: boolean,
    isLoadingMore: boolean
}

export default class ProductTabItem extends Component<Props, State>{

    page: number = 0;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            listItem: [],
            hasNextPage: false,
            isLoadingMore: false
        }
    }

    onLoad = debounce(async () => {
        const { id } = this.props;
        const { listItem } = this.state;
        const products = await CategoryRequest.getProducts(id, { page: this.page + 1, limit: 10 });
        if (products) {
            this.page += 1;
            this.setState({
                isLoading: false,
                listItem: listItem ? listItem.concat(products.products) : products.products,
                hasNextPage: products.hasNextPage,
                isLoadingMore: false
            });
        }
    })

    componentDidMount(): void {
        this.onLoad();
    }

    renderItem = (ele: any) => {
        const { item, index } = ele;
        return (
            <ProductItem
                ProductItem={item}
                navigation={this.props.navigation}
                index={item.id}
            />
        )
    }

    renderFooter = () => {
        const { isLoadingMore } = this.state
        if (isLoadingMore) return <ActivityIndicator color={config.secondaryColor} size={"small"} />
        return null
    }

    renderContent = () => {
        const { isLoading, listItem, hasNextPage } = this.state
        if (isLoading) {
            return <XSpinner style={{ marginBottom: 50 }} isVisible={true} size={60} type={'Circle'} color={config.secondaryColor} />
        }
        if (listItem.length > 0) {
            return (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 15 }}
                    style={styles.listWrapper}
                    data={listItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    onEndReached={() => {
                        if (hasNextPage) {
                            this.setState({ isLoadingMore: true })
                            this.onLoad()
                        }
                    }}
                    onEndReachedThreshold={0.25}
                    ListFooterComponent={this.renderFooter}
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
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f6f6fa", marginTop: 15 },
    listWrapper: { flex: 1, paddingHorizontal: 7.5, paddingTop: 7.5 },
    textWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
