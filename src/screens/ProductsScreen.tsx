import React, {Component} from 'react';
import {Text, View, FlatList, StyleSheet} from "react-native";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import CategoryItem from "../themes/Components/CategoryItem";
import platform from "../themes/Variables/platform";
import ProductTab from "../themes/Components/ProductTab";

export default class ProductsScreen extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    asyncInit = async () => {

        const res = await HomeRequest.getCategories();

        setTimeout(() => {

            this.setState({
                isLoading: false,
                category: res,

            });
        }, 500)
    }

    // componentDidMount(): void {
    //     this.asyncInit();
    //
    // }

    renderItem = ({item, index}) => {
        return (
            <CategoryItem
                product={item}
                layoutWidth={platform.deviceWidth /3 -20}
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
            <ProductTab navigation={this.props.navigation}/>
        )
    }
}

const styles = StyleSheet.create({
    Wrapper: {flex: 1},
    flatlist: {flex: 1, paddingHorizontal: 15},
})
