import * as React from "react";
import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Image from 'react-native-fast-image';
import platform from "../themes/Variables/platform";
import config from "../config";

const imgFake = require("../assets/slide1.png");
export interface Props {
    listBanner: any;
}

export interface State {
    slider1ActiveSlide: number
}

class BannerCategory extends React.Component<Props, State> {
    _slider1Ref: any;

    constructor(props: any) {
        super(props);
        this.state = {
            slider1ActiveSlide: 0,
        };
    }

    render() {
        const { slider1ActiveSlide } = this.state;
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={this.props.listBanner}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    if (item.id) {
                                        this.props.navigation.navigate("ListProductScreen", {id: item.id, title: item.name});
                                    }

                                }}
                                style={{alignSelf: 'center', paddingVertical: 4.5}} index={index.toString()}>
                                <Image source={imgFake}
                                       resizeMode={Image.resizeMode.stretch  }
                                       style={bannerStyles.image}/>
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
                    autoplay={false}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                />
            </View>
        );
    }
}

export default BannerCategory;



const IS_IOS = platform === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const slideWidth = viewportWidth;
const slideHeight = slideWidth/2.56;
const itemHorizontalMargin = 0;
const imageWidth = platform.deviceWidth - 30 ;
const imageHeight = imageWidth * 0.3;
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 0;

const bannerStyles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
    },
    imageContainerEven: {
        backgroundColor: '#0000'
    },
    image: { width: imageWidth, height: imageHeight, borderRadius: 15},
    slider: {
    },
    sliderContentContainer: {
    },
});
