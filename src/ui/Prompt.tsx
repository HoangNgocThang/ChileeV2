import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity, Platform} from "react-native";
import config from "../config";

interface Prop {
    placeholder?: string,
    label?: string,
    content?: string,
    visible: boolean,
    keyboardType?: string,
    onCancel?: any,
    onDone?: any,
    maxLength?: number
}

interface State {
    content: string
}

export default class Prompt extends Component<Prop, State>
{
    private textInputRef: any;
    constructor(props: Prop) {
        super(props);
        this.state = {
            content: this.props.content ? this.props.content.toString() : ''
        }
    }


    focus(content: any) {
        if (this.textInputRef) {
            this.textInputRef.focus();
            if (typeof content === 'string') {
                this.setState({content});
            }
        }
    }


    render() {
        if (!this.props.visible) {
            return null;
        }

        const maxLength = this.props.maxLength || 200;

        return <View style={styles.overlay}>
            <View style={styles.content}>
                <View >
                    <Text style={styles.label}>{this.props.label}</Text>
                    <TextInput value={this.state.content}
                               ref={(input) => { this.textInputRef = input; }}
                               keyboardType={this.props.keyboardType}
                               maxLength={maxLength}
                               onChangeText={(value: string) => {
                                   this.setState({
                                       content:value
                                   })
                               }}
                               placeholder={this.props.placeholder} style={styles.input}/>
                </View>
                <View style={{flex:1,flexDirection:'row',marginTop:5, alignItems: 'center',
                    justifyContent: 'center'}}>
                    <TouchableOpacity style={styles.btnYes} onPress={() => {
                      if (this.props.onDone) {
                          this.props.onDone(this.state.content);
                      }
                    }}>
                        <Text style={{color:'white'}}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.btnNo} onPress={() => {
                        if (this.props.onCancel) {
                            this.props.onCancel();
                        }

                    }}>
                        <Text style={{color:'black'}}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    label: {
      fontWeight: 'bold',
    },
    overlay: {
        zIndex:9999,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        height: '100%',
        width:'100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingLeft:10,
        paddingTop:10,
        paddingRight:10,
        backgroundColor: 'white',
        top: '30%',
        height: 110,
        width: '90%',
        borderRadius: 10,
        position: 'absolute',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        borderBottomColor: '#d9d9d9',
        color: "#000000"
    },
    btnYes: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:config.secondaryColor,
        borderRadius:5,
        padding:5,
        height:30,
        width:100
    },
    btnNo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
        borderRadius:5,
        borderWidth:1,
        marginLeft:5,
        padding:5,
        height:30,
        width:100
    }
});
