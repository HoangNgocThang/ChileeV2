import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
    navigation: any
}

const NotiDetailScreen = (props: Props) => {
    return (
        <View style={styles.container}>
            <Text>NotiDetailScreen</Text>
        </View>
    );
};

export default NotiDetailScreen;

const styles = StyleSheet.create({
    container: {}
});
