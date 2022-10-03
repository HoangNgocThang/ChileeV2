import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import config from '../../config';

interface State {
    list: Array<any>
    listSelected: Array<any>
}

interface Props {
    listData: Array<any>
}

class ListProps extends React.Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {
            list: [
                {
                    title: 'title1',
                    value: 'value1',
                    selected: false
                },
                {
                    title: 'title2',
                    value: 'value2',
                    selected: false
                },
                {
                    title: 'title3',
                    value: 'value3',
                    selected: false
                }
            ],
            listSelected: []
        }
    }

    onClickItem = (e: any, index: number) => {
        const newArr = this.state.list.map((it, i) => {
            if (it.value == e.value) {
                return { ...it, selected: true }
            } else {
                return { ...it, selected: false }
            }
        })
        this.setState({ list: newArr })
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.list.map(((e, i) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.onClickItem(e, i)}
                                key={`${e.value}`}
                                style={e.selected ? styles.itemSelected : styles.item}>
                                <Text style={e.selected ? styles.textItemSelected : styles.textItem}>{e.title}</Text>
                            </TouchableOpacity>
                        )
                    }))
                }
            </View>
        );
    }

};

export default ListProps;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    item: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: config.secondaryColor,
        margin: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexWrap: 'wrap'
    },
    textItem: {
        fontSize: 12,
        color: 'black'
    },
    itemSelected: {
        backgroundColor: config.secondaryColor,
        borderColor: config.secondaryColor,
        borderRadius: 4,
        borderWidth: 1,
        margin: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexWrap: 'wrap'
    },
    textItemSelected: {
        fontSize: 12,
        color: 'white'
    }
});
