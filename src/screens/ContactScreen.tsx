import * as React from 'react';
import {
    Text, View, StyleSheet, FlatList,
    TouchableOpacity, Image, Linking, Alert
} from 'react-native';
import moment from 'moment';
import NotificationRequest from '../api/requests/NotificationRequest';
import { navigationRef } from '../navigation/RootNavigation';
const prodef = require('../../src/assets/prodef.jpeg');
const playstore = require('../../src/assets/playstore.png');

interface Props {
    navigation: any
}

const ContactScreen = (props: Props) => {

    const [data, setData] = React.useState([
        {
            id: 1,
            imageUrl: require('../../src/assets/zalo_icon.png'),
            title: 'Phụ kiện hoa Chilee',
            summary: 'Công ty chuyên cung cấp các loại Giấy gói hoa, Lưới, Ruby băng và các phụ kiện khác.'
        }
    ]);
    const [page, setPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(0);

    const getData = async () => {
        // try {
        //     const res: any = await NotificationRequest.get(1);
        //     console.log('res', res)
        //     if (res) {
        //         setData(res)
        //     }
        // } catch (error) {
        //     console.log('error', error)
        // }
    }

    React.useEffect(() => {
        getData()
    }, [])

    const onClickItemNoti = async (item: any, index: number) => {
        // props.navigation.navigate('NotiDetailScreen', { item: item })
        const supported = await Linking.canOpenURL('https://zalo.me/1636451175413542693');

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL('https://zalo.me/1636451175413542693');
        } else {
            Alert.alert(`Không thể mở: https://zalo.me/1636451175413542693`);
        }
    }

    const renderImage = (value: string) => {
        // if (value) {
        //     return { uri: value }
        // }
        // return prodef;
        return playstore;
    }

    const renderItemNoti = (ele: any) => {
        const { item, index } = ele
        return (
            <TouchableOpacity
                onPress={() => onClickItemNoti(item, index)}
                style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: '#F6F6F6', borderRadius: 15, padding: 8 }}>
                {/* <Image source={renderImage(item?.imageUrl)} style={{ width: 60, height: 60 }} resizeMode="contain" /> */}
                <Image source={item?.imageUrl} style={{ width: 60, height: 60 }} resizeMode="contain" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text numberOfLines={2} style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>{item?.title}</Text>
                    <Text numberOfLines={3} style={{ fontSize: 12, color: '#000000', marginTop: 5 }}>{item?.summary}</Text>
                    {/* <View style={{ marginTop: 4, flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Text style={{ color: '#A1A1A1', fontSize: 10, fontWeight: 'bold' }}>{item?.created_at}</Text>
                    </View> */}
                </View>
                {/* {item?.read == false && <Text style={{ color: 'red' }}>◉</Text>} */}
            </TouchableOpacity>
        )
    }

    const renderListNoti = () => {
        return (
            <FlatList
                style={{ paddingVertical: 8, marginHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                // ListFooterComponent={renderFooter()}
                data={data}
                renderItem={renderItemNoti}
                keyExtractor={item => `key-${item.id}`} />
        )
    }

    return (
        <View style={styles.container}>
            {renderListNoti()}
        </View>
    );
};

export default ContactScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});
