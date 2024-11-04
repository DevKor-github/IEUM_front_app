import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IPlace} from '../recoil/place/atom';
import React from 'react';
import ImageContainer from './ImageContainer';

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
        <View style={styles.image}>
          <ImageContainer
            imageUrl={item?.placeImages[0].url}
            defaultImageUrl={require('../assets/unloaded-image-v2.png')}
            width="100%"
            height={220}
            borderRadius={6}
          />
        </View>
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
    overflow: 'hidden',
  },
  image: {
    marginBottom: 8, // todo 너무 좁지 않은가?
    width: '100%',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#888',
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
});
export default PlaceList;
