import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LocationIcon from '../assets/location-icon.svg';
import SaveFinIcon from '../assets/save-fin-icon.svg';
import BookmarkIcon from '../assets/bookmark-icon.svg';

import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useState} from 'react';
import {IPlace} from '../recoil/place/atom';
import {useRecoilState, useRecoilValue} from 'recoil';
import placeWithFilter from '../recoil/place/withFilter';
import categoryAtom from '../recoil/category';
import {Categories} from '../recoil/category/atom';
import folderAtom, {
  folderWithSelected,
  selectedFolderAtom,
} from '../recoil/folder';
import {IFolder} from '../recoil/folder/atom';
import ShareButton from './ShareButton';

export interface IPlaceBottomSheet {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

type Mode = 'SAVED_PLACED' | 'FOLDER';
const PlaceBottomSheet = (props: IPlaceBottomSheet) => {
  const {bottomSheetModalRef} = props;
  const filteredPlace: IPlace[] = useRecoilValue(placeWithFilter);
  const categories: Categories[] = useRecoilValue(categoryAtom);
  const folders: IFolder[] = useRecoilValue(folderAtom);
  const [selectedFolderIndex, setSelectedFolderIndex] =
    useRecoilState(selectedFolderAtom);
  const selectedFolder: IFolder | null = useRecoilValue(folderWithSelected);

  const [mode, setMode] = useState<Mode>('SAVED_PLACED');
  // variables
  const snapPoints = useMemo(() => ['25%', '80%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleTabPress = (selectedMode: Mode) => {
    setMode(selectedMode);
  };

  const renderTopSection = () => {
    return (
      <View style={styles.topSectionContainer}>
        <View style={styles.topSectionInfo}>
          <Text style={styles.topSectionTitle}>파일 이름</Text>
          <View style={styles.topSectionSubTitleContainer}>
            <BookmarkIcon />
            <Text style={styles.topSectionSubTitle}>저장한 장소 · 38</Text>
          </View>
        </View>
        <ShareButton />
      </View>
    );
  };

  const renderMode = () => {
    if (categories.length > 0) {
      return null;
    }

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
    if (mode === 'SAVED_PLACED') {
      return renderSavedPlace();
    } else if (mode === 'FOLDER') {
      return renderFolder();
    }
    return null;
  };

  const renderSavedPlace = () => {
    const renderItem = ({item}: {item: (typeof filteredPlace)[0]}) => (
      <View style={styles.card}>
        <Image
          // source={{uri: item.imageUrl}}
          source={require('../assets/test-place.png')}
          style={styles.image}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    );

    return (
      <FlatList
        data={filteredPlace}
        renderItem={renderItem}
        keyExtractor={item => 'place_' + item.id.toString()}
        key={mode === 'SAVED_PLACED' ? 'two-columns' : 'one-column'} // key 값 변경으로 재렌더링 유도
        contentContainerStyle={styles.bottomSheetScrollViewContent}
        numColumns={2} // 2열 그리드 형식으로 표시
        columnWrapperStyle={styles.gridContainer} // 열 사이 간격 조절
      />
    );
  };

  const renderFolder = () => {
    const renderItem = ({item}: {item: IFolder}) => (
      <TouchableOpacity onPress={() => setSelectedFolderIndex(item.id)}>
        <View style={styles.itemContainer}>
          <Image
            source={require('../assets/test-place.png')}
            style={styles.itemImage}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.itemSubtitleContainer}>
              <BookmarkIcon />
              <Text style={styles.itemSubtitle}>
                저장한 장소 · {item.totalCount}
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
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.contentContainer}>
        <View>
          {renderMode()}
          {renderTopSection()}
          {renderContent()}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
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

  listContent: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: 1000,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtitleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },

  topSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  topSectionInfo: {},
  topSectionTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  topSectionSubTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  topSectionSubTitle: {
    fontSize: 14,
    fontWeight: 400,
    color: '#A4A4A4',
    marginLeft: 5,
  },
});

export default PlaceBottomSheet;
