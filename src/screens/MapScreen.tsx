import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useRef, useState} from 'react';
import FilterIcon from '../assets/filter-icon.svg';
import SelectedFilterIcon from '../assets/selected-filter-icon.svg';
import BookmarkIcon from '../assets/bookmark-selected-icon.svg';
import TabIcon from '../assets/tab-icon.svg';
import {useRecoilState, useRecoilValue} from 'recoil';
import placeWithFilter from '../recoil/place/withFilter';
import placeAtom, {IPlace} from '../recoil/place/atom';
import SelectButton from '../component/SelectButton';
import categoryAtom, {Categories} from '../recoil/category/atom';
import CircleButton from '../component/CircleButton';
import PlaceBottomSheet from '../component/PlaceBottomSheet';
import {folderWithSelected} from '../recoil/folder';
import FilterBottomSheet from '../component/FilterBottomSheet';
import regionAtom from '../recoil/region';

export type MapScreenProps = StackScreenProps<RootStackParamList, 'Map'>;

const MapScreen = ({navigation, route}: MapScreenProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const filterBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const places: IPlace[] = useRecoilValue(placeAtom);
  const filteredPlace: IPlace[] = useRecoilValue(placeWithFilter);
  const selectedFolder = useRecoilValue(folderWithSelected);

  const [categories, setCategories] = useRecoilState(categoryAtom);
  const regions = useRecoilValue(regionAtom);

  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(-1);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

  const handlePresentFilterModalPress = useCallback(() => {
    setIsOpenFilterModal(true);
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFilterPress = (category: Categories) => {
    setIsOpenFilterModal(false); // 혹시 모를 모달 열림 방지
    setCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(item => item !== category);
      }
      return [...prevCategories, category];
    });
  };

  const handleMarkerPress = (index: number) => {
    if (selectedMarkerIndex === index) {
      index = -1;
    }
    setSelectedMarkerIndex(index);
  };

  useEffect(() => {
    if (!bottomSheetModalRef.current) return;
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const renderFilterSection = () => {
    if (selectedFolder) return;
    return (
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <SelectButton
            index={-1}
            isSelected={categories.length !== 0}
            onPress={handlePresentFilterModalPress}
            text={'필터'}
            icon={categories.length !== 0 ? SelectedFilterIcon : FilterIcon}
            selectedStyle={{
              selectedButton: styles.selectedFilter,
              selectedButtonText: styles.selectedFilterText,
            }}
          />
          {Object.values(Categories).map(item => (
            <SelectButton
              key={item}
              index={-1}
              isSelected={categories.includes(item)}
              onPress={() => handleFilterPress(item)}
              text={item}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSummaryCard = (placeInfo: IPlace | undefined) => {
    if (!placeInfo) return;

    return (
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
            <Text style={styles.placeCardTitle}>{placeInfo.title}</Text>
            <Text style={styles.placeCardLocation}>{placeInfo.location}</Text>
            <Text style={styles.placeCardTags}>
              {placeInfo.hashtag.map(item => '#' + item).join(' ')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <BottomSheetModalProvider>
          <NaverMapView
            style={{flex: 1}}
            isShowLocationButton={false}
            isShowZoomControls={false}>
            {filteredPlace.map((item: IPlace) => (
              <NaverMapMarkerOverlay
                key={item.id}
                latitude={item.latitude}
                longitude={item.longitude}
                onTap={() => handleMarkerPress(item.id)}
                anchor={{x: 0.5, y: 1}}
                caption={{
                  text: item.title,
                }}
                image={require('../assets/cafe-icon.png')}
              />
            ))}
          </NaverMapView>

          {renderFilterSection()}
          {selectedMarkerIndex !== -1 &&
            renderSummaryCard(
              places.find(item => item.id === selectedMarkerIndex),
            )}
          <View style={styles.floatButtonContainer}>
            <CircleButton onPress={handlePresentModalPress} icon={TabIcon} />
          </View>

          <PlaceBottomSheet bottomSheetModalRef={bottomSheetModalRef} />
        </BottomSheetModalProvider>

        <FilterBottomSheet
          bottomSheetModalRef={filterBottomSheetModalRef}
          isOpenModal={isOpenFilterModal}
          onClose={() => setIsOpenFilterModal(false)}
          selectedCategory={categories}
          selectedRegion={regions}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
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
  selectedFilter: {
    borderWidth: 0.8, //todo 움직임 1.6
    borderColor: '#FF5570',
  },
  selectedFilterText: {
    color: '#FF5570',
  },

  // floatButtonContainer
  floatButtonContainer: {
    position: 'absolute',
    right: 24,
    bottom: 120, // todo 위치
    // bottom: 300, // todo 위치
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
    color: '#FF5570',
    // color: '#121212',
  },
  bookmarkIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginHorizontal: 15,
  },
});
export default MapScreen;
