import {
  Button,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FilterIcon from '../assets/filter-icon.svg';
import SelectedFilterIcon from '../assets/selected-filter-icon.svg';
import LocationIcon from '../assets/location-icon.svg';
import SaveFinIcon from '../assets/save-fin-icon.svg';
import BookmarkIcon from '../assets/bookmark-icon.svg';

export type MapScreenProps = StackScreenProps<RootStackParamList, 'Map'>;

const filters = [
  'FOOD',
  'CAFE',
  'ALCOHOL',
  'MUSEUM',
  'STAY',
  'SHOPPING',
  'OTHERS',
];
const data = [
  {
    id: '1',
    title: '장소 이름',
    location: '제주 서귀포시 | CAFE',
    imageUrl: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    title: '장소 이름',
    location: '제주 서귀포시 | CAFE',
    imageUrl: 'https://example.com/image2.jpg',
  },
  {
    id: '3',
    title: '장소 이름',
    location: '제주 서귀포시 | CAFE',
    imageUrl: 'https://example.com/image3.jpg',
  },
  {
    id: '4',
    title: '장소 이름',
    location: '제주 서귀포시 | CAFE',
    imageUrl: 'https://example.com/image4.jpg',
  },
];

const MapScreen = ({navigation, route}: MapScreenProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(-1);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(-1);
  // const filterBottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['25%', '80%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleFilterPress = (index: number) => {
    setSelectedFilterIndex(index);
  };

  const handleTabPress = (index: number) => {
    setSelectedTabIndex(index);
  };

  const handleMarkerPress = (index: number) => {
    if (selectedMarkerIndex === index) {
      index = -1;
    }
    setSelectedMarkerIndex(index);
  };

  const renderItem = (item: any) => (
    <View style={styles.card}>
      <Text>test</Text>
      {/*<Image source={{uri: item.imageUrl}} style={styles.image} />*/}
      {/*<Image*/}
      {/*  source={require('../assets/test-place.png')}*/}
      {/*  style={styles.image}*/}
      {/*/>*/}
      {/*<Text style={styles.title}>{item.title}</Text>*/}
      {/*<Text style={styles.location}>{item.location}</Text>*/}
    </View>
  );

  useEffect(() => {
    if (!bottomSheetModalRef.current) return;
    // bottomSheetModalRef.current.present();
  }, [bottomSheetModalRef]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <NaverMapView
            style={{flex: 1}}
            isShowLocationButton={false}
            isShowZoomControls={false}>
            <NaverMapMarkerOverlay
              latitude={37.359972}
              longitude={127.104916}
              onTap={() => handleMarkerPress(1)}
              anchor={{x: 0.5, y: 1}}
              caption={{
                text: 'test',
              }}
              // subCaption={{
              //   key: '1234',
              //   text: '123',
              // }}
              // image={{symbol: 'blue'}}
              image={require('../assets/cafe-icon.png')}
              // image={{assetName: 'CafeIcon'}}
              // width={10}
              // height={10}
            />
          </NaverMapView>
          {/*<ScrollView style={styles.filterContainer}>*/}
          {/*  <TouchableOpacity style={styles.filterButton}>*/}
          {/*    <Text>필터</Text>*/}
          {/*  </TouchableOpacity>*/}
          {/*</ScrollView>*/}
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              <TouchableOpacity
                key={-1}
                style={[
                  styles.button,
                  selectedFilterIndex !== -1 && styles.selectedFilter,
                ]}
                onPress={() => handleFilterPress(-1)}>
                {selectedFilterIndex === -1 ? (
                  <FilterIcon style={styles.filterIcon} />
                ) : (
                  <SelectedFilterIcon style={styles.filterIcon} />
                )}
                <Text
                  style={[
                    styles.buttonText,
                    selectedFilterIndex !== -1 && styles.selectedFilterText,
                  ]}>
                  필터
                </Text>
              </TouchableOpacity>
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    selectedFilterIndex === index && styles.selectedButton,
                  ]}
                  onPress={() => handleFilterPress(index)}>
                  <Text
                    style={[
                      styles.buttonText,
                      selectedFilterIndex === index &&
                        styles.selectedButtonText,
                    ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedMarkerIndex !== -1 && (
            <View style={styles.placeCardContainer}>
              <View style={styles.placeCard}>
                <Image
                  // source={{uri: 'https://example.com/image.jpg'}}
                  source={require('../assets/test-place.png')}
                  style={styles.placeCardImage}
                />
                <View style={styles.placeCardContent}>
                  <View style={styles.bookmarkIcon}>
                    <BookmarkIcon />
                  </View>
                  <Text style={styles.placeCardTitle}>오피스제주</Text>
                  <Text style={styles.placeCardLocation}>
                    제주 서귀포시 | CAFE
                  </Text>
                  <Text style={styles.placeCardTags}>
                    # 해시태그 # 해시태그
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <BottomSheetView style={styles.contentContainer}>
              <View>
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      selectedTabIndex === 0 && styles.selectedTab,
                    ]}
                    onPress={() => handleTabPress(0)}>
                    <LocationIcon />
                    <Text style={styles.tabText}>저장된 장소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      selectedTabIndex === 1 && styles.selectedTab,
                    ]}
                    onPress={() => handleTabPress(1)}>
                    <SaveFinIcon />
                    <Text style={styles.tabText}>내 보관함</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  contentContainerStyle={styles.bottomSheetScrollViewContent}>
                  <View style={styles.gridContainer}>
                    {data.map(item => (
                      <View key={item.id} style={styles.card}>
                        <Image
                          // source={{uri: item.imageUrl}}
                          source={require('../assets/test-place.png')}
                          style={styles.image}
                        />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.location}>{item.location}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },

  //top filter
  filterContainer: {
    position: 'absolute',
    top: 60,
    height: 100,
    // zIndex: 1000,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 23,
    marginHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 14,
  },
  filterIcon: {
    marginRight: 5,
  },
  selectedButton: {
    backgroundColor: '#FF5570',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  selectedFilter: {
    borderWidth: 1.6,
    borderColor: '#FF5570',
  },
  selectedFilterText: {
    color: '#FF5570',
  },

  //bottom sheet card
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginHorizontal: 24,
    backgroundColor: '#FFEAEE',
    borderRadius: 20,
    marginBottom: 20,
  },
  selectedTab: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#FF5570',
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  tabText: {
    color: '#FF5570',
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
  },

  bottomSheetScrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '49%',
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    marginBottom: 10,
    height: 218,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#888',
  },

  //placeCard
  placeCardContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: Dimensions.get('window').width * 0.9,
  },
  placeCardImage: {
    width: 120,
    height: 130,
    borderRadius: 10,
    marginRight: 15,
  },
  placeCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  placeCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  placeCardLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777',
    marginBottom: 18,
  },
  placeCardTags: {
    fontSize: 14,
    fontWeight: '400',
    // color: '#FF5570',
    color: '#121212',
  },
  bookmarkIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginHorizontal: 15,
  },
});
export default MapScreen;
