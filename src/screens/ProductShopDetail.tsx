import React, {Component} from 'react';
import {Text, View} from "react-native";
// @ts-ignore
import ProductDetailScreen from "./ProductDetailScreen";

/**
 * File này để copy/paste khi tạo màn hình mới cho tiện
 */
export default class ProductShopDetail extends ProductDetailScreen
{

    constructor(props) {
        super(props);
        this.showShopInfo = false;
    }
}
