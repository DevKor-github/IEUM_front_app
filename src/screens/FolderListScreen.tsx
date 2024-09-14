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
import FolderSavedPlaceNum from '../assets/folder-saved-place-num.svg';
import PlusIcon from '../assets/plus-icon.svg';
import SelectIcon from '../assets/select-icon.svg';
import DeleteIcon from '../assets/delete-icon.svg';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {HomeStackParamList} from '../../types';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosError} from 'axios';

export type FolderListScreenProps = StackScreenProps<
  HomeStackParamList,
  'FolderList'
>;

const dWidth = Dimensions.get('window').width;

interface FolderData {
  id: number;
  name: string;
  placeCnt: number;
  type: number;
}

const FolderListScreen = ({navigation, route}: FolderListScreenProps) => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);

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
      Alert.alert('오류', '보관함 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFolders();
    }, [fetchFolders]),
  );

  const toggleSelection = (folderId: number) => {
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders(selectedFolders.filter(id => id !== folderId));
    } else {
      setSelectedFolders([...selectedFolders, folderId]);
    }
  };

  const handleDelete = () => {
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
              const accessToken = await EncryptedStorage.getItem('accessToken');

              for (const folderId of selectedFolders) {
                try {
                  await API.delete(`/folders/${folderId}`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                    },
                  });

                  setFolders(prevFolders =>
                    prevFolders.filter(folder => folder.id !== folderId),
                  );
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
                      '네트워크 문제로 보관함 삭제에 실패했습니다.',
                    );
                  }
                }
              }

              setSelectedFolders([]);
              setIsSelecting(false);
            } catch (error) {
              console.error('Error processing deletion:', error);
              Alert.alert('오류', '보관함 삭제 처리 중 문제가 발생했습니다.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <BackButton style={styles.backButton} />
        </Pressable>
        <Text style={styles.headerText}>내 보관함</Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        <Pressable
          onPress={() => {
            setIsSelecting(!isSelecting);
            setSelectedFolders([]);
          }}
          style={styles.selectButton}>
          {!isSelecting ? <SelectIcon /> : <></>}
          <Text style={styles.selectText}>{isSelecting ? '취소' : '선택'}</Text>
        </Pressable>
        {isSelecting && (
          <Pressable onPress={handleDelete} style={styles.deleteFolderButton}>
            <DeleteIcon />
            <Text style={styles.deleteFolderText}>삭제</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.folderGrid}>
          {folders.map((folder, index) => (
            <Pressable
              key={folder.id}
              style={[
                styles.folderItem,
                {marginRight: index % 2 === 0 ? 8 : 0},
              ]}
              onPress={() => {
                if (isSelecting) {
                  toggleSelection(folder.id);
                } else {
                  navigation.navigate('FolderPlaceList', {
                    folderId: folder.id,
                    folderName: folder.name,
                  });
                }
              }}>
              <View
                style={[
                  styles.folderImage,
                  selectedFolders.includes(folder.id) && styles.selectedFolder,
                ]}>
                <Text style={styles.folderName}>{folder.name}</Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <FolderSavedPlaceNum />
                  <Text style={styles.folderPlaceCnt}>
                    저장한 장소 · {folder.placeCnt}곳
                  </Text>
                </View>
                {isSelecting && (
                  <View style={styles.selectionIcon}>
                    {selectedFolders.includes(folder.id) ? (
                      <CheckedSpot />
                    ) : (
                      <EmptySpot />
                    )}
                  </View>
                )}
              </View>
            </Pressable>
          ))}

          {/* 보관함 추가 */}
          <Pressable
            style={styles.addFolder}
            onPress={() => navigation.navigate('NewFolder')}>
            <View style={styles.plusIconContainer}>
              <PlusIcon />
            </View>
            <Text style={styles.addFolderText}>보관함 추가</Text>
          </Pressable>
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
    marginRight: 125,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 30,
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
    alignItems: 'center',
    paddingBottom: 30,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  folderItem: {
    width: (dWidth - 70) / 2,
    marginBottom: 20,
    position: 'relative',
  },
  folderImage: {
    width: '100%',
    height: 180,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingLeft: 15,
    position: 'relative',
  },
  selectedFolder: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  folderName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  folderPlaceCnt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFF',
  },
  selectionIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addFolder: {
    width: (dWidth - 70) / 2,
    height: 180,
    backgroundColor: '#FFF',
    borderColor: '#EFEFEF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  plusIconContainer: {
    width: 25,
    height: 25,
    borderColor: '#C1C1C1',
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addFolderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A4A4A4',
  },
});

export default FolderListScreen;
