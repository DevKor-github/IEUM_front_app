import * as React from 'react';
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
import {RootStackParamList} from '../../types';

export type LinkInputScreenProps = StackScreenProps<
  RootStackParamList,
  'LinkInput'
>;

const dHeight = Dimensions.get('window').height;
const dWidth = Dimensions.get('window').width;

const LinkInputScreen = ({navigation, route}: LinkInputScreenProps) => {
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
            borderColor: '#1212140D',
            borderWidth: 1,
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
          <Pressable onPress={() => {}}>
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
