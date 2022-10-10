import * as React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';
const prodef = require('../../src/assets/prodef.jpeg')

interface Props {
    navigation: any
}

const NotiScreen = (props: Props) => {

    const [data, setData] = React.useState([
        {
            "id": 175624,
            "appLink": null,
            "title": "🇻🇳 HVT tặng ngay 1 cuộn túi gói hàng màu đỏ mừng ngày GIẢI PHÓNG THỦ ĐÔ",
            "image": "notification/2022/10/10/tui-goi-hang-hvt-chuc-mung-giai-phong-thu-do-10-10-1665397132.jpg",
            "checked": false,
            "dateModified": "2022-10-10T13:49:09.1576457",
            "dateCreated": "2022-10-10T10:38:02.2564005",
            "imageUrl": "https://resource.nhuahvt.com/0x600/notification/2022/10/10/tui-goi-hang-hvt-chuc-mung-giai-phong-thu-do-10-10-1665397132.jpg"
        },
        {
            "id": 158324,
            "appLink": null,
            "title": "🌡 Giấy in nhiệt giá RẺ giật mình!! Duy nhất trong tháng 7",
            "image": "notification/2022/7/27/giay-tiet-kiem-gia-re-fb-post-1658836461.jpg",
            "checked": false,
            "dateModified": "2022-10-09T17:46:00.5896264",
            "dateCreated": "2022-07-27T15:06:13.1172477",
            "imageUrl": "https://resource.nhuahvt.com/0x600/notification/2022/7/27/giay-tiet-kiem-gia-re-fb-post-1658836461.jpg"
        },
        {
            "id": 174598,
            "appLink": null,
            "title": "[Hàng tặng không bán] 🍀 Túi gói hàng màu XANH KIM TIỀN hoàn toàn mới",
            "image": "notification/2022/10/5/screenshot_1664942094-1664978807.png",
            "checked": false,
            "dateModified": "2022-10-09T15:23:58.6046958",
            "dateCreated": "2022-10-05T14:11:16.5610685",
            "imageUrl": "https://resource.nhuahvt.com/0x600/notification/2022/10/5/screenshot_1664942094-1664978807.png"
        },
        {
            "id": 155196,
            "appLink": null,
            "title": "Mua càng nhiều giảm càng sâu!! Chương trình SALE lớn nhất trong năm",
            "image": "notification/2022/7/15/ct1_1@4x-100-1657879131.jpg",
            "checked": false,
            "dateModified": "2022-10-06T23:37:55.2902758",
            "dateCreated": "2022-07-15T10:02:57.8772627",
            "imageUrl": "https://resource.nhuahvt.com/0x600/notification/2022/7/15/ct1_1@4x-100-1657879131.jpg"
        },
        {
            "id": 164564,
            "appLink": null,
            "title": "BE UNIQUE 🤳 khác biệt theo cách riêng của bạn với màu túi gói hàng độc đáo",
            "image": "notification/2022/8/22/Tui-goi-hang-hvt-9-1661168869.jpg",
            "checked": false,
            "dateModified": "2022-10-06T23:13:49.4848796",
            "dateCreated": "2022-08-22T11:51:54.0730813",
            "imageUrl": "https://resource.nhuahvt.com/0x600/notification/2022/8/22/Tui-goi-hang-hvt-9-1661168869.jpg"
        },
    ]);
    const [page, setPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(0);

    React.useEffect(() => {

    }, [])

    const onClickItemNoti = () => {

    }

    const renderImage = (value: string) => {
        if (value) {
            return { uri: value }
        }
        return prodef;
    }

    const renderItemNoti = (ele: any) => {
        const { item, index } = ele
        return (
            <TouchableOpacity
                // onPress={() => onClickItemNoti(item, index)}
                style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: '#F6F6F6', borderRadius: 15, padding: 8 }}>
                <Image source={renderImage(item?.imageUrl)} style={{ width: 60, height: 60 }} resizeMode="contain" />
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ fontSize: 12, color: '#000000', }}>{item?.title}</Text>
                    <View style={{ marginTop: 4, flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Text style={{ color: '#A1A1A1', fontSize: 10, fontWeight: 'bold' }}>{moment(item?.dateCreated).format('DD/MM/YYYY HH:mm')}</Text>
                    </View>
                </View>
                {item?.checked == false && <Text style={{ color: 'red' }}>◉</Text>}
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

export default NotiScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});
