import {TextInput, View, StyleSheet, Text, TouchableOpacity} from "react-native";
import React, {Component} from "react";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SearchBox extends Component<any>{

    constructor(props: any) {
        super(props);
        this.state = {
            value: '',
        };
    }

    onChangeText = (text: string) => {
        this.setState({value: text})
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    };

    submitSearch = () => {
        const {value} = this.state
        this.props.onSearch(value)
    }

    setValue = (value: string) => {
        this.setState({value: value});
    }

    clearValue = () => {
        this.setState({value: ""});
        this.props.changeTab();
    }

    onFocus = () => {
        this.props.changeTab();
    }

    render () {
        return (
            <View style={[styles.boxWrapper, this.props.style]}>
                <MaterialCommunityIcons name="magnify" color={"#a0a0a0"} size={24} />
                <TextInput
                    style={styles.textInput}
                    {...this.props.config}
                    onChangeText={this.onChangeText}
                    value={this.state.value}
                    onSubmitEditing={this.submitSearch}
                    onFocus={this.onFocus}
                />
                {this.state.value ?
                    <TouchableOpacity style={styles.clearButton} onPress={this.clearValue}>
                        <MaterialCommunityIcons name="close" color={"#fff"} size={12} />
                    </TouchableOpacity>
                    : null}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    clearButton: {backgroundColor: 'rgba(70, 70, 70, 0.4)', width: 18, height: 18, borderRadius: 9, justifyContent: "center", alignItems: "center", marginRight: 5},
    boxWrapper: {paddingHorizontal: 10, paddingVertical: 7.5, flexDirection: "row", alignItems: "center", borderRadius: 10},
    textInput: {flex: 1, paddingVertical: 0, marginLeft: 7.5, fontSize: 16, color: "#000000"},
})
