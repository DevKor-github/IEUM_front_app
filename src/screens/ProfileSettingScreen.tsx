import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import ProfileImageSetting from '../assets/profile-image-setting.svg';

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
  const [selectedGender, setSelectedGender] = React.useState<string | null>(
    null,
  );

  const handleGenderPress = (gender: string) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

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

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            프로필 설정,{'\n'}1분이면 끝나요😎
          </Text>
        </View>
        <ProfileImageSetting />
        <View style={[styles.inputContainer, {marginBottom: 35}]}>
          <Text style={styles.inputText}>닉네임</Text>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'flex-end'}}>
            <TextInput
              autoCapitalize="none"
              style={{
                width: 268,
                paddingBottom: 15,
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#C1C1C1',
                color: 'black',
                fontSize: 17,
                fontWeight: '600',
              }}
            />
            <View
              style={{
                width: 69,
                height: 30,
                borderRadius: 20,
                borderColor: '#C1C1C1',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 13, fontWeight: '600', color: '#C1C1C1'}}>
                중복확인
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.inputContainer, {marginBottom: 35}]}>
          <Text style={styles.inputText}>생년월일</Text>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'flex-end'}}>
            <TextInput
              placeholder="8자리 ex) 20011225"
              placeholderTextColor="#DEDEDE"
              autoCapitalize="none"
              style={{
                width: 345,
                paddingBottom: 15,
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#C1C1C1',
                color: 'black',
                fontSize: 17,
                fontWeight: '600',
              }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>성별</Text>
          <View style={{flexDirection: 'row', gap: 10, marginTop: 12}}>
            <Pressable
              onPress={() => handleGenderPress('male')}
              style={{
                width: 168,
                height: 45,
                borderRadius: 6,
                borderColor: selectedGender === 'male' ? '#FF5570' : '#F8F8F8',
                borderWidth: 1,
                backgroundColor:
                  selectedGender === 'male' ? '#FF557030' : '#F8F8F8',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: selectedGender === 'male' ? '#FF5570' : '#C1C1C1',
                }}>
                남성
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleGenderPress('female')}
              style={{
                width: 168,
                height: 45,
                borderRadius: 6,
                borderColor: selectedGender === 'female' ? '#FF5570' : '#F8F8F8',
                borderWidth: 1,
                backgroundColor:
                  selectedGender === 'female' ? '#FF557030' : '#F8F8F8',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: selectedGender === 'female' ? '#FF5570' : '#C1C1C1',
                }}>
                여성
              </Text>
            </Pressable>
          </View>
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
              navigation.navigate('PreferenceStart');
            }}
            style={styles.nextButton}>
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
  genderButton: {
    width: 168,
    height: 45,
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F8',
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

export default ProfileSettingScreen;
