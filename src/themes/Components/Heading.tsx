import * as React from "react";
import { Image, StyleSheet, PixelRatio } from 'react-native';
import { Badge, Body, Button, Header, Icon, Left, Right, Text, Title } from "native-base";
import NavigationService from "../../helper/NavigationService";

import cartIcon from "../../../assets/cart.png"
import add from "../../../assets/Heading/add.png"
import logo_omipharma from "../../../assets/logo_omipharma.png"
import variable from "../variables/platform";
import btnBack from '../../../assets/Heading/back.png';
import notificationIcon from '../../../assets/notification.png';
import { SafeAreaView } from "react-navigation";
import commonColor from "../variables/commonColor";

export interface Props {
    cartData?: any
    page?: String
    title?: String
    noLeft?: boolean
    goBack?: Function
    rightAction?: Function
    rightStyle?: any
    transparentBg?: boolean
    rightTitle?: String
    containerStyles?: any
}

export interface State {
}

class Heading extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let { page } = this.props
        switch (page) {
            case 'transparent':
                return this.renderTransparentState()
            case 'normal':
                return this.renderNormalState()
            case 'main':
                return this.renderMainState()
            case 'normal2':
                return this.renderNormalState2()
            case 'normal3':
                return this.renderNormalState3()
            default:
                return this.renderHomeState();
        }

    }

    renderNormalState2() {
        let { title } = this.props
        return (
            <SafeAreaView style={{ backgroundColor: '#008080' }}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => NavigationService.goBack()}>
                            <Image source={btnBack} style={{ height: 15, width: 23, marginLeft: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                    <Title style={styles.title}>{title}</Title>
                    </Body>
                    <Right />
                </Header>
            </SafeAreaView>
        )
    }

    renderNormalState3() {
        let { title, right } = this.props;
        return (
            <SafeAreaView style={{ backgroundColor: '#008080' }}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => NavigationService.goBack()}>
                            <Image source={btnBack} style={{ height: 15, width: 23, marginLeft: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                    <Title style={styles.title}>{title}</Title>
                    </Body>
                    {right ? <Right>
                        <Button transparent onPress={() => right.action()}>
                            <Image source={right.icon} style={{ height: 22, width: 23, marginLeft: 5 }} />
                        </Button>
                    </Right> : <Right />}
                </Header>
            </SafeAreaView>
        )
    }

    renderMainState() {
        let { title, cartData } = this.props
        return (
            <SafeAreaView style={{ backgroundColor: '#008080' }}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => NavigationService.goBack()}>
                            <Image source={btnBack} style={{ height: 15, width: 23, marginLeft: 5 }} />
                        </Button>
                    </Left>
                    <Body>
                    <Title style={styles.title}>{title}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => NavigationService.navigate('CartInfor', {})}>
                            <Image source={cartIcon} style={{}} />
                            {cartData !== 'undefined' && cartData.length > 0 &&
                            <Badge style={styles.badge}>
                                <Text style={styles.badgeText}>{cartData.length}</Text>
                            </Badge>
                            }
                        </Button>
                        {/* <Button transparent>
						<Image source={barcode} style={{}} />
					</Button> */}
                    </Right>
                </Header>
            </SafeAreaView>
        )
    }

    renderNormalState() {
        let { title, noLeft, transparentBg, goBack, rightTitle, rightAction, rightStyle, titleStyle } = this.props
        let headerProps = {}
        if (transparentBg) {
            headerProps = {
                noShadow: true,
                style: { borderBottomWidth: 0, backgroundColor: 'transparent' }
            }
        }
        return (
            <SafeAreaView style={{ backgroundColor: '#008080' }}>
                <Header {...headerProps}>
                    <Left>
                        {!noLeft && <Button transparent onPress={() => typeof goBack === 'function' ? goBack() : NavigationService.goBack()}>
                            <Image source={btnBack} style={{ height: 15, width: 23, marginLeft: 5 }} />
                        </Button>}
                    </Left>
                    <Body style={{ flex: 3 }}>
                    {(titleStyle) ? <Title style={titleStyle}>{title}</Title> : <Title style={styles.title}>{title}</Title>}
                    </Body>
                    <Right>
                        {typeof rightTitle !== 'undefined' && <Button transparent hasText onPress={() => typeof rightAction === 'function' ? rightAction() : goBack()} style={rightStyle}>
                            <Text style={styles.rightTxt}>{rightTitle}</Text>
                        </Button>}
                    </Right>
                </Header>
            </SafeAreaView>
        )
    }

    renderTransparentState() {
        let { title, containerStyles, goBack, rightTitle, rightAction, rightStyle } = this.props
        return (
            <SafeAreaView style={{ backgroundColor: '#008080' }}>
                <Header style={[styles.header, containerStyles]}>
                    <Left>
                        <Button transparent onPress={() => typeof goBack === 'function' ? goBack() : NavigationService.goBack()}>
                            <Image source={btnBack} style={{ height: 15, width: 23, marginLeft: 5, tintColor: "#000" }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                    {title && (<Title style={[styles.title, styles.title2]}>{title}</Title>)}
                    </Body>
                    <Right>
                        {typeof rightTitle !== 'undefined' && <Button transparent hasText onPress={() => typeof rightAction === 'function' ? rightAction() : goBack()} style={rightStyle}>
                            <Text style={styles.rightTxt}>{rightTitle}</Text>
                        </Button>}
                    </Right>
                </Header>
            </SafeAreaView>
        )
    }

    renderHomeState() {
        let { cartData, notification, unread } = this.props
        return (
            <SafeAreaView style={{ backgroundColor: '#008080' }}>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon
                                active
                                name="menu"
                                onPress={() => NavigationService.toggleDrawer()}
                            />
                        </Button>
                    </Left>
                    <Body>
                    <Image source={logo_omipharma} style={{}} />
                    </Body>
                    <Right>
                        <Button transparent onPress={() => NavigationService.navigate('Notification', {})}>
                            <Image source={notificationIcon} style={{}} />
                            {unread > 0 &&
                            <Badge style={styles.badge}>
                                <Text style={styles.badgeText}>{unread}</Text>
                            </Badge>
                            }
                        </Button>
                        <Button transparent onPress={() => NavigationService.navigate('CartInfor', {})}>
                            <Image source={cartIcon} style={{}} />
                            {cartData !== 'undefined' && cartData.length > 0 &&
                            <Badge style={styles.badge}>
                                <Text style={styles.badgeText}>{cartData.length}</Text>
                            </Badge>
                            }
                        </Button>
                    </Right>
                </Header>
            </SafeAreaView>
        )
    }
}

export default Heading

const styles = StyleSheet.create({
    header: { backgroundColor: '#F6F6FA', borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1) },
    badge: { position: 'absolute', right: 5, top: 3 },
    badgeText: {},
    title: { fontSize: 16, fontWeight: 'bold' },
    title2: { color: '#000000' },
    iconBack2: { color: '#000000' },
    rightTxt: { paddingLeft: 0 }
})
