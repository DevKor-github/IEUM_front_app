import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import LoginLogo from '../assets/main-logo.svg';
import MainText from '../assets/intro-text.svg';
import KakaoLoginButton from '../assets/kakao-login.svg';
import NaverLoginButton from '../assets/naver-login.svg';
import AppleLoginButton from '../assets/apple-login.svg';
import {RootStackParamList} from '../../types';
import {
  KakaoOAuthToken,
  KakaoProfile,
  login,
  logout,
  getProfile,
  getAccessToken,
  KakaoAccessTokenInfo,
} from '@react-native-seoul/kakao-login';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {API} from '../api/base';

export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

//for naver login
const consumerKey = 'I96iM8FiTCmG7LDPwazG';
const consumerSecret = 'cFlKXu8OSY';
const appName = 'IEUM';
const serviceUrlScheme = 'naverLogin';

const LoginScreen = ({navigation, route}: LoginScreenProps) => {
  //kakao
  const logInWithKakao = async () => {
    const token: KakaoOAuthToken = await login();
    const profile: KakaoProfile = await getKakaoProfile();
    const accessToken = token.accessToken;
    const id = profile.id;
    navigation.navigate('PreferenceStart');
    // navigation.navigate('PreferenceStart', { accessToken: accessToken, id: id  })
    return JSON.stringify(token);
  };

  const logOutWithKakao = async () => {
    const logOutMessage = await logout();
    Alert.alert(logOutMessage);
    return logOutMessage;
  };

  const getKakaoProfile = async () => {
    const profile: KakaoProfile = await getProfile();
    return profile;
  };

  const getKakaoToken = async () => {
    const token: KakaoAccessTokenInfo = await getAccessToken();
    console.log(token);
    return JSON.stringify(token);
  };

  //naver
  React.useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS: serviceUrlScheme,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const [success, setSuccessResponse] =
    React.useState<NaverLoginResponse['successResponse']>();
  const [failure, setFailureResponse] =
    React.useState<NaverLoginResponse['failureResponse']>();
  const [getProfileRes, setGetProfileRes] =
    React.useState<GetProfileResponse>();

  const logInWithNaver = async () => {
    const {failureResponse, successResponse} = await NaverLogin.login();
    setSuccessResponse(successResponse);
    setFailureResponse(failureResponse);
  };

  const logOutWithNaver = async () => {
    try {
      await NaverLogin.logout();
      setSuccessResponse(undefined);
      setFailureResponse(undefined);
      setGetProfileRes(undefined);
    } catch (e) {
      console.error(e);
    }
  };

  const getNaverProfile = async () => {
    try {
      const profileResult = await NaverLogin.getProfile(success!.accessToken);
      setGetProfileRes(profileResult);
    } catch (e) {
      setGetProfileRes(undefined);
    }
  };

  const deleteToken = async () => {
    try {
      await NaverLogin.deleteToken();
      setSuccessResponse(undefined);
      setFailureResponse(undefined);
      setGetProfileRes(undefined);
    } catch (e) {
      console.error(e);
    }
  };

  // apple
  const logInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const {user, email, fullName} = appleAuthRequestResponse;
        const requestBody = {oAuthId: {user}, oAuthPlatform: 'Apple'};
        const res = await API.post('/auth/login/social', requestBody);
        if (res.status === 201) {
          console.log('Apple 로그인 성공');
        } else {
          console.log('Apple 로그인 실패');
        }

        // .then(
        //   console.log("Apple 로그인 성공");
        // )
        // .catch (
        //   console.log("Apple 로그인 실패")
        // )
        // console.log('Apple 로그인 성공:', {user});

        // 예시: 로그인 성공 후 이동
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Apple 로그인 에러:', error);
      Alert.alert('Apple 로그인 중 문제가 발생했습니다.');
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate('Map')}>
          <View
            style={{paddingTop: 17, paddingRight: 30, alignItems: 'flex-end'}}>
            <Text style={{fontSize: 14, color: '#A4A4A4'}}>둘러보기</Text>
          </View>
        </Pressable>

        <View style={styles.logoContainer}>
          <MainText style={styles.mainText} />
          <LoginLogo />
        </View>
        <View style={styles.loginContainer}>
          <View style={styles.loginSignupContainer}>
            <View style={styles.line} />
            <Text style={styles.loginSignupText}>로그인</Text>
            <Text style={styles.loginSignupText}> / </Text>
            <Text style={styles.loginSignupText}>회원가입</Text>
            <View style={styles.line} />
          </View>
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
            onPress={logInWithKakao}>
            <KakaoLoginButton style={styles.loginButton} />
          </Pressable>
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
            onPress={logInWithNaver}>
            <NaverLoginButton style={styles.loginButton} />
          </Pressable>
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
            onPress={logInWithApple}>
            <AppleLoginButton style={styles.loginButton} />
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
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  mainText: {
    marginBottom: 4,
  },
  loginContainer: {
    alignItems: 'center',
    paddingTop: 300,
  },
  loginSignupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  loginSignupText: {
    color: '#7F7F7F',
    fontSize: 14.5,
  },
  line: {
    width: 110,
    height: 0.6,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 10,
  },
  loginButton: {
    marginBottom: 15,
  },
});

export default LoginScreen;
