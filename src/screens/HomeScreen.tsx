import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  NativeModules,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '../../types';
import MainLogo from '../assets/main-logo-small.svg';
import NotificationIcon from '../assets/notification-icon.svg';
import EmptyProfile from '../assets/empty-profile.svg';
import EditIcon from '../assets/edit-icon.svg';
import LinkInputIcon from '../assets/link-input-icon.svg';
import LinkInputButton from '../assets/agreement-toggle-button.svg';
import FolderSavedPlaceNum from '../assets/folder-saved-place-num.svg';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosError} from 'axios';
import ImageContainer from '../component/ImageContainer';
import PlaceList from '../component/PlaceList';
import {IPlace} from '../recoil/place/atom';
import {mapServerCategoryToEnum} from '../recoil/category/atom';

export type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

interface LinkData {
  id: number;
  collectionType: 'INSTAGRAM' | 'NAVER BLOG';
  link: string;
  content: string;
  collectionPlacesCount: number;
  savedCollectionPlacesCount: number;
}

interface Folder {
  id: number;
  name: string;
  placeCnt: number;
  type: number;
  thumbnailUrl: string;
}

interface Place {
  id: number;
  name: string;
  simplifiedAddress: string;
  ieumCategory: string;
  imageUrl: string;
}

const dWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [unviewedLinksCount, setUnviewedLinksCount] = useState<number>(0);
  const [unSavedPlacesCount, setUnSavedPlacesCount] = useState<number>(0);
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [username, setUserName] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);

  const [cursorId, setCursorId] = useState<number | null>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setSavedPlaces([]);
      setCursorId(0);
      setHasMoreData(true);
      fetchSavedPlaces();
    }, []),
  );

  useEffect(() => {
    saveTokenToUserDefaults();
  }, []);
  async function saveTokenToUserDefaults() {
    try {
      const token = await EncryptedStorage.getItem('refreshToken');
      if (token) {
        const {SharedDataModule} = NativeModules;
        SharedDataModule.saveRefreshToken(token); // Share Extension에서 호출할 메서드
      }
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
    }
  }

  const fetchSavedPlaces = useCallback(async () => {
    if (isLoadingMore || !hasMoreData || cursorId === null) return;

    try {
      setIsLoadingMore(true);

      const res = await API.get('/folders/default/places-list', {
        params: {
          take: 10,
          cursorId: cursorId || 0,
          addressList: [],
          categoryList: [],
        },
      });

      const data = res.data.items;
      const meta = res.data.meta;

      setSavedPlaces(prev => {
        const updated = [...prev, ...data];
        const uniquePlaces = updated.filter(
          (item, index, self) =>
            self.findIndex(p => p.id === item.id) === index,
        );
        return uniquePlaces;
      });

      setCursorId(meta.hasNextPage ? meta.nextCursorId : null);
      setHasMoreData(meta.hasNextPage);
    } catch (error) {
      console.error('Error fetching saved places:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursorId, isLoadingMore, hasMoreData]);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, folderRes, unviewedLinksRes, viewedLinksRes] =
        await Promise.all([
          API.get('/users/me'),
          API.get('/folders'),
          API.get('/collections/unviewed', {
            params: {cursorId: cursorId},
          }),
          API.get('/collections/viewed', {
            params: {cursorId: cursorId},
          }),
        ]);

      if (profileRes.status === 200) {
        setUserName(profileRes.data.nickname);
      }

      if (folderRes.status === 200) {
        setFolders(folderRes.data.items);
      }

      const unviewedLinks = unviewedLinksRes.data.items;
      const viewedLinks = viewedLinksRes.data.items;

      setUnviewedLinksCount(unviewedLinks.length);

      const totalUnViewedUnSavedPlaces = unviewedLinks.reduce(
        (acc: number, link: LinkData) => acc + link.collectionPlacesCount,
        0,
      );

      const totalViewedUnSavedPlaces = viewedLinks.reduce(
        (acc: number, link: LinkData) => acc + link.collectionPlacesCount,
        0,
      );

      setUnSavedPlacesCount(
        totalUnViewedUnSavedPlaces +
          totalViewedUnSavedPlaces -
          savedPlaces.length,
      );

      await fetchSavedPlaces();
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        navigation.navigate('ServiceAgreement');
      } else if (error.response?.status === 404) {
        navigation.navigate('Login');
      } else {
        console.error('Error fetching data:', error);
      }
    }
  }, [fetchSavedPlaces, savedPlaces.length]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const renderFolders = () => {
    const folderItems = folders.slice(0, 4).map((folder, index) => (
      <>
        <View
          key={folder.id}
          style={{
            marginRight: index % 2 === 0 ? 8 : 0,
            marginBottom: index % 2 === 0 ? 8 : 0,
          }}>
          <ImageContainer
            imageUrl={folder.thumbnailUrl}
            defaultImageUrl={require('../assets/unloaded-image-v3.png')}
            width={(dWidth - 58) / 2}
            height={105}
            borderRadius={8}>
            <View style={styles.folderItem}>
              <Text style={styles.folderName}>{folder.name}</Text>
              <View style={styles.folderInfo}>
                <FolderSavedPlaceNum />
                <Text style={styles.folderPlaceCount}>
                  저장한 장소 · {folder.placeCnt}곳
                </Text>
              </View>
            </View>
          </ImageContainer>
        </View>
      </>
    ));
    return <View style={styles.foldersContainer}>{folderItems}</View>;
  };

  const renderPlaces = () => {
    const placeItems = savedPlaces.slice(0, 4).map((item): IPlace => {
      return {
        id: item.id,
        name: item.name,
        address: '',
        simplifiedAddress: item.simplifiedAddress,
        roadAddress: '',
        phone: '',
        category: mapServerCategoryToEnum(item.ieumCategory),
        latitude: 0,
        longitude: 0,
        categoryTags: '',
        hashTags: [],
        // region?: Regions,
        openingHours: [],
        googleMapsUri: '',
        linkedCollections: [],
        placeImages: [
          {
            url: item.imageUrl,
            authorName: '',
            authorUri: '',
          },
        ],
      };
    });
    return (
      <View style={{height: 550}}>
        <PlaceList
          placeList={placeItems}
          onPress={() => navigation.navigate('PlaceList')}
          loading={false}
          load={() => {}}
          containerStyle={{paddingHorizontal: 0}}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <MainLogo />
        {/* <NotificationIcon /> */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileSection}>
          <EmptyProfile />
          <Text style={styles.nicknameText}>{username} 님의 공간</Text>
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileEdit')}>
            {/* <EditIcon /> */}
            <Text style={styles.editText}>내 정보</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.linkInfoContainer}
          onPress={() => navigation.navigate('SpotCandidate')}>
          <LinkInputIcon />
          <View style={styles.linkInfoTextContainer}>
            <Text style={styles.newLinksText}>
              새로 등록된 {unviewedLinksCount}개의 링크
            </Text>
            <Text style={styles.unsavedPlacesText}>
              {unSavedPlacesCount}개의 장소가 저장을 기다리고 있어요!
            </Text>
          </View>
          <LinkInputButton style={styles.linkInputButton} />
        </Pressable>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>내 보관함 🚘</Text>
          <Pressable
            onPress={() =>
              navigation.navigate('FolderList', {newFolder: null})
            }>
            {renderFolders()}
          </Pressable>
          <Pressable
            style={styles.viewAllButton}
            onPress={() =>
              navigation.navigate('FolderList', {newFolder: null})
            }>
            <Text style={styles.viewAllButtonText}>전체보기</Text>
          </Pressable>
        </View>

        <View style={{width: dWidth, height: 12, backgroundColor: '#F8F8F8'}} />

        <View
          style={{
            marginTop: 30,
            width: dWidth - 48,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              alignSelf: 'flex-start',
              marginBottom: 18,
            }}>
            내 장소 📍
          </Text>
          <Pressable onPress={() => navigation.navigate('PlaceList')}>
            {renderPlaces()}
          </Pressable>
          <Pressable
            // style={{
            //   width: 172,
            //   height: 40,
            //   borderColor: '#D9D9D9',
            //   borderWidth: 1,
            //   borderRadius: 2,
            //   alignItems: 'center',
            //   justifyContent: 'center',
            //   marginTop: 25,
            //   marginBottom: 25,
            // }}
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('PlaceList')}>
            <Text style={styles.viewAllButtonText}>전체보기</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate('LinkInput')}
        style={styles.addLinkButton}>
        <Text style={styles.addLinkButtonText}>😝 링크 추가하기</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    width: dWidth,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 18,
  },
  profileSection: {
    flexDirection: 'row',
    width: dWidth,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    marginLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    width: 60,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFB2BE',
    borderWidth: 1,
    borderRadius: 25,
    marginLeft: 'auto',
    gap: 2,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF7D92',
  },
  linkInfoContainer: {
    flexDirection: 'row',
    width: dWidth - 48,
    height: 75,
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    borderColor: '#F2F3F4',
    borderWidth: 1,
    borderRadius: 15,
  },
  linkInfoTextContainer: {
    marginLeft: 13.5,
    gap: 2,
  },
  newLinksText: {
    fontSize: 15,
    fontWeight: '700',
  },
  unsavedPlacesText: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#A4A4A4',
  },
  linkInputButton: {
    marginLeft: 'auto',
    width: 9,
    height: 14,
  },
  sectionContainer: {
    width: dWidth - 48,
    alignItems: 'center',
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  foldersContainer: {
    marginTop: 15,
    width: dWidth - 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  folderItem: {
    padding: 15,
    marginBottom: 10,
    marginRight: 8,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  folderInfo: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  folderPlaceCount: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#FFF',
    marginLeft: 7,
  },
  placesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  placeItem: {
    width: (dWidth - 58) / 2,
    marginBottom: 20,
  },
  placeImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
  },
  image: {
    marginBottom: 8,
    width: '100%',
    position: 'relative',
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeInfo: {
    fontSize: 12.5,
    color: '#A4A4A4',
    fontWeight: '500',
  },
  viewAllButton: {
    width: 172,
    height: 40,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addLinkButton: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    height: 38,
    width: 134,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5570',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderRadius: 65,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  addLinkButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
