import * as React from "react";
import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Image from 'react-native-fast-image';

import platform from "../themes/Variables/platform";
import config from "../config";

export interface Props {
    listBanner: any;
    ratio?: number
}

export interface State {
    slider1ActiveSlide: number
}

class BannerHome extends React.Component<Props, State> {
    _slider1Ref: any;

    constructor(props: any) {
        super(props);
        this.state = {
            slider1ActiveSlide: 0,
        };
    }

    render() {
        const { slider1ActiveSlide } = this.state;
        const {ratio} = this.props
        const imageWidth = platform.deviceWidth ;
        const imageHeight = imageWidth * (ratio ? ratio : 0.3);
        return (
            <View style={{backgroundColor: "#fff", alignItems: "center"}}>
                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={this.props.listBanner}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    if (item.product && item.product.id) {
                                        if (this.props.detail) {
                                            this.props.navigation.navigate(this.props.detail, {Item: item.product})
                                        } else {
                                            this.props.navigation.navigate('DetailProduct', {Item: item.product})
                                        }

                                    }

                                }}
                                style={{alignSelf: 'center'}} index={index.toString()}>
                                <View style={{borderRadius: 5}}>
                                    <Image source={item.link}
                                           resizeMode={Image.resizeMode.stretch  }
                                           style={{ width: imageWidth, height: imageHeight}}/>
                                </View>
                            </TouchableOpacity>
                        );
                    }}

                    sliderWidth={platform.deviceWidth}
                    itemWidth={platform.deviceWidth}
                    firstItem={0}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={0.7}
                    // inactiveSlideShift={20}
                    containerCustomStyle={bannerStyles.slider}
                    contentContainerCustomStyle={bannerStyles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                />
                <View style={{position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: "center"}}>
                    <Pagination
                        dotsLength={this.props.listBanner.length}
                        activeDotIndex={slider1ActiveSlide}
                        dotContainerStyle={{marginHorizontal: 2.5}}
                        dotColor={config.secondaryColor}
                        dotStyle={{ width: 8, height: 8, borderRadius: 4}}
                        inactiveDotColor={'#a0a0a0'}
                        carouselRef={this._slider1Ref}
                        tappableDots={!!this._slider1Ref}
                        inactiveDotScale={1}
                        containerStyle={{paddingVertical:0}}
                    />
                </View>
            </View>
        );
    }
}

export default BannerHome;



const IS_IOS = platform === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const slideWidth = viewportWidth;
const slideHeight = slideWidth/2.56;
const itemHorizontalMargin = 0;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 0;

const bannerStyles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight ,
        paddingHorizontal: itemHorizontalMargin,
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
    },
    imageContainerEven: {
        backgroundColor: '#0000'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, height: undefined, width: undefined,
        resizeMode: 'contain',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    slider: {
    },
    sliderContentContainer: {
    },
});
