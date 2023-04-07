import React, { useState, useEffect, useRef } from 'react';
import {
  View, SafeAreaView, StyleSheet,
  TextInput, TouchableOpacity, FlatList,
  Text, ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { $alert } from '../ui/Alert';
import ProductRequest from '../api/requests/ProductRequest';
import { debounce, isScrollCloseToBottom } from '../utils';
import ProductItem2 from '../themes/Components/ProductItem2';
import ProductItemChildren from '../themes/Components/ProductItemChildren';

interface Props {
  navigation: any
}

const ProductSearchScreen = (props: Props) => {

  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const page = useRef(1);

  useEffect(() => { }, [])

  const onSearch = async () => {
    try {
      setLoading(true)
      setTimeout(async () => {
        console.log('a11:', page.current)
        const res: any = await ProductRequest.search(searchText, page.current);
        console.log('res999', res)
        setLoading(false)
        if (res?.err_code == 0) {
          if (res?.hasNextPage) {
            if (page.current == 1) {
              setData(res?.products)
              setHasNextPage(res?.hasNextPage)
            } else {
              setData(data.concat(res?.products))
              setHasNextPage(res?.hasNextPage)
            }
          } else {
            setData(res?.products)
            setHasNextPage(res?.hasNextPage)
          }
        }
      }, 200)

    } catch (error) {
      console.log('err 99', error)
      $alert(`${error}`)
    }
  }

  const renderHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
              marginLeft: 15,
              width: 44,
              height: 44,
            }}>
            {/* <Icon style={{ width: 16, height: 17 }} name={'back'} /> */}
            <MaterialCommunityIcons name="arrow-left" color={"black"} size={24} />
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 46,
            backgroundColor: 'white',
            borderRadius: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
            flex: 1,
            marginRight: 15,
          }}>

          <TextInput
            style={{
              fontSize: 14,
              lineHeight: 18,
              color: 'black',
              flex: 1,
              marginHorizontal: 10,
            }}
            // maxLength={20}
            placeholder={'Tìm kiếm tên hoặc mã sản phẩm'}
            autoCapitalize={'none'}
            returnKeyType={'search'}
            // clearButtonMode={'while-editing'}
            enablesReturnKeyAutomatically={true}
            underlineColorAndroid={'transparent'}
            numberOfLines={1}
            autoCorrect={false}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              // onChangeSearchText(text);
            }}
          // onSubmitEditing={() => {
          //     Keyboard.dismiss();
          //     onChangeSearchText(searchText);
          // }}
          />
          <TouchableOpacity
            onPress={() => {
              page.current = 1;
              setData([])
              setHasNextPage(false)
              onSearch()
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 46,
              backgroundColor: 'silver',
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              position: 'absolute',
              right: 0,
              paddingHorizontal: 10,
            }}>
            <MaterialCommunityIcons name="magnify" color={"black"} size={24} />
          </TouchableOpacity>
        </View>
      </View>

    )
  }

  const onNextPage = debounce(() => {
    if (!hasNextPage) {
      return;
    }
    page.current = page.current + 1;
    onSearch()
  })

  const renderItem = (ele: any) => {
    const { item, index } = ele;
    return <ProductItemChildren maxWidth={true} key={`${item.id}`} item={item} navigation={props.navigation} />
  }

  console.log('data', data, hasNextPage)
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {loading ? <View style={{ marginVertical: 10 }}>
        <ActivityIndicator size="small" />
      </View> : <></>}
      <FlatList
        data={data}
        style={{ flex: 1, width: '100%', marginTop: 15, paddingHorizontal: 15 }}
        contentContainerStyle={{ paddingBottom: 256 }}
        // scrollEnabled={true}
        // keyboardShouldPersistTaps={'always'}
        // overScrollMode="always"
        // keyboardDismissMode={'on-drag'}
        keyExtractor={item => `${item?.id}`}
        renderItem={renderItem}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={pullingToRefresh}
        //     onRefresh={handlePullToRefresh}
        //     title="Kéo để làm mới"
        //     tintColor={'white'}
        //     titleColor={'white'}
        //   />
        // }
        onScroll={({ nativeEvent }) => {
          if (isScrollCloseToBottom(nativeEvent)) {
            onNextPage();
          }
        }}
        ListEmptyComponent={
          <Text style={{
            fontSize: 14,
            lineHeight: 19,
            textAlign: 'center',
            marginTop: 20,
          }}>
            {'Dữ liệu trống'}
          </Text>
        }
      />
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6'
  }
})

export default ProductSearchScreen;