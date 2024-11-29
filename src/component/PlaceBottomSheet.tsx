import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LocationIcon from '../assets/location-icon.svg';
import SaveFinIcon from '../assets/save-fin-icon.svg';
import BookmarkIcon from '../assets/bookmark-filled-icon.svg';
import CloseIcon from '../assets/close-icon.svg';
import CurrentLocationIcon from '../assets/current-location-icon.svg';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import placeAtom, {IPlace} from '../recoil/place/atom';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import categoryAtom from '../recoil/category';
import {Categories, mapServerCategoryToEnum} from '../recoil/category/atom';
import folderAtom, {
  folderWithSelected,
  selectedFolderAtom,
} from '../recoil/folder';
import {IFolder} from '../recoil/folder/atom';
import ShareButton from './ShareButton';
import PlaceList from './PlaceList';
import CircleButton from './CircleButton';
import regionAtom from '../recoil/region';
import {Regions} from '../recoil/region/atom';
import {API} from '../api/base';
import ImageContainer from './ImageContainer';

export interface IPlaceBottomSheet {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  pressPlace: (index: number) => void;
}

type Mode = 'SAVED_PLACED' | 'FOLDER';
const PlaceBottomSheet = (props: IPlaceBottomSheet) => {
  const {bottomSheetModalRef, isModalOpen, setIsModalOpen} = props;
  // const filteredPlace: IPlace[] = useRecoilValue(placeWithFilter);
  const categories: Categories[] = useRecoilValue(categoryAtom);
  const regions: Regions[] = useRecoilValue(regionAtom);

  const setSelectedFolderIndex = useSetRecoilState(selectedFolderAtom);
  const selectedFolder = useRecoilValue(folderWithSelected);
  const [folders, setFolders] = useRecoilState(folderAtom);
  // const placeInFolder = useRecoilValue(placeWithFolder);

  const [places, setPlaces] = useRecoilState(placeAtom);

  const [mode, setMode] = useState<Mode>('SAVED_PLACED');
  const [cursor, setCursor] = useState<number>(-1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [statesReady, setStatesReady] = useState(false); // New state to track when updates are done

  const [loading, setLoading] = useState<boolean>(false);

  const [placeInFolder, setPlaceInFolder] = useState<IPlace[]>([]);
  const [folderCursor, setFolderCursor] = useState<number>(-1);
  const [hasNextPageFolderPlace, setHasNextPageFolderPlace] =
    useState<boolean>(true);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['25%', '85%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsModalOpen(false); // Modal is closed
      // props.setIsModalOpen(false);
    } else {
      setIsModalOpen(true); // Modal is open
      // props.setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    // getPlaceList();
    getFolderList();
  }, []);
  useEffect(() => {
    // Reset the states
    setHasNextPage(true);
    setCursor(-1);
    setPlaces([]);

    // Indicate that states have been set
    setStatesReady(true);

    console.log(categories);
  }, [categories, regions]); // Runs when `categories` changes

  // Another effect for calling `getPlaceList` once the states are updated
  useEffect(() => {
    if (statesReady) {
      getPlaceList(categories, regions);
      setStatesReady(false); // Reset statesReady to prevent future triggers
    }
  }, [statesReady, categories, regions]); // Runs when `statesReady` is true

  useEffect(() => {
    if (props.isModalOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  });
  const getFolderList = async () => {
    const res = await API.get('/folders');
    const {items} = res.data;
    const folderList: IFolder[] = items.map((item: any) => {
      return {
        id: item.id,
        title: item.name,
        imageUrl: '',
        totalCount: item.placeCnt,
      };
    });
    console.log(folderList);
    setFolders(folderList);
  };

  const getPlaceList = async (
    categoryList: Categories[] = [],
    regionList: Regions[] = [],
  ) => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    const params = new URLSearchParams();
    params.append('take', '10');
    // let params: {take: number; cursorId?: number} = {take: 10};

    if (cursor > 0) {
      // params = {...params, cursorId: cursor};
      params.append('cursorId', cursor.toString());
    }
    if (categoryList && categoryList?.length > 0) {
      categoryList?.forEach(category =>
        params.append('categoryList', category),
      );
    }
    if (regionList && regionList?.length > 0) {
      regionList?.forEach(region => params.append('addressList', region));
    }

    API.get(`/folders/default/places-list?${params.toString()}`)
      .then(res => {
        const {items, meta} = res.data;
        setHasNextPage(meta.hasNextPage);
        setCursor(meta.nextCursorId);
        const placeList: IPlace[] = items.map((place: any) => {
          const markerCategory = mapServerCategoryToEnum(place.ieumCategory);
          return {
            id: place.id,
            name: place.name, // Name of the place
            category: markerCategory, // Category of the place, e.g., "Restaurant"
            simplifiedAddress: place.simplifiedAddress, // Category of the place, e.g., "Restaurant"
            placeImages: [
              {
                url: place.imageUrl,
                authorName: '',
                authorUri: '',
              },
            ],
          };
        });
        setPlaces(prev => [...prev, ...placeList]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTabPress = (selectedMode: Mode) => {
    setMode(selectedMode);
  };

  const renderTopSection = () => {
    if (categories.length > 0 || regions.length > 0) {
      return (
        <View style={styles.filteredTopSectionContainer}>
          <View style={styles.topSectionInfo}>
            <View style={styles.topSectionSubTitleContainer}>
              <BookmarkIcon />
              <Text style={styles.topSectionSubTitle}>
                저장한 장소 · {places.length}곳
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (!selectedFolder) {
      return renderMode();
    }

    return (
      <View style={styles.topSectionContainer}>
        <View style={styles.topSectionInfo}>
          <Text style={styles.topSectionTitle}>{selectedFolder.title}</Text>
          <View style={styles.topSectionSubTitleContainer}>
            <BookmarkIcon />
            <Text style={styles.topSectionSubTitle}>
              저장한 장소 · {selectedFolder.totalCount}곳
            </Text>
          </View>
        </View>
        <ShareButton />
      </View>
    );
  };

  const renderMode = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            mode === 'SAVED_PLACED' && styles.selectedTab,
          ]}
          onPress={() => handleTabPress('SAVED_PLACED')}>
          <LocationIcon />
          <Text style={styles.tabText}>저장된 장소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, mode === 'FOLDER' && styles.selectedTab]}
          onPress={() => handleTabPress('FOLDER')}>
          <SaveFinIcon />
          <Text style={styles.tabText}>내 보관함</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (selectedFolder) {
      return (
        <PlaceList
          placeList={placeInFolder}
          onPress={index => {
            props.pressPlace(index);
          }}
          loading={loading}
          load={() => getPlaceInFolder(selectedFolder?.id)}
        />
      );
    }

    if (mode === 'SAVED_PLACED') {
      return renderSavedPlace();
    } else if (mode === 'FOLDER') {
      return renderFolder();
    }
    return null;
  };

  const renderSavedPlace = () => {
    return (
      <PlaceList
        placeList={places}
        onPress={index => {
          props.pressPlace(index);
        }}
        loading={loading}
        load={getPlaceList}
      />
    );
  };

  const getPlaceInFolder = (id: number) => {
    if (loading || !hasNextPageFolderPlace) return;

    setLoading(true);
    let params: {take: number; cursorId?: number} = {take: 10};

    if (folderCursor > 0) {
      params = {...params, cursorId: folderCursor};
    }

    API.get(`/folders/${id}/places-list`, {params})
      .then(res => {
        const {items, meta} = res.data;
        setHasNextPageFolderPlace(meta.hasNextPage);
        setFolderCursor(meta.nextCursorId);
        const placeList: IPlace[] = items.map((place: any) => {
          const markerCategory = mapServerCategoryToEnum(place.ieumCategory);
          return {
            id: place.id,
            name: place.name, // Name of the place
            category: markerCategory, // Category of the place, e.g., "Restaurant"
            simplifiedAddress: place.simplifiedAddress, // Category of the place, e.g., "Restaurant"
            placeImages: [
              {
                url: place.imageUrl,
                authorName: '',
                authorUri: '',
              },
            ],
          };
        });
        setPlaceInFolder(prev => [...prev, ...placeList]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pressFolder = (id: number) => {
    setFolderCursor(-1);
    setHasNextPageFolderPlace(true);
    setSelectedFolderIndex(id);
    getPlaceInFolder(id);
  };

  const handleCloseFolder = () => {
    setSelectedFolderIndex(null);
    setPlaceInFolder([]);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        onPress={handleCloseFolder}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),

    [],
  );

  const renderFolder = () => {
    const renderItem = ({item}: {item: IFolder}) => (
      <TouchableOpacity onPress={() => pressFolder(item.id)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemImage}>
            <ImageContainer
              imageUrl={item?.imageUrl}
              defaultImageUrl={require('../assets/unloaded-image.png')}
              width={50}
              height={50}
              borderRadius={5}
            />
          </View>

          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.itemSubtitleContainer}>
              <BookmarkIcon />
              <Text style={styles.itemSubtitle}>
                저장한 장소 · {item.totalCount}곳
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={item => 'folder_' + item.id.toString()}
        key={mode === 'SAVED_PLACED' ? 'two-columns' : 'one-column'} // key 값 변경으로 재렌더링 유도
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <>
      {selectedFolder && isModalOpen && (
        <View style={styles.floatButtonContainer}>
          <CircleButton onPress={handleCloseFolder} icon={CloseIcon} />
        </View>
      )}

      {isModalOpen && (
        <View style={styles.floatCurrentLocationButtonContainer}>
          <CircleButton
            onPress={() => console.log('click')}
            icon={CurrentLocationIcon}
          />
        </View>
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.contentContainer}>
          <View>
            {renderTopSection()}
            {renderContent()}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginHorizontal: 24,
    backgroundColor: '#FFEAEE',
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 16,
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

  listContent: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: 1000,
    height: 70,
  },
  itemImage: {
    marginRight: 10,
  },
  itemTextContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  filteredTopSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: 24,
    marginTop: 15,
    marginBottom: 8,
  },
  topSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: 24,
    marginTop: 15,
    marginBottom: 8,
  },
  topSectionInfo: {},
  topSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  topSectionSubTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  topSectionSubTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A4A4A4',
    marginLeft: 5,
  },

  floatButtonContainer: {
    position: 'absolute',
    right: 24,
    top: 60,
    zIndex: 9000,
  },
  floatCurrentLocationButtonContainer: {
    position: 'absolute',
    right: 24,
    bottom: 230, // todo 위치
  },
});

export default PlaceBottomSheet;
