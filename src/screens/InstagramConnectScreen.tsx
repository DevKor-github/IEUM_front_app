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

export type InstagramConnectScreenProps = StackScreenProps<
  RootStackParamList,
  'InstagramConnect'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const InstagramConnectScreen = ({
  navigation,
  route,
}: InstagramConnectScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('PreferenceDone');
            }}>
            <BackButton style={styles.backButton} />
          </Pressable>
          <Text style={styles.headerText}>회원가입</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            인스타그램을 연동하면 게시글을 저장 시,{'\n'}이음 앱에서 확인할 수
            있어요! 🍀
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#C1C1C1',
              marginTop: 30,
              marginLeft: 24,
            }}>
            아이디
          </Text>
        </View>
        <View>
          <TextInput
            placeholder="인스타 아이디을 입력하세요."
            autoCapitalize="none"
            placeholderTextColor="deepGray"
            style={{
              width: 345,
              paddingBottom: 15,
              marginTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#C1C1C1',
              color: 'black',
              fontSize: 17,
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            height: dHeight - 175,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('SignUpDone');
            }}
            style={{borderBottomColor: '#A4A4A4', borderBottomWidth: 1}}>
            <Text style={{fontSize: 14, color: '#A4A4A4'}}>다음에 하기</Text>
          </Pressable>
        </View>
        <View
          style={{
            position: 'absolute',
            height: dHeight - 90,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('InstagramFail'); // 이후 수정
            }}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>다음</Text>
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
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: dWidth,
    marginTop: 65,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 24,
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

export default InstagramConnectScreen;
