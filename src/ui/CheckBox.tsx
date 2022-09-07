import {Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import config from "../config";

 function CheckBoxIcon(props: any) {
    return (
        <View style={[{
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: config.secondaryColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5
        }, props.style]}>
            {
                props.selected ?
                    <View style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: config.secondaryColor,
                    }}/>
                    : null
            }
        </View>
    );
}

export class CheckBox extends Component<any, any> {
     constructor(props: any) {
         super(props);
         this.state = {
             checked: props.checked
         }
     }

     onSelected = () => {
         const value = !this.state.checked;
        this.setState({checked: value});
        if (this.props.onChange) {
            this.props.onChange(value);
        }
     };

     render() {
         const padding = this.props.paddingVertical || 15;
         return <View>
             {this.props.items.map((item: any) => {
                 return (
                     <TouchableOpacity
                         onPress={() => this.onSelected(item)}
                         key={item.id.toString()} style={{flex:1, flexDirection: 'row', paddingVertical:padding, alignItems: "center"}}>
                         <CheckBoxIcon selected={this.state.checked} />
                         <Text style={{paddingLeft: 15}}>{item.label}</Text>
                     </TouchableOpacity>
                 )
             })}
         </View>
     }
}


