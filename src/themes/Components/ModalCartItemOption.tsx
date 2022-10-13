import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Modal from "react-native-modal";
import platform from "../Variables/platform";
import {cloneObject, debounce, numberFormat, intVal, validQuantity} from "../../utils";
import config from "../../config";
import {Pack, Product} from '../../api/interfaces';
import CartStore, {CartItem} from "../../store/CartStore";
import {$alert} from "../../ui/Alert";
import messages from "../../locale/messages";
import storage from "../../utils/storage";
import {navigate} from "../../navigation/RootNavigation";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductRequest from "../../api/requests/ProductRequest";
import Prompt from "../../ui/Prompt";



export interface Props {
    item: Product
}

export interface State {
    quantity: any,
    price: number,
    isVisible: boolean,
    item: any,
    amount: number,
    amountOrigin: number,
    activePack: Pack,
    showPrompt: boolean
}


const defaultWidth = platform.deviceWidth;
export default class ModalCartItemOption extends Component<Props, State> {
    private activePrice: number;
    private isLoading = true;
    private promptRef: any;

    constructor(props: Props) {
        super(props);
        props.item.packs.forEach((item: Pack, index: number) => {
            item.checked = (index === 0)
        });

        const defaultPack =  (props.item.packs && props.item.packs[0]) || {id: 0, price: 0};
        this.activePrice = props.item.price;
        this.state = {
            isVisible: false,
            price: 0,
            quantity: 1,
            item:  props.item || {thumb: {}},
            amount:  0,
            amountOrigin:  0,
            activePack: defaultPack,
            showPrompt: false
        };


        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
    }



    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        // do things with nextProps.someProp and prevState.cachedSomeProp
        return {
            item: nextProps.item
            //  cachedSomeProp: nextProps.someProp,
            // ... other derived state properties
        };
    }

    asyncInit = debounce(async () => {
        this.isLoading = true;
        const res = await ProductRequest.calculatePrice(
            this.state.item.id,
            this.state.quantity,
            this.state.activePack
        );

        this.setState({
            amount: res.amount,
            amountOrigin: res.amount_origin,
            price: res.price,
        }, () => {
            this.isLoading = false;
        })
    });


    componentDidMount(): void {
        this.asyncInit();
    }

    componentWillUnmount(): void {
    }

    onClose() {
        this.setState({ isVisible: false });
    }

    onOpen() {

        this.setState({ isVisible: true });
    }


    selectPack = async (pack: Pack) => {

        this.state.item.packs.forEach((item: Pack) => {
            item.checked = (pack === item)
        });
        //this.activePrice = pack.price;
       // const newPrice = this.activePrice * this.state.quantity;
        this.setState({item: this.state.item, activePack: pack})
    };

    add = async (value: number) => {

        const newValue = validQuantity(this.state.quantity + value);

        this.isLoading = true;
        this.setState({quantity: newValue}, () => {
            this.asyncInit();
        });
    };

    addToCart = async () => {
        if (this.isLoading) {
            $alert('Vui lòng đợi giây lát')
            return;
        }
        
        const auth = await storage.getAuth();
        if (!auth) {
            $alert(messages.pleaseLogin, () => {
                this.setState({isVisible: false});
                // navigate('ProfileScreen');
            });
            return;
        }

        const product = this.state.item;

        if (product.quantity < this.state.quantity) {
            $alert(messages.outOfQuantity);
            return;
        }


        const activePack = cloneObject(this.state.activePack);
        activePack.price = this.activePrice;

        const item: CartItem = {
            product: product,
            pack:product?.packs?.length > 0 ?  activePack : {},
            price: this.activePrice,
            quantity: this.state.quantity
        };
        const res = await CartStore.add(item);
        if (res.err_code) {
            $alert(res.message);
        } else {
            $alert(res.message, () => {
                this.setState({isVisible: false});
            });
        }
    };


    showQuantity = (index: number) => {
        const {priceByQuantities} = this.props.item;
        if (index == 0) {
            return "≥" + priceByQuantities[index].quantity
        } else {
            if (priceByQuantities[index + 1]) {
                return priceByQuantities[index].quantity + "-" + (priceByQuantities[index + 1].quantity - 1)
            }
            return "≥" + priceByQuantities[index].quantity
        }
    }

    renderPriceByQuantity = () => {
        let {item} = this.props;
        if (item.priceByQuantities && item.priceByQuantities.length > 0) {
            return (
                <View>
                    <View style={styles.underLine}/>
                    <View style={styles.priceByUnit}>
                        <FlatList
                            numColumns={3}
                            keyExtractor={(item, index) => item.id.toString()}
                            style={{marginTop: 15, marginBottom: 10}}
                            showsVerticalScrollIndicator={false}
                            data={item.priceByQuantities}
                            renderItem={({item}) => {
                                return <View style={styles.priceUnitItem} key={item.id}>
                                    <Text style={styles.textItemPrice}>{numberFormat(item.price)}</Text>
                                    <View style={[styles.priceItemRow, {marginTop: 3}]}>
                                        <Text style={styles.textItemQuantity}>{item.explain}</Text>
                                    </View>

                                </View>
                            }}
                        />
                    </View>
                </View>
            )
        }
        return null
    }

    renderPrice = () => {
        const hasDiscount = this.state.amountOrigin > this.state.amount;
        return (
            <View>
                <View style={styles.underLine}/>
                <View style={styles.amountWrapper}>
                    <Text style={styles.amountTitle}>Tổng tiền</Text>
                    <Text>
                        {hasDiscount &&
                        <Text style={styles.textPriceOrigin}>{numberFormat(this.state.amountOrigin)+ ' '}</Text>}
                        <Text style={styles.textPrice}>{numberFormat(this.state.amount)}</Text>
                    </Text>
                </View>
            </View>
        )
    }

    renderItem = ({item}) => {
        return (
            <TouchableOpacity
                style={[styles.pack, item.checked ? styles.packActive : undefined]}
                onPress={() => {this.selectPack(item)}}
            >
                <Text style={[styles.packName, item.checked ? styles.packNameActie : undefined]}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    renderPack = () => {
        let {item} = this.props;
        let hasChecked = false;
        item.packs.forEach((item: Pack, index: number) => {
            if (item.checked) {
                hasChecked = true;
            }
        });
        if (!hasChecked) {
            if (item.packs[0]) item.packs[0].checked = true;
        }

        return (
            <View>
                <View style={styles.underLine}/>
                <Text style={{fontSize: 16, fontWeight: "bold", marginTop: 10, color: config.secondaryColor}}>
                    Thuộc tính
                </Text>
                <View style={styles.packContainer}>
                    <FlatList
                        style={{maxHeight: platform.deviceHeight * 0.3}}
                        showsVerticalScrollIndicator={false}
                        data={item.packs}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </View>
        )
    }

    onQuantityTextChange = (content: string) => {
        const quantity = validQuantity(content);
        this.setState({
            quantity,
            showPrompt: false
        }, () => {
            this.asyncInit()
        })
    }

    openPrompt = () => {
        this.setState({
            showPrompt: true
        }, () => {
            if (this.promptRef) {
                this.promptRef.focus(this.state.quantity.toString());
            }
        })
    }

    render() {

        let {item} = this.props;
        const {activePack} = this.state;
        let thumbUrl = activePack.image;
        if (!thumbUrl) {
            if (item.thumb && item.thumb.uri) {
                thumbUrl = item.thumb.uri;
            }
        }
        return (

            <View>
                <Modal
                    backdropOpacity={0.3}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.state.isVisible}
                    style={{margin: 0, justifyContent: "flex-end" }}
                    onBackButtonPress={() => {
                        this.onClose();
                    }}
                    onBackdropPress={() => {
                        this.onClose();
                    }}>
                    <Prompt label={'Nhập số lượng'}
                            ref={(ref: any) => {
                                this.promptRef = ref;
                            }}
                            maxLength={6}
                            placeholder={'Vui lòng nhập số lượng'}
                            keyboardType={'number-pad'}
                            visible={this.state.showPrompt}
                            onDone={this.onQuantityTextChange}
                            onCancel={() => {
                                this.setState({
                                    showPrompt:false,
                                });
                            }}
                            content={this.state.quantity}/>
                    <View style={styles.container}>
                        <View style={{width: platform.deviceWidth}}>
                            <View style={styles.wrapper}>
                                <View style={styles.header}>
                                    <Image source={{uri: thumbUrl}} style={styles.headerImage}/>
                                    <View style={styles.headerBody}>
                                        <Text style={styles.textName}>{item.name}</Text>
                                        <Text style={styles.textPrice}>{numberFormat(this.state.price)}
                                            <Text style={{fontSize: 14, color: "#a0a0a0"}}>/{item.unit}</Text>
                                        </Text>
                                        <Text style={{fontSize: 14, color: "#a0a0a0"}}>Số lượng còn lại: {item.quantity}</Text>
                                        <Text style={{fontSize: 14, paddingTop: 2, color: "#a0a0a0"}}>{this.state.activePack.name}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={this.onClose}>
                                            <MaterialCommunityIcons name="close" color={"#000000"} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {this.renderPriceByQuantity()}
                                {this.renderPack()}
                                <View style={styles.underLine}/>
                                <View style={styles.amountWrapper}>
                                    <Text style={styles.amountTitle}>Số lượng</Text>
                                    <View style={styles.buttonWrapper}>
                                        <TouchableOpacity style={styles.plusBtn} onPress={() => {this.add(-1)}}>
                                            <MaterialCommunityIcons name="minus" color={"#a0a0a0"} size={22} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={this.openPrompt}
                                            style={{minWidth:70, justifyContent:'center'}}>
                                            <Text style={{textAlign:'center',width:'100%'}}>{this.state.quantity}</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity style={styles.plusBtn} onPress={() => {this.add(1)}}>
                                            <MaterialCommunityIcons name="plus" color={"#a0a0a0"} size={22} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {this.renderPrice()}
                                <View style={styles.underLine}/>
                                {/* thanghn todo */}
                                <TouchableOpacity style={styles.addBtn} onPress={this.addToCart}>
                                    <Text style={styles.textAdd}>Thêm vào giỏ hàng</Text>
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
    container: {alignItems: 'center'},
    wrapper: {
        borderTopLeftRadius: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 15,
        borderTopRightRadius: 15
    },
    header: {flexDirection: "row", paddingBottom: 15},
    headerImage: {width: defaultWidth / 4, height: defaultWidth/4},
    headerBody: {flex: 1, paddingLeft: 15, justifyContent: "space-between"},
    underLine: {height: 1, backgroundColor: "#a0a0a0", width: "100%"},
    amountWrapper: {flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12.5},
    amountTitle: {fontSize: 16, fontWeight: "bold", color: config.secondaryColor},
    buttonWrapper: {
        flexDirection: "row", alignItems: "center", borderRadius: 5,
        borderWidth: 1, borderColor: "#a0a0a0", paddingVertical: 3.5
    },
    plusBtn: {alignItems: "center", justifyContent: "center", paddingHorizontal: 5},
    packContainer: {marginTop: 10, paddingBottom: 15},
    packActive: {backgroundColor: config.secondaryColor},
    packNameActie: {color: '#fff'},
    pack: {alignSelf: 'flex-start' ,marginTop:5, borderRadius: 5, backgroundColor: "#E3E3E8", marginEnd: 10},
    packName: {fontSize: 14, paddingHorizontal: 5, paddingVertical: 5, color: "#000"},
    addBtn: {
        width: "100%", alignItems: "center", backgroundColor: config.secondaryColor,
        borderRadius: 10, height: 40, marginTop: 5, justifyContent: "center"
    },
    textAdd: {fontSize: 16, paddingVertical: 5, color: "#fff"},
    textName: {fontSize: 18, fontWeight: "bold", color: config.secondaryColor},
    textPrice: {fontSize: 18, color: config.secondaryColor, paddingTop: 2},
    textPriceOrigin: {fontSize: 14, color: '#808082', paddingTop: 2, textDecorationLine: "line-through"},
    textQuantity: {fontSize: 18, color: config.secondaryColor, marginHorizontal: 5, paddingVertical: 0, textAlign: "center"},
    priceByUnit: {flexDirection: "row", alignItems: "center", width: "100%", paddingVertical: 10},
    priceUnitItem: {flex: 1, paddingRight: 10, alignItems: "center"},
    priceItemRow: {alignItems: "center", flexDirection: "row", justifyContent: "center"},
    textItemPrice: {fontSize: 18, color: config.secondaryColor, fontWeight: "bold"},
    textItemQuantity: {fontSize: 14.5, color: "#000", marginRight: 5},
    textDefaultQuantity: {fontSize: 14.5, color: "#000"},
})
