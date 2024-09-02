import React from 'react';
import {
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
import PlaceConvenienceSection from '../component/PlaceConvenienceSection';
import {IPlace, PlaceConvenience} from '../recoil/place/atom';
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';

export type PlaceDetailScreenProps = StackScreenProps<
  MapStackParamList,
  'PlaceDetail'
>;

const links = [
  {
    icon: 'https://example.com/blog-icon.png', // 블로그 아이콘 URL
    title:
      '눈치 안 보고 노트북 할 수 있는 공간입니다. 너무 좋네요 하하하하하ㅏ하ㅏ',
    date: '2024-08-10',
    link: 'https://example.com/blog-link',
  },
  {
    icon: 'https://example.com/instagram-icon.png', // 인스타그램 아이콘 URL
    title: '비내리는 장마, 무더운 여름날씨에 가기 좋은 장소이네요.',
    date: '2024-08-10',
    link: 'https://example.com/instagram-link',
  },
];

const PlaceDetailScreen = ({navigation, route}: PlaceDetailScreenProps) => {
  const renderTitleSection = () => {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.placeInfo}>
          <View>
            <Text style={styles.title}>커피 스케치</Text>
            <Text style={styles.subtitle}>제주 서귀포시 | 카페, 디저트</Text>
          </View>
          <TouchableOpacity style={styles.bookmarkIcon}>
            <BookmarkIcon />
          </TouchableOpacity>
        </View>
        <Text>#대형카페</Text>
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
          <Text style={styles.operationTime}>매일 10:00 - 18:30</Text>
          <Text style={styles.specialTimeText}>· 15:00 - 브레이크타임</Text>
          <Text style={styles.specialTimeText}>· 18:00 - 라스트오더</Text>
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
            onPress={() => Linking.openURL('tel:0507-1402-1228')}>
            <Text style={styles.phoneNumber}>0507-1402-1228</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header 이미지 */}
      <Image
        style={styles.headerImage}
        // source={{uri: 'https://example.com/your-image-url.jpg'}} // 여기에 이미지 URL 추가
        source={require('../assets/unloaded-image.png')} // 여기에 이미지 URL 추가
      />

      <View style={styles.contentContainer}>
        {/* 카페 이름과 북마크 아이콘 */}
        {renderTitleSection()}

        {/* 영업시간 섹션 */}
        {renderTimeSection()}

        {/* 전화번호 섹션 */}
        {renderPhoneSection()}

        {/* 제공 서비스 섹션 */}
        <PlaceConvenienceSection placeConveniences={[PlaceConvenience.DOG]} />

        {/* 지도 섹션 */}
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>지도</Text>
          <View style={styles.mapImage}>
            <View style={styles.overlay}>
              <Text style={styles.overlayTitle}>
                탭하여 자세한 위치를 확인하세요!
              </Text>
            </View>
            <NaverMapView
              style={{width: '100%', height: '100%'}}
              isShowLocationButton={false}
              isShowZoomControls={false}>
              <NaverMapMarkerOverlay
                // key={item.id}
                latitude={37.359972}
                longitude={127.104916}
                anchor={{x: 0.5, y: 1}}
                caption={{
                  text: '장소 이름',
                }}
                image={require('../assets/cafe-icon.png')}
              />
            </NaverMapView>
          </View>
        </View>

        {/* 내가 확인한 링크 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내가 확인한 링크</Text>
          {links.map((link, index) => (
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
                  {link.title}
                </Text>
                <Text style={styles.linkDate}>조회 {link.date}</Text>
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
});

export default PlaceDetailScreen;
