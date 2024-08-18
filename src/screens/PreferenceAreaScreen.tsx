import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {useSetRecoilState} from 'recoil';
import userInfoAtom from '../recoil/user/index';
import BackButton from '../assets/back-button.svg';
import ActiveIndex from '../assets/preference-activate.svg';
import NotActiveIndex from '../assets/preference-deactivate.svg';
import DotDotDot from '../assets/dot-dot-dot.svg';

export type PreferenceAreaScreenProps = StackScreenProps<
  RootStackParamList,
  'PreferenceArea'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const areas = [
  {name: '서울', subText: '서귀포/성산/애월'},
  {name: '경기', subText: '서귀포/성산/애월'},
  {name: '인천', subText: '서귀포/성산/애월'},
  {name: '부산', subText: '서귀포/성산/애월'},
  {name: '대구/경북', subText: '서귀포/성산/애월'},
  {name: '울산/경남', subText: '서귀포/성산/애월'},
  {name: '대전/세종/충청', subText: '서귀포/성산/애월'},
  {name: '광주/전라', subText: '서귀포/성산/애월'},
  {name: '제주', subText: '서귀포/성산/애월'},
];

const PreferenceAreaScreen = ({
  navigation,
  route,
}: PreferenceAreaScreenProps) => {
  const [selectedAreas, setSelectedAreas] = React.useState<Set<string>>(
    new Set(),
  );

  const setUserInfo = useSetRecoilState(userInfoAtom);

  const handlePress = (area: string) => {
    setSelectedAreas(prev => {
      const newSelectedAreas = new Set(prev);
      if (newSelectedAreas.has(area)) {
        newSelectedAreas.delete(area);
      } else {
        newSelectedAreas.add(area);
      }
      return newSelectedAreas;
    });
  };

  const generateFinalList = () => {
    const preferredRegion: string[] = [];
    selectedAreas.forEach(areaName => {
      const area = areas.find(a => a.name === areaName);
      if (area) {
        const mainAreas = area.name.split('/');
        const subAreas = area.subText.split('/');

        mainAreas.forEach(mainArea => {
          subAreas.forEach(subArea => {
            preferredRegion.push(`${mainArea.trim()}, ${subArea.trim()}`);
          });
        });
      }
    });
    return preferredRegion;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('PreferenceMBTI', route.params);
            }}>
            <BackButton style={styles.backButton} />
          </Pressable>
          <Text style={styles.headerText}>나의 취향 찾기</Text>
        </View>

        <View style={styles.indexContainer}>
          <View style={styles.indexWrapper}>
            <NotActiveIndex />
            <Text style={styles.indexText}>1</Text>
          </View>
          <DotDotDot />
          <View style={styles.indexWrapper}>
            <ActiveIndex />
            <Text style={styles.activeIndexText}>2</Text>
          </View>
          <DotDotDot />
          <View style={styles.indexWrapper}>
            <NotActiveIndex />
            <Text style={styles.indexText}>3</Text>
          </View>
          <DotDotDot />
          <View style={styles.indexWrapper}>
            <NotActiveIndex />
            <Text style={styles.indexText}>4</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>나의 관심지역은?</Text>
        </View>

        <View style={styles.gridContainer}>
          {areas.map(area => (
            <Pressable
              key={area.name}
              onPress={() => handlePress(area.name)}
              style={[
                styles.button,
                selectedAreas.has(area.name) && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonMainText,
                  selectedAreas.has(area.name) && styles.buttonMainTextPressed,
                ]}>
                {area.name}
              </Text>
              <Text
                style={[
                  styles.buttonSubText,
                  selectedAreas.has(area.name) && styles.buttonSubTextPressed,
                ]}>
                {area.subText}
              </Text>
            </Pressable>
          ))}
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
              const preferredRegion = generateFinalList();
              setUserInfo((prevState) => ({
                ...prevState,
                preferredRegion: preferredRegion
              }));
              navigation.navigate('PreferenceStyle');
            }}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>다음</Text>
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
    justifyContent: 'flex-start',
    borderBottomColor: '#1212140D',
    borderBottomWidth: 1,
  },
  backButton: {
    width: 16,
    height: 12,
    marginLeft: 24,
    marginRight: 105,
  },
  headerText: {
    fontSize: 17,
  },
  indexContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 35,
    alignItems: 'center',
  },
  indexWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndexText: {
    position: 'absolute',
    fontSize: 12.6,
    fontWeight: '600',
    color: '#FFF',
  },
  indexText: {
    position: 'absolute',
    fontSize: 12.6,
    fontWeight: '600',
    color: '#C1C1C1',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: dWidth,
    marginLeft: 24,
  },
  titleText: {
    fontSize: 21,
    fontWeight: '600',
    marginLeft: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: dWidth - 48,
    marginTop: 32,
  },
  button: {
    width: (dWidth - 48) / 3 - 8,
    height: 100,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonPressed: {
    backgroundColor: '#FF557030',
    borderColor: '#FF5570',
    borderWidth: 1,
  },
  buttonMainText: {
    fontSize: 15,
    color: '#7F7F7F',
  },
  buttonSubText: {
    fontSize: 12.5,
    color: '#A4A4A4',
  },
  buttonMainTextPressed: {
    fontSize: 15,
    color: '#FF5570',
  },
  buttonSubTextPressed: {
    fontSize: 12.5,
    color: '#FF55708C',
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

export default PreferenceAreaScreen;
