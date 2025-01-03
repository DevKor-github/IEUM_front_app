import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import {StackScreenProps} from '@react-navigation/stack';
import {MapStackParamList} from '../../types';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import FilterIcon from '../assets/filter-icon.svg';
import SelectedFilterIcon from '../assets/selected-filter-icon.svg';
import TabIcon from '../assets/tab-icon.svg';
import CurrentLocationIcon from '../assets/current-location-icon.svg';

// marker svg
import AlcoholMarkerIcon from '../assets/marker/alcohol.svg';
import SelectedAlcoholMarkerIcon from '../assets/marker/alcohol-selected.svg';
import FoodMarkerIcon from '../assets/marker/food.svg';
import SelectedFoodMarkerIcon from '../assets/marker/food-selected.svg';
import CafeMarkerIcon from '../assets/marker/cafe.svg';
import SelectedCafeMarkerIcon from '../assets/marker/cafe-selected.svg';
import MuseumMarkerIcon from '../assets/marker/museum.svg';
import SelectedMuseumMarkerIcon from '../assets/marker/museum-selected.svg';
import StayMarkerIcon from '../assets/marker/stay.svg';
import SelectedStayMarkerIcon from '../assets/marker/stay-selected.svg';
import ShoppingMarkerIcon from '../assets/marker/shopping.svg';
import SelectedShoppingMarkerIcon from '../assets/marker/shopping-selected.svg';
import OtherMarkerIcon from '../assets/marker/others.svg';
import SelectedOtherMarkerIcon from '../assets/marker/others-selected.svg';

import {useRecoilState, useRecoilValue} from 'recoil';
import placeAtom from '../recoil/place/atom';
import SelectButton from '../component/SelectButton';
import categoryAtom, {
  Categories,
  mapServerCategoryToEnum,
} from '../recoil/category/atom';
import CircleButton from '../component/CircleButton';
import PlaceBottomSheet from '../component/PlaceBottomSheet';
import {folderWithSelected} from '../recoil/folder';
import FilterBottomSheet from '../component/FilterBottomSheet';
import regionAtom from '../recoil/region';
import {API} from '../api/base';
import markerAtom, {IMarker} from '../recoil/marker/atom';
import {Regions} from '../recoil/region/atom';
import SummaryCard from '../component/SummaryCard';
import {useFocusEffect} from '@react-navigation/native';

export type MapScreenProps = StackScreenProps<MapStackParamList, 'Map'>;

