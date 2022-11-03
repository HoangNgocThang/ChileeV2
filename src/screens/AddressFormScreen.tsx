import React, {Component} from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Picker,
    Platform, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
// @ts-ignored
import { $alert } from "../ui/Alert";
import InputText from "../ui/InputText";
// @ts-ignored
// @ts-ignored
import AddressRequest from "../api/requests/AddressRequest";
import config from "../config";
import Spinner from "../ui/Spinner";
import { getRemoteConfigSync, getRemoteProvincesSync, isPhoneValid, isStrEmptyOrSpaces } from '../utils';
import { RemoteConfig } from "../api/interfaces";
import messages from "../locale/messages";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RadioButton } from "../ui/RadioButton";
const IS_IOS = (Platform.OS === "ios");
const defaultAvatar = require('../assets/default-avatar.png');
const formWidth = Dimensions.get('window').width;

export default class AddressFormScreen extends Component<any, any>{
    
    private remoteConfig: RemoteConfig;
    private provinces: any = [];
    private districts: any = [];
    private provinceMap: any = {};
    private provinceMapName: any = {};
    private districtMapName: any = {};

    constructor(props: any) {
        super(props);
        this.remoteConfig = getRemoteConfigSync();
        this.provinces = getRemoteProvincesSync();
        this.provinceMap = {};
        this.provinceMapName = {};
        this.districtMapName = {};
        this.provinces.forEach(p => {
            this.provinceMap[p.id] = p.districts;
            this.provinceMapName[p.id] = p.name;
        });
        const defaultAddress = {
            name: '',
            phone: '',
            phone2: '',
            province_id: '',
            district_id: '',
            address: '',
            buyer_name: '',
            buyer_phone: '',
            buyer_phone2: '',
            type: 0
        };
        const address = props.route.params.address || defaultAddress;
        if (address.province_id) {
            this.districts = this.provinceMap[address.province_id];
            this.districts.forEach(d => {
                this.districtMapName[d.id] = d.name;
            })
        }


        this.state = {
            isLoading: false,
            provinceName: this.provinceMapName[address.province_id] || 'Tỉnh/Thành phố',
            districtName: this.districtMapName[address.district_id] || 'Quận/Huyện',
            address: address,
            type: 0,
            errors: {
                username: '',
                password: ''
            }
        }

    }

    setValueAndError(field: string, message: string, value: string) {
        const { errors, address } = this.state;
        errors[field] = message;
        address[field] = value;
        return this.setState({ errors, address })
    }

    componentDidMount(): void {

    }

    saveAddress = async () => {
        if (this.state.isLoading) {
            return;
        }
        const { address } = this.state;
        if (isStrEmptyOrSpaces(address.name)) {
            $alert(messages.receiverNameError);
            return this.setValueAndError('name', messages.receiverNameError, address.name);
        }

        if (!isPhoneValid(address.phone)) {
            $alert(messages.phoneError);
            return this.setValueAndError('phone', messages.phoneError, address.phone);
        }

        if (isStrEmptyOrSpaces(address.address)) {
            $alert(messages.addressError);
            return this.setValueAndError('address', messages.addressError, address.address);
        }

        if (parseInt(address.district_id) === 0) {
            return $alert(messages.districtError)
        }

        if (parseInt(address.province_id) === 0) {
            return $alert(messages.provinceError)
        }

        if (this.state.type) {
            if (isStrEmptyOrSpaces(address.buyer_name)) {
                $alert(messages.buyerNameError);
                return this.setValueAndError('buyer_name', messages.buyerNameError, address.buyer_name);
            }

            if (!isPhoneValid(address.buyer_phone)) {
                $alert(messages.buyerPhoneError);
                return this.setValueAndError('buyer_phone', messages.buyerPhoneError, address.buyer_phone);
            }

            if (address.buyer_phone2 && !isPhoneValid(address.buyer_phone2)) {
                $alert(messages.buyerPhoneError);
                return this.setValueAndError('buyer_phone2', messages.buyerPhoneError, address.buyer_phone2);
            }
        }


        this.setState({ isLoading: true });
        const res = await AddressRequest.save(address);

        setTimeout(() => {
            this.setState({ isLoading: false });
            $alert(res.message, () => {
                if (res.err_code === 0) {
                    this.props.navigation.goBack();
                }
            });

        }, 500)



    }

