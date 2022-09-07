import React, {Component} from 'react';
import {FlatList, Text, View, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import HomeRequest from "../api/requests/HomeRequest";
import Spinner from '../ui/Spinner';
import config from "../config";
import BtnMore from "../ui/BtnMore";
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import GroupItem2 from "../themes/Components/GroupItem2";
import {ShareInfo} from "../api/interfaces";
import InputText from "../ui/InputText";
import {debounce, isStrEmptyOrSpaces} from "../utils";

export default class ListGroupScreen extends Component<any, any>{
    private shareInfo: ShareInfo;
    private showMyGroup = false;
    private keyword = '';
    constructor(props: any) {
        super(props);
        this.shareInfo = this.props.route.params.shareInfo;
        this.showMyGroup = !!this.props.route.params.showMyGroup;


        this.state = {
            isLoading: true,
            isLoadingMore: false,
            showLoadMore: true,
            page: 1,
            groups:  []
        }
    }

    async asyncInit() {
        const groups = await HomeRequest.getGroupBySharedId( this.shareInfo.id, '', this.showMyGroup);
        this.setState({groups: groups});
    }

    componentDidMount(): void {
        this.asyncInit();
    }


    renderItem = ({item, index}) => {
        return (
            <GroupItem2

                group={item}
                navigation={this.props.navigation}
            />
        )
    }

    onSearch = debounce(async (keyword:string) => {


        this.keyword = keyword.trim();
        const groups = await HomeRequest.getGroupBySharedId( this.shareInfo.id, keyword);
        this.setState({groups: groups});
    });

    getListHeader = () => {
        return <View>
            <InputText onChangeText={this.onSearch} placeholder={'tìm nhóm'}/>
        </View>
    }

    render() {
        if (this.state.groups.length === 0 && isStrEmptyOrSpaces(this.keyword)) {
            return <View style={styles.textWrapper}>
                <Text>Chưa có nhóm nào</Text>

            </View>
        }

        return (
            <View style={styles.container}>

                <FlatList
                    ListHeaderComponent={this.getListHeader}
                    style={styles.listWrapper}
                    data={this.state.groups}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                />
                {/*{this.state.showLoadMore &&  <BtnMore isLoading={this.state.isLoadingMore} loadingMore={this.loadingMore}/>}*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15},
    listWrapper: {flex: 1},
    textWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    btnWrapper: {paddingVertical: 10},
    btnAddGroup: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        backgroundColor: config.backgroundColor, borderRadius: 5, paddingVertical: 12.5
    },
    textAddGroup: {fontSize: 18, fontWeight: "700", marginLeft: 10, color: config.secondaryColor},
})
