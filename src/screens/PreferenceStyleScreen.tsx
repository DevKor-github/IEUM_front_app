import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import BackButton from '../assets/back-button.svg';
import ActiveIndex from '../assets/preference-activate.svg';
import NotActiveIndex from '../assets/preference-deactivate.svg';
import DotDotDot from '../assets/dot-dot-dot.svg';
import StyleNumber from '../assets/style-number.svg';
import StyleGraphLeftEnd from '../assets/style-graph-left-end.svg';
import ActiveStyleGraphLeftEnd from '../assets/active-style-graph-left-end.svg';
import StyleGraphMiddle from '../assets/style-graph-middle.svg';
import ActiveStyleGraphMiddle from '../assets/active-style-graph-middle.svg';
import StyleGraphRightEnd from '../assets/style-graph-right-end.svg';
import ActiveStyleGraphRightEnd from '../assets/active-style-graph-right-end.svg';
import {useSetRecoilState} from 'recoil';
import userInfoAtom from '../recoil/user/index';

export type PreferenceStyleScreenProps = StackScreenProps<
  RootStackParamList,
  'PreferenceStyle'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const PreferenceStyleScreen = ({
  navigation,
  route,
}: PreferenceStyleScreenProps) => {
  const [selectedIndexes, setSelectedIndexes] = React.useState<Array<number>>(
    Array(6).fill(-1),
  );

  const setUserInfo = useSetRecoilState(userInfoAtom);

  const handlePress = (questionIndex: number, answerIndex: number) => {
    setSelectedIndexes(prevIndexes =>
      prevIndexes.map((index, i) =>
        i === questionIndex ? answerIndex : index,
      ),
    );
  };

  const handleNextPress = () => {
    const allQuestionsAnswered = selectedIndexes.every(index => index !== -1);
    if (allQuestionsAnswered) {
      const scheduleStyle = selectedIndexes[0] + 1;
      const destinationStyle1 = selectedIndexes[1] + 1;
      const destinationStyle2 = selectedIndexes[2] + 1;
      const destinationStyle3 = selectedIndexes[3] + 1;
      const planningStyle = selectedIndexes[4] + 1;
      const budgetStyle = selectedIndexes[5] + 1;

      setUserInfo(prevState => ({
        ...prevState,
        budgetStyle: budgetStyle,
        planningStyle: planningStyle,
        scheduleStyle: scheduleStyle,
        destinationStyle1: destinationStyle1,
        destinationStyle2: destinationStyle2,
        destinationStyle3: destinationStyle3,
      }));

      navigation.navigate('PreferencePeople');
    } else {
      Alert.alert('모든 질문에 답변을 선택해주세요.');
    }
  };

  const questions = [
    '하루일정은 이렇게!',
    '여행이라면 이런 곳을 가야해!',
    '나는 이런 곳이 좋더라',
    '여행가면 주로 하고 싶은 활동은?',
    '계획은 이 정도!',
    '돈은 이렇게 써야지!',
  ];

  const labels = [
    ['알차게 👟', '여유롭게 👒'],
    ['유명관광지 🗼', '로컬장소 🗿'],
    ['자연 🏞️', '도시 🏙️'],
    ['휴양 🧘🏻', '액티비티 🏄🏻'],
    ['철저하게 🗓️', '즉흥으로 🍀'],
    ['가성비 🔖', '호캉스 💵'],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('PreferenceArea');
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
            <ActiveIndex />
            <Text style={styles.activeIndexText}>3</Text>
          </View>
          <DotDotDot />
          <View style={styles.indexWrapper}>
            <NotActiveIndex />
            <Text style={styles.indexText}>4</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>나의 여행 스타일은?</Text>
          <Text style={styles.titleSubText}>추후 변경이 가능합니다 😉</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {questions.map((question, questionIndex) => (
            <View key={questionIndex} style={styles.sectionContainer}>
              <StyleNumber style={{marginBottom: 8}} />
              <Text style={{fontSize: 16.5, fontWeight: '500'}}>
                {question}
              </Text>
              <View style={styles.graphContainer}>
                {[0, 1, 2, 3, 4].map(answerIndex => (
                  <Pressable
                    key={answerIndex}
                    onPress={() => handlePress(questionIndex, answerIndex)}>
                    {selectedIndexes[questionIndex] === answerIndex ? (
                      answerIndex === 0 ? (
                        <ActiveStyleGraphLeftEnd />
                      ) : answerIndex === 4 ? (
                        <ActiveStyleGraphRightEnd />
                      ) : (
                        <ActiveStyleGraphMiddle />
                      )
                    ) : answerIndex === 0 ? (
                      <StyleGraphLeftEnd />
                    ) : answerIndex === 4 ? (
                      <StyleGraphRightEnd />
                    ) : (
                      <StyleGraphMiddle />
                    )}
                  </Pressable>
                ))}
              </View>
              <View style={styles.labelContainer}>
                <Text style={{fontSize: 13, color: '#A4A4A4'}}>
                  {labels[questionIndex][0]}
                </Text>
                <Text style={{fontSize: 13, color: '#A4A4A4'}}>
                  {labels[questionIndex][1]}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

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
    borderBottomColor: '#F8F8F8',
    borderBottomWidth: 15,
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
  scrollViewContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    flexDirection: 'column',
    width: dWidth,
    alignItems: 'flex-start',
    marginTop: 40,
    paddingLeft: 24,
    borderBottomColor: '#F8F8F8',
    borderBottomWidth: 10,
  },
  graphContainer: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 17.5,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: dWidth - 15,
    paddingRight: 24,
    marginTop: 5,
    marginBottom: 32,
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

export default PreferenceStyleScreen;
