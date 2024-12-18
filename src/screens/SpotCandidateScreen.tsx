import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '../../types';
import BackButton from '../assets/back-button.svg';
import {API} from '../api/base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useFocusEffect} from '@react-navigation/native';
import dayjs from 'dayjs'; // For date formatting

export type SpotCandidateScreenProps = StackScreenProps<
  HomeStackParamList,
  'SpotCandidate'
>;

interface LinkData {
  id: number;
  collectionType: 'INSTAGRAM' | 'NAVER BLOG';
  link: string;
  content: string;
  createdAt: string;
  collectionPlacesCount: number;
  savedCollectionPlacesCount: number;
}

const dWidth = Dimensions.get('window').width;

const SpotCandidateScreen = ({navigation}: SpotCandidateScreenProps) => {
  const [unviewedLinks, setUnviewedLinks] = useState<LinkData[]>([]);
  const [viewedLinks, setViewedLinks] = useState<LinkData[]>([]);
  const [recentUpdateDate, setRecentUpdateDate] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchLinks = async () => {
        try {
          const unviewedResponse = await API.get<{
            response: {data: LinkData[]};
          }>('/collections/unviewed', {
            params: {cursorId: 0},
          });

          if (isActive) {
            setUnviewedLinks(unviewedResponse.data.items);
          }

          const viewedResponse = await API.get<{response: {data: LinkData[]}}>(
            '/collections/viewed',
            {
              params: {cursorId: 0},
            },
          );

          if (isActive) {
            setViewedLinks(viewedResponse.data.items);
          }

          const allLinks = [
            ...unviewedResponse.data.items,
            ...viewedResponse.data.items,
          ];

          if (allLinks.length > 0) {
            const latestLink = allLinks.reduce((latest, current) => {
              return dayjs(current.createdAt).isAfter(dayjs(latest.createdAt))
                ? current
                : latest;
            });

            const createdAt = dayjs(latestLink.createdAt);
            let adjustedHour = createdAt.hour() + 9;

            if (adjustedHour >= 24) {
              adjustedHour = adjustedHour - 24;
            }

            setRecentUpdateDate(
              dayjs(latestLink.createdAt)
                .hour(adjustedHour)
                .format('YYYY/MM/DD HH:mm'),
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchLinks();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handlePress = (
    collectionId: number,
    collectionContent: string,
    collectionType: string,
    disableAnimation: boolean,
  ) => {
    navigation.navigate('SpotSave', {
      collectionId,
      collectionContent,
      collectionType,
      disableAnimation
    });
  };

  const cleanInstagramContent = (content: string) => {
    const colonIndex = content.indexOf('"');
    return colonIndex !== -1
      ? content.substring(colonIndex + 1).trim()
      : content;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <BackButton style={styles.backButton} />
          </Pressable>
          <Text style={styles.headerText}>장소 후보 리스트</Text>
        </View>

        {/* Recent Update */}
        <View style={styles.recentUpdateContainer}>
          <Text style={styles.recentUpdateText}>RECENT UPDATE</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.lightbulb}>💡</Text>
            <Text style={styles.dateText}>{recentUpdateDate || 'N/A'}</Text>
          </View>
        </View>

        {/* Link Lists */}
        <ScrollView style={styles.scrollView}>
          {/* Unviewed Links */}
          {unviewedLinks?.map(link => (
            <Pressable
              style={styles.card}
              key={link.id}
              onPress={() =>
                handlePress(link.id, link.content, link.collectionType, false)
              }>
              <View style={styles.cardHeader}>
                {link.collectionType === 'INSTAGRAM' ? (
                  <LinearGradient
                    colors={[
                      'rgba(255, 27, 144, 0.85)',
                      'rgba(248, 2, 97, 0.85)',
                      'rgba(237, 0, 192, 0.85)',
                      'rgba(197, 0, 233, 0.85)',
                      'rgba(112, 23, 255, 0.85)',
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.collectionTypeBadge}>
                    <Text style={styles.cardType}>INSTAGRAM</Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={[
                      'rgba(25, 248, 118, 0.92)',
                      'rgba(3, 235, 100, 0.92)',
                      'rgba(39, 252, 227, 0.92)',
                    ]}
                    start={{x: -0.02, y: 0}}
                    end={{x: 1.54, y: 1}}
                    style={styles.collectionTypeBadge}>
                    <Text style={styles.cardType}>NAVER BLOG</Text>
                  </LinearGradient>
                )}
                <View style={styles.newBlock}>
                  <Text style={styles.newTag}>NEW</Text>
                </View>
              </View>
              <Text
                style={styles.cardContent}
                numberOfLines={2}
                ellipsizeMode="tail">
                {link.collectionType === 'INSTAGRAM'
                  ? cleanInstagramContent(link.content)
                  : link.content}
              </Text>
              <Pressable onPress={() => openLink(link.link)}>
                <Text style={styles.cardLink}>원글 확인하기</Text>
                <Text style={[styles.cardLinkUrl, styles.underline]}>
                  {link.link}
                </Text>
              </Pressable>
            </Pressable>
          ))}

          {/* Viewed Links */}
          {viewedLinks?.map(link => (
            <Pressable
              style={[styles.card, styles.viewedCard]}
              key={link.id}
              onPress={() =>
                handlePress(link.id, link.content, link.collectionType, false)
              }>
              <View style={styles.cardHeader}>
                {link.collectionType === 'INSTAGRAM' ? (
                  <LinearGradient
                    colors={[
                      'rgba(209, 209, 209, 1)',
                      'rgba(209, 209, 209, 1)',
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.collectionTypeBadge}>
                    <Text style={styles.cardType}>INSTAGRAM</Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={[
                      'rgba(209, 209, 209, 1)',
                      'rgba(209, 209, 209, 1)',
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.collectionTypeBadge}>
                    <Text style={styles.cardType}>NAVER BLOG</Text>
                  </LinearGradient>
                )}
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {link.savedCollectionPlacesCount}/
                    {link.collectionPlacesCount}
                  </Text>
                </View>
              </View>
              <Text
                style={styles.cardContent}
                numberOfLines={2}
                ellipsizeMode="tail">
                {link.collectionType === 'INSTAGRAM'
                  ? cleanInstagramContent(link.content)
                  : link.content}
              </Text>
              <Pressable onPress={() => openLink(link.link)}>
                <Text style={styles.cardLink}>원글 확인하기</Text>
                <Text style={[styles.cardLinkUrl, styles.underline]}>
                  {link.link}
                </Text>
              </Pressable>
            </Pressable>
          ))}
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
    justifyContent: 'flex-start',
    borderBottomColor: '#1212140D',
    borderBottomWidth: 1,
  },
  backButton: {
    width: 16,
    height: 12,
    marginLeft: 24,
    marginRight: 100,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
  },
  recentUpdateContainer: {
    flexDirection: 'row',
    width: dWidth - 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 13,
  },
  recentUpdateText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    color: '#121214',
  },
  dateContainer: {
    flexDirection: 'row',
    width: 130,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFDBE1',
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
    paddingHorizontal: 8,
    gap: 1,
  },
  lightbulb: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 22,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F7F7F',
  },
  scrollView: {
    width: dWidth - 48,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  viewedCard: {
    backgroundColor: '#F5F5F5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionTypeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 1,
  },
  cardType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  newBlock: {
    height: 23,
    width: 46,
    backgroundColor: '#FF5570',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newTag: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFF',
  },
  cardContent: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#008AFF',
    marginBottom: 4,
  },
  cardLinkUrl: {
    fontSize: 12,
    color: '#7F7F7F',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#7F7F7F',
  },
  progressContainer: {
    height: 23,
    width: 46,
    borderRadius: 19,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default SpotCandidateScreen;
