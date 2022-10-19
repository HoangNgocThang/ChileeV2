import React, { Component, PureComponent } from 'react';
import { Text, View, TouchableOpacity, Button, StyleSheet, TextInput, Alert } from "react-native";
import platform from "../Variables/platform";
import ProductItemChildren from './ProductItemChildren';

const defaultWidth = platform.deviceWidth;

interface Props {
    data: Array<any>,
    navigation: any
}

interface State {

}

class ListChildren extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { data } = this.props
        if (data) {
            return (
                data.map(e => {
                    return (
                        <ProductItemChildren key={`${e.id}`} item={e} navigation={this.props.navigation} />
                    )
                })
            )
        } else {
            return <></>
        }
    }

};

export default ListChildren;

const styles = StyleSheet.create({});
