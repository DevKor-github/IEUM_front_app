import {StyleSheet, Text, View} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo} from 'react';

export interface IPlaceBottomSheet {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  isOpenModal: boolean;
  onClose: () => void;
}

const FilterBottomSheet = (props: IPlaceBottomSheet) => {
  const {bottomSheetModalRef} = props;
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['60%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      props.onClose();
    }
    // else {
    //   setIsModalOpen(true); // Modal is open
    // }
  }, []);

  useEffect(() => {
    if (props.isOpenModal) {
      bottomSheetModalRef.current?.present();
    }
  });
  const renderTopSection = () => {
    return <View style={styles.topSectionContainer}></View>;
  };

  const renderContent = () => {
    return (
      <View>
        <Text>test</Text>
      </View>
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0} // 이거 추가
        disappearsOnIndex={-1} // 이거 추가
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
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: 'lightblue', // 원하는 색상으로 변경
  },
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
    fontWeight: '700',
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
    top: 80, // todo 위치
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  secondModalContent: {
    alignItems: 'center',
  },
});

export default FilterBottomSheet;
