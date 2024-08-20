import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Categories} from '../recoil/category/atom';
import {useSetRecoilState} from 'recoil';
import categoryAtom from '../recoil/category';

import FilterIcon from '../assets/filter-icon.svg';
import CloseIcon from '../assets/close-icon.svg';
import SelectButton from './SelectButton';
import regionAtom, {Regions} from '../recoil/region/atom';

export interface IFilterBottomSheet {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  isOpenModal: boolean;
  onClose: () => void;
  selectedCategory: Categories[];
  selectedRegion: Regions[];
}

const FilterBottomSheet = (props: IFilterBottomSheet) => {
  const {selectedRegion, selectedCategory, bottomSheetModalRef, onClose} =
    props;

  // variables
  const snapPoints = useMemo(() => ['65%'], []);

  // const selectedCategories: Categories[] = useRecoilValue(categoryAtom);
  // const selectedRegions: Regions[] = useRecoilValue(regionAtom);
  //
  const setCategories = useSetRecoilState(categoryAtom);
  const setRegion = useSetRecoilState(regionAtom);

  const [localSelectedCategories, setLocalSelectedCategories] =
    useState<Categories[]>(selectedCategory);
  const [localSelectedRegions, setLocalSelectedRegions] =
    useState<Regions[]>(selectedRegion);

  // props 변경 감지 및 로컬 상태 업데이트
  useEffect(() => {
    setLocalSelectedCategories(selectedCategory);
    setLocalSelectedRegions(selectedRegion);
  }, [selectedCategory, selectedRegion]);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, []);

  useEffect(() => {
    if (props.isOpenModal) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  });

  useEffect(() => {
    console.log(localSelectedRegions);
    console.log(localSelectedCategories);
  }, []);
  const renderTopSection = () => {
    return (
      <View style={styles.topSectionContainer}>
        <View style={styles.topSection}>
          <View style={styles.topSectionFilterSection}>
            <FilterIcon />
            <Text style={styles.topSectionTitle}>필터</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.hr} />
      </View>
    );
  };

  const handleCategoryFilterPress = (category: Categories) => {
    setLocalSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(item => item !== category);
      }
      return [...prevCategories, category];
    });
  };

  const handleRegionFilterPress = (region: Regions) => {
    setLocalSelectedRegions(prevRegions => {
      if (prevRegions.includes(region)) {
        return prevRegions.filter(item => item !== region);
      }
      return [...prevRegions, region];
    });
  };

  const renderContent = () => {
    return (
      <View>
        {renderCategories()}
        {renderRegion()}
      </View>
    );
  };

  const renderCategories = () => {
    return (
      <View style={styles.toggleContainer}>
        <View style={styles.toggleTitleSection}>
          <Text style={styles.toggleTitle}>카테고리</Text>
        </View>
        <View style={styles.buttonContainer}>
          {Object.values(Categories).map(item => (
            <SelectButton
              key={item}
              index={-1}
              isSelected={localSelectedCategories.includes(item)}
              onPress={() => handleCategoryFilterPress(item)}
              text={item}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderRegion = () => {
    return (
      <View style={styles.toggleContainer}>
        <View style={styles.toggleTitleSection}>
          <Text style={styles.toggleTitle}>지역</Text>
        </View>
        <View style={styles.buttonContainer}>
          {Object.values(Regions).map(item => (
            <SelectButton
              key={item}
              index={-1}
              isSelected={localSelectedRegions.includes(item)}
              onPress={() => handleRegionFilterPress(item)}
              text={item}
            />
          ))}
        </View>
      </View>
    );
  };

  const handleResetFilter = () => {
    setLocalSelectedCategories([]);
    setLocalSelectedRegions([]);
  };
  const handleApplyFilter = () => {
    setCategories(localSelectedCategories);
    setRegion(localSelectedRegions);
    onClose();
  };

  const renderFooter = () => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetFilter}>
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilter}>
          <Text style={styles.applyButtonText}>필터 적용</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),

    [],
  );

  return (
    <>
      <BottomSheetModalProvider>
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
              {renderFooter()}
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topSectionContainer: {
    width: 'auto',
  },
  topSection: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  topSectionFilterSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topSectionTitle: {
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 16,
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 15,
  },
  toggleContainer: {
    // flex: 1,
    marginTop: 20,
  },
  toggleTitleSection: {
    marginBottom: 16,
  },
  toggleTitle: {
    fontWeight: '600',
    fontSize: 17,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 'auto',
    marginVertical: 20,
  },
  resetButton: {
    flex: 1,
    maxWidth: 110,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#C1C1C1',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF5570',
    padding: 15,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontWeight: '600',
    fontSize: 15,
    color: 'white',
  },
});

export default FilterBottomSheet;
