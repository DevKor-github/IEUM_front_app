import {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '../../types';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';

export type LinkInputScreenProps = StackScreenProps<
  HomeStackParamList,
  'LinkInput'
>;

const dHeight = Dimensions.get('window').height;
const dWidth = Dimensions.get('window').width;

const LinkInputScreen = ({navigation, route}: LinkInputScreenProps) => {
  const [requestUrl, setRequestUrl] = useState('');

  const onChangeUrlText = (inputText: string) => {
    setRequestUrl(inputText);
  };

  const onSubmitUrl = async () => {
    const uuid = await EncryptedStorage.getItem('uuid');

    // 정규 표현식을 사용하여 URL 유효성 검사
    const isInstagram = /instagram\.com/.test(requestUrl);
    const isNaverBlog = /blog\.naver\.com/.test(requestUrl);

    if (!isInstagram && !isNaverBlog) {
      // URL이 Instagram이나 Naver Blog가 아닐 경우
      navigation.navigate('LinkReject');
      return;
    }

    const collectionType = isNaverBlog ? 1 : 0;

    try {
      const requestBody = {
        link: requestUrl,
      };
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      const response = await API.post('/crawling', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      console.log(response)
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: dWidth,
            height: dHeight * 0.06,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '400',
                color: '#008AFF',
                lineHeight: 22,
              }}>
              취소
            </Text>
          </Pressable>
          <Text style={{fontSize: 17, fontWeight: '500', lineHeight: 22}}>
            링크 입력
          </Text>
          <Pressable onPress={onSubmitUrl}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '400',
                color: '#008AFF',
                lineHeight: 22,
              }}>
              완료
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: dWidth,
            paddingHorizontal: 24,
            marginTop: 45,
            alignItems: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#FF5570',
              lineHeight: 22,
            }}>
            링크 추가하기
          </Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={onChangeUrlText}
            style={{
              width: dWidth - 48,
              paddingBottom: 10,
              marginTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#FF5570',
              color: 'black',
              fontSize: 14,
              fontWeight: '500',
            }}
            value={requestUrl}
          />
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

export default LinkInputScreen;
