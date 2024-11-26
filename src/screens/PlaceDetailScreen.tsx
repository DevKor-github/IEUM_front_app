import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {MapStackParamList} from '../../types';
import BookmarkIcon from '../assets/bookmark-icon.svg';
import PhoneIcon from '../assets/phone-icon.svg';
import InstaIcon from '../assets/insta-icon.svg';
import NaverIcon from '../assets/naver-icon.svg';
import CopyIcon from '../assets/copy-icon.svg';
import PlaceConvenienceSection from '../component/PlaceConvenienceSection';
import {ILinkCollection, IPlace, PlaceConvenience} from '../recoil/place/atom';
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import {API} from '../api/base';
import {Categories} from '../recoil/category/atom';
import Clipboard from '@react-native-clipboard/clipboard';
import HashTags from '../component/HashTags';
import ImageContainer from '../component/ImageContainer';
import SpotUnSaveIcon from '../assets/bookmark-non-selected-icon.svg';
import SpotSaveIcon from '../assets/bookmark-selected-icon.svg';
import SavedPlaceNum from '../assets/saved-place-num.svg';
import CheckedSpot from '../assets/checked-spot.svg';
import PlusIcon from '../assets/place-plus-icon.svg';
import {useFocusEffect} from '@react-navigation/native';

export type PlaceDetailScreenProps = StackScreenProps<
  MapStackParamList,
  'PlaceDetail'
>;

interface Folder {
  id: number;
  name: string;
  type: number;
  placeCnt: number;
  placeExistence: boolean;
}

const dWidth = Dimensions.get('window').width;

