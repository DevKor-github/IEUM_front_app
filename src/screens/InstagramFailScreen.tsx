import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import BackButton from '../assets/back-button.svg';

export type InstagramFailScreenProps = StackScreenProps<
  RootStackParamList,
  'InstagramFail'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const InstagramFailScreen = ({navigation, route}: InstagramFailScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('InstagramConnect');
            }}>
            <BackButton style={styles.backButton} />
          </Pressable>
          <Text style={styles.headerText}>회원가입</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 230,
          }}>
          <Text style={styles.titleText}>
            해당 아이디의 계정을 {'\n'}
            찾을 수 없습니다. 😢
          </Text>
          <Pressable
            onPress={() => navigation.navigate('InstagramConnect')}
            style={{
              marginTop: 40,
              width: 108,
              height: 37,
              borderRadius: 5,
              backgroundColor: '#FF5570',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, fontWeight: '600', color: 'white'}}>
              다시 시도
            </Text>
          </Pressable>
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
  header: {
    flexDirection: 'row',
    height: 52,
    width: dWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#1212140D',
    borderBottomWidth: 1,
  },
  backButton: {
    width: 16,
    height: 12,
    marginLeft: 24,
    marginRight: 130,
  },
  headerText: {
    fontSize: 17,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  nextButton: {
    position: 'absolute',
    width: 345,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5570',
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});

export default InstagramFailScreen;
