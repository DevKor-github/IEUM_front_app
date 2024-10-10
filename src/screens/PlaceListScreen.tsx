import {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import BackButton from '../assets/back-button.svg';
import CheckedSpot from '../assets/checked-spot.svg';
import EmptySpot from '../assets/empty-circle.svg';
import SelectIcon from '../assets/select-icon.svg';
import DeleteIcon from '../assets/delete-icon.svg';
import SavedPlaceNum from '../assets/saved-place-num.svg';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {HomeStackParamList} from '../../types';
import {useFocusEffect} from '@react-navigation/native';

export type PlaceListScreenProps = StackScreenProps<
  HomeStackParamList,
  'PlaceList'
>;

const dWidth = Dimensions.get('window').width;

interface Place {
  id: number;
  name: string;
  simplifiedAddress: string;
  ieumCategory: string;
  imageUrl: string;
}

const PlaceListScreen = ({navigation, route}: PlaceListScreenProps) => {
  const [defaultId, setDefaultId] = useState(0);
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useFocusEffect(() => {
    async function getDefaultId() {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const res = await API.get('/folders/default', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDefaultId(res.data.id);
    }
    getDefaultId();
  });

  const getSavedPlaces = useCallback(async () => {
    if (isLoadingMore || cursorId === null) return;

    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      setIsLoadingMore(true);

      const res = await API.get('/folders/default/places-list', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          take: 10,
          cursorId: cursorId,
          addressList: [],
          categoryList: [],
        },
      });

      const data = res.data.items;
      const meta = res.data.meta;

      setSavedPlaces(prev => [...prev, ...data]);
      setCursorId(meta.hasNextPage ? meta.nextCursorId : null);
    } catch (error) {
      console.error('Error fetching saved places:', error);
      Alert.alert('Error', 'An error occurred while fetching saved places.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursorId, isLoadingMore]);

  useEffect(() => {
    getSavedPlaces();
    return () => {};
  }, [navigation, getSavedPlaces]);

  const toggleSelection = (placeId: number) => {
    setSelectedPlaces(prevSelected =>
      prevSelected.includes(placeId)
        ? prevSelected.filter(id => id !== placeId)
        : [...prevSelected, placeId],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      '선택된 장소들을 삭제하시겠어요?',
      '삭제하시면 모든 보관함에서 삭제됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const requestBody = {placeIds: selectedPlaces};
            try {
              const accessToken = await EncryptedStorage.getItem('accessToken');
              await API.delete(`/folders/${defaultId}/folder-places`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                data: requestBody,
              });
              setSavedPlaces(prevPlaces =>
                prevPlaces.filter(place => !selectedPlaces.includes(place.id)),
              );
              setSelectedPlaces([]);
              setIsSelecting(false);
            } catch (error) {
              console.error('Error deleting folder:', error);
              Alert.alert('오류', '보관함 삭제 중 문제가 발생했습니다.');
            }
          },
        },
      ],
    );
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && cursorId !== null) {
      getSavedPlaces();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <BackButton style={styles.backButton} />
        </Pressable>
        <Text style={styles.headerText}>내 장소</Text>
      </View>

      <View
        style={{
          width: dWidth - 48,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          borderBottomColor: 'black',
          borderBottomWidth: 2.2,
          marginTop: 40,
        }}>
        <View>
          <Text style={{fontSize: 20, fontWeight: '700', marginBottom: 4}}>
            내 장소 📍
          </Text>
          <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
            <SavedPlaceNum />
            <Text>저장한 장소 · {savedPlaces.length}곳</Text>
          </View>
        </View>
        <View style={styles.actionButtonsContainer}>
          <Pressable
            onPress={() => {
              setIsSelecting(!isSelecting);
              setSelectedPlaces([]);
            }}
            style={styles.selectButton}>
            {!isSelecting ? <SelectIcon /> : <></>}
            <Text style={styles.selectText}>
              {isSelecting ? '취소' : '선택'}
            </Text>
          </Pressable>
          {isSelecting && (
            <Pressable onPress={handleDelete} style={styles.deleteFolderButton}>
              <DeleteIcon />
              <Text style={styles.deleteFolderText}>삭제</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={({nativeEvent}) => {
          const paddingToBottom = 10;
          if (
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - paddingToBottom
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}>
        <View style={styles.placeGrid}>
          {savedPlaces.map((place, index) => (
            <Pressable
              key={place.id}
              style={[styles.placeItem, {marginRight: index % 2 === 0 ? 8 : 0}]}
              onPress={() =>
                isSelecting ? toggleSelection(place.id) : navigation.navigate('PlaceDetail', { placeId: place.id })
              }>
              <View
                style={[
                  styles.placeImage,
                  selectedPlaces.includes(place.id) && styles.selectedPlace,
                ]}
              />
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeInfo}>
                {place.simplifiedAddress} | {place.ieumCategory}
              </Text>
              {isSelecting && (
                <View style={styles.selectionIcon}>
                  {selectedPlaces.includes(place.id) ? (
                    <CheckedSpot />
                  ) : (
                    <EmptySpot />
                  )}
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    height: 52,
    width: dWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#1212140D',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 16,
    height: 12,
    marginRight: 130,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 23,
    marginBottom: 20,
  },
  selectButton: {
    height: 30,
    width: 65,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    gap: 8,
  },
  selectText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#7F7F7F',
  },
  deleteFolderButton: {
    height: 30,
    width: 65,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    gap: 8,
    marginLeft: 5,
  },
  deleteFolderText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#F00',
  },
  scrollViewContent: {
    alignItems: 'flex-start',
    paddingBottom: 30,
    paddingTop: 25,
  },
  placeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  placeItem: {
    width: (dWidth - 70) / 2,
    marginBottom: 20,
    position: 'relative',
  },
  placeImage: {
    width: '100%',
    height: 218,
    borderRadius: 10,
    backgroundColor: 'grey',
  },
  selectedPlace: {
    opacity: 0.7,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#121212',
    marginTop: 8,
  },
  placeInfo: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A4A4A4',
    marginTop: 4,
  },
  selectionIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default PlaceListScreen;
