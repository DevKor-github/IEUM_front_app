import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {HomeStackParamList} from '../../types';
import MainLogo from '../assets/main-logo-small.svg';
import NotificationIcon from '../assets/notification-icon.svg';
import EmptyProfile from '../assets/empty-profile.svg';
import EditIcon from '../assets/edit-icon.svg';
import LinkInputIcon from '../assets/link-input-icon.svg';
import LinkInputButton from '../assets/agreement-toggle-button.svg';
import {API} from '../api/base';
import {StackScreenProps} from '@react-navigation/stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useFocusEffect} from '@react-navigation/native';

export type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

interface LinkData {
  id: number;
  collectionType: 'INSTAGRAM' | 'NAVER BLOG';
  link: string;
  content: string;
  collectionPlacesCount: number;
  savedCollectionPlacesCount: number;
}

const dHeight = Dimensions.get('window').height;
const dWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [unviewedLinksCount, setUnviewedLinksCount] = useState<number>(0);
  const [unSavedPlacesCount, setUnSavedPlacesCount] = useState<number>(0);
  const [username, setUserName] = useState('');

  useEffect(() => {
    async function getUserProfile() {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const res = await API.get('/users/me/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status === 200) {
        setUserName(res.data.response.nickname);
      }
    }
    getUserProfile();
  }, []);

  useEffect(() => {
    async function getFolder() {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const res = await API.get('/folders', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.statusCode === 9001 || res.data.statusCode === 9003) {
        console.log('SignUp Needed');
        navigation.navigate('ServiceAgreement');
      }
    }
    getFolder();
  }, [navigation]);

  useFocusEffect(() => {
    async function fetchLinkData() {
      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        const unviewedResponse = await API.get<{response: {data: LinkData[]}}>(
          '/collections/unviewed',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              cursorId: 0,
            },
          },
        );
        const viewedResponse = await API.get<{response: {data: LinkData[]}}>(
          '/collections/viewed',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              cursorId: 0,
            },
          },
        );

        const unviewedLinks = unviewedResponse.data.response.data;
        const viewedLinks = viewedResponse.data.response.data;

        setUnviewedLinksCount(unviewedLinks.length);

        const totalUnSavedPlaces = unviewedLinks.reduce(
          (acc: number, link: LinkData) =>
            acc +
            (link.collectionPlacesCount - link.savedCollectionPlacesCount),
          0,
        );

        const totalViewedUnSavedPlaces = viewedLinks.reduce(
          (acc: number, link: LinkData) =>
            acc +
            (link.collectionPlacesCount - link.savedCollectionPlacesCount),
          0,
        );

        setUnSavedPlacesCount(totalUnSavedPlaces + totalViewedUnSavedPlaces);
      } catch (error) {
        console.error('Error fetching link data:', error);
      }
    }

    fetchLinkData();
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MainLogo />
          <NotificationIcon />
        </View>
        <View style={styles.profileSection}>
          <EmptyProfile />
          <Text style={styles.nicknameText}>{username} 님의 공간</Text>
          <Pressable style={styles.editButton}>
            <EditIcon />
            <Text style={styles.editText}>편집</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.linkInfoContainer}
          onPress={() => navigation.navigate('SpotCandidate')}>
          <LinkInputIcon />
          <View style={styles.linkInfoTextContainer}>
            <Text style={styles.newLinksText}>
              새로 등록된 {unviewedLinksCount}개의 링크
            </Text>
            <Text style={styles.unsavedPlacesText}>
              {unSavedPlacesCount}개의 장소가 저장을 기다리고 있어요!
            </Text>
          </View>
          <LinkInputButton style={styles.linkInputButton} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('LinkInput')}
          style={styles.addLinkButton}>
          <Text style={styles.addLinkButtonText}>😝 링크 추가하기</Text>
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
  header: {
    flexDirection: 'row',
    width: dWidth,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 18,
  },
  profileSection: {
    flexDirection: 'row',
    width: dWidth,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  nicknameText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    marginLeft: 10,
  },
  editButton: {
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
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF7D92',
  },
  linkInfoContainer: {
    flexDirection: 'row',
    width: dWidth - 48,
    height: 75,
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    borderColor: '#F2F3F4',
    borderWidth: 1,
  },
  linkInfoTextContainer: {
    marginLeft: 13.5,
    gap: 2,
  },
  newLinksText: {
    fontSize: 15,
    fontWeight: '700',
  },
  unsavedPlacesText: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#A4A4A4',
  },
  linkInputButton: {
    marginLeft: 'auto',
    width: 9,
    height: 14,
  },
  addLinkButton: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    height: 38,
    width: 134,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5570',
    borderColor: '#FFFFFF5970',
    borderWidth: 1,
    borderRadius: 65,
  },
  addLinkButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