const PlaceDetailScreen = ({navigation, route}: PlaceDetailScreenProps) => {
  const [placeDetails, setPlaceDetails] = useState<IPlace>();
  const [placeConveniences, setPlaceConveniences] = useState<
    PlaceConvenience[]
  >([]);
  const [isSaved, setIsSaved] = useState(true);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [folders, setFolders] = useState<any[]>([]);
  const [defaultId, setDefaultId] = useState(0);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isSpotSaved, setIsSpotSaved] = useState(true);
  const [existingFolders, setExistingFolders] = useState<number[]>([]);

  useFocusEffect(() => {
    async function getDefaultId() {
      const res = await API.get('/folders/default');
      setDefaultId(res.data.id);
    }
    getDefaultId();
  });

  useEffect(() => {
    getPlaceDetail();
  }, []);

  useEffect(() => {
    async function getFolder() {
      const res = await API.get('/folders');
      setFolders(res.data.items);
    }
    getFolder();
  }, [navigation]);

  const getPlaceDetail = async () => {
    const {placeId} = route.params;
    const {data} = await API.get(`/places/${placeId}`);

    const tempPlaceInfo: IPlace = {
      id: data.id,
      name: data.name,
      address: data.address,
      simplifiedAddress: data.simplifiedAddress,
      roadAddress: data.roadAddress,
      phone: data.phone,
      category: Categories.FOOD, //todo
      latitude: data.latitude,
      longitude: data.longitude,
      categoryTags: data.primaryCategory,
      hashTags: data.customTags,
      openingHours: data.openingHours,
      googleMapsUri: data.googleMapsUri,
      linkedCollections: data.linkedCollections,
      placeImages: data.placeImages,
    };

    const tempPlaceConveniences = [];
    if (data.freeStreetParking || data.paidParkingLot || data.freeParkingLot) {
      tempPlaceConveniences.push(PlaceConvenience.PARK);
    }
    if (data.allowsDogs) {
      tempPlaceConveniences.push(PlaceConvenience.DOG);
    }
    if (data.takeout) {
      tempPlaceConveniences.push(PlaceConvenience.TAKEOUT);
    }
    if (data.delivery) {
      tempPlaceConveniences.push(PlaceConvenience.DELIVERY);
    }
    if (data.reservable) {
      tempPlaceConveniences.push(PlaceConvenience.RESERVATION);
    }
    if (data.goodForGroups) {
      tempPlaceConveniences.push(PlaceConvenience.GROUP);
    }
    setPlaceConveniences(tempPlaceConveniences);
    setPlaceDetails(tempPlaceInfo);
  };

  const fetchFoldersContainingPlace = async (placeId: number) => {
    try {
      const res = await API.get(`/places/${placeId}/folders`);

      const folderList = res.data.items;
      const folderIdsWithPlace = folderList
        .filter((folder: Folder) => folder.placeExistence)
        .map((folder: Folder) => folder.id);

      setExistingFolders(folderIdsWithPlace);
    } catch (error) {
      console.error('Error fetching folders containing place:', error);
    }
  };

  useEffect(() => {
    const {placeId} = route.params;
    if (isBottomSheetVisible) {
      fetchFoldersContainingPlace(placeId);
    }
  }, [isBottomSheetVisible]);

  const handleSpotUnsave = async () => {
    const {placeId} = route.params;
    try {
      await API.delete(`/folders/${defaultId}/folder-places`, {
        data: {placeIds: [placeId]},
      });
      setIsSpotSaved(false);
      setIsBottomSheetVisible(false);
    } catch (error) {
      console.error('Error unsaving spot:', error);
      Alert.alert('Error', 'An error occurred while unsaving the place.');
    }
  };

  const saveToSelectedFolder = async (folderId: number) => {
    try {
      const {placeId} = route.params;
      const requestBody = {
        placeIds: [placeId],
      };
      await API.post(`/folders/${folderId}/folder-places`, requestBody);
      setIsBottomSheetVisible(false);
      setSelectedFolderId(null);
    } catch (error) {
      console.error('Error saving to folder:', error);
      Alert.alert('Error', 'An error occurred while saving the place.');
    }
  };

  const removePlaceFromFolder = async (folderId: number) => {
    try {
      const {placeId} = route.params;
      await API.delete(`/folders/${folderId}/folder-places`, {
        data: {
          placeIds: [placeId],
        },
      });

      setExistingFolders(prevFolders =>
        prevFolders.filter(id => id !== folderId),
      );
    } catch (error) {
      console.error('Error removing place from folder:', error);
      Alert.alert(
        'Error',
        'An error occurred while removing the place from the folder.',
      );
    }
    setIsBottomSheetVisible(false);
  };

  const renderFolderItem = ({item}: {item: Folder}) => {
    const isFolderContainingPlace = existingFolders.includes(item.id);

    return (
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
          <Pressable
            onPress={() => {
              if (isFolderContainingPlace) {
                removePlaceFromFolder(item.id);
              } else {
                saveToSelectedFolder(item.id);
              }
            }}
            style={{marginLeft: 'auto'}}>
            {isFolderContainingPlace ? <CheckedSpot /> : <PlusIcon />}
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderTitleSection = () => {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.placeInfo}>
          <View>
            <Text style={styles.title}>{placeDetails?.name}</Text>
            <Text style={styles.subtitle}>{`${
              placeDetails?.simplifiedAddress
            } ${
              placeDetails?.categoryTags
                ? '| ' + placeDetails?.categoryTags
                : ''
            }`}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookmarkIcon}
            onPress={() => {
              setIsBottomSheetVisible(true);
            }}>
            {isSpotSaved ? <BookmarkIcon /> : <SpotUnSaveIcon />}
          </TouchableOpacity>
        </View>
        <HashTags hashtags={placeDetails?.hashTags} />
      </View>
    );
  };
  const renderTimeSection = () => {
    return (
      <View style={[styles.section, styles.flexRow]}>
        <View>
          <Text style={styles.sectionTitle}>영업시간</Text>
        </View>
        <View style={styles.timeSection}>
          {/*<Text style={styles.operationTime}>매일 10:00 - 18:30</Text>*/}
          {/*<Text style={styles.specialTimeText}>· 15:00 - 브레이크타임</Text>*/}
          {/*<Text style={styles.specialTimeText}>· 18:00 - 라스트오더</Text>*/}
          {placeDetails?.openingHours?.map((openingHour, index) => (
            <Text key={index} style={styles.operationTime}>
              {openingHour}
            </Text>
          ))}
        </View>
      </View>
    );
  };
  const renderPhoneSection = () => {
    return (
      <View style={[styles.section, styles.flexRow]}>
        <Text style={styles.sectionTitle}>전화번호</Text>
        <View style={[styles.flexRow, {alignItems: 'center'}]}>
          <PhoneIcon />
          <TouchableOpacity
            onPress={() => Linking.openURL(placeDetails?.phone || '')}>
            <Text style={styles.phoneNumber}>{placeDetails?.phone}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const openKakaoMap = (
    latitude: string,
    longitude: string,
    placeName: string,
  ) => {
    // 카카오 지도 앱의 URL 스킴과 웹 URL
    const KAKAO_MAP_URL = 'kakaomap://look?p='; // 목적지 좌표로 경로 안내
    const KAKAO_WEB_URL = 'https://map.kakao.com/link/map/';

    // 카카오 지도 앱 열기 시도
    const kakaoMapAppUrl = `${KAKAO_MAP_URL}${latitude},${longitude}&name=${placeName}`;

    Linking.canOpenURL(kakaoMapAppUrl)
      .then(supported => {
        if (supported) {
          // 카카오 지도 앱이 설치된 경우 앱으로 열기
          return Linking.openURL(kakaoMapAppUrl);
        } else {
          // 설치되어 있지 않은 경우 웹으로 열기
          const kakaoWebUrl = `${KAKAO_WEB_URL}${placeName},${latitude},${longitude}`;
          return Linking.openURL(kakaoWebUrl);
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error', '카카오 지도 앱을 열 수 없습니다.');
      });
  };

  const copyText = (textToCopy: string = '') => {
    Clipboard.setString(textToCopy); // 클립보드에 텍스트 복사
    Alert.alert('성공', '텍스트가 클립보드에 복사되었습니다!');
  };

  const handleToGoLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <ImageContainer
        imageUrl={placeDetails?.placeImages[0]?.url || ''}
        defaultImageUrl={require('../assets/unloaded-image.png')}
        width="100%"
        height={320}
      />
      <View style={styles.contentContainer}>
        {/* 카페 이름과 북마크 아이콘 */}
        {renderTitleSection()}

        {/* 영업시간 섹션 */}
        {renderTimeSection()}

        {/* 전화번호 섹션 */}
        {renderPhoneSection()}

        {/* 제공 서비스 섹션 */}
        <PlaceConvenienceSection placeConveniences={placeConveniences} />

        {/* 지도 섹션 */}
        <View style={[styles.section]}>
          <Text style={[styles.sectionTitle, {marginBottom: 10}]}>지도</Text>
          <View style={styles.mapImage}>
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => {
                openKakaoMap(
                  placeDetails?.latitude.toString() || '',
                  placeDetails?.longitude.toString() || '',
                  placeDetails?.name || '',
                );
              }}>
              <Text style={styles.overlayTitle}>
                탭하여 자세한 위치를 확인하세요!
              </Text>
            </TouchableOpacity>
            <NaverMapView
              style={{width: '100%', height: '100%'}}
              isShowLocationButton={false}
              isShowZoomControls={false}
              camera={{
                latitude: placeDetails?.latitude || 0,
                longitude: placeDetails?.longitude || 0,
              }}>
              <NaverMapMarkerOverlay
                // key={item.id}
                latitude={placeDetails?.latitude || 0}
                longitude={placeDetails?.longitude || 0}
                anchor={{x: 0.5, y: 1}}
                caption={{
                  text: placeDetails?.name || '',
                }}
                image={require('../assets/cafe-icon.png')}
              />
            </NaverMapView>
          </View>
          <View style={[styles.flexRow, {marginTop: 9}]}>
            <TouchableOpacity
              style={[styles.flexRow, {alignItems: 'center'}]}
              onPress={() => copyText(placeDetails?.roadAddress)}>
              <CopyIcon />
              <Text style={[styles.addressCopyText, {marginLeft: 4}]}>
                주소복사
              </Text>
            </TouchableOpacity>
            <View>
              {/*<Text style={styles.addressText}>{placeDetails?.address}</Text>*/}
              <Text style={styles.addressText}>
                {placeDetails?.roadAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* 내가 확인한 링크 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내가 확인한 링크</Text>
          {placeDetails?.linkedCollections.map(
            (link: ILinkCollection, index) => (
              <View key={index} style={styles.linkContainer}>
                {/*<Image source={{uri: link.icon}} style={styles.linkIcon} />*/}
                <View style={styles.linkIcon}>
                  {link.collectionType === 'INSTAGRAM' ? (
                    <InstaIcon />
                  ) : (
                    <NaverIcon />
                  )}
                </View>
                <View style={styles.linkInfo}>
                  <Text
                    style={styles.linkTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {link.content}
                  </Text>
                  <Text style={styles.linkDate}>조회 {link.updatedAt}</Text>
                </View>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => handleToGoLink(link.link)}>
                  <Text style={styles.linkButtonText}>바로가기</Text>
                </TouchableOpacity>
              </View>
            ),
          )}
        </View>
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
                  <Pressable
                    onPress={handleSpotUnsave}
                    style={{marginLeft: 'auto'}}>
                    {isSpotSaved ? <BookmarkIcon /> : <SpotUnSaveIcon />}
                  </Pressable>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerImage: {
    width: '100%',
    height: 320,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginTop: 18,
    paddingBottom: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  placeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '400',
    color: '#A4A4A4',
  },
  bookmarkIcon: {
    // 북마크 아이콘 스타일
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  section: {
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    fontSize: 14,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSection: {
    flexDirection: 'column',
    // justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  operationTime: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  specialTimes: {},
  specialTimeText: {},
  phoneNumber: {marginLeft: 6},
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 8,
    opacity: 0.3,
    position: 'absolute',
    zIndex: 100,
    padding: 16,
  },
  overlayTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  linkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  linkIcon: {
    width: 40,
    height: 40,
    marginRight: 9,
  },
  linkInfo: {
    flex: 1,
    marginRight: 34,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  linkDate: {
    fontSize: 13,
    fontWeight: '400',
    color: '#888',
  },
  linkButton: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#008AFF',
  },
  addressCopyText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#008AFF',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#A4A4A4',
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
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSheetContent: {
    height: '45%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  folderInfoContainer: {
    flexDirection: 'row',
    width: dWidth - 58,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
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
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
  },
});

export default PlaceDetailScreen;
