import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CircleButton from './CircleButton';
import ImageContainer from './ImageContainer';
import BookmarkIcon from '../assets/bookmark-selected-icon.svg';
import CloseIcon from '../assets/close-icon.svg';
import HashTags from './HashTags';
import {useRecoilValue} from 'recoil';
import placeAtom from '../recoil/place';
import {IPlace} from '../recoil/place/atom';
import {useEffect, useState} from 'react';
import {API} from '../api/base';
import {mapServerCategoryToEnum} from '../recoil/category/atom';

interface ISummaryCardProps {
  placeId: number;
  onClose: () => void;
  onNavigate: (id: number) => void;
}

const SummaryCard = (props: ISummaryCardProps) => {
  const {placeId, onClose, onNavigate} = props;
  const places = useRecoilValue(placeAtom);
  const [placeInfo, setPlaceInfo] = useState<IPlace | undefined>();

  useEffect(() => {
    let placeInfo = places.find(item => item.id === placeId);
    if (!placeInfo) {
      getPlacePreview(placeId).then(res => (placeInfo = res));
    }
    setPlaceInfo(placeInfo);
  }, [places, placeId]);

  const getPlacePreview = async (placeId: number): Promise<any> => {
    const res = await API.get(`/places/${placeId}/preview`);
    const {data} = res;

    const markerCategory = mapServerCategoryToEnum(data.ieumCategory);
    const placeList: any = {
      id: data.id,
      name: data.name, // Name of the place
      category: markerCategory, // Category of the place, e.g., "Restaurant"
      simplifiedAddress: data.simplifiedAddress, // Category of the place, e.g., "Restaurant"
      placeImages: [
        {
          url: data.imageUrl,
          authorName: '',
          authorUri: '',
        },
      ],
    };
    setPlaceInfo(placeList);
  };

  return placeInfo ? (
    <TouchableOpacity
      style={styles.placeCardContainer}
      onPress={() => onNavigate(placeInfo.id)}>
      <View style={styles.placeCardCloseButton}>
        <CircleButton onPress={onClose} icon={CloseIcon} />
      </View>
      <View style={styles.placeCard}>
        <View style={styles.placeCardImage}>
          <ImageContainer
            imageUrl={placeInfo.placeImages[0]?.url}
            defaultImageUrl={require('../assets/unloaded-image-v3.png')}
            width={120}
            height={130}
            borderRadius={10}
          />
        </View>
        <View style={styles.placeCardContent}>
          <View style={styles.bookmarkIcon}>
            <BookmarkIcon />
          </View>
          <View>
            <Text style={styles.placeCardTitle}>{placeInfo.name}</Text>
            <Text style={styles.placeCardLocation}>
              {placeInfo.simplifiedAddress}
            </Text>
          </View>
          <Text style={styles.placeCardTags}>
            <HashTags hashtags={placeInfo.hashTags} />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ) : (
    <></>
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
    marginBottom: 13,
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
export default SummaryCard;
