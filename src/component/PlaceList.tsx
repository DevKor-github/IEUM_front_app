import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IPlace} from '../recoil/place/atom';
import React from 'react';

export interface IPlaceList {
  placeList: IPlace[];
  onPress: (id: number) => void;
  loading: boolean;
  load: () => void;
}

const PlaceList = (props: IPlaceList) => {
  const renderItem = ({item}: {item: IPlace}) => (
    <TouchableOpacity
      onPress={() => props.onPress(item.id)}
      style={styles.card}>
      <View>
        <Image // todo 동그랗게 수정
          // source={{uri: item.imageUrl}}
          source={
            item?.placeImages[0].url
              ? {uri: item?.placeImages[0].url}
              : require('../assets/unloaded-image.png')
          }
          style={styles.image}
        />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.location}>{`${item.simplifiedAddress} ${
          item.category ? '| ' + item.category : ''
        }`}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    return props.loading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  return (
    <FlatList
      data={props.placeList}
      renderItem={renderItem}
      keyExtractor={item => 'place_' + item.id.toString() + item.name}
      // key={mode === 'SAVED_PLACED' ? 'two-columns' : 'one-column'} // key 값 변경으로 재렌더링 유도
      contentContainerStyle={styles.bottomSheetScrollViewContent}
      numColumns={2} // 2열 그리드 형식으로 표시
      columnWrapperStyle={styles.gridContainer} // 열 사이 간격 조절
      onEndReached={props.load} // 리스트 끝에 도달했을 때 추가 데이터 요청
      onEndReachedThreshold={0.5} // 끝에서 50% 남았을 때 호출
      ListFooterComponent={renderFooter} // 로딩 중일 때 하단에 로딩 스피너 표시
    />
  );
};

const styles = StyleSheet.create({
  bottomSheetScrollViewContent: {
    paddingHorizontal: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '49%',
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    marginBottom: 10,
    height: 220,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  location: {
    fontSize: 12.5,
    color: '#888',
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
});
export default PlaceList;
