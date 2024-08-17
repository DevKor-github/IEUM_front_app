import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {useSetRecoilState} from 'recoil';
import userInfoAtom from '../recoil/user/index';
import BackButton from '../assets/back-button.svg';
import ActiveIndex from '../assets/preference-activate.svg';
import NotActiveIndex from '../assets/preference-deactivate.svg';
import DotDotDot from '../assets/dot-dot-dot.svg';

export type PreferencePeopleScreenProps = StackScreenProps<
  RootStackParamList,
  'PreferencePeople'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const people = [
  {name: '✨ 나홀로'},
  {name: '🏡 가족'},
  {name: '🧓 부모님'},
  {name: '👨‍👩‍👦 아이'},
  {name: '💍 연인'},
  {name: '🧩 친구'},
  {name: '🐶 반려동물'},
];

const PreferencePeopleScreen = ({
  navigation,
  route,
}: PreferencePeopleScreenProps) => {
  const [selectedPeople, setSelectedPeople] = React.useState<Set<string>>(
    new Set(),
  );

  const setUserInfo = useSetRecoilState(userInfoAtom);

  const handlePress = (p: string) => {
    setSelectedPeople(prev => {
      const newSelectedPeople = new Set(prev);
      if (newSelectedPeople.has(p)) {
        newSelectedPeople.delete(p);
      } else {
        newSelectedPeople.add(p);
      }
      return newSelectedPeople;
    });
  };

  const handleNextPress = () => {
    const preferredCompanion = Array.from(selectedPeople).map(
      name => name.split(' ')[1],
    );

    if (preferredCompanion.length > 0) {
      setUserInfo(prevState => ({
        ...prevState,
        preferredCompanion: preferredCompanion,
      }));
      navigation.navigate('PreferenceDone');
    } else {
      Alert.alert('하나 이상의 동행을 선택해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('PreferenceStyle', route.params);
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
            <NotActiveIndex />
            <Text style={styles.indexText}>2</Text>
          </View>
          <DotDotDot />
          <View style={styles.indexWrapper}>
            <NotActiveIndex />
            <Text style={styles.indexText}>3</Text>
          </View>
          <DotDotDot />
          <View style={styles.indexWrapper}>
            <ActiveIndex />
            <Text style={styles.activeIndexText}>4</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>주로 누구와 떠나시나요?</Text>
          <Text style={styles.titleSubText}>중복 선택이 가능합니다</Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            {people.slice(0, 2).map(p => (
              <Pressable
                key={p.name}
                onPress={() => handlePress(p.name)}
                style={[
                  styles.button,
                  selectedPeople.has(p.name) && styles.buttonPressed,
                ]}>
                <Text
                  style={[
                    styles.buttonText,
                    selectedPeople.has(p.name) && styles.buttonTextPressed,
                  ]}>
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.buttonRow}>
            {people.slice(2, 5).map(p => (
              <Pressable
                key={p.name}
                onPress={() => handlePress(p.name)}
                style={[
                  styles.button,
                  selectedPeople.has(p.name) && styles.buttonPressed,
                ]}>
                <Text
                  style={[
                    styles.buttonText,
                    selectedPeople.has(p.name) && styles.buttonTextPressed,
                  ]}>
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.buttonRow}>
            {people.slice(5).map(p => (
              <Pressable
                key={p.name}
                onPress={() => handlePress(p.name)}
                style={[
                  styles.button,
                  selectedPeople.has(p.name) && styles.buttonPressed,
                ]}>
                <Text
                  style={[
                    styles.buttonText,
                    selectedPeople.has(p.name) && styles.buttonTextPressed,
                  ]}>
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            height: dHeight - 90,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Pressable onPress={handleNextPress} style={styles.nextButton}>
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
    paddingLeft: 24,
  },
  titleText: {
    fontSize: 21,
    fontWeight: '600',
    marginLeft: 15,
  },
  titleSubText: {
    fontSize: 13.5,
    color: '#A4A4A4',
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 30,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  button: {
    width: 103,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#FF557030',
    borderColor: '#FF5570',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    color: '#C1C1C1',
  },
  buttonTextPressed: {
    fontSize: 15,
    color: '#FF5570',
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

export default PreferencePeopleScreen;
