import {Alert} from "react-native";

export function $alert(message: string, cb?: any) {
    Alert.alert(
        'Thông báo',
        message,
        [
            {text: 'OK', onPress: () => {
                    if (cb) {
                        cb()
                    }
                }}
        ],
        {cancelable: false},
    );
}

export  function confirm(message: string, cb?: any) {
    Alert.alert(
        'Thông báo',
        message,
        [
            {text: 'OK', onPress: () => {
                    cb(true)
                }},
            {
                text: 'Hủy',
                onPress: () => {
                    cb(false)
                },
                style: 'cancel',
            },

        ],
        {cancelable: false},
    );
}
