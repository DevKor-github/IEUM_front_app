import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {TravelStackParamList} from '../../types';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

export type TravelScreenProps = StackScreenProps<
  TravelStackParamList,
  'Travel'
>;

const dHeight = Dimensions.get('window').height;

const TravelScreen = ({navigation, route}: TravelScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{paddingTop: 35}}>
          <Text
            style={{fontSize: 23, fontWeight: 700, fontFamily: 'Pretendard'}}>
            여행 만들기
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
});

export default TravelScreen;
