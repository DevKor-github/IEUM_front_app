import {StyleSheet, Text, View} from 'react-native';

import {PlaceConvenience} from '../recoil/place/atom';
// icon
import DeliveryIcon from '../assets/place/delivery-icon.svg';
import DeliverySelectedIcon from '../assets/place/delivery-selected-icon.svg';
import DogIcon from '../assets/place/dog-icon.svg';
import DogSelectedIcon from '../assets/place/dog-selected-icon.svg';
import GroupIcon from '../assets/place/group-icon.svg';
import GroupSelectedIcon from '../assets/place/group-selected-icon.svg';
import ParkIcon from '../assets/place/park-icon.svg';
import ParkSelectedIcon from '../assets/place/park-selected-icon.svg';
import ReservationIcon from '../assets/place/reservation-icon.svg';
import ReservationSelectedIcon from '../assets/place/reservation-selected-icon.svg';
import TakeAwayIcon from '../assets/place/take-away-icon.svg';
import TakeAwaySelectedIcon from '../assets/place/take-away-selected-icon.svg';

import React from 'react';

export interface PlaceConvenienceSection {
  placeConveniences: PlaceConvenience[];
}

const PlaceConvenienceSection = (props: PlaceConvenienceSection) => {
  const {placeConveniences} = props;

  // Example mapping of conveniences to their corresponding icons and labels
  const convenienceMap = {
    [PlaceConvenience.PARK]: {
      icon: <ParkIcon />,
      selectedIcon: <ParkSelectedIcon />,
      label: PlaceConvenience.PARK,
    },
    [PlaceConvenience.DOG]: {
      icon: <DogIcon />,
      selectedIcon: <DogSelectedIcon />,
      label: PlaceConvenience.DOG,
      // label: '반려동물',
    },
    [PlaceConvenience.GROUP]: {
      icon: <GroupIcon />,
      selectedIcon: <GroupSelectedIcon />,
      // label: '단체',
    },
    [PlaceConvenience.TAKEOUT]: {
      icon: <TakeAwayIcon />,
      selectedIcon: <TakeAwaySelectedIcon />,
      // label: '포장',
    },
    [PlaceConvenience.DELIVERY]: {
      icon: <DeliveryIcon />,
      selectedIcon: <DeliverySelectedIcon />,
      // label: '배달',
    },
    [PlaceConvenience.RESERVATION]: {
      icon: <ReservationIcon />,
      selectedIcon: <ReservationSelectedIcon />,
      // label: '예약',
    },
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>제공서비스</Text>
      <View style={styles.serviceIcons}>
        {(
          Object.keys(convenienceMap) as Array<keyof typeof convenienceMap>
        ).map(key => {
          const isSelected = placeConveniences.includes(
            key as PlaceConvenience,
          );
          const {icon, selectedIcon} = convenienceMap[key];

          return (
            <View key={key} style={styles.serviceIcon}>
              {isSelected ? selectedIcon : icon}
              <Text
                style={[
                  styles.serviceText,
                  isSelected && styles.selectedServiceText,
                ]}>
                {key}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  serviceIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  serviceIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 21,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 10,
    color: '#D9D9D9',
  },
  selectedServiceText: {
    color: '#121212',
  },
});

export default PlaceConvenienceSection;
