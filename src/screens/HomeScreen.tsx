import * as React from 'react';
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
import MainLogo from '../assets/main-logo-small.svg';
import NotificationIcon from '../assets/notification-icon.svg';
import EmptyProfile from '../assets/empty-profile.svg';
import EditIcon from '../assets/edit-icon.svg';
import LinkInputIcon from '../assets/link-input-icon.svg';
import LinkInputButton from '../assets/agreement-toggle-button.svg';

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const dHeight = Dimensions.get('window').height;
const dWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation, route}: HomeScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: dWidth,
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            marginTop: 18,
          }}>
          <MainLogo />
          <NotificationIcon />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: dWidth,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 32,
            paddingHorizontal: 24,
          }}>
          <EmptyProfile />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              lineHeight: 22,
              marginLeft: 10,
            }}>
            김명진님의 공간
          </Text>

          <Pressable
            style={{
              flexDirection: 'row',
              width: 60,
              height: 27,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#FFB2BE',
              borderWidth: 1,
              borderRadius: 25,
              marginLeft: 'auto',
              gap: 2,
            }}>
            <EditIcon />
            <Text style={{fontSize: 13, fontWeight: '600', color: '#FF7D92'}}>
              편집
            </Text>
          </Pressable>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            width: dWidth - 48,
            height: 75,
            marginTop: 20,
            paddingHorizontal: 20,
            alignItems: 'center',
            backgroundColor: '#FAFBFC',
            borderColor: '#F2F3F4',
            borderWidth: 1,
          }}
          onPress={() => navigation.navigate('LinkInput')}>
          <LinkInputIcon />
          <View style={{marginLeft: 13.5, gap: 2}}>
            <Text style={{fontSize: 15, fontWeight: '700'}}>
              새로 등록된 3개의 링크
            </Text>
            <Text style={{fontSize: 12.5, fontWeight: '400', color: '#A4A4A4'}}>
              14개의 장소가 저장을 기다리고 있어요!
            </Text>
          </View>
          <View style={{marginLeft: 'auto', width: 9, height: 14}}>
            <LinkInputButton style={{width: 9, height: 14}} />
          </View>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('LinkInput')}
          style={{
            position: 'absolute',
            right: 24,
            bottom: 115,
            height: 38,
            width: 134,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FF5570',
            borderColor: '#FFFFFF5970',
            borderWidth: 1,
            borderRadius: 65,
          }}>
          <Text style={{fontSize: 13.5, fontWeight: '700', color: '#FFFFFF'}}>
            😝 링크 추가하기
          </Text>
        </Pressable>
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

export default HomeScreen;
