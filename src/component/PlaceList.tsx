import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IPlace} from '../recoil/place/atom';
import React from 'react';
import ImageContainer from './ImageContainer';
import CheckedSpot from '../assets/checked-spot.svg';
import EmptySpot from '../assets/empty-circle.svg';

const dWidth = Dimensions.get('window').width;

export interface IPlaceList {
  placeList: IPlace[];
  onPress: (id: number) => void;
  loading: boolean;
  load: () => void;
  isSelecting?: boolean;
  selectedPlaces?: number[];
  toggleSelection?: (id: number) => void;
}

const PlaceList = (props: IPlaceList) => {
  const renderItem = ({item}: {item: IPlace}) => (
    <TouchableOpacity
      onPress={() =>
        props.isSelecting && props.toggleSelection
          ? props.toggleSelection(item.id)
          : props.onPress(item.id)
      }
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
          {props.isSelecting && (
            <View style={styles.selectionIcon}>
              {props.selectedPlaces &&
              props.selectedPlaces.includes(item.id) ? (
                <CheckedSpot width={29} height={29} />
              ) : (
                <EmptySpot width={29} height={29} />
              )}
            </View>
          )}
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
      contentContainerStyle={styles.bottomSheetScrollViewContent}
      numColumns={2}
      columnWrapperStyle={styles.gridContainer}
      onEndReached={props.load}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  bottomSheetScrollViewContent: {
    paddingHorizontal: 24,
  },
  gridContainer: {
    width: dWidth - 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  card: {
    width: '49%',
    marginBottom: 18,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    marginBottom: 8,
    width: '100%',
    position: 'relative',
  },
  selectionIcon: {
    position: 'absolute',
    top: 14,
    right: 11,
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