const MapScreen = ({navigation, route}: MapScreenProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const filterBottomSheetModalRef = useRef<BottomSheetModal>(null);

  // const places: IPlace[] = useRecoilValue(placeAtom);
  const selectedFolder = useRecoilValue(folderWithSelected);
  const regions = useRecoilValue(regionAtom);
  const places = useRecoilValue(placeAtom);

  const [categories, setCategories] = useRecoilState(categoryAtom);
  const [markers, setMarkers] = useRecoilState(markerAtom);

  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(-1);
  const [isOpenModal, setIsOpenModal] = useState(true);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
  const [initialLocation, setInitialLocation] = useState({});

  useFocusEffect(
    useCallback(() => {
      getMarkerList(categories, regions);
    }, [categories, regions]),
  );

  const getMarkerList = async (
    categoryList: Categories[] = [],
    regionList: Regions[] = [],
  ) => {
    const params = new URLSearchParams();
    if (categoryList && categoryList?.length > 0) {
      categoryList?.forEach(category =>
        params.append('categoryList', category),
      );
    }
    if (regionList && regionList?.length > 0) {
      regionList?.forEach(region => params.append('addressList', region));
    }

    const res = await API.get(`/folders/default/markers?${params.toString()}`);
    const {items} = res.data;
    const markerList: IMarker[] = items.map((marker: any) => {
      const markerCategory = mapServerCategoryToEnum(marker.ieumCategory);
      return {
        id: marker.id,
        name: marker.name, // Name of the place
        category: markerCategory, // Category of the place, e.g., "Restaurant"
        latitude: marker.latitude, // Latitude as a string
        longitude: marker.longitude, // Longitude as a string
      };
    });
    setMarkers(markerList);
    setInitialLocation({
      latitude: markerList[0]?.latitude, // todo marker 없는 경우
      longitude: markerList[0]?.longitude,
      zoom: 13,
    });
  };

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
    // let open = false;
    if (selectedMarkerIndex === index) {
      index = -1;
      // open = true;
    }
    // setIsOpenModal(open);
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
          <View style={{marginRight: 4}}>
            <SelectButton
              index={-1}
              isSelected={categories.length !== 0 || regions.length !== 0}
              onPress={handlePresentFilterModalPress}
              text={'필터'}
              icon={
                categories.length !== 0 || regions.length !== 0
                  ? SelectedFilterIcon
                  : FilterIcon
              }
              selectedStyle={{
                selectedButton: styles.selectedFilter,
                selectedButtonText: styles.selectedFilterText,
              }}
            />
          </View>
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

  const getIconByCategory = (
    category: Categories,
    selected: boolean = false,
  ) => {
    switch (category) {
      case Categories.FOOD:
        return selected ? <SelectedFoodMarkerIcon /> : <FoodMarkerIcon />;
      case Categories.CAFE:
        return selected ? <SelectedCafeMarkerIcon /> : <CafeMarkerIcon />;
      case Categories.ALCOHOL:
        return selected ? <SelectedAlcoholMarkerIcon /> : <AlcoholMarkerIcon />;
      case Categories.MUSEUM:
        return selected ? <SelectedMuseumMarkerIcon /> : <MuseumMarkerIcon />;
      case Categories.STAY:
        return selected ? <SelectedStayMarkerIcon /> : <StayMarkerIcon />;
      case Categories.SHOPPING:
        return selected ? (
          <SelectedShoppingMarkerIcon />
        ) : (
          <ShoppingMarkerIcon />
        );
      default:
        return selected ? <SelectedOtherMarkerIcon /> : <OtherMarkerIcon />;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <BottomSheetModalProvider>
          <NaverMapView
            style={{flex: 1}}
            isShowLocationButton={false}
            isShowZoomControls={false}
            camera={initialLocation as Camera}>
            {markers.map((item: IMarker) => (
              <NaverMapMarkerOverlay
                key={item.id}
                latitude={item.latitude}
                longitude={item.longitude}
                onTap={() => handleMarkerPress(item.id)}
                anchor={{x: 0.5, y: 1}}
                caption={{
                  text: item.name,
                }}
                width={20}
                height={20}>
                <View
                  key={`${item.id}_${item.id === selectedMarkerIndex}`}
                  collapsable={false}
                  style={{width: 50, height: 50}}>
                  {getIconByCategory(
                    item.category,
                    item.id === selectedMarkerIndex,
                  )}
                </View>
              </NaverMapMarkerOverlay>
            ))}
          </NaverMapView>

          {renderFilterSection()}
          <View style={styles.floatButtonContainer}>
            <CircleButton onPress={handlePresentModalPress} icon={TabIcon} />
            {!isOpenModal && (
              <CircleButton
                onPress={handlePresentModalPress}
                icon={CurrentLocationIcon}
              />
            )}
          </View>
          {selectedMarkerIndex !== -1 && (
            <SummaryCard
              placeId={selectedMarkerIndex}
              onClose={() => handleMarkerPress(selectedMarkerIndex)}
              onNavigate={id =>
                navigation.navigate('PlaceDetail', {placeId: id})
              }
            />
          )}

          <PlaceBottomSheet
            bottomSheetModalRef={bottomSheetModalRef}
            isModalOpen={isOpenModal}
            setIsModalOpen={setIsOpenModal}
            pressPlace={(index: number) =>
              navigation.navigate('PlaceDetail', {placeId: index})
            }
          />
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
    display: 'flex',
    flexDirection: 'column-reverse',
    // height: 80,
    gap: 11,
    position: 'absolute',
    right: 24,
    bottom: 120, // todo 위치
  },

  //placeCard
  placeCardContainer: {
    position: 'absolute',
    bottom: 100,
    width: '95%',
    // alignItems: 'center',
    // alignContent: 'center',
    // justifyContent: 'center',
  },
  placeCardCloseButton: {
    marginLeft: 'auto',
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
