import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import {
  login as KakaoLogin,
  logout as KakaoLogout,
} from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {StackScreenProps} from '@react-navigation/stack';
import EmptyProfile from '../assets/big-empty-profile.svg';
import BackButton from '../assets/back-button.svg';
import {HomeStackParamList} from '../../types';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
export type ProfileEditScreenProps = StackScreenProps<
  HomeStackParamList,
  'ProfileEdit'
>;

const dWidth = Dimensions.get('window').width;

const ProfileEditScreen = ({navigation, route}: ProfileEditScreenProps) => {
  const [userName, setUserName] = useState('');
  const getUserName = async () => {
    try {
      const profileRes = await API.get('/users/me');
      if (profileRes.status === 200) {
        setUserName(profileRes.data.nickname);
      }
    } catch (err) {
      console.log("Can't get profile info");
    }
  };
  useEffect(() => {
    getUserName();
    console.log(EncryptedStorage.getItem('oAuthPlatform'));
  }, []);

  const handleWithdraw = async () => {
    Alert.alert(
      '회원 탈퇴',
      '회원 탈퇴를 진행하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: async () => {
            try {
              const res = await API.delete('/users/me');
              if (res.status === 200) {
                Alert.alert('회원 탈퇴', '회원 탈퇴가 완료되었습니다.', [
                  {text: '확인', onPress: () => navigation.replace('Login')},
                ]);
              }
            } catch (err) {
              console.error('회원 탈퇴 오류:', err);
              Alert.alert('오류', '회원 탈퇴 중 문제가 발생했습니다.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: async () => {
            try {
              const socialLoginType = await EncryptedStorage.getItem(
                'oAuthPlatform',
              );

              switch (socialLoginType) {
                case 'kakao':
                  await handleKakaoLogout();
                  break;
                case 'naver':
                  await handleNaverLogout();
                  break;
                case 'apple':
                  await handleAppleLogout();
                  break;
                default:
                  Alert.alert('오류', '알 수 없는 로그인 타입입니다.');
                  return;
              }

              await EncryptedStorage.clear();
              Alert.alert('로그아웃', '로그아웃이 완료되었습니다.', [
                {text: '확인', onPress: () => navigation.replace('Login')},
              ]);
            } catch (err) {
              console.error('로그아웃 오류:', err);
              Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleKakaoLogout = async () => {
    try {
      await KakaoLogout();
      console.log('카카오 로그아웃 완료');
    } catch (err) {
      console.error('카카오 로그아웃 오류:', err);
      throw err;
    }
  };

  const handleNaverLogout = async () => {
    try {
      await NaverLogin.logout();
      console.log('네이버 로그아웃 완료');
    } catch (err) {
      console.error('네이버 로그아웃 오류:', err);
      throw err;
    }
  };

  const handleAppleLogout = async () => {
    // try {
    //   await appleAuth.performRequest({
    //     requestedOperation: appleAuth.Operation.LOGOUT,
    //   });
    //   console.log('애플 로그아웃 완료');
    // } catch (err) {
    //   console.error('애플 로그아웃 오류:', err);
    //   throw err;
    // }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={{position: 'absolute', left: 24}}
            onPress={() => navigation.goBack()}>
            <BackButton />
          </Pressable>
          <Text style={styles.headerText}>내 정보</Text>
        </View>

        <View style={styles.profileContainer}>
          <EmptyProfile style={{width: 80, height: 80}} />
          <Text style={styles.profileName}>{userName}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.withdrawButton]}
            onPress={handleWithdraw}>
            <Text style={styles.withdrawText}>회원탈퇴</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.feedbackButton]}
            onPress={() => Linking.openURL('https://pf.kakao.com/_zaxkMn')}>
            <Text style={styles.feedbackText}>피드백을 남겨주세요 💬</Text>
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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: dWidth,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1212140D',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FBD58B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 57,
    width: dWidth,
    alignItems: 'center',
  },
  button: {
    width: '60%',
    height: 52,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#EFEFEF',
    marginBottom: 12,
  },
  logoutText: {
    color: '#A4A4A4',
    fontSize: 16,
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: '#FFE5E5',
    marginBottom: 50,
  },
  withdrawText: {
    color: '#FF5570',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackButton: {
    backgroundColor: '#E5F0FF',
  },
  feedbackText: {
    color: '#008AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileEditScreen;
