import {Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import config from "../config";

 function RadioButtonIcon(props: any) {
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

export class RadioButton extends Component<any, any> {
     constructor(props: any) {
         super(props);
         this.state = {
             value: props.value
         }
     }

     onSelected = (item: any) => {
        this.setState({value: item.id});
        if (this.props.onChange) {
            this.props.onChange(item);
        }
     };


     render() {
         const padding = this.props.paddingVertical || 15;
         return <View>

             {this.props.items.map((item: any) => {
                 return (
                     <TouchableOpacity
                         onPress={() => this.onSelected(item)}
                         key={item.id.toString()} style={{flexDirection: 'row', paddingVertical:5,
                         alignItems: "center"}}>
                         <RadioButtonIcon selected={item.id==this.state.value} />
                         <View>
                             <Text style={{paddingLeft: 5, color:'#000',fontSize:14}}>{item.label}</Text>
                         </View>
                     </TouchableOpacity>
                 )
             })}
         </View>
     }
}


