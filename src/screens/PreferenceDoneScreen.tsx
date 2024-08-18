import {useEffect} from 'react';
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
import {RootStackParamList} from '../../types';
import {useRecoilValue} from 'recoil';
import userInfoAtom from '../recoil/user/index';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';

export type PreferenceDoneScreenProps = StackScreenProps<
  RootStackParamList,
  'PreferenceDone'
>;

const dHeight = Dimensions.get('window').height;

const PreferenceDoneScreen = ({
  navigation,
  route,
}: PreferenceDoneScreenProps) => {
  const userInfo = useRecoilValue(userInfoAtom);

  useEffect(() => {
    async function putUserInfo() {
      const requestBody = {
        isAdConfirmed: userInfo.isAdConfirmed,
        nickname: userInfo.nickname,
        birthDate: userInfo.birthDate,
        sex: userInfo.sex,
        mbti: userInfo.mbti,
        preferredRegion: userInfo.preferredRegion,
        preferredCompanion: userInfo.preferredCompanion,
        budgetStyle: userInfo.budgetStyle,
        planningStyle: userInfo.planningStyle,
        scheduleStyle: userInfo.scheduleStyle,
        destinationStyle1: userInfo.destinationStyle1,
        destinationStyle2: userInfo.destinationStyle2,
        destinationStyle3: userInfo.destinationStyle3,
      };
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await API.put('/users/me/info', requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      console.log(response.data);
      if (response.status === 201) {
        console.log('정보 입력 성공!');
      }
    }
    putUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{paddingTop: 165}}>
          <Text style={{fontSize: 55}}>🥰</Text>
        </View>
        <View style={{paddingTop: 35}}>
          <Text
            style={{fontSize: 23, fontWeight: 700, fontFamily: 'Pretendard'}}>
            완료되었습니다
          </Text>
        </View>
        <Text
          style={{
            paddingTop: 10,
            fontSize: 14,
            fontWeight: 400,
            color: 'grey',
            textAlign: 'center',
          }}>
          해당 설문을 바탕으로 {userInfo.nickname} 님의{'\n'}
          취향을 저격할 공간들을 추천해드릴게요 :)
        </Text>
        <View
          style={{
            position: 'absolute',
            height: dHeight - 90,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('SignUpDone');
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

export default PreferenceDoneScreen;
