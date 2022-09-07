import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, StyleSheet, FlatList} from 'react-native';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import config from "../config";

class SortMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityIndex: false,
            selectIndex: 0,
            rotationAnims: new Animated.Value(0)
        };
    }

    renderCheck = ({item, index}) => {
        const {selectIndex} = this.state;
        return (
            <TouchableOpacity activeOpacity={1} style={styles.touchCheck} onPress={this.itemOnPress.bind(this, index)} >
                <View style={styles.wrapperCheck} >
                    <Text style={[styles.titleCheck, {color: selectIndex === index ? config.secondaryColor : "#000"}]} >{item.key}</Text>
                    {selectIndex === index ? <MaterialCommunityIcons name="check" color={config.secondaryColor} size={20} /> : null}
                </View>
                <View style={styles.underline} />
            </TouchableOpacity>
        )
    }

    renderActivityPanel() {
        if (this.state.activityIndex) {

            var currentTitles = this.props.data;

            return (
                <View style={styles.panelWrapper}>
                    <TouchableOpacity onPress={() => this.openOrClosePanel()} activeOpacity={1} style={styles.backgroundPanel}>
                        <View style={styles.background} />
                    </TouchableOpacity>
                    <FlatList
                        style={styles.listWrapper}
                        data={currentTitles}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderCheck}
                    />
                </View>
            );
        } else {
            return (null);
        }
    }

    openOrClosePanel() {
        if (this.state.activityIndex == true) {
            this.setState({
                activityIndex: false,
            });
            Animated.timing(
                this.state.rotationAnims,
                {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear
                }
            ).start();

        } else {
            this.setState({
                activityIndex: true,
            });
            Animated.timing(
                this.state.rotationAnims,
                {
                    toValue: 0.5,
                    duration: 300,
                    easing: Easing.linear
                }
            ).start();
        }
    }

    itemOnPress(index) {
        this.setState({
            selectIndex: index
        });
        if (this.props.onPress) {
            this.props.onPress(index)
        }
        this.openOrClosePanel();
    }

    render() {
        let data = this.props.data;
        return (
            <View style={styles.wrapperContainer} >
                <View style={styles.wrapperContent}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.openOrClosePanel.bind(this)}>
                        <View style={styles.titleWrapper} >
                            <Text style={styles.title} >
                                {data[this.state.selectIndex].key}
                            </Text>
                            <Animated.View
                                style={{
                                    transform: [{
                                        rotateZ: this.state.rotationAnims.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg']
                                        })
                                    }]
                                }} >
                                <MaterialCommunityIcons name="chevron-down" color={config.secondaryColor} size={20} />
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.flexStyle}/>
                </View>
                <View style={styles.flexStyle}>
                    {this.props.children}

                    {this.renderActivityPanel()}
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    flexStyle: {flex: 1},
    wrapperContainer: {flex: 1, backgroundColor: "#fff"},
    wrapperContent: {flexDirection: "row"},
    titleWrapper: {flexDirection: 'row', alignItems: "center", paddingHorizontal: 15, paddingVertical: 10},
    title: {fontSize: 14, fontWeight: "500", color: config.secondaryColor, paddingRight: 5},
    panelWrapper: {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0},
    backgroundPanel: {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0},
    background: {opacity: 0.2, backgroundColor: 'black', flex: 1 },
    listWrapper: {position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff'},
    touchCheck: {flex: 1, paddingHorizontal: 15},
    wrapperCheck: {flex: 1, alignItems: "center", paddingLeft: 10, flexDirection: 'row', paddingVertical: 10},
    titleCheck: {fontSize: 14, fontWeight: "500", flex: 1},
    underline: {backgroundColor: '#a0a0a0', height: 0.5}
});

export default SortMenu;
