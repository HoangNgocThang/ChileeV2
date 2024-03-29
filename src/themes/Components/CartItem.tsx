import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import platform from "../Variables/platform";
import { debounce, intVal, numberFormat } from "../../utils";
import Image from 'react-native-fast-image'
import config from "../../config";
// @ts-ignored
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartStore from "../../store/CartStore";
import { $alert } from "../../ui/Alert";
import messages from "../../locale/messages";
import CartRequest from "../../api/requests/CartRequest";
import { navigate } from "../../navigation/RootNavigation";
import InputText from "../../ui/InputText";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

const prodef = require('../../../src/assets/prodef.jpeg')
const defaultWidth = platform.deviceWidth;

interface Props {
  item: any
  navigation: any
}

interface State {
  product: any,
  quantity: any,
  pack: any,
  price: any,
  priceOrigin: any,
  amount: any,
  amountOrigin: any,
  quantityText: any,
  valid: boolean,
}

export default class CartItem extends Component<Props, State>{

  private item: any;

  constructor(props: any) {
    super(props);
    this.item = this.props.item;
    let { product, quantity, pack } = this.item;
    product.quantity = intVal(product.quantity);
    quantity = intVal(quantity);
    if (quantity <= 0) {
      quantity = 1;
    }

    this.state = {
      product: product,
      quantity: quantity,
      pack: pack,
      price: this.item.price,
      priceOrigin: this.item.price_origin,
      amount: this.item.price * quantity,
      amountOrigin: this.item.price_origin * quantity,
      quantityText: quantity.toString(),
      valid: true,
    }
  }

  add = (value: number) => {
    const newQuantity = this.state.quantity + value;
    if (newQuantity <= 0) {
      return;
    }

    this.setState({ quantity: newQuantity }, () => {
      this.addHandler(this.state.quantity);
    });
  }

  addHandler = debounce(async (quantity: number) => {
    if (this.props.beforeQuantityChanged) {
      this.props.beforeQuantityChanged();
    }

    const res = await CartRequest.updateQuantity(this.item.id, quantity);
    if (res.err_code === 0) {
      await AsyncStorage.setItem('isErrorQuanity', 'false')
      this.setState({
        //quantity: quantity,
        price: res.price,
        priceOrigin: res.price_origin,
        amountOrigin: res.price_origin * quantity,
        amount: res.price * quantity,
      });
      this.props.quantityChanged(res.amount, res.amount_origin);
    } else {
      await AsyncStorage.setItem('isErrorQuanity', 'true')
      $alert(res.message);
    }
  }, 200);

  onChangeText = (text: string) => {
    let quantity = intVal(text);
    if (quantity <= 0) {
      return;
    }

    this.setState({ quantity }, () => {
      this.addHandler(quantity);
    });
  }

  onEndEditing = () => {
    let { quantity } = this.state;
    if (quantity < 0) {
      quantity = 1;
    }

    this.setState({ quantity }, () => {
      this.addHandler(quantity);
    })
  }

  render() {
    const item = this.props.item;
    let { product, quantity, pack, shop } = item;
    const { navigation } = this.props;
    const showOrigin = this.item.price < this.item.priceOrigin;
    const { valid } = this.state;
    return (
      <View style={styles.cardWrapper}>
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate("DetailProduct", { Item: product })}>
              <Image
                source={valid ? item?.product?.thumb : prodef}
                // style={styles.thumb}
                style={{ width: defaultWidth * 0.14, height: defaultWidth * 0.14, borderRadius: 5 }}
                onError={() => { this.setState({ valid: false }) }} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentWrapper}>
            <View>
              <View style={styles.contentHeader}>
                <Text style={styles.textName}>{product.name}</Text>
                <TouchableOpacity
                  onPress={() => { this.props.removeItem(this.props.item) }}>
                  <MaterialCommunityIcons name="close" color={"#a0a0a0"} size={20} />
                </TouchableOpacity>
              </View>
              {/* <Text style={styles.textInfo}>Ngày giao hàng: {product.time_range}</Text>
                            <Text style={styles.textInfo}>Thuộc tính: {pack.name}</Text> */}
              {shop != null &&
                <TouchableOpacity
                  style={styles.shopInfo}
                  onPress={() => {
                    navigate('ShopDetailScreen', {
                      id: shop.id
                    })
                  }}>
                  <Text style={styles.shopInfoText}>{shop.name}</Text>
                </TouchableOpacity>}
            </View>

            <View style={[styles.contentFooter]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.textInfo}>Đơn giá:</Text>
                <Text style={[styles.textAmount, { flex: 0 }]} numberOfLines={1}>
                  {numberFormat(this.state.price)}
                </Text>
                <Text style={{ marginLeft: 12, fontSize: 12, color: 'grey', }}>Tồn: {product.quantity}</Text>
              </View>
              {this.state.priceOrigin > this.state.price &&
                <Text style={styles.textAmountOrigin} numberOfLines={1} ellipsizeMode="tail">
                  {numberFormat(this.state.priceOrigin)}
                </Text>}
            </View>
            <View style={[styles.contentFooter]}>
              <Text style={styles.textInfo}>Tổng tiền:</Text>
              <Text style={styles.textAmount} numberOfLines={1} ellipsizeMode="tail">
                {numberFormat(this.state.amount)}
              </Text>
              {this.state.amountOrigin > this.state.amount &&
                <Text style={styles.textAmountOrigin} numberOfLines={1} ellipsizeMode="tail">
                  {numberFormat(this.state.amountOrigin)}
                </Text>}
            </View>

