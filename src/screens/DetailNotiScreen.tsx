import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet, Dimensions, Linking, Platform } from "react-native";
import Spinner from '../ui/Spinner';
import config from "../config";
import platform from "../themes/Variables/platform";
import HTML from 'react-native-render-html-fork-tuanht';
import NotificationRequest from "../api/requests/NotificationRequest";
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationStore from '../store/NotificationStore';
const ignoredStyles = ['display', 'width', 'height', 'font-family', 'padding', 'line-height', 'transform', 'text-align', 'background-color', 'white-space', 'text-decoration-style', 'text-decoration-color'];

interface State {
    isLoading: boolean,
    notify: object
}


export default class DetailNotiScreen extends Component<State, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            notify: {}
        }
    }

    //logic

    componentDidMount(): void {
        this.asyncInit();
    }

    asyncInit = async () => {
        const {params} = this.props.route
        if (params && params.id) {
            const res = await NotificationRequest.show(params.id)
            console.log(res)
            if (res && res.content) {
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        notify: res,

                    });
                    NotificationStore.decrease();
                }, 500)
            }
        }
    }

    //ui

    renderContent = () => {
        const {notify} = this.state;
        return (
            <HTML
                html={notify.content}
                imagesMaxWidth={Dimensions.get('window').width- 30}
                ignoredStyles={ignoredStyles}
                onLinkPress={(evt, href) => {
                    Linking.openURL(href)
                }
                } />
        )
    }

    renderIcon = () => {
        const {notify} = this.state;
        if (notify.read == 1) {
            return <Icon name="email-open" color={config.secondaryColor} size={20} />
        }
        return <Icon name="email" color={config.secondaryColor} size={20} />
    }

    renderHeader = () => {
        const {notify} = this.state;
        return (
            <View>
                <Text style={styles.title}>{notify.title}</Text>
                <View style={styles.timeWrap}>
                    {this.renderIcon()}
                    <Text style={styles.time}>{notify.created_at}</Text>
                </View>
            </View>
        )
    }

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return <Spinner/>
        }
        return (
            <ScrollView
                style={styles.scrollWrapper}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {this.renderHeader()}
                {this.renderContent()}
            </ScrollView>
        )
    }
}

const deviceWidth = platform.deviceWidth
const styles = StyleSheet.create({
    scrollWrapper: { flex: 1, backgroundColor: "#fff"},
    container: {padding: 15},
    title: {fontSize: 18, fontWeight: "bold"},
    timeWrap: {flexDirection: "row", alignItems: "center"},
    time: {color: '#b6b6b6', fontSize: 16, textAlign: "right", flex: 1}
})
