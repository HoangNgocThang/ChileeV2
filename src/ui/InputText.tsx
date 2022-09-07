import {TextInput, View, StyleSheet, Text} from "react-native";
import React, {Component} from "react";
import config from "../config";
import {isStrEmptyOrSpaces} from "../utils";

interface State {
    value: string,
    err: string
}

export default class InputText extends Component<any, State>{
    private model: any;
    constructor(props: any) {
        super(props);
        this.state = {
            value: props.value || '',
            err: props.err || ''
        };

        this.model = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // do things with nextProps.someProp and prevState.cachedSomeProp
        return {
            err: nextProps.err || '',
            value: nextProps.value
          //  cachedSomeProp: nextProps.someProp,
            // ... other derived state properties
        };
    }



    onChangeText = (text: string) => {
        this.setState({value: text})
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    };

    render () {
        return <View>
            {this.state.value && this.props.showplaceholder ? <Text style={style.placehoder}>Ghi chú cho người bán</Text> : null}
            <TextInput
                returnKeyType='done'
                maxLength={this.props.maxLength||200}
                placeholder={this.props.placeholder ? this.props.placeholder : ""}
                placeholderTextColor={this.props.placeholdercolor ? this.props.placeholdercolor : "#bababa"}
                secureTextEntry={!!this.props.secureTextEntry}
                style={this.props.style ? this.props.style : style.textInput}
                onChangeText={text => this.onChangeText(text)}

                value={this.state.value}
            />
            {this.state.err.length>0 && <Text style={{color:'red', fontSize:12}}>{this.state.err}</Text>}
        </View>
    }

}
 const style = StyleSheet.create({
     placehoder: {
         fontSize: 14, color: "#a0a0a0"
     },
     textInput: {
         height: 40,
         borderColor: 'gray',
         borderBottomWidth: 1,
         borderBottomColor: '#d9d9d9',
         color: "#000000"
     },
 })
