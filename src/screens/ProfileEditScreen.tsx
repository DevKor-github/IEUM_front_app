import {useState, useEffect, useCallback} from 'react';
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
  ScrollView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {useSetRecoilState} from 'recoil';
import ProfileImageSetting from '../assets/profile-image-setting.svg';
import BackButton from '../assets/back-button.svg';
import userInfoAtom from '../recoil/user/index';
import {HomeStackParamList} from '../../types';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosError} from 'axios';

export type ProfileEditScreenProps = StackScreenProps<
  HomeStackParamList,
  'ProfileEdit'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const ProfileEditScreen = ({navigation, route}: ProfileEditScreenProps) => {
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

  const fetchUserProfile = useCallback(async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const res = await API.get('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNickname(res.data.nickname);
      setBirthDate(res.data.birthDate.slice(0, 10).split('-').join(''));
      setSelectedSex(res.data.sex);
      setUserInfo(prevState => ({
        ...prevState,
        nickname: res.data.nickname,
        birthDate: res.data.birthDate.slice(0, 10).split('-').join(''),
        sex:res.data.sex,
        mbti: "",
        preferredRegion: [""],
        preferredCompanion: [""],
        budgetStyle: 0,
        planningStyle: 0,
        scheduleStyle: 0,
        destinationStyle1: 0,
        destinationStyle2: 0,
        destinationStyle3: 0
      }))
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          // 둘러보기 기능 추가 시 구현
        }
      } else {
        console.error('Error deleting folder:', error);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile]),
  );

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
            style={{paddingRight: 115}}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <BackButton />
          </Pressable>
          <Text style={styles.headerText}>프로필 설정</Text>
          <Pressable style={{paddingLeft: 90}}>
            <Text style={{fontSize: 13, fontWeight: '500', color: '#A4A4A4'}}>
              로그아웃
            </Text>
          </Pressable>
        </View>
        <ScrollView
          style={{
            paddingTop: 45,
            paddingBottom: 20,
            overflow: 'scroll',
          }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <ProfileImageSetting style={{alignSelf: 'center'}} />
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
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginTop: 12,
                    paddingBottom: 35,
                  }}>
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
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>나의 취향 찾기</Text>
                <View
                  style={{
                    width: dWidth - 48,
                    borderRadius: 6,
                    backgroundColor: '#F8F8F8',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: '600'}}>
                    나의 MBTI는?
                  </Text>
                  <View
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: '#008AFF14',
                      borderRadius: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#008AFF',
                      }}>
                      ISTP
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: dWidth - 48,
                    borderRadius: 6,
                    backgroundColor: '#F8F8F8',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: '600'}}>
                    나의 관심지역은?
                  </Text>
                  <View
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: '#008AFF14',
                      borderRadius: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#008AFF',
                      }}>
                      서울 외 3
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: dWidth - 48,
                    borderRadius: 6,
                    backgroundColor: '#F8F8F8',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 5,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: '600'}}>
                    나의 여행 스타일은?
                  </Text>
                  <View
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: '#008AFF14',
                      borderRadius: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#008AFF',
                      }}>
                      변경하기???
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: dWidth - 48,
                    borderRadius: 6,
                    backgroundColor: '#F8F8F8',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 5,
                    marginBottom: 40
                  }}>
                  <Text style={{fontSize: 15, fontWeight: '600'}}>
                    주로 누구랑 떠나시나요?
                  </Text>
                  <View
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: '#008AFF14',
                      borderRadius: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#008AFF',
                      }}>
                      가족 외 1
                    </Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={handleNextPress}
                style={[
                  styles.saveButton,
                  {backgroundColor: isFormValid ? '#FF5570' : '#FF5570'},
                ]}
                disabled={isFormValid}>
                <Text style={styles.saveButtonText}>저장하기</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
    paddingHorizontal: 24,
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
    width: dWidth - 46,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C1C1C1',
  },
  saveButton: {
    width: 345,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 70,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});

export default ProfileEditScreen;
