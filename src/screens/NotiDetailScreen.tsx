import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import NotificationRequest from '../api/requests/NotificationRequest';
import { WebView } from 'react-native-webview';

interface Props {
    navigation: any
    route: any
}

const NotiDetailScreen = (props: Props) => {

    const { navigation, route } = props;
    const [dataDetail, setDataDetail] = React.useState(null);

    const getDetail = async () => {
        try {
            console.log('11id',)
            const id = route.params?.item?.id;
            console.log('11id', id)
            const res: any = await NotificationRequest.show(id);
            if (res) {
                setDataDetail(res)
            }

        } catch (error) {
            setTimeout(() => {
                Alert.alert('Thông báo', `${error}`)
            }, 200)
        }
    }

    React.useEffect(() => {
        getDetail()
    }, [])

    return (
        <View style={styles.container}>
            {dataDetail != null ?
                <WebView style={{ flex: 1 }}
                    source={{ html: dataDetail?.content }} /> : <></>
            }
        </View>
    );
};

export default NotiDetailScreen;

const styles = StyleSheet.create({
    container: {}
});
