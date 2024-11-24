import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  Alert,
  Modal,
  Share,
  FlatList,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import BackButton from '../assets/back-button.svg';
import CheckedSpot from '../assets/checked-spot.svg';
import EmptySpot from '../assets/empty-circle.svg';
import ShareIcon from '../assets/share-icon.svg';
import SavedPlaceNum from '../assets/saved-place-num.svg';
import DotDotButton from '../assets/dot-dot-button.svg';
import PlusIcon from '../assets/place-plus-icon.svg';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {HomeStackParamList} from '../../types';
import {AxiosError} from 'axios';
import PlaceList from '../component/PlaceList';
import {IPlace} from '../recoil/place/atom';

export type FolderPlaceListScreenProps = StackScreenProps<
  HomeStackParamList,
  'FolderPlaceList'
>;

const dWidth = Dimensions.get('window').width;

interface Folder {
  id: number;
  name: string;
  type: number;
  placeCnt: number;
}

const FolderPlaceListScreen = ({
  navigation,
  route,
}: FolderPlaceListScreenProps) => {
  const {folderId, folderName} = route.params;
  const [savedPlaces, setSavedPlaces] = useState<IPlace[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [cursorId, setCursorId] = useState<number | null>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getSavedPlaces = useCallback(async () => {
    if (isLoadingMore || cursorId === null) return;

    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      setIsLoadingMore(true);

      const res = await API.get(`/folders/${folderId}/places-list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          take: 10,
          cursorId: cursorId || 0,
          addressList: [],
          categoryList: [],
        },
      });

      const data = res.data.items.map((place: any) => ({
        id: place.id,
        name: place.name,
        simplifiedAddress: place.simplifiedAddress,
        ieumCategory: place.ieumCategory,
        placeImages: [
          {
            url: place.imageUrl,
            authorName: '',
            authorUri: '',
          },
        ],
        category: '',
        address: '',
        roadAddress: '',
        phone: '',
      }));
      const meta = res.data.meta;

      setSavedPlaces(prev => [...prev, ...data]);
      setCursorId(meta.hasNextPage ? meta.nextCursorId : null);
    } catch (error) {
      console.error('Error fetching saved places:', error);
      Alert.alert('Error', 'An error occurred while fetching saved places.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursorId, isLoadingMore, folderId]);

  useEffect(() => {
    getSavedPlaces();
  }, [getSavedPlaces]);

  const toggleSelection = (placeId: number) => {
    setSelectedPlaces(prevSelected =>
      prevSelected.includes(placeId)
        ? prevSelected.filter(id => id !== placeId)
        : [...prevSelected, placeId],
    );
  };

  const handleDelete = () => {
    setIsBottomSheetVisible(false);
    Alert.alert(
      '선택된 장소들을 삭제하시겠어요?',
      '선택된 모든 장소는 내 장소 에 계속 저장된 상태로 유지됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const requestBody = {placeIds: selectedPlaces};
              const accessToken = await EncryptedStorage.getItem('accessToken');
              await API.delete(`/folders/${folderId}/folder-places`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                data: requestBody,
              });
              navigation.goBack();
            } catch (err) {
              const error = err as AxiosError;

              if (error.response) {
                const status = error.response.status;

                if (status === 401) {
                  // 둘러보기 기능 추가 시 구현
                }
              } else {
                console.error('Error deleting places:', error);
                Alert.alert(
                  '오류',
                  '선택된 장소 삭제 처리 중 문제가 발생했습니다.',
                );
              }
            }
          },
        },
      ],
    );
  };

  const handleThreeDotMenu = () => {
    setIsMenuVisible(true);
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
      setIsBottomSheetVisible(false);
      setSelectedPlaces([]);
      setSelectedFolderId(null);
      setIsSelecting(false);
    } catch (error) {
      console.error('Error saving to folder:', error);
      Alert.alert('Error', 'An error occurred while saving the place.');
    }
  };

  const fetchFolders = useCallback(async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const res = await API.get('/folders', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFolders(res.data.items);
    } catch (error) {
      console.error('Error fetching folders:', error);
      Alert.alert('Error', 'An error occurred while fetching folders.');
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

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

  const handleLoadMore = () => {
    if (!isLoadingMore && cursorId !== null) {
      getSavedPlaces();
    }
  };

  const handleUpdate = (isSelecting: boolean) => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectedPlaces([]);
    } else {
      navigation.navigate('FolderList', {newFolder: null});
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            handleUpdate(isSelecting);
          }}>
          {isSelecting ? (
            <Text style={{fontSize: 17, fontWeight: '400', color: '#008AFF'}}>
              취소
            </Text>
          ) : (
            <BackButton style={styles.backButton} />
          )}
        </Pressable>
        <Text style={styles.headerText}>내 보관함</Text>
        <Pressable onPress={handleThreeDotMenu}>
          <DotDotButton />
        </Pressable>
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
          paddingBottom: 13,
          marginTop: 40,
          marginBottom: 22,
        }}>
        <View>
          <Text style={{fontSize: 20, fontWeight: '700', marginBottom: 4}}>
            {folderName}
          </Text>
          <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
            <SavedPlaceNum />
            <Text>저장한 장소 · {savedPlaces.length}곳</Text>
          </View>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            width: 78,
            height: 33,
            gap: 7,
            borderRadius: 20,
            backgroundColor: '#FF5570',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={async () => await Share.share({message: '보관함 공유'})}>
          <ShareIcon />
          <Text style={{fontSize: 14, fontWeight: '600', color: '#FFF'}}>
            공유
          </Text>
        </Pressable>
      </View>

      <PlaceList
        placeList={savedPlaces}
        isSelecting={isSelecting}
        selectedPlaces={selectedPlaces}
        toggleSelection={toggleSelection}
        onPress={placeId => {
          if (isSelecting) {
            toggleSelection(placeId);
          } else {
            navigation.navigate('PlaceDetail', {placeId});
          }
        }}
        loading={isLoadingMore}
        load={handleLoadMore}
      />

      {selectedPlaces.length > 0 && (
        <Pressable
          style={styles.bottomMenuTrigger}
          onPress={() => setIsBottomSheetVisible(true)}>
          <Pressable style={styles.bottomMenuButton} onPress={handleDelete}>
            <Text style={styles.bottomMenuTriggerText}>선택삭제</Text>
          </Pressable>
          <Pressable
            style={styles.bottomMenuButton}
            onPress={() => {
              setIsBottomSheetVisible(true);
            }}>
            <Text style={styles.bottomMenuTriggerText}>보관함 추가</Text>
          </Pressable>
        </Pressable>
      )}

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

              <FlatList
                data={folders}
                keyExtractor={item => item.id.toString()}
                renderItem={renderFolderItem}
              />
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}>
          <View style={styles.bottomMenu}>
            <Pressable
              onPress={() => {
                navigation.navigate('RenameFolder', {folderId: folderId});
                setIsMenuVisible(false);
              }}>
              <Text style={styles.menuItem}>보관함 이름 변경</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsSelecting(true);
                setIsMenuVisible(false);
              }}>
              <Text style={styles.menuItem}>편집</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert(
                  '해당 보관함을 삭제하시겠어요?',
                  '해당 보관함을 공유한 사람들의 보관함에서도 영구적으로 삭제됩니다.',
                  [
                    {text: '취소', style: 'cancel'},
                    {
                      text: '삭제',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          const accessToken = await EncryptedStorage.getItem(
                            'accessToken',
                          );
                          await API.delete(`/folders/${folderId}`, {
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              'Content-Type': 'application/json',
                            },
                          });
                          navigation.goBack();
                        } catch (err) {
                          const error = err as AxiosError;

                          if (error.response) {
                            const status = error.response.status;

                            if (status === 401) {
                              // 둘러보기 기능 추가 시 구현
                            }
                          } else {
                            console.error('Error deleting folder:', error);
                            Alert.alert(
                              '오류',
                              '보관함 삭제 처리 중 문제가 발생했습니다.',
                            );
                          }
                        }
                        setIsSelecting(false);
                      },
                    },
                  ],
                );
                setIsMenuVisible(false);
              }}>
              <Text style={[styles.menuItem, styles.destructive]}>
                보관함 삭제
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    justifyContent: 'space-between',
    borderBottomColor: '#1212140D',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 16,
    height: 12,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
  },
  scrollViewContent: {
    alignItems: 'flex-start',
    paddingBottom: 30,
    paddingTop: 25,
  },
  placeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
  bottomMenuButton: {
    width: 168,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFEF',
  },
  bottomMenuTrigger: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    backgroundColor: '#FFFFFF',
  },
  bottomMenuTriggerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7F7F7F',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
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
  bottomMenu: {
    backgroundColor: '#FFFFFF',
    height: 205,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  menuItem: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 12,
    color: '#121212',
  },
  destructive: {
    color: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelItem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default FolderPlaceListScreen;
