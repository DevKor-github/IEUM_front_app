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
import {HomeStackParamList} from '../../types';
import LinkRejectLogo from '../assets/link-reject-logo.svg';

export type LinkRejectScreenProps = StackScreenProps<
  HomeStackParamList,
  'LinkReject'
>;

const dHeight = Dimensions.get('window').height;

const LinkRejectScreen = ({navigation, route}: LinkRejectScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{paddingTop: dHeight * 0.27}}>
          <LinkRejectLogo />
        </View>
        <View style={{paddingTop: 20}}>
          <Text style={{fontSize: 18, fontWeight: '600', lineHeight: 23}}>
            존재하지 않는 링크입니다 😢
          </Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={styles.nextButton}>
          <Text style={styles.nextButtonText}>홈으로 돌아가기</Text>
        </Pressable>
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
  nextButton: {
    marginTop: 32,
    width: 153,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5570',
    borderRadius: 5,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    lineHeight: 23,
  },
});

export default LinkRejectScreen;
