import {TextInput, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import React, {PureComponent} from "react";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../config";

export default class BtnMore extends PureComponent<any>{

    constructor(props: any) {
        super(props);
    }

    onLoad = () => {
        this.props.loadingMore();
    }

    render () {
        return (
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.button}
                                  onPress={this.onLoad} disabled={this.props.isLoading} activeOpacity={1}
                >
                    <View style={styles.buttonContent}>
                        <MaterialCommunityIcons name="chevron-down" color={"#fff"} size={20} />
                        {this.props.isLoading ?
                            <View style={styles.indicatorWrapper}>
                                <ActivityIndicator size={20} color="#fff" />
                            </View>
                            : <Text style={styles.text}>Xem thêm</Text>}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    buttonWrapper: {alignItems: "center", marginTop: 15},
    button: {backgroundColor: config.secondaryColor, borderRadius: 5},
    buttonContent: {flexDirection: "row", alignItems: "center", padding: 5},
    indicatorWrapper: {paddingHorizontal: 15},
    text: {fontSize: 16, paddingVertical: 0, color: "#fff", marginLeft: 5},
})
