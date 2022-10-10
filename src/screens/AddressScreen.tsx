import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import config from "../config";
import platform from "../themes/Variables/platform";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from "../ui/Spinner";
import AddressRequest from "../api/requests/AddressRequest";
import { $alert, confirm } from "../ui/Alert";
import messages from "../locale/messages";
import { Product } from "../api/interfaces";


export default class AddressScreen extends Component<any, any> {

    private focusListener: any;
    private product: Product;

    constructor(props: any) {
        super(props);
        let isPayment = false;
        let createGroup = false;
        let joinGroup = false;
        if (props.route.params) {
            if (props.route.params.payment) {
                isPayment = true;
            }
            if (props.route.params.createGroup) {
                createGroup = true;
                this.product = props.route.params.product;
            }
            if (props.route.params.joinGroup) {
                joinGroup = true;
                this.product = props.route.params.product;
            }
        }

        this.state = {
            choose: 0,
            isPayment: isPayment,
            createGroup: createGroup,
            joinGroup: joinGroup,
            isLoading: true,
            addresses: []
        }
    }

    asyncInit = async () => {
        this.setState({ isLoading: true })
        const addresses = await AddressRequest.get();
        this.setState({ addresses, isLoading: false });
    }

    onFocus = () => {
        this.asyncInit();
    }

    componentDidMount(): void {
        this.focusListener = this.props.navigation.addListener('focus', this.onFocus);
        this.asyncInit();
    }

    setDefaultAddr = (addr) => {
        AddressRequest.setDefaultAddress(addr.id);
        this.state.addresses.forEach(a => {
            a.is_default = (addr.id == a.id)
        });

        this.setState({ addresses: this.state.addresses });
    };

    removeAddress = async (addr, index) => {
        confirm('Xóa địa chỉ này', async (ok) => {
            if (ok) {
                const res = await AddressRequest.remove(addr.id);
                $alert(res.message);
                if (res.err_code === 0) {
                    this.state.addresses.splice(index, 1);
                    this.setState({ addresses: this.state.addresses });
                }
            }
        })
    };

    editAddress = async (addr) => {
        this.props.navigation.navigate('AddressFormScreen', { address: addr });
    };

    confirmCheckout = (createGroup = false) => {
        if (this.state.addresses.length === 0) {
            return $alert('Vui lòng chọn địa chỉ nhận hàng')
            return;
        }
        let defaultAddr = null;
        this.state.addresses.forEach(addr => {
            if (addr.is_default) {
                defaultAddr = addr;
            }
        });

        if (!defaultAddr) {
            return $alert('Vui lòng chọn địa chỉ nhận hàng');
        }

        if (this.state.createGroup) {
            this.props.navigation.navigate("GroupCreateScreen",
                { address: defaultAddr, product: this.product })
        } else if (this.state.joinGroup) {
            this.props.navigation.goBack();
            this.props.route.params.callback(defaultAddr);

        } else {
            this.props.navigation.navigate("CheckoutScreen", { address: defaultAddr })
        }

    };


    renderBuyer = (item) => {
        let phone = item.buyer_phone;
        if (item.buyer_phone2) {
            phone += '(' + item.buyer_phone2 + ')';
        }
        return <>
            <Text style={{ fontSize: 12, color: "#a0a0a0", marginTop: 2, fontStyle: 'italic' }}>Người mua: </Text>
            <Text style={{ fontSize: 14, color: "#a0a0a0", marginTop: 2 }}>{item.buyer_name}</Text>
            <Text style={{ fontSize: 14, color: "#a0a0a0", marginTop: 2 }}>{phone}</Text>
        </>
    }

    joinGroup = () => {
        alert('joined')
    }

    renderItem = ({ item, index }) => {
        const ratioStyle = { borderColor: item.is_default ? config.secondaryColor : "#000" };
        let phone = item.phone;
        if (item.phone2) {
            phone += '(' + item.phone2 + ')';
        }
        return (
            <View style={styles.itemWrapper}>
                <View style={styles.itemLeft}>
                    <TouchableOpacity style={[styles.ratio, ratioStyle]}
                        onPress={() => { this.setDefaultAddr(item) }} activeOpacity={1}>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.is_default ? config.secondaryColor : "transparent" }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.itemRight}>
                    <Text style={{ fontSize: 16, marginTop: 2 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: "#a0a0a0", marginTop: 2 }}>{item.decoded}</Text>
                    <Text style={{ fontSize: 14, color: "#a0a0a0", flex: 1 }}>{phone}</Text>
                    {item.type == 1 && this.renderBuyer(item)}
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.editAddress(item) }}>
                            <MaterialCommunityIcons name="pencil" color={"#a0a0a0"} size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.removeAddress(item, index) }}>
                            <MaterialCommunityIcons name="close" color={"#a0a0a0"} size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                {/* <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                    {this.state.isLoading && <Spinner/>} */}
                <FlatList
                    ListHeaderComponent={
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('AddressFormScreen', { title: 'Thêm địa chỉ' })
                            }}
                            style={styles.btnAdd}>
                            <View style={styles.iconAdd}>
                                <MaterialCommunityIcons name="plus" color={config.secondaryColor} size={20} />
                            </View>
                            <Text style={styles.textAdd}>Thêm địa chỉ mới</Text>
                        </TouchableOpacity>
                    }
                    style={styles.flatList}
                    keyExtractor={item => item.id.toString()}
                    data={this.state.addresses}
                    renderItem={this.renderItem}
                />
                {/* </ScrollView> */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => this.confirmCheckout()}>
                        <Text style={styles.footerText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const deviceWidth = platform.deviceWidth
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    scroll: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
    flatList: { flex: 1, paddingVertical: 5 },
    btnAdd: { flexDirection: "row", width: platform.deviceWidth - 30, borderBottomWidth: 0.5, borderColor: "#a0a0a0", paddingVertical: 10 },
    iconAdd: { paddingHorizontal: 7.5, justifyContent: "center", marginRight: 15 },
    textAdd: { fontSize: 16, color: config.secondaryColor, paddingVertical: 0 },
    ratio: { width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    footer: {
        backgroundColor: "#fff", paddingHorizontal: 15, paddingVertical: 5,
        width: deviceWidth, borderColor: "#a0a0a0", borderTopWidth: 0.5
    },
    footerButton: { borderRadius: 5, backgroundColor: config.secondaryColor, alignItems: "center" },
    footerText: { paddingVertical: 10, color: "#fff", fontSize: 18 },
    itemWrapper: {
        flexDirection: "row", width: platform.deviceWidth - 30, borderBottomWidth: 0.5,
        borderColor: "#a0a0a0", paddingVertical: 5
    },
    itemLeft: { paddingHorizontal: 10, justifyContent: "center", marginRight: 15 },
    itemRight: { flex: 1 },

})
