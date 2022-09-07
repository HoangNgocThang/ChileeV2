import React, {Component} from 'react';
import {Alert, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import config from "../../config";
import {getRemoteProvincesSync} from "../../utils";
import ConfigStore from "../../store/ConfigStore";



const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
export default class ModalLocationOption extends Component<any> {
    private provinces: any = [];
    constructor(props) {
        super(props);
        this.provinces =  getRemoteProvincesSync();
        this.state = {
            isVisible: false,
            selected: 0,
            items: this.provinces
        }
    }

    onClose = () => {
        this.setState({ isVisible: false });
    }

    onOpen() {
        this.setState({ isVisible: true });
    }

    choose = (index: number) => {
        this.setState({selected: index})
    }

    onConfirm = () => {
        ConfigStore.setProvince(this.provinces[this.state.selected])
        this.onClose();
        this.props.onConFirm();
    }

    renderItem = ({item, index}) => {
        const {selected} = this.state;
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.choose.bind(this, index)}
            >
                <View style={styles.cardWrapper}>

                    <Text style={[styles.text, {color: index === selected ? config.secondaryColor : "#000"}]}>{item.name}</Text>
                    {index === selected ?  <MaterialCommunityIcons name="check" color={config.secondaryColor} size={26} /> : null}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let {items} = this.state;

        return (
            <View>
                <Modal
                    backdropOpacity={0.3}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.state.isVisible}
                    style={styles.modal}
                >
                    <View style={styles.container}>
                        <View style={styles.contentWrapper}>
                            <Text style={styles.headerText}>Chọn khu vực mua hàng</Text>
                            <FlatList
                                style={{}}
                                data={items}
                                renderItem={this.renderItem}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => item.id.toString()}
                            />
                            <View style={{alignItems: "center"}}>
                                <TouchableOpacity activeOpacity={1} onPress={this.onConfirm}
                                                  style={styles.button}>
                                    <Text style={styles.buttonText}>Xác nhận</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    modal: {justifyContent: "center", alignItems: "center", margin: 0},
    container: {width: deviceWidth * 0.8, height: deviceHeight * 0.5, backgroundColor: "#fff", borderRadius: 10},
    contentWrapper: {paddingVertical: 10, paddingHorizontal: 15, flex: 1},
    headerText: {fontSize: 20, fontWeight: "bold", paddingVertical: 10, textAlign: "center"},
    cardWrapper: {flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderColor: "#a0a0a0", paddingVertical: 10},
    button: {paddingVertical: 10, alignItems: "center", paddingHorizontal: 20, borderRadius: 10, backgroundColor: config.secondaryColor},
    text: {fontSize: 20, paddingHorizontal: 10},
    buttonText: {fontSize: 20, color: "#fff"}
})
