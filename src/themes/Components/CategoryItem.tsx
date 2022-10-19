import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Image from 'react-native-fast-image'
import config from "../../config";
import {Category} from "../../api/interfaces";

interface Props {
    product: Category
    navigation: any
}

export default class CategoryItem extends PureComponent<Props, any>{
    constructor(props: any) {
        super(props);
    }

    navigation = () => {
        this.props.navigation.navigate("ListProductScreen", {id: this.props.product.id})
    }

    render() {
        let {product, layoutWidth, layoutPadding, fontWeight} = this.props;
        const {navigation} = this.props;
        const imgWidth = layoutWidth - 2 * layoutPadding;
        return (
            <TouchableOpacity style={[styles.Wrapper, {marginEnd: layoutPadding, width: layoutWidth, marginVertical: layoutPadding}]}
                onPress={this.navigation}
            >
                <Image source={product.thumb} style={[styles.thumb, {width: imgWidth, height: imgWidth}]}/>
                <View style={styles.textWrapper}>
                    <Text style={[styles.text, {fontWeight: fontWeight}]} numberOfLines={2} ellipsizeMode={"tail"}>{product.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textWrapper: {alignItems: "center"},
    Wrapper: {alignItems: "center", paddingTop: 5},
    thumb: {borderRadius: 5},
    text: {fontSize: 14, paddingVertical: 5, textAlign: "center", color: config.textColor}
})
