import React, {Component} from 'react';
import {FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated} from "react-native";
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-fast-image';
import platform from "../themes/Variables/platform";
import slideHolder from "../assets/holder.png"
import {numberFormat, debounce, isEmpty, hasShareInfo} from "../utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from "react-native-fast-image";
import HTML from 'react-native-render-html';
import ModalCartItemOption from "../themes/Components/ModalCartItemOption"
import HomeRequest from "../api/requests/HomeRequest";
import {Product, ProductPrice, ShareInfo} from "../api/interfaces";
import config from "../config";
import GroupCountdown from "../ui/GroupCountdown";
import GroupItem2 from "../themes/Components/GroupItem2";
import {$alert} from "../ui/Alert";
import storage from "../utils/storage";
import ProductRequest from "../api/requests/ProductRequest";
import DiscountCountdown from "../ui/DiscountCountdown";

const img = require("../assets/logo.jpg");
const bannerWidth = platform.deviceWidth * 0.15;
const bannerHeight = platform.deviceWidth * 0.15;
const ignoredStyles = ['display', 'width', 'height', 'font-family', 'padding', 'line-height', 'transform', 'text-align', 'background-color', 'white-space', 'text-decoration-style', 'text-decoration-color'];

interface State {
    isLoading: true,
    listBanner: Array<any>,
    activeImage: number,
    imageZoomIndex: number,
    product: Product
}

export default class ProductDetailScreen extends Component<any, State>{
    private listener: any;
    private loadFlag = true;
    private hasAuth = false;
    protected showShopInfo = true;

    constructor(props: any) {
        super(props);
        let product = this.props.route.params.Item;

        if (product && product.id) {
            product = {...product};//clone make sure no side effect

            if (product.price_label) {
                product.price_label = null;
            }
        }
        this.state = {
            listBanner: [
                {link: slideHolder}
            ],
            scrollY: new Animated.Value(0),
            activeImage: 0,
            imageZoomIndex: 0,
            product: product || {id: 0, name: '', content: '<html><head></head><body><p>&nbsp;</p></body></html>', packs: [], thumbs: []},
            isLoading: true,
            isLoggedIn: false
        }

    }

    _getHeaderOpacity = () => {
        const {scrollY} = this.state;

        return scrollY.interpolate({
            inputRange: [0, platform.deviceWidth * 0.75],
            outputRange: [0, 1],
            extrapolate: 'clamp',
            useNativeDriver: true
        });
    };

    asyncInit = debounce( async () => {
        const auth = await storage.getAuth();
        if (auth) {
            this.hasAuth = true;
        }
        const {params} = this.props.route;
        let id;
        if (params.Item) {
            id = params.Item.id;
        } else {
           id = params.id
        }

       // this.setState({isLoading: true, listBanner: []});
        const res = await ProductRequest.show(id );
        const product = res.product;
        product.packs.forEach((p,i) => {
            if (!p.id) {
                p.id = i;
            }
            p.checked = (i===0);
        });

        if (product.shareable && product.shareInfo.length === 0) {
            console.log('shareable=true. But shareInfo not found');
            product.shareable = false;
        }


        this.setState({ product: product, listBanner: product.thumbs})
        this.props.navigation.setParams({title: 'Chi tiết'});

    })

    onFocus = async () => {
        await this.asyncInit();
    };

    componentDidMount(): void {
        this.asyncInit();
        this.listener = this.props.navigation.addListener('focus', this.onFocus)
    }


    zoomImages = () => {
       try {
           const images = this.state.product.thumbs.map(p => {
               return {url:  p.link.uri}
           })
           this.props.navigation.navigate('PhotoScreen', {images: images});
       } catch (e) {
           this.props.navigation.navigate('PhotoScreen', {images: []});
       }

    }

    pressPreviewImage = (index: number) => {
        this.refs.carousel1.snapToItem(index);
        this.setState({activeImage: index})
    }

