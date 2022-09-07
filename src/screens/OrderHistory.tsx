import React, {Component} from 'react';
import {View, StyleSheet} from "react-native";
import config from "../config";
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import platform from "../themes/Variables/platform";
import TabOrderHistory from "../themes/Components/TabOrderHistory";
import {model} from "../themes/Variables/model";

const STATUS_NEW = 0;
const STATUS_SHIPPING= 1;
const STATUS_SUCCEED = 2;
const STATUS_CANCELLED = 3;

const routes = [
    { key: 'first', title: 'Tất cả' },
    { key: 'second', title: 'Đang xử lý' },
    { key: 'third', title: 'Đang giao hàng' },
    { key: 'fourth', title: 'Thành công' },
    { key: 'fifth', title: 'Đã hủy' },
]
export default class OrderHistory extends Component<any, any>{
    private initialRoute: string;
    constructor(props: any) {
        super(props);
        if (props.route && props.route.params) {
            this.initialRoute = props.route.params.initialRoute;
        }

        this.state = {
            orders: [],
            index : props.route.params.initialRoute || 0,
            isLoading: true,
        }
    }


    componentDidMount(): void {
        //this.asyncInit();
    }

    // getRoute = (status, props) => (
    //     <TabOrderHistory navigation={this.props.navigation} {...props} status={status}/>
    // );


    renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <TabOrderHistory navigation={this.props.navigation} status={-1}/>
            case 'second':
                return <TabOrderHistory navigation={this.props.navigation} status={model.STATUS_NEW}/>
            case 'third':
                return <TabOrderHistory navigation={this.props.navigation} status={model.STATUS_SHIPPING}/>
            case 'fourth':
                return <TabOrderHistory navigation={this.props.navigation} status={model.STATUS_SUCCEED}/>
            case 'fifth':
                return <TabOrderHistory navigation={this.props.navigation} status={model.STATUS_CANCELLED}/>
            default:
                return null;
        }
    };

    // renderScene = SceneMap({
    //     first: (props) => {
    //         return this.getRoute(-1, props)
    //     },
    //     second: (props) => {
    //         return this.getRoute(STATUS_NEW, props)
    //     },
    //     third: (props) => {
    //         return this.getRoute(STATUS_SHIPPING, props)
    //     },
    //     fourth: (props) => {
    //         return this.getRoute(STATUS_SUCCEED, props)
    //     },
    //     fifth: (props) => {
    //         return this.getRoute(STATUS_CANCELLED, props)
    //     },
    // });

    renderTabBar = props =>  {

        return  <TabBar
            {...props}
            indicatorStyle={styles.indicatorStyle}
            style={styles.tabBarStyle}
            tabStyle={styles.tabStyle}
            scrollEnabled={true}
            pressOpacity={1}
            bounces={false}
            labelStyle={styles.labelStyle}
            inactiveColor={"#a0a0a0"}
            activeColor={config.secondaryColor}
        />
    }

    render() {

        return (
            <View style={styles.container}>
                <TabView
                    lazy={true}
                    navigationState={ {index: this.state.index, routes: routes}}
                    renderScene={this.renderScene}
                    onIndexChange={(index) => this.setState({index: index})}
                    initialLayout={styles.initialLayout}
                    renderTabBar={this.renderTabBar}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{ flex: 1},
    indicatorStyle: { backgroundColor: config.secondaryColor },
    tabBarStyle: { backgroundColor: "#fff"},
    tabStyle: {width: "auto", paddingHorizontal: 5},
    labelStyle: {fontSize: 18, textTransform: "capitalize"},
    initialLayout: { width: platform.deviceWidth }
});
