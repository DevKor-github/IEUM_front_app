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

export type RenameFolderScreenProps = StackScreenProps<
  HomeStackParamList,
  'RenameFolder'
>;

const dHeight = Dimensions.get('window').height;
const dWidth = Dimensions.get('window').width;

const RenameFolderScreen = ({navigation, route}: RenameFolderScreenProps) => {
  const {folderId} = route.params;
  const [requestName, setRequestName] = useState('');

  const onChangeUrlText = (inputText: string) => {
    setRequestName(inputText);
  };

  const onSubmitName = async () => {
    try {
      const requestBody = {
        name: requestName,
      };
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await API.put(`/folders/${folderId}`, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigation.navigate('FolderPlaceList', {
        folderId: folderId,
        folderName: requestName,
      });
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
          <Pressable onPress={() => navigation.goBack()}>
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
            내 보관함
          </Text>
          <Pressable onPress={onSubmitName}>
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
            보관함 이름 변경
          </Text>
          <TextInput
            autoCapitalize="none"
            placeholder="보관함 이름"
            placeholderTextColor="#D9D9D9"
            onChangeText={onChangeUrlText}
            style={{
              width: dWidth - 48,
              paddingBottom: 10,
              marginTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#FF5570',
              color: 'black',
              fontSize: 19,
              fontWeight: '600',
            }}
            value={requestName}
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

export default RenameFolderScreen;