            {/* <View style={[styles.contentFooter, { marginTop: 5 }]}>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity style={{ borderRadius: 15 }} onPress={(() => this.add(-1))}>
                  <View style={styles.button}>
                    <View style={styles.buttonBackground} />
                    <View style={{ zIndex: 1 }}><MaterialCommunityIcons name="minus" color={"#fff"} size={20} /></View>
                  </View>
                </TouchableOpacity>
                <TextInput
                  value={this.state.quantity.toString()}
                  onChangeText={this.onChangeText}
                  onEndEditing={this.onEndEditing}
                  keyboardType={"number-pad"}
                  enablesReturnKeyAutomatically={true}
                  returnKeyType={"done"}
                  style={styles.textQuantity}
                />
                <TouchableOpacity
                  onPress={(() => this.add(1))}
                  style={{ backgroundColor: config.secondaryColor, borderRadius: 15 }}>
                  <View style={styles.button}>
                    <MaterialCommunityIcons name="plus" color={"#fff"} size={20} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.textInfo}>Tồn: {product.quantity}</Text>
            </View> */}

            <View style={{ marginTop: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  onPress={(() => this.add(-1))}
                  style={{
                    borderRadius: 1000,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <View style={styles.button}>
                    <View style={styles.buttonBackground} />
                    <View style={styles.button}>
                      <MaterialCommunityIcons name="minus" color={"#fff"} size={15} /></View>
                  </View>
                </TouchableOpacity>
                <TextInput
                  value={this.state.quantity.toString()}
                  onChangeText={this.onChangeText}
                  onEndEditing={this.onEndEditing}
                  keyboardType={"number-pad"}
                  enablesReturnKeyAutomatically={true}
                  returnKeyType={"done"}
                  style={styles.textQuantity}
                />
                <TouchableOpacity
                  onPress={(() => this.add(1))}
                  style={{
                    backgroundColor: config.secondaryColor,
                    borderRadius: 1000,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <View style={styles.button}>
                    <MaterialCommunityIcons name="plus" color={"#fff"} size={15} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumb: { width: defaultWidth * 0.2, height: defaultWidth * 0.2, borderRadius: 7.5 },
  cardWrapper: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    // borderBottomWidth: 0.5, borderColor: "#a0a0a0"
  },
  container: { width: defaultWidth - 30, flexDirection: "row" },
  imageWrapper: { justifyContent: "center", flex: 0, paddingRight: 10, paddingLeft: 4 },
  contentWrapper: { flex: 1, justifyContent: "space-between" },
  contentHeader: { flexDirection: "row", justifyContent: "flex-end" },
  textName: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    color: config.textColor
  },
  contentFooter: { flexDirection: "row", alignItems: "center" },
  textAmount: { fontSize: 12, color: config.secondaryColor, flex: 1 },
  textAmountOrigin: { fontSize: 12, color: 'gray', textDecorationLine: "line-through", marginRight: 3 },
  // buttonWrapper: { flexDirection: "row", alignItems: "center", paddingRight: 10 },
  // button: { alignItems: "center", width: 25, height: 25, justifyContent: "center", padding: 1 },
  // buttonBackground: {
  //   position: "absolute", backgroundColor: config.secondaryColor,
  //   top: 0, bottom: 0, left: 0, right: 0, opacity: 0.3, borderRadius: 15
  // },
  buttonWrapper: { flexDirection: "row", alignItems: "center" },
  button: {
    alignItems: "center",
    width: 15, height: 15,
    justifyContent: "center",
    // padding: 1,
  },
  buttonBackground: {
    position: "absolute", backgroundColor: config.secondaryColor,
    top: 0, bottom: 0, left: 0, right: 0, opacity: 0.3, borderRadius: 15
  },
  textQuantity: {
    fontSize: 12, color: config.secondaryColor, marginHorizontal: 5,
    minWidth: 30,
    paddingVertical: 0, textAlign: "center"
  },
  textInfo: { fontSize: 12,  color: config.textColor, marginRight: 5 },
  shopInfo: {
    paddingTop: 2, color: config.textColor, alignSelf: 'flex-start',
    marginTop: 5, borderRadius: 5,
    padding: 5, borderWidth: 1, borderColor: config.secondaryColor
  },
  shopInfoText: { fontSize: 14, paddingTop: 2, color: config.secondaryColor, borderColor: config.secondaryColor },
  // textQuantity: {
  //   fontSize: 18, color: config.secondaryColor, marginHorizontal: 5,
  //   minWidth: 60,
  //   paddingVertical: 0, textAlign: "center"
  // },
})
