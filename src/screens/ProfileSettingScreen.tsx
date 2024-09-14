import {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {useSetRecoilState} from 'recoil';
import ProfileImageSetting from '../assets/profile-image-setting.svg';
import userInfoAtom from '../recoil/user/index';
import {RootStackParamList} from '../../types';
import {API} from '../api/base';

export type ProfileSettingScreenProps = StackScreenProps<
  RootStackParamList,
  'ProfileSetting'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const ProfileSettingScreen = ({
  navigation,
  route,
}: ProfileSettingScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSelectedSex] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);

  const setUserInfo = useSetRecoilState(userInfoAtom);

  const onChangeNicknameText = (inputText: string) => {
    setNickname(inputText);
    setIsDuplicate(null);
  };

  const onChangeBirthDateText = (inputText: string) => {
    setBirthDate(inputText);
  };

  const handleSexPress = (s: string) => {
    setSelectedSex(sex === s ? '' : s);
  };

  useEffect(() => {
    const isBirthDateValid = birthDate.length === 8 && /^\d+$/.test(birthDate);
    const isValid =
      nickname.trim() !== '' &&
      isBirthDateValid &&
      sex !== '' &&
      isDuplicate === false;
    setIsFormValid(isValid);
  }, [nickname, birthDate, sex, isDuplicate]);

  const handleNextPress = () => {
    if (isFormValid) {
      const bDate = `${birthDate.slice(0, 4)}-${birthDate.slice(
        4,
        6,
      )}-${birthDate.slice(6, 8)}`;
      setUserInfo(prevState => ({
        ...prevState,
        nickname: nickname,
        birthDate: bDate,
        sex: sex,
      }));

      navigation.navigate('PreferenceStart');
    }
  };

  async function checkNickname(nickname: string) {
    try {
      const res = await API.get('/users/nickname', {
        params: {
          nickname: nickname,
        },
      });
      setIsDuplicate(res.data.isDuplicate);
    } catch (error) {
      console.error(error);
      setIsDuplicate(null);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('ServiceAgreement');
            }}></Pressable>
          <Text style={styles.headerText}>프로필 설정</Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                프로필 설정,{'\n'}1분이면 끝나요😎
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <ProfileImageSetting />
              <View style={[styles.inputContainer, {marginBottom: 35}]}>
                <Text style={styles.inputText}>닉네임</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'flex-end',
                  }}>
                  <TextInput
                    onChangeText={onChangeNicknameText}
                    autoCapitalize="none"
                    style={{
                      width: 268,
                      paddingBottom: 10,
                      marginTop: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#C1C1C1',
                      color: 'black',
                      fontSize: 17,
                      fontWeight: '600',
                    }}
                    value={nickname}
                  />
                  <View
                    style={{
                      width: 69,
                      height: 30,
                      borderRadius: 20,
                      borderColor:
                        isDuplicate === false ? '#008AFF' : '#C1C1C1',
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Pressable onPress={() => checkNickname(nickname)}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: isDuplicate === false ? '#008AFF' : '#C1C1C1',
                        }}>
                        {isDuplicate === false ? '가능해요' : '중복확인'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                {isDuplicate !== null && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: isDuplicate == false ? '#008AFF' : '#F00',
                    }}>
                    {isDuplicate == false
                      ? '사용 가능한 닉네임입니다 :)'
                      : '이미 사용 중인 닉네임입니다 :('}
                  </Text>
                )}
              </View>

              <View style={[styles.inputContainer, {marginBottom: 35}]}>
                <Text style={styles.inputText}>생년월일</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'flex-end',
                  }}>
                  <TextInput
                    onChangeText={onChangeBirthDateText}
                    placeholder="8자리 ex) 20011225"
                    placeholderTextColor="#DEDEDE"
                    autoCapitalize="none"
                    maxLength={8} // 최대 8자리까지만 입력 가능
                    keyboardType="numeric" // 숫자 키패드를 표시
                    style={{
                      width: 345,
                      paddingBottom: 10,
                      marginTop: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#C1C1C1',
                      color: 'black',
                      fontSize: 17,
                      fontWeight: '600',
                    }}
                    value={birthDate}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>성별</Text>
                <View style={{flexDirection: 'row', gap: 10, marginTop: 12}}>
                  <Pressable
                    onPress={() => handleSexPress('M')}
                    style={{
                      width: 168,
                      height: 45,
                      borderRadius: 6,
                      borderColor: sex === 'M' ? '#FF5570' : '#F8F8F8',
                      borderWidth: 1,
                      backgroundColor: sex === 'M' ? '#FF557030' : '#F8F8F8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: sex === 'M' ? '#FF5570' : '#C1C1C1',
                      }}>
                      남성
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSexPress('F')}
                    style={{
                      width: 168,
                      height: 45,
                      borderRadius: 6,
                      borderColor: sex === 'F' ? '#FF5570' : '#F8F8F8',
                      borderWidth: 1,
                      backgroundColor: sex === 'F' ? '#FF557030' : '#F8F8F8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: sex === 'F' ? '#FF5570' : '#C1C1C1',
                      }}>
                      여성
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            position: 'absolute',
            height: dHeight - 90,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            onPress={handleNextPress}
            style={[
              styles.nextButton,
              {backgroundColor: isFormValid ? '#FF5570' : '#FFC1C1'},
            ]}
            disabled={!isFormValid}>
            <Text style={styles.nextButtonText}>확인</Text>
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
    justifyContent: 'center',
    borderBottomColor: '#1212140D',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 17,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: dWidth,
    paddingLeft: 24,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginVertical: 32,
  },
  inputContainer: {
    marginTop: 14,
    gap: 12,
    width: dWidth - 48,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C1C1C1',
  },
  nextButton: {
    position: 'absolute',
    width: 345,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileSettingScreen;