    renderDistrict() {
        if (!this.provinceMap[this.state.address.province_id]) {
            return null;
        }

        const districts = this.provinceMap[this.state.address.province_id];
        return districts.map(d => {
            return <Picker.Item key={d.id.toString()} label={d.name} value={d.id.toString()} />
        })
    }

    renderBuyer = () => {
        const { errors, address } = this.state;
        return <>
            <View style={{ width: formWidth, height: 75 }}>
                <Text style={styles.label}>Tên người mua</Text>
                <InputText value={address.buyer_name}
                    err={errors.buyer_name}
                    maxLength={100}
                    onChangeText={(text: string) => {
                        if (isStrEmptyOrSpaces(text)) {
                            return this.setValueAndError('buyer_name', messages.buyerNameError, text)
                        }

                        this.setValueAndError('buyer_name', '', text)
                    }}
                    placeholder="Tên người mua" />
            </View>
            <View style={{ width: formWidth, height: 75 }}>
                <Text style={styles.label}>Số điện thoại người mua</Text>
                <InputText value={address.buyer_phone}
                    err={errors.buyer_phone}
                    maxLength={100}
                    onChangeText={(text: string) => {
                        if (!isPhoneValid(text)) {
                            return this.setValueAndError('buyer_phone', messages.buyerPhoneError, text)
                        }

                        this.setValueAndError('buyer_phone', '', text)
                    }}
                    placeholder="SĐT người mua" />
            </View>
            <View style={{ width: formWidth, height: 75 }}>
                <Text style={styles.label}>Số điện thoại người mua (khác)</Text>
                <InputText value={address.buyer_phone2}
                    err={errors.buyer_phone2}
                    maxLength={100}
                    onChangeText={(text: string) => {
                        if (text) {
                            if (!isPhoneValid(text)) {
                                return this.setValueAndError('buyer_phone2', messages.buyerPhoneError, text)
                            }
                        }

                        this.setValueAndError('buyer_phone2', '', text)
                    }}
                    placeholder="SĐT người mua khác" />
            </View>
        </>
    }

