import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Linking,
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
import CopyIcon from '../assets/copy-icon.svg';
import PlaceConvenienceSection from '../component/PlaceConvenienceSection';
import {IPlace, PlaceConvenience} from '../recoil/place/atom';
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import {API} from '../api/base';
import {Categories} from '../recoil/category/atom';
import Clipboard from '@react-native-clipboard/clipboard';
import HashTags from '../component/HashTags';

export type PlaceDetailScreenProps = StackScreenProps<
  MapStackParamList,
  'PlaceDetail'
>;

const PlaceDetailScreen = ({navigation, route}: PlaceDetailScreenProps) => {
  const [placeDetails, setPlaceDetails] = useState<IPlace>();
  const [placeConveniences, setPlaceConveniences] = useState<
    PlaceConvenience[]
  >([]);

  useEffect(() => {
    getPlaceDetail();
  }, []);

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
      // category: data.,
      category: Categories.FOOD, //todo
      latitude: data.latitude,
      longitude: data.longitude,
      categoryTags: data.primaryCategory,
      hashTags: data.customTags,
      // region?: data., // todo
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

          {/*todo 로직 추가*/}
          <TouchableOpacity style={styles.bookmarkIcon}>
            <BookmarkIcon />
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

  return (
    <ScrollView style={styles.container}>
      {/* Header 이미지 */}
      <Image
        style={styles.headerImage}
        source={{uri: placeDetails?.placeImages[0].url}} // 여기에 이미지 URL 추가
        // source={require('../assets/unloaded-image.png')} // 여기에 이미지 URL 추가
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
          <Text style={styles.sectionTitle}>지도</Text>
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
          <View style={[styles.flexRow, {marginTop: 11}]}>
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
          {placeDetails?.linkedCollections.map((link: any, index) => (
            <View key={index} style={styles.linkContainer}>
              {/*<Image source={{uri: link.icon}} style={styles.linkIcon} />*/}
              <View style={styles.linkIcon}>
                <InstaIcon />
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
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkButtonText}>바로가기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
    marginTop: 24,
    paddingBottom: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  placeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
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
  },
  section: {
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    fontSize: 14.5,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeSection: {
    flexDirection: 'column',
    // justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  operationTime: {
    fontSize: 14.5,
    fontWeight: '400',
    marginBottom: 9,
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
});

export default PlaceDetailScreen;
