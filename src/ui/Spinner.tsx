import XSpinner from "react-native-spinkit";
import {View} from "react-native";
import React from "react";
import config from "../config";
import platform from "../themes/Variables/platform";

export default  function Spinner() {
    return <View style={{
            flex: 1,
            width: platform.deviceWidth,
            top: platform.deviceHeight*0.3,
            position: 'absolute',
            zIndex:99,
            alignItems: 'center',
            justifyContent: 'center',


    }}>
    <XSpinner style={{marginBottom: 50}} isVisible={true} size={60} type={'Circle'} color={config.secondaryColor}/>
        </View>
}
