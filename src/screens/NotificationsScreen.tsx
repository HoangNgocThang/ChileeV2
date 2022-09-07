import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet} from "react-native";
import Spinner from '../ui/Spinner';
import NotificationItem from "../themes/Components/NotificationItem";
import NotificationRequest from "../api/requests/NotificationRequest";
import {debounce} from "../utils";


interface State {
    isLoading: boolean,
    listNotify: Array<any>
}

export default class NotificationsScreen extends Component<State, any>{
    page : number = 1;
    private focusListener: any;
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            listNotify: []
        }
    }

    //logic
    onFocus = async () => {
        this.getData();
    }

    componentDidMount(): void {
        this.getData();
        this.focusListener = this.props.navigation.addListener('focus', this.onFocus)
    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }

    getData = debounce(async () => {
        console.log('debounced');
        const res = await NotificationRequest.get(this.page)
        if (res) {
            setTimeout(() => {
                this.setState({
                    isLoading: false,
                    listNotify: res,

                });
            }, 500)
        }
    })


    // ui

    renderItem = ({item, index}) => {
        return (
            <NotificationItem NotificationItem={item} navigation={this.props.navigation}/>
        )
    }

    renderContent = () => {
        const {isLoading, listNotify} = this.state;
        if (isLoading) {
            return <Spinner/>
        }
        if (listNotify.length === 0) {
            return <Text>Hiện không có thông báo nào!</Text>
        }

        return (
            <FlatList
                style={styles.listWrapper}
                data={listNotify}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this.renderItem}
                maxToRenderPerBatch={15}
                initialNumToRender={15}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f6fa", alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingTop: 10},
    listWrapper: {flex: 1, paddingHorizontal: 10, backgroundColor: "#FFF", paddingBottom: 10},
})
