import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native";
import config from "../../config";
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import platform from "../../themes/Variables/platform";
import Spinner from '../../ui/Spinner';
import CategoryRequest from "../../api/requests/CategoryRequest";
import ProductTabItem from "./ProductTabItem";

interface Props {
    navigation: any
}

interface State {
    index: number,
    isLoading: boolean,
    routes: Array<any>
}

export default class ProductTab extends Component<Props, State>{

    constructor(props: any) {
        super(props);
        this.state = {
            index: 0,
            isLoading: true,
            routes: []
        }
    }

    asyncInit = async () => {

        const res = await CategoryRequest.getParentCategories();
        if (res) {
            let routes = res.categories.map((value, index, res) => {
                let item = {};
                item["title"] = value.name;
                item["key"] = value.id;
                return item
            })
            setTimeout(() => {

                this.setState({
                    isLoading: false,
                    routes: routes,
                });
            }, 500)
        }

    }

    componentDidMount(): void {
        this.asyncInit();
    }

    onChange = (index: any) => {
        this.setState({ index: index })
    }

    renderScene = ({ route }: any) => {
        const { navigation } = this.props
        return <ProductTabItem id={route.key} navigation={navigation} />
    };

    renderTabBarItem = (ele: any) => {
        const { item, index } = ele;
        const tabIndex = this.state.index;
        return (
            <View style={{ backgroundColor: "#f6f6fa" }}>
                <TouchableOpacity
                    style={[
                        styles.tabItem,
                        { backgroundColor: index == tabIndex ? "#f6f6fa" : "#fff" },
                        index == tabIndex + 1 ? { borderTopRightRadius: 7.5 } : {},
                        index == tabIndex - 1 ? { borderBottomRightRadius: 7.5 } : {}
                    ]}
                    activeOpacity={1}
                    onPress={this.onChange.bind(this, index)}
                >
                    <View style={[styles.tabItemDot, { backgroundColor: index == tabIndex ? config.secondaryColor : "#fff" }]} />
                    <Text
                        numberOfLines={2}
                        ellipsizeMode={"tail"}
                        style={[styles.tabItemText, { color: index == tabIndex ? config.secondaryColor : "#000" }]}
                    >{item.title}</Text>
                </TouchableOpacity>
            </View>
        )

    }

    renderTabBar = () => {
        const { isLoading, routes } = this.state
        if (isLoading) {
            return null
        }
        return (
            <View style={styles.tabBarWrap}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={routes}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={this.renderTabBarItem}
                />
            </View>
        )
    }

    renderContent = () => {
        const { isLoading, index, routes } = this.state
        if (isLoading) {
            return <Spinner />
        }
        return (
            <TabView
                style={styles.initialLayout}
                lazy={true}
                navigationState={{ index: index, routes: routes }}
                renderScene={this.renderScene}
                onIndexChange={this.onChange}
                initialLayout={styles.initialLayout}
                renderTabBar={() => null}
            />
        )
    }

    render() {

        return (
            <View style={styles.container}>
                {this.renderContent()}
                {this.renderTabBar()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "flex-end", backgroundColor: '#fff' },
    indicatorStyle: { backgroundColor: config.secondaryColor },
    tabBarStyle: { backgroundColor: "#fff" },
    tabStyle: { width: "auto", paddingHorizontal: 5 },
    labelStyle: { fontSize: 18, textTransform: "capitalize" },
    initialLayout: { width: platform.deviceWidth - 100 },
    tabBarWrap: { width: 100, position: "absolute", overflow: "hidden", bottom: 0, top: 15, left: 0, backgroundColor: "#fff" },
    tabItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
    tabItemDot: { width: 2.5, height: "100%", marginLeft: 2.5 },
    tabItemText: { fontSize: 16, paddingHorizontal: 10, flex: 1 }
});