    showQuantity = (index) => {
        const {priceByQuantities} = this.state.product;
        if (index == 0) {
            return "≥" + priceByQuantities[index].quantity
        } else {
            if (priceByQuantities[index + 1]) {
                return priceByQuantities[index].quantity + "-" + (priceByQuantities[index + 1].quantity - 1)
            }
            return "≥" + priceByQuantities[index].quantity
        }
    }

    renderImage = ({ item, index }:any) => {

        return (
            <TouchableOpacity style={styles.imageTouch} onPress={this.zoomImages}>
                <Image
                    resizeMode={Image.resizeMode.stretch }
                    source={item.link} style={styles.image}/>
            </TouchableOpacity>
        );
    }

    renderPreviewImage = ({ item, index }:any) => {
        let {activeImage} = this.state;
        return (
            <TouchableOpacity style={styles.previewImageTouch} onPress={this.pressPreviewImage.bind(this, index)}>
                <Image
                    source={item.link}
                    style={[styles.previewImage,{borderColor: activeImage === index ? config.secondaryColor : "transparent", opacity: activeImage === index ? 1 : 0.5}]}
                />
            </TouchableOpacity>
        );
    };

    renderAddToCart = (product: Product) => {

        if (product.saleable) {
            if (product.shareable) {
                if (!isEmpty(product.shareInfo)) {
                    const shareInfo = product.shareInfo[0];
                    let retailPrice = product.price;

                    return (
                        <View style={styles.footerContent}>
                            <TouchableOpacity style={styles.btnSingle} onPress={() => this.refs.ModalCartItemOption.onOpen()}>
                                <Text style={styles.textSingle}>{numberFormat(retailPrice)}</Text>
                                <Text style={styles.titleSingle}>Giá mua lẻ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnGroup}>
                                <Text style={styles.textGroup}>{numberFormat(shareInfo.price_discount)}</Text>
                                <Text style={styles.titleGroup}>Mua chung</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

            }
            if (product.quantity > 0) {
                return <View style={styles.footerButton}>
                    <TouchableOpacity style={styles.button} onPress={() => this.refs.ModalCartItemOption.onOpen()}>
                        <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            }
            return <View style={styles.footerContent}>
                <MaterialCommunityIcons name="store" color={config.secondaryColor} size={35}/>
                <Text style={styles.footerContentText}>Sản phẩm tạm thời hết hàng, chúng tôi đang bổ sung thêm</Text>
            </View>
        }

         return null;

    }

    renderHeaderContent = () => {
        //if else de hien image hoac countdown
        const {product} = this.state;

        return (
            <View>
                {hasShareInfo(product) &&  <GroupCountdown shareInfo={product.shareInfo[0]} />}
                {product.countdown_show &&  <DiscountCountdown product={product} />}
                <View style={styles.previewImageWrapper}>
                    <FlatList
                        style={styles.previewImageList}
                        data={this.state.listBanner}
                        horizontal={true}
                        scrollEnabled={false}
                        renderItem={this.renderPreviewImage}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        maxToRenderPerBatch={15}
                    />
                </View>
            </View>
        )
    }

    renderGroupBuy = (product: Product) => {
        const shareInfo: ShareInfo = product.shareInfo[0];


        return (
            <View style={styles.rowContent}>
                <View style={styles.groupTitle}>
                    <Text style={styles.textGroupTitle}>Nhóm ({shareInfo.groupCount})</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate("ListGroupScreen", {shareInfo})}>
                        <Text style={styles.textGroupMore}>Xem thêm</Text>
                    </TouchableOpacity>
                </View>
                {shareInfo.groups.map(group => {
                    return  <GroupItem2 key={group.id.toString()}

                                        group={group} navigation={this.props.navigation}/>
                })}


                <View style={styles.groupFooter}>

                    <TouchableOpacity style={styles.btnAddGroup}
                                      onPress={() => {
                                          const diff = Math.max(0, shareInfo.end_time - Date.now());
                                          if (diff === 0) {
                                              $alert('Đã hết thời gian mua chung');
                                              return;
                                          }
                                          if (!this.hasAuth) {
                                              $alert('Bạn vui lòng đăng nhập để sử dụng chức năng này');
                                              return;
                                          }

                                          this.props.navigation.navigate('AddressScreen', {
                                              createGroup: true,
                                              product: this.state.product
                                          })
                                      }}
                                      activeOpacity={1}>
                        <MaterialCommunityIcons name="account-multiple-plus" color={config.secondaryColor} size={25}/>
                        <Text style={styles.textAddGroup}>Tạo nhóm</Text>

                    </TouchableOpacity>
                    {this.hasAuth && <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("ListGroupScreen",
                            {shareInfo, showMyGroup:true, title: 'Nhóm của tôi'})}
                        activeOpacity={1} style={{flex:1, alignSelf: 'center'}}>
                        <Text style={styles.textMyGroup}>Xem nhóm của tôi</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        )
    }

