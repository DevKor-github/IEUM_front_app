import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {HomeStackParamList} from '../../types';
import {API} from '../api/base';
import {SafeAreaView} from 'react-native-safe-area-context';
import EncryptedStorage from 'react-native-encrypted-storage';
import CloseButton from '../assets/close-button.svg';
import SaveToFolder from '../assets/save-to-folder.svg';
import SavedToFolder from '../assets/saved-to-folder.svg';
import CheckedSpot from '../assets/checked-spot.svg';
import EmptySpot from '../assets/empty-circle.svg';
import SelectIcon from '../assets/select-icon.svg';
import {useFocusEffect} from '@react-navigation/native';

export type SpotSaveScreenProps = StackScreenProps<
  HomeStackParamList,
  'SpotSave'
>;

interface Place {
  placeId: number;
  placeName: string;
  simplifiedAddress: string;
  mappedCategory: string;
  isSaved: boolean;
}

interface SavedPlace {
  id: number;
  name: string;
  simplifiedAddress: string;
  mappedCategory: string;
}

const dWidth = Dimensions.get('window').width;

const SpotSaveScreen: React.FC<SpotSaveScreenProps> = ({navigation, route}) => {
  const {collectionId, collectionContent, collectionType} = route.params;
  const [places, setPlaces] = useState<Place[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useFocusEffect(() => {
    const fetchSavedPlaces = async () => {
      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        const response = await API.get('/folders/default/places-list', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            take: 10, // 한번에 가져올 장소의 개수, 필요에 따라 조정
            cursorId: 0, // 첫 페이지를 불러올 때는 0
            addressList: [],
            categoryList: [],
          },
        });

        if (response.status === 200) {
          const data = response.data.response.data;
          setSavedPlaces(data);
        } else {
          Alert.alert('Error', 'Failed to fetch saved places.');
        }
      } catch (error) {
        console.error('Error fetching saved places:', error);
        Alert.alert('Error', 'An error occurred while fetching saved places.');
      }
    };
    fetchSavedPlaces();
  });

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        const response = await API.get(
          `/collections/${collectionId}/collection-places`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              collectionId: collectionId,
            },
          },
        );
        const data = response.data.response.data;
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching places:', error);
        Alert.alert('Error', 'An error occurred while fetching places.');
      }
    };
    fetchPlaces();
  }, [collectionId]);

  const toggleSelection = (placeId: number) => {
    setSelectedPlaces(prevSelected =>
      prevSelected.includes(placeId)
        ? prevSelected.filter(id => id !== placeId)
        : [...prevSelected, placeId],
    );
  };

  const handleSavePlace = async (placeId: number, isSaved: boolean) => {
    if (
      isSaved ||
      (savedPlaces && savedPlaces.some(place => place.id === placeId))
    ) {
      Alert.alert('이미 저장된 장소입니다');
      return;
    }

    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await API.post(
        '/folders/default/folder-places',
        {
          placeIds: [placeId],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
      setPlaces(prevPlaces =>
        prevPlaces.map(place =>
          place.placeId === placeId ? {...place, isSaved: true} : place,
        ),
      );
    } catch (error) {
      console.error('Error saving place:', error);
      Alert.alert('Error', 'An error occurred while saving the place.');
    }
  };

  const saveSelectedPlaces = async () => {
    const alreadySavedPlaces = selectedPlaces.filter(
      placeId => savedPlaces && savedPlaces.some(place => place.id === placeId),
    );

    if (alreadySavedPlaces.length > 0) {
      Alert.alert('이미 저장된 장소가 포함되어 있습니다.');
      return;
    }

    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await API.post(
        '/folders/default/folder-places',
        {
          placeIds: selectedPlaces,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
      setPlaces(prevPlaces =>
        prevPlaces.map(place =>
          selectedPlaces.includes(place.placeId)
            ? {...place, isSaved: true}
            : place,
        ),
      );
      setSelectedPlaces([]);
      setIsSelecting(false);
    } catch (error) {
      console.error('Error saving places:', error);
      Alert.alert('Error', 'An error occurred while saving selected places.');
    }
  };

  const formatCollectionContent = (content: string, type: string) => {
    if (type === 'INSTAGRAM') {
      const colonIndex = content.indexOf('"');
      if (colonIndex !== -1) {
        return content.slice(colonIndex + 1).trim();
      }
    }
    return content;
  };

  const renderPlaceItem = ({item}: {item: Place}) => (
    <View style={styles.placeItem}>
      <View>
        <Text style={styles.placeName}>{item.placeName}</Text>
        <Text style={styles.placeInfo}>
          {item.simplifiedAddress} | {item.mappedCategory}
        </Text>
      </View>
      {isSelecting ? (
        <Pressable onPress={() => toggleSelection(item.placeId)}>
          {selectedPlaces.includes(item.placeId) ? (
            <CheckedSpot />
          ) : (
            <EmptySpot />
          )}
        </Pressable>
      ) : (
        <Pressable
          style={
            item.isSaved ||
            (savedPlaces &&
              savedPlaces.some(place => place.id === item.placeId))
              ? styles.savedButton
              : styles.saveButton
          }
          onPress={() => handleSavePlace(item.placeId, item.isSaved)}>
          <Text
            style={
              item.isSaved ||
              (savedPlaces &&
                savedPlaces.some(place => place.id === item.placeId))
                ? styles.savedText
                : styles.saveText
            }>
            {item.isSaved ||
            (savedPlaces &&
              savedPlaces.some(place => place.id === item.placeId))
              ? '보관함에 저장됨'
              : '보관함에 저장'}
          </Text>
          {item.isSaved ||
          (savedPlaces &&
            savedPlaces.some(place => place.id === item.placeId)) ? (
            <SavedToFolder />
          ) : (
            <SaveToFolder />
          )}
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <CloseButton />
        </Pressable>
      </View>
      <View style={styles.container}>
        <LinearGradient
          colors={[
            'rgba(255, 27, 144, 0.85)',
            'rgba(248, 2, 97, 0.85)',
            'rgba(237, 0, 192, 0.85)',
            'rgba(197, 0, 233, 0.85)',
            'rgba(112, 23, 255, 0.85)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.instagramBadge}>
          <Text style={styles.instagramBadgeText}>INSTAGRAM</Text>
        </LinearGradient>
        <Text
          style={styles.collectionContent}
          numberOfLines={2}
          ellipsizeMode="tail">
          {formatCollectionContent(collectionContent, collectionType)}
        </Text>

        <LinearGradient
          colors={['#79C1FF', '#008AFF']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.notice}>
          <View
            style={{
              height: 25,
              width: 87,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: '#FFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 9,
            }}>
            <Text style={styles.noticeText}>이음 알림 💌</Text>
          </View>
          <Text style={styles.noticeText}>
            저장된 장소는 muya_ho 님의 지도에 추가됩니다!
          </Text>
        </LinearGradient>
        <FlatList
          data={places}
          contentContainerStyle={styles.flatListContent}
          keyExtractor={item => item.placeId.toString()}
          renderItem={renderPlaceItem}
          ListHeaderComponent={
            <View style={styles.actionHeader}>
              <Pressable
                onPress={() => setIsSelecting(!isSelecting)}
                style={styles.selectButton}>
                {!isSelecting ? <SelectIcon /> : <></>}
                <Text style={styles.actionText}>
                  {isSelecting ? '취소' : '선택'}
                </Text>
              </Pressable>
              {isSelecting && (
                <Pressable
                  onPress={saveSelectedPlaces}
                  style={styles.saveSelectedButton}>
                  <Text style={styles.saveSelectedText}>보관함에 저장</Text>
                </Pressable>
              )}
            </View>
          }
        />
      </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 24,
    marginTop: 18,
  },
  container: {
    flex: 1,
  },
  flatListContent: {
    alignItems: 'center',
  },
  instagramBadge: {
    width: 84,
    height: 23,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    margin: 16,
  },
  instagramBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  collectionContent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#121212',
    lineHeight: 18,
    marginBottom: 16,
    marginLeft: 16,
  },
  notice: {
    height: 42,
    width: dWidth,
    marginBottom: 19,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  noticeText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  actionHeader: {
    flexDirection: 'row',
    width: dWidth,
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginRight: 35,
    gap: 8,
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
  saveSelectedButton: {
    height: 30,
    width: 98,
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
  actionText: {
    fontSize: 13.5,
    color: '#7F7F7F',
    fontWeight: '500',
  },
  saveSelectedText: {
    fontSize: 14,
    color: '#7F7F7F',
  },
  placeItem: {
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 345,
    height: 85,
  },
  placeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#121212',
  },
  placeInfo: {
    fontSize: 13,
    fontWeight: '200',
    lineHeight: 27.5,
    color: '#7F7F7F',
  },
  saveButton: {
    flexDirection: 'row',
    width: 105,
    height: 32,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  savedButton: {
    flexDirection: 'row',
    width: 105,
    height: 32,
    backgroundColor: '#FF5570',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#121212',
  },
  savedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default SpotSaveScreen;
