import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet, TouchableOpacity, Clipboard, Platform } from "react-native";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import config from "../config";
import BtnMore from "../ui/BtnMore";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import MemberGroup from "../themes/Components/MemberGroup";
import Image from 'react-native-fast-image';
import platform from "../themes/Variables/platform";
const defaultAvatar = require('../assets/default-avatar.png');
import OrderGroupItem from "../themes/Components/OrderGroupItem";
import moment, {Duration} from "moment";
import {RadioButton} from '../ui/RadioButton';
import OrderRequest from "../api/requests/OrderRequest";
import {debounce, getRemoteConfigSync, numberFormat} from "../utils";
import {$alert, confirm} from "../ui/Alert";
import storage from "../utils/storage";
import InputText from "../ui/InputText";
import {Address} from "../api/interfaces";
import Share from 'react-native-share';


export default class DetailGroupScreen extends Component<any, any>{
    private group: any;
    private listener: any;
    private addressType = 1;
    private quantity = 1;

    constructor(props: any) {
        super(props);
        if (this.props.route.params.group) {
            this.group = this.props.route.params.group;
        } else {
            this.group = {id: this.props.route.params.id }
        }



        this.state = {
            amountTotal:0,
            amount:0,
            shipFee:0,
            duration:null,
            group: this.group,
            isLoading: true,
            isLoadingMore: false,
            showLoadMore: true,
            page: 1,
            listMember: [1,2,3,4,5,6],
            item: null,
            members: [],
            readonly: false,
            quantity: 1,
            userAddress: null,
            showFooter: false,
        }
    }

    asyncInit = debounce(async  () => {
        const group = await HomeRequest.getGroupMembers(this.group.id);
        if (!group) {
            $alert('Nhóm không tồn tại');
            return;
        }


        let item = {
            product: {
                name: group.product_name,
                thumb: group.thumb,
                from: '',
                shareInfo: [ group.shareInfo]
            },
        }
        const diff = Math.max(0, group.end_time - Date.now());
        let duration: moment.Duration;
        if (diff > 0) {
            duration = moment.duration(diff);
        }
        let currentUser;
        let readonly = group.joined || group.status !=0;
        if (group.currentUserIndex >= 0) {
            currentUser = group.members[group.currentUserIndex];
            if (!currentUser) {
                group.joined = false;
            }
        }

        if (!group.joined ) {
            this.setState({
                members: group.members,
                group: group, item,
                duration,
                amount: group.shareInfo.price_discount,
                readonly: readonly,
                showFooter: true
            });
        } else {
            this.setState({
                userAddress: currentUser.address,
                members: group.members,
                group: group, item,
                duration,
                amount: currentUser.amount,
                shipFee: currentUser.ship_fee,
                readonly: readonly,
                quantity: currentUser.quantity,
                showFooter: true
            });

        }


    })

    onFocus = async () => {
        await this.asyncInit();
    };

    componentDidMount(): void {
        this.asyncInit();
        this.listener = this.props.navigation.addListener('focus', this.onFocus)
    }

    componentWillUnmount(): void {
        if ( this.listener ) {
            this.listener();
        }
    }

    renderItem = ({item, index}) => {
        return (
            <MemberGroup
                avatar={null}
                item={item}
                name={item.username}
            />
        )
    }

    renderProfile = () => {
        const {group} = this.state;

        return (
            <View>
                <View style={styles.profileWrap}>
                    <View style={styles.avatarWrap}>
                        <Image source={group.avatar || defaultAvatar} style={styles.avatar}/>
                    </View>
                    <Text style={styles.textName}>{group.name}</Text>

                </View>

            </View>
        )
    }

    share = (url: string, title: string) => {
      //  const url = 'https://awesome.contents.com/';
      /// const title = 'Awesome Contents';
        const message = 'Tham gia nhóm mua chung để được mua với giá tốt nhất';
        //const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
        const options = Platform.select({
            ios: {
                activityItemSources: [
                    { // For sharing url with custom title.
                        placeholderItem: { type: 'url', content: url },
                        item: {
                            default: { type: 'url', content: url },
                        },
                        subject: {
                            default: title,
                        },
                        linkMetadata: { originalUrl: url, url, title },
                    }
                ],
            },
            default: {
                title,
                subject: title,
                message: `${message} ${url}`,
            },
        });

        Share.open(options);
    }

    quantityChanged = (qty: number) => {
        this.quantity = qty;
        this.setState({
            amount: qty * this.state.group.shareInfo.price_discount
        })
    }

    renderUserAddress = () => {
        if (!this.state.userAddress) {
            return null;
        }
        const addr = this.state.userAddress;

        return  <View style={styles.rowInfo}>
            <Text style={styles.titleInfo2}>Địa chỉ nhận hàng</Text>
            <Text style={styles.textInfo3}>
                {addr.decoded}
            </Text>
        </View>
    }