    renderProductPrice = () => {
        const {product} = this.state;

        return (
            <Text style={{flex:1}} >
                {product.price_label !=null &&
                <Text style={product.price_label.style}>{product.price_label.text}</Text>
                }
                <Text style={styles.textPrice}>{numberFormat(product.price)}</Text>
            </Text>
        )
        // if else

    }

    renderPriceByQuantity = () => {
        const {product} = this.state;
        if (product.priceByQuantities && product.priceByQuantities.length > 0) {
            return (
                <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>Ưu đãi khi mua theo số lượng</Text>
                    <View style={{alignItems: "center", flexDirection: "row"}}>
                        <FlatList
                            numColumns={3}
                            keyExtractor={(item, index) => item.id.toString()}
                            style={{marginTop: 15, marginBottom: 10}}
                            showsVerticalScrollIndicator={false}
                            data={product.priceByQuantities}
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

    renderShop = () => {
        if (!this.showShopInfo) {
            return null;
        }
        const {product} = this.state;
        if (!product.shop) {
            return null;
        }
        return (
            <View style={[styles.rowContent, {flexDirection: "row", alignItems: "center"}]}>
                {/*fake logo*/}
                <FastImage
                    source={{uri: product.shop.avatar}}
                    style={styles.shopAvatar}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.shopContent}>
                    <Text style={styles.shopName}>{product.shop.name}</Text>
                    {/*fake dia chi*/}
                    <Text style={styles.shopAddress}>{product.shop.address || "Hà Nội"}</Text>
                </View>
                <TouchableOpacity
                    style={styles.btnShop}
                    activeOpacity={0.8}
                    onPress={() => this.props.navigation.navigate("ShopDetailScreen", {id: product.shop.id})}
                >
                    <Text style={styles.btnShopTitle}>Xem shop</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let content = `<p>a</p>`;
        let {activeImage} = this.state;
        const {product} = this.state;
        const hadShareInfo = hasShareInfo(product);

        return (
            <SafeAreaView style={styles.safeAreaView}>

                <Animated.ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
                                     overScrollMode={'never'}
                                     scrollEventThrottle={16}
                                     onScroll={Animated.event(
                                         [
                                             {
                                                 nativeEvent: {contentOffset: {y: this.state.scrollY}}
                                             }
                                         ]
                                     )}>
                    <View style={styles.imageWrapper}>

                        <Carousel
                            ref={'carousel1'}
                            layout={'default'}
                            data={this.state.listBanner}
                            sliderWidth={platform.deviceWidth}
                            itemWidth={platform.deviceWidth}
                            firstItem={0}
                            loop={true}
                            inactiveSlideOpacity={1}
                            inactiveSlideScale={1}
                            onSnapToItem={(index) => {
                                this.setState({activeImage: index})
                            }}
                            renderItem={this.renderImage}
                        />
                        <View style={styles.imageIndex}>
                            <View style={styles.indexWrapper}>
                                <Text style={styles.indexText}>{activeImage + 1}/{this.state.listBanner.length}</Text>
                            </View>
                        </View>
                    </View>
                    {this.renderHeaderContent()}
                    <View style={styles.rowContent}>
                        <Text style={[styles.rowTitle, {fontSize: 20, color: config.textColor}]}>{product.name}</Text>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            {this.renderProductPrice()}
                            {product.label !=null &&
                                <Text style={styles.textFreeShip}>{product.label.text}</Text>}
                        </View>
                    </View>
                    {hadShareInfo && this.renderGroupBuy(product)}
                    {this.renderPriceByQuantity()}
                    <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>Số lượng</Text>
                        <View style={{alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                            <Text style={{fontSize: 16, color: config.textColor}}>{product.quantity}</Text>
                        </View>
                    </View>
                    {!!product.shipment_note && <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>Ghi chú giao hàng</Text>
                        <View style={{alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                            <Text style={{fontSize: 16, color: config.textColor}}>{product.shipment_note}</Text>
                        </View>
                    </View>}
                    {!!product.note && <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>Ghi chú</Text>
                        <View style={{alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                            <Text style={{fontSize: 16, color: config.textColor}}>{product.note}</Text>
                        </View>
                    </View>}
                    {!!product.time_range && <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>Ngày giao hàng </Text>
                        <View style={{alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                            <Text style={{fontSize: 16, color: config.textColor}}>{product.time_range}</Text>
                        </View>
                    </View>}

                    <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>Thông tin sản phẩm</Text>
                        <View style={{alignItems: "center", flexDirection: "row"}}>
                            <View style={{paddingRight: 10}}>
                                <Text style={{fontSize: 14, color: "#a0a0a0"}}>Loại sản phẩm</Text>
                                <Text style={{fontSize: 14, color: "#a0a0a0", paddingVertical: 5}}>Xuất Xứ</Text>
                            </View>
                            <View style={{paddingLeft: 10, flex: 1}}>
                                <Text style={{fontSize: 14, color: config.textColor}} numberOfLines={1} ellipsizeMode="tail">{product.category_name} </Text>
                                <Text style={{fontSize: 14, paddingVertical: 5, color: config.textColor}} numberOfLines={1} ellipsizeMode="tail">{product.from}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowContent}>
                        <Text style={styles.rowTitle}>Mô tả sản phẩm</Text>
                        <View>
                            <HTML html={this.state.product.content || `<p>&nbsp;</p>`} imagesMaxWidth={platform.deviceWidth - 30} ignoredStyles={ignoredStyles} />
                        </View>
                    </View>
                    <ModalCartItemOption ref="ModalCartItemOption" item={product}/>
                </Animated.ScrollView>
                {this.renderAddToCart(this.state.product)}
            </SafeAreaView>
        )
    }
}
const imageWidth = platform.deviceWidth ;
const imageHeight = imageWidth * 0.75;
const styles = StyleSheet.create({
    safeAreaView: {flex: 1, backgroundColor: "#fff"},
    scrollView: {flex: 1, backgroundColor: "#f6f6fa"},
    imageWrapper: {backgroundColor: "#fff"},
    imageTouch: {paddingHorizontal: 1, alignSelf: 'center'},
    image: { width: imageWidth, height: imageHeight},
    imageIndex: {position: "absolute", bottom: 10, right: 15},
    indexWrapper: {
        borderRadius: 10, paddingHorizontal: 7.5, paddingVertical: 1.5,
        backgroundColor: 'rgba(52, 52, 52, 0.5)'
    },
    indexText: {color: "#fff", fontSize: 14},
    previewImageWrapper: {paddingHorizontal: 15, width: "100%", backgroundColor: "#fff", paddingBottom: 10},
    previewImageList: {marginTop: 10},
    previewImageTouch: {marginEnd: 5, borderRadius: 7.5},
    previewImage: {width: bannerWidth, height: bannerHeight, borderWidth: 1.5, borderRadius: 7.5},
    rowContent: {paddingHorizontal: 15, paddingVertical: 7.5, backgroundColor: "#fff", marginTop: 5},
    rowTitle: {fontSize: 18, fontWeight: "bold", color: config.secondaryColor, paddingVertical: 5},
    footerButton: {
        paddingHorizontal: 15, backgroundColor: "#fff", paddingVertical: 5,
        borderTopWidth: 0.5, borderColor: "#a0a0a0"
    },
    button: {width: "100%", alignItems: "center", backgroundColor: config.secondaryColor, borderRadius: 5},
    buttonText: {fontSize: 16, paddingVertical: 10, color: "#fff"},
    footerContent: {
        flexDirection: "row", alignItems: "center", paddingHorizontal: 15, backgroundColor: "#fff",
        paddingVertical: 10, borderTopWidth: 0.5, borderColor: "#a0a0a0"
    },
    footerContentText: {fontSize: 14, flex: 1, paddingLeft: 10},
    textFreeShip: {
        fontSize: 14, color: config.secondaryColor, paddingHorizontal: 7.5, marginLeft: 10,
        borderRadius: 10, paddingVertical: 2.5, borderWidth: 1, borderColor: config.secondaryColor
    },
    groupTitle: {flexDirection: "row", alignItems: "center", justifyContent: "space-between"},
    textGroupTitle: {fontSize: 18, color: config.secondaryColor, fontWeight: "bold"},
    textGroupMore: {fontSize: 16, color: config.secondaryColor, paddingLeft: 10},
    textMyGroup: {fontSize: 13, color: config.secondaryColor, paddingLeft: 10, textDecorationLine: 'underline'},
    groupFooter: {paddingTop: 10, borderTopWidth: 1, borderColor: "#a0a0a0"},
    btnAddGroup: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        backgroundColor: config.backgroundColor, borderRadius: 5, paddingVertical: 12.5
    },
    textAddGroup: {fontSize: 18, fontWeight: "700", marginLeft: 10, color: config.secondaryColor},
    textPriceShare: {fontSize: 18, color: config.textColor, flex: 1},
    textPriceMarket: {color: "#a0a0a0", textDecorationLine: "line-through", fontSize: 13},
    textPrice: {fontSize: 18, color: config.secondaryColor},
    textPriceDiscount: {fontSize: 16, color: 'gray', textDecorationLine: 'line-through'},
    textUnit: {fontSize: 14, color: "#a0a0a0"},
    btnSingle: {
        flex: 1, alignItems: "center", padding: 5, borderWidth: 1, borderRadius: 5,
        borderColor: config.secondaryColor, marginRight: 10
    },
    btnGroup: {
        flex: 1, alignItems: "center", padding: 5, backgroundColor: config.secondaryColor, borderWidth: 1,
        borderRadius: 5, borderColor: config.secondaryColor
    },
    titleSingle: {fontSize: 16, color: config.secondaryColor, fontWeight: "700"},
    titleGroup: {fontSize: 16, color: "#fff", fontWeight: "700"},
    textSingle: {fontSize: 16, color: config.secondaryColor},
    textGroup: {fontSize: 16, color: "#fff"},
    priceUnitItem: {flex: 1, paddingRight: 10, alignItems: "center", marginTop:5},
    priceItemRow: {alignItems: "center", flexDirection: "row", justifyContent: "center"},
    textItemPrice: {fontSize: 16, color: config.secondaryColor, marginRight: 7.5, fontWeight: "bold"},
    textItemQuantity: {fontSize: 16, color: "#000", marginRight: 5},
    textDefaultQuantity: {fontSize: 16, color: "#000"},
    shopContent: {flex: 1, justifyContent: "space-between", paddingHorizontal: 15},
    shopName: {fontSize: 15, color:config.textColor},
    shopAddress: {fontSize: 12, color: "#a0a0a0", marginTop: 5},
    btnShop: {paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, borderWidth: 1, borderColor: config.secondaryColor},
    btnShopTitle: {fontSize: 14, color: config.secondaryColor},
    shopAvatar: {width: imageWidth * 0.14, height: imageWidth * 0.14, borderRadius: imageWidth * 0.07}
})
