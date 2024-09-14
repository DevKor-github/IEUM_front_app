import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
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
import PlusIcon from '../assets/place-plus-icon.svg';
import CheckedSpot from '../assets/checked-spot.svg';
import EmptySpot from '../assets/empty-circle.svg';
import SelectIcon from '../assets/select-icon.svg';
import SavedPlaceNum from '../assets/saved-place-num.svg';
import SpotSaveIcon from '../assets/spot-save-icon.svg';
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

interface Folder {
  id: number;
  name: string;
  type: number;
  placeCnt: number;
}

const dWidth = Dimensions.get('window').width;

const SpotSaveScreen: React.FC<SpotSaveScreenProps> = ({navigation, route}) => {
  const {collectionId, collectionContent, collectionType} = route.params;
  const [places, setPlaces] = useState<Place[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<Folder[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [savedPlacesCursorId, setSavedPlacesCursorId] = useState<number | null>(
    0,
  );
  const [placesCursorId, setPlacesCursorId] = useState<number | null>(0);
  const [isFetchingSavedPlaces, setIsFetchingSavedPlaces] = useState(false);
  const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);

  useFocusEffect(() => {
    const fetchSavedPlaces = async () => {
      if (isFetchingSavedPlaces || savedPlacesCursorId === null) return;

      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        setIsFetchingSavedPlaces(true);

        const res = await API.get('/folders/default/places-list', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            take: 10,
            cursorId: savedPlacesCursorId,
            addressList: [],
            categoryList: [],
          },
        });

        const data = res.data.items;
        const meta = res.data.meta;

        setSavedPlaces(prevSavedPlaces => [...prevSavedPlaces, ...data]);

        setSavedPlacesCursorId(meta.hasNextPage ? meta.nextCursorId : null);
      } catch (error) {
        console.error('Error fetching saved places:', error);
        Alert.alert('Error', 'An error occurred while fetching saved places.');
      } finally {
        setIsFetchingSavedPlaces(false);
      }
    };
    fetchSavedPlaces();
  });

  useEffect(() => {
    const fetchPlaces = async () => {
      if (isFetchingPlaces || placesCursorId === null) return;

      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        setIsFetchingPlaces(true);

        const res = await API.get(
          `/collections/${collectionId}/collection-places`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              collectionId: collectionId,
              cursorId: placesCursorId,
            },
          },
        );
        const data = res.data.items;
        const meta = res.data.meta;

        setPlaces(prevPlaces => [...prevPlaces, ...data]);

        setPlacesCursorId(meta.hasNextPage ? meta.nextCursorId : null);
      } catch (error) {
        console.error('Error fetching places:', error);
        Alert.alert('Error', 'An error occurred while fetching places.');
      } finally {
        setIsFetchingPlaces(false);
      }
    };
    fetchPlaces();
  }, [collectionId, placesCursorId]);

  useEffect(() => {
    async function getFolder() {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const res = await API.get('/folders', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFolders(res.data.items);
    }
    getFolder();
  }, [navigation]);

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
      await API.post(
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
      setPlaces(prevPlaces =>
        prevPlaces.map(place =>
          selectedPlaces.includes(place.placeId)
            ? {...place, isSaved: true}
            : place,
        ),
      );
      setSelectedPlaces([placeId]);
      setIsSelecting(false);
      setIsBottomSheetVisible(true);
    } catch (error) {
      console.error('Error saving places:', error);
      Alert.alert('Error', 'An error occurred while saving selected places.');
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
      await API.post(
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
      setPlaces(prevPlaces =>
        prevPlaces.map(place =>
          selectedPlaces.includes(place.placeId)
            ? {...place, isSaved: true}
            : place,
        ),
      );
      setIsSelecting(false);
      setIsBottomSheetVisible(true);
    } catch (error) {
      console.error('Error saving places:', error);
      Alert.alert('Error', 'An error occurred while saving selected places.');
    }
  };

  const saveToSelectedFolder = async (folderId: number) => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');

      if (selectedPlaces.length === 0) {
        Alert.alert('Error', 'No places selected or invalid place ID.');
        return;
      }
      const validPlaceIds = selectedPlaces.filter(
        id => id !== null && id !== undefined,
      );
      if (validPlaceIds.length === 0) {
        Alert.alert('Error', 'Invalid place IDs.');
        return;
      }
      const requestBody = {
        placeIds: validPlaceIds,
      };
      await API.post(`/folders/${folderId}/folder-places`, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPlaces(prevPlaces =>
        prevPlaces.map(place =>
          validPlaceIds.includes(place.placeId)
            ? {...place, isSaved: true}
            : place,
        ),
      );
      setIsBottomSheetVisible(false);
      setSelectedPlaces([]);
      setSelectedFolderId(null);
      setIsSelecting(false);
    } catch (error) {
      console.error('Error saving to folder:', error);
      Alert.alert('Error', 'An error occurred while saving the place.');
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

  const renderFolderItem = ({item}: {item: Folder}) => (
    <Pressable
      style={styles.folderItem}
      onPress={() => {
        setSelectedFolderId(item.id);
        setTimeout(() => {
          setSelectedFolderId(null);
        }, 500);
        setIsBottomSheetVisible(false);
        saveToSelectedFolder(item.id);
      }}>
      <View style={styles.folderInfoContainer}>
        <View style={styles.folderIcon} />
        <View>
          <Text style={styles.folderName}>{item.name}</Text>
          <View style={styles.folderDetailContainer}>
            <SavedPlaceNum />
            <Text style={styles.folderPlaceCnt}>
              저장한 장소 · {item.placeCnt}곳
            </Text>
          </View>
        </View>
        {selectedFolderId === item.id ? (
          <CheckedSpot style={{marginLeft: 'auto'}} />
        ) : (
          <PlusIcon style={{marginLeft: 'auto'}} />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <CloseButton />
        </Pressable>
      </View>
      <View style={styles.container}>
        {collectionType === 'INSTAGRAM' ? (
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
        ) : (
          <LinearGradient
            colors={[
              'rgba(25, 248, 118, 0.92)',
              'rgba(3, 235, 100, 0.92)',
              'rgba(39, 252, 227, 0.92)',
            ]}
            start={{x: -0.02, y: 0}}
            end={{x: 1.54, y: 1}}
            style={styles.naverBadge}>
            <Text style={styles.naverBadgeText}>NAVER BLOG</Text>
          </LinearGradient>
        )}

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
          onEndReached={() => {
            if (!isFetchingPlaces && placesCursorId !== null) {
              setPlacesCursorId(placesCursorId);
            }
          }}
          onEndReachedThreshold={0.5}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isBottomSheetVisible}
          onRequestClose={() => {
            setIsBottomSheetVisible(false);
            setSelectedFolderId(null);
          }}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => {
              setIsBottomSheetVisible(false);
              setSelectedFolderId(null);
            }}>
            <View style={styles.bottomSheet}>
              <View style={styles.bottomSheetContent}>
                <View
                  style={{
                    marginTop: 15,
                    marginHorizontal: 5,
                    marginBottom: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.bottomSheetTitle}>내 보관함</Text>
                  <Pressable>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#008AFF',
                      }}>
                      새 보관함
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 5,
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: 'grey',
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                  <View>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      Default
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <SavedPlaceNum />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '400',
                          color: '#A4A4A4',
                        }}>
                        저장한 장소 · 곳
                      </Text>
                    </View>
                  </View>
                  <SpotSaveIcon style={{marginLeft: 'auto'}} />
                </View>

                <View
                  style={{
                    backgroundColor: '#EFEFEF',
                    height: 1,
                    width: 320,
                    marginTop: 20,
                    marginBottom: 25,
                    alignSelf: 'center',
                  }}
                />

                <FlatList
                  data={folders}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderFolderItem}
                />
              </View>
            </View>
          </Pressable>
        </Modal>
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
    justifyContent: 'center',
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
  naverBadge: {
    width: 90,
    height: 23,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    margin: 16,
  },
  naverBadgeText: {fontSize: 11, fontWeight: '700', color: '#FFF'},
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
  },
  bottomSheet: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    height: '45%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  folderInfoContainer: {
    flexDirection: 'row',
    width: dWidth - 58,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  folderIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 10,
    marginRight: 10,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  folderDetailContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  folderPlaceCnt: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A4A4A4',
  },
  bottomSheetButton: {
    marginTop: 15,
    backgroundColor: '#FF5570',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
});

export default SpotSaveScreen;