    renderOrderInfo = () => {
        if (!this.state.item) {
            return null;
        }
        return (
            <View style={{paddingVertical: 15, borderBottomWidth: 0.5, borderColor: "#a0a0a0"}}>


                <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 5}}>
                    <MaterialCommunityIcons name="package-variant-closed" color={"#000000"} size={18} />
                    <Text style={{fontSize: 18, fontWeight: "700", color: "#000000", flex: 1, marginHorizontal: 5}}>Thông tin đơn hàng</Text>
                </View>
               <View style={{flex:1}}>
                    <OrderGroupItem
                        quantity={this.state.quantity}
                        onChange={this.quantityChanged}
                        readonly={this.state.readonly}
                        item={this.state.item}/>
                </View>
                <View>
                    {this.renderUserAddress()}
                    <View style={styles.rowInfo}>
                        <Text style={styles.titleInfo2}>Phí ship</Text>
                        <Text style={styles.textInfo3}>{numberFormat(this.state.shipFee)}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                        <Text style={styles.titleInfo2}>Trạng thái nhóm</Text>
                        <Text style={styles.textInfo3}>{this.state.group.statusText}</Text>
                    </View>
                    <View style={styles.rowInfo}>
                        <Text style={styles.titleInfo2}>Tổng tiền</Text>
                        <Text style={styles.textInfo2}>{numberFormat(this.state.amount+this.state.shipFee)}</Text>
                    </View>



                </View>
            </View>
        )
    }

    renderStatusInfo = () => {
        if (!this.state.duration) {
            return;
        }
        const {duration} = this.state;
        return (
            <View style={styles.statusWrapper}>
                <MaterialCommunityIcons name="clock-outline" color={config.secondaryColor} size={20} />
                <Text style={{fontSize: 16, color: "#a0a0a0", marginLeft: 5}}>Thời gian còn lại:
                    <Text style={{fontWeight: "700", color: config.secondaryColor}}> {duration.hours()} giờ {duration.minutes()} phút</Text>
                </Text>

            </View>

        )
        // return (
        //     <View style={styles.statusWrapper}>
        //         <MaterialCommunityIcons name="check" color={config.secondaryColor} size={20} />
        //         <Text style={{fontSize: 16, color: config.secondaryColor, marginLeft: 5}}>Nhóm đạt tiêu chuẩn</Text>
        //     </View>
        // )
        // return (
        //     <View style={styles.statusWrapper}>
        //         <MaterialCommunityIcons name="information-outline" color={"red"} size={20} />
        //         <Text style={{fontSize: 16, color: "red", marginLeft: 5}}>Nhóm không đạt tiêu chuẩn</Text>
        //     </View>
        // )
    }

    renderGroupStatus = () => {
        const {group} = this.state;
        return (
            <View>
                {this.renderStatusInfo()}
                <View style={styles.memberWrapper}>
                    <Text style={styles.textMember}>Thành viên ({group.number_member}/{group.required_member})</Text>
                    <View style={styles.progressWrapper}>
                        <Progress.Bar
                            progress={group.percent}
                            useNativeDriver={true}
                            width={null}
                            height={5}
                            borderRadius={2.5}
                            borderWidth={0}
                            unfilledColor={"#E6DFDE"}
                            color={config.secondaryColor}
                        />
                    </View>
                </View>
                <FlatList
                    style={styles.listWrapper}
                    data={this.state.members}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }

    joinAsync = async (addrId: any) => {
        const res = await OrderRequest.joinSharedGroup({
            groupId: this.state.group.id,
            addressId: addrId,
            quantity: this.quantity,
            shipFee: this.state.shipFee,
            addressType: this.addressType,
        });

        $alert(res.message, () => {
            this.asyncInit();

        });
    }

    joinGroup = async () => {
        const auth = await storage.getAuth();
        if (!auth) {
            $alert('Bạn vui lòng đăng nhập để sử dụng chức năng này');
            return;
        }
        this.props.navigation.navigate('AddressScreen', {
            title:  this.addressType ==1 ? 'Thông tin liên hệ': 'Địa chỉ nhận hàng',
            joinGroup:true,
            group: this.state.group,
            product: this.state.item.product,
            callback: async (addr: Address) =>  {
                this.joinAsync(addr.id)
            }
        })
    }

    leaveGroup = async () => {
        const auth = await storage.getAuth();
        if (!auth) {
            $alert('Bạn vui lòng đăng nhập để sử dụng chức năng này');
            return;
        }

        let message = 'Rời khỏi nhóm';
        if (this.state.group.isMaster) {
            message = 'Bạn là chủ nhóm nếu rời nhóm thì nhóm này sẽ bị hủy. Bạn có chắc chắn chứ?';
        }
        confirm(message,async (ok) => {
            if (ok) {
                const res = await OrderRequest.leaveSharedGroup(this.state.group.id);
                $alert(res.message, () => {
                    this.props.navigation.goBack();
                });
            }
        })
    }

    renderMeta = () => {

        const {group} = this.state;
        if (group.joined) {
            return <Text>Bạn đã tham gia nhóm này</Text>
        }
        if (group.status != 0) {
            return null;
        }
        return <RadioButton
            onChange={(item:any) => {
                this.addressType = item.id;
                if (item.id===1) {
                    this.setState({shipFee:0})
                } else {
                    this.setState({shipFee: group.shareInfo.ship_fee})
                }
            }}
            value={1} items={[
            {id: 1, label: 'Nhận hàng cùng với chủ nhóm'},
            {id: 2, label: 'Nhận hàng địa chỉ riêng'},
        ]} />
    }

    renderFooter = () => {
        const {group} = this.state;
        const remoteConfig = getRemoteConfigSync();
        const hasShareLink = !!remoteConfig.groupShareLink;
        return (
            <View style={styles.footer}>
                <View style={{paddingBottom:3}}>
                    {this.renderMeta()}
                </View>
                {hasShareLink && <TouchableOpacity
                   onPress={() =>  {
                       const url = remoteConfig.groupShareLink + '/' + this.state.group.id;
                       this.share(url, 'Chia sẻ nhóm: '+ group.name)
                       //Clipboard.setString(remoteConfig.groupShareLink + '/' + this.state.group.id);
                       //$alert('Đã sao chép link')
                   }
                   }
                   style={styles.btnShare}>
                    <MaterialCommunityIcons name="export-variant" color={config.secondaryColor} size={20} />
                    <Text style={styles.textShare}>Chia sẻ nhóm</Text>
                </TouchableOpacity>}
                {group.status==0 && <TouchableOpacity style={styles.btnJoin} onPress={group.joined?this.leaveGroup:this.joinGroup}>
                    <Text style={styles.textJoin}>{group.joined?'Rời khỏi nhóm':'Tham gia'}</Text>
                </TouchableOpacity>}
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollWrapper}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 15}}
                >
                    {this.renderProfile()}
                    {this.renderOrderInfo()}
                    {this.renderGroupStatus()}
                </ScrollView>
                {this.state.showFooter && this.renderFooter()}
            </View>
        )
    }
}