    render() {
        const { errors, address } = this.state;
        const { navigation } = this.props;
        return (
            <KeyboardAvoidingView
                behavior={IS_IOS ? "padding" : null}
                keyboardVerticalOffset={IS_IOS ? 100 : 0}
                style={{ alignItems: 'center', paddingLeft: 20, paddingRight: 20, justifyContent: 'center' }}>
                {this.state.isLoading && <Spinner />}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView} >
                    {/* <View style={{ width: formWidth, height: 80 }}>
                        <Text style={styles.label}>Địa chỉ bao gồm</Text>
                        <RadioButton
                            value={address.type}
                            onChange={(value) => {
                                address.type = value.id;
                                this.setState({ address })
                            }}
                            items={[{ id: 0, label: 'Người nhận' }, { id: 1, label: 'Người mua và người nhận' }]}
                            label={'giờ hành chính'} selected={true} />
                    </View>
                    {this.state.address.type === 1 && this.renderBuyer()} */}
                    <View style={{ width: formWidth, height: 75 }}>
                        <Text style={styles.label}>Tên người nhận</Text>
                        <InputText value={address.name}
                            err={errors.name}
                            maxLength={100}
                            onChangeText={(text: string) => {
                                if (isStrEmptyOrSpaces(text)) {
                                    return this.setValueAndError('name', messages.receiverNameError, text)
                                }
                                this.setValueAndError('name', '', text)
                            }}
                            placeholder="Tên người nhận" />
                    </View>
                    <View style={{ width: formWidth, height: 75 }}>
                        <Text style={styles.label}>Số điện thoại người nhận</Text>
                        <InputText value={address.phone}
                            maxLength={15}
                            err={errors.phone}
                            onChangeText={(text: string) => {
                                if (!isPhoneValid(text)) {
                                    return this.setValueAndError('phone', messages.phoneError, text)
                                }
                                this.setValueAndError('phone', '', text)
                            }}
                            placeholder="Số điện thoại" />
                    </View>
                    <View style={{ width: formWidth, height: 70 }}>
                        <Text style={styles.label}>Số điện thoại dự phòng</Text>
                        <InputText value={address.phone2}
                            maxLength={15}
                            err={errors.phone2}
                            onChangeText={(text: string) => {
                                if (text) {
                                    if (!isPhoneValid(text)) {
                                        return this.setValueAndError('phone2', messages.phoneError, text)
                                    }
                                }
                                this.setValueAndError('phone2', '', text)
                            }}
                            placeholder="Số điện thoại khác" />
                    </View>
                    <View style={{ width: formWidth, height: 55, marginTop: 10 }}>
                        <Text style={styles.label}>Tỉnh/thành phố</Text>
                        <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#d9d9d9', flex: 1, flexDirection: 'row' }}
                            onPress={() => {
                                // navigation.navigate('SelectPickerScreen', {
                                //     options: this.provinces,
                                //     value: address.province_id,
                                //     title: 'Chọn tỉnh/thành phố',
                                //     onChange: (item) => {
                                //         this.districts = item.districts;
                                //         address.province_id = item.id;
                                //         this.setState({ address, provinceName: item.name, districtName: 'Quận/Huyện' })
                                //     }
                                // });
                                navigation.navigate('SelectProvinceScreen', {
                                    // options: this.provinces,
                                    // value: address.province_id,
                                    title: 'Chọn tỉnh/thành phố',
                                    onChange: (item:any) => {
                                        console.log('item11',item)
                                        this.districts = item.districts;
                                        address.province_id = item.id;
                                        this.setState({ address, provinceName: item.name, districtName: 'Quận/Huyện' })
                                    }
                                });
                            }}>
                            <View style={{ flex: 1 }}>
                                <Text>{this.state.provinceName}</Text>
                            </View>
                            <View>
                                <MaterialCommunityIcons name="menu-down" color="gray" size={18} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: formWidth, height: 40, marginTop: 20 }}>
                        <Text style={styles.label}>Quận/huyện</Text>
                        <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#d9d9d9', flex: 1, flexDirection: 'row' }}
                            onPress={() => {
                                // navigation.navigate('SelectPickerScreen', {
                                //     title: 'Chọn quận/huyện',
                                //     options: this.districts,
                                //     value: address.district_id,
                                //     onChange: (item) => {
                                //         address.district_id = item.id;
                                //         this.setState({ address, districtName: item.name })
                                //     }
                                // });
                                console.log('333',address)
                                navigation.navigate('SelectDistrictScreen', {
                                    title: 'Chọn quận/huyện',
                                    // options: this.districts,
                                    // value: address.district_id,
                                    provinceId: address.province_id,
                                    onChange: (item) => {
                                        address.district_id = item.id;
                                        this.setState({ address, districtName: item.name })
                                    }
                                });
                            }}>
                            <View style={{ flex: 1 }}>
                                <Text>{this.state.districtName}</Text>
                            </View>
                            <View>
                                <MaterialCommunityIcons name="menu-down" color="gray" size={18} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: formWidth, height: 70, marginTop: 15 }}>
                        <Text style={styles.label}>Địa chỉ đầy đủ</Text>
                        <InputText value={address.address}
                            maxLength={200}
                            err={errors.address}
                            onChangeText={(text: string) => {
                                if (isStrEmptyOrSpaces(text)) {
                                    return this.setValueAndError('address', messages.addressError, text)
                                }
                                this.setValueAndError('address', '', text)
                            }}
                            placeholder="Địa chỉ đầy đủ" />
                    </View>
                    <View style={{ flex: 1, height: 80, width: formWidth, marginTop: 10, flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.addBtn} onPress={this.saveAddress}>
                            <Text style={{ fontSize: 16, paddingVertical: 5, color: "#fff" }}>Lưu lại</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: { marginTop: 15, width: formWidth, padding: 20 },
    label: { fontSize: 12, color: 'gray' },
    fbLoginBtn: { width: 150, backgroundColor: '#1877F2', height: 45, padding: 10, borderRadius: 5 },
    ggLoginBtn: { width: 150, backgroundColor: '#EA4335', height: 45, padding: 10, borderRadius: 5 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        overflow: "hidden",
        borderWidth: 0,
    },
    addBtn: {
        width: formWidth * 0.9, alignItems: "center", backgroundColor: config.secondaryColor,
        borderRadius: 5, height: 40, marginBottom: 10, paddingTop: 5
    }
})