const deviceWidth = platform.deviceWidth
const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#fff"},
    scrollWrapper: { flex: 1},
    listWrapper: {flex: 1},
    textWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    btnWrapper: {paddingVertical: 10},
    btnAddGroup: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        backgroundColor: config.backgroundColor, borderRadius: 5, paddingVertical: 12.5
    },
    textAddGroup: {fontSize: 18, fontWeight: "700", marginLeft: 10, color: config.secondaryColor},
    footer: {padding: 15, borderTopWidth: 0.5, borderColor: "#a0a0a0"},
    btnShare: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12.5, borderWidth: 1,
        borderStyle: "dashed", borderColor: config.secondaryColor, borderRadius: 10, backgroundColor: config.backgroundColor
    },
    btnJoin: {padding: 12.5, alignItems: "center", borderRadius: 10, backgroundColor: "#a0a0a0", marginTop: 10},
    textShare: {fontSize: 18, fontWeight: "700", color: config.secondaryColor, marginLeft: 10},
    textJoin: {fontSize: 18, color: "#fff", fontWeight: "700"},
    progressWrapper: {flex: 3},
    memberWrapper: {flexDirection: "row", alignItems: "center", paddingVertical: 10, marginBottom: 10},
    textMember: {fontSize: 16, color:config.textColor, marginRight: 5, flex: 2},
    statusWrapper: {flexDirection: "row", alignItems: "center", paddingVertical: 10, justifyContent: "center", marginTop: 10},
    avatarWrap: {width: deviceWidth * 0.12, height: deviceWidth * 0.12, borderRadius: deviceWidth * 0.06, overflow: "hidden"},
    avatar: {width: deviceWidth * 0.12, height: deviceWidth * 0.12},
    textName: {fontSize: 18, fontWeight: "bold", color: config.secondaryColor, flex: 1, marginLeft: 15},
    profileWrap: {
        flexDirection: "row", alignItems: "center", paddingVertical: 20, borderBottomWidth: 0.5, borderColor: "#a0a0a0"
    },
    rowInfo: {flexDirection: "row", alignItems: "center", marginTop: 2},
    titleInfo: {fontSize: 15, color: "#a0a0a0"},
    textInfo: {fontSize: 15, color: "#a0a0a0", paddingLeft: 5, flex: 1, textAlign: "right"},
    titleInfo2: {fontSize: 15, color: "#000000", fontWeight: "500"},
    textInfo3: {
        color: config.secondaryColor,
        paddingLeft: 5,
        flex: 1,
        textAlign: "right"
    },
    textInfo2: {
        fontSize: 18,
        color: config.secondaryColor,
        fontWeight: "500",
        paddingLeft: 5,
        flex: 1,
        textAlign: "right"
    },
})
