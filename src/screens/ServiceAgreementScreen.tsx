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
import BackButton from '../assets/back-button.svg';
import AgreementButton from '../assets/agreement-button.svg';
import ActiveAgreementButton from '../assets/agreement-button-active.svg';
import AgreementToggleButton from '../assets/agreement-toggle-button.svg';

export type ServiceAgreementScreenProps = StackScreenProps<
  RootStackParamList,
  'ServiceAgreement'
>;

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

type AgreementState = 'all' | 'age' | 'terms' | 'privacy' | 'location' | 'ads';

const ServiceAgreementScreen = ({
  navigation,
  route,
}: ServiceAgreementScreenProps) => {
  const [agreementStates, setAgreementStates] = React.useState<
    Record<AgreementState, boolean>
  >({
    all: false,
    age: false,
    terms: false,
    privacy: false,
    location: false,
    ads: false,
  });

  const toggleAgreement = (key: AgreementState) => {
    if (key === 'all') {
      const newState = !agreementStates.all;
      setAgreementStates({
        all: newState,
        age: newState,
        terms: newState,
        privacy: newState,
        location: newState,
        ads: newState,
      });
    } else {
      setAgreementStates(prevState => {
        const newState = {...prevState, [key]: !prevState[key]};
        const allSelected = Object.values(newState).slice(1, 6).every(Boolean);
        return {...newState, all: allSelected};
      });
    }
  };

  const renderAgreementButton = (key: AgreementState) => {
    return agreementStates[key] ? (
      <ActiveAgreementButton style={styles.agreementButton} />
    ) : (
      <AgreementButton style={styles.agreementButton} />
    );
  };

  const areRequiredAgreementsAccepted = () => {
    return (
      agreementStates.age &&
      agreementStates.terms &&
      agreementStates.privacy &&
      agreementStates.location
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => { navigation.navigate('Login')}}>
            <BackButton style={styles.backButton} />
          </Pressable>
          <Text style={styles.headerText}>회원가입</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            내 취향에 맞는 여행,{'\n'}이음과 시작하세요 ✨
          </Text>
        </View>

        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitleText}>약관 및 개인정보 처리 동의</Text>
        </View>

        <View style={styles.allAgreementContainer}>
          <Pressable onPress={() => toggleAgreement('all')}>
            {renderAgreementButton('all')}
          </Pressable>
          <Text style={styles.allAgreementText}>전체 동의하기</Text>
        </View>
        <View style={styles.agreementContainer}>
          <Pressable onPress={() => toggleAgreement('age')}>
            {renderAgreementButton('age')}
          </Pressable>
          <Text style={styles.agreementText}>만 14세 이상입니다 (필수)</Text>
          <Pressable style={styles.toggleButton}>
            <AgreementToggleButton />
          </Pressable>
        </View>
        <View style={styles.agreementContainer}>
          <Pressable onPress={() => toggleAgreement('terms')}>
            {renderAgreementButton('terms')}
          </Pressable>
          <Text style={styles.agreementText}>서비스 이용 약관 (필수)</Text>
          <Pressable style={styles.toggleButton}>
            <AgreementToggleButton />
          </Pressable>
        </View>
        <View style={styles.agreementContainer}>
          <Pressable onPress={() => toggleAgreement('privacy')}>
            {renderAgreementButton('privacy')}
          </Pressable>
          <Text style={styles.agreementText}>개인정보 처리방침 (필수)</Text>
          <Pressable style={styles.toggleButton}>
            <AgreementToggleButton />
          </Pressable>
        </View>
        <View style={styles.agreementContainer}>
          <Pressable onPress={() => toggleAgreement('location')}>
            {renderAgreementButton('location')}
          </Pressable>
          <Text style={styles.agreementText}>
            위치기반 서비스 이용 약관 (필수)
          </Text>
          <Pressable style={styles.toggleButton}>
            <AgreementToggleButton />
          </Pressable>
        </View>
        <View style={styles.agreementContainer}>
          <Pressable onPress={() => toggleAgreement('ads')}>
            {renderAgreementButton('ads')}
          </Pressable>
          <Text style={styles.agreementText}>광고성 정보 수신 동의 (선택)</Text>
          <Pressable style={styles.toggleButton}>
            <AgreementToggleButton />
          </Pressable>
        </View>
        {areRequiredAgreementsAccepted() && (
          <View
            style={{
              position: 'absolute',
              height: dHeight - 90,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Pressable
              onPress={() => {
                navigation.navigate('ProfileSetting');
              }}
              style={styles.nextButton}
              disabled={!areRequiredAgreementsAccepted()}>
              <Text style={styles.nextButtonText}>다음</Text>
            </Pressable>
          </View>
        )}
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
    marginRight: 130,
  },
  headerText: {
    fontSize: 17,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: dWidth,
    paddingLeft: 24,
    marginTop: 64,
  },
  titleText: {
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 32,
  },
  subTitleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 45,
    marginBottom: 33,
    width: dWidth * 0.85,
    height: 38,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  subTitleText: {
    fontSize: 18.5,
    fontWeight: '600',
    lineHeight: 22,
  },
  allAgreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: dWidth,
    paddingLeft: 24,
    marginBottom: 20,
  },
  allAgreementText: {
    fontSize: 17,
    fontWeight: '600',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: dWidth,
    paddingLeft: 24,
    marginBottom: 10,
  },
  agreementButton: {
    marginRight: 10,
  },
  agreementText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A4A4A4',
  },
  toggleButton: {
    marginLeft: 'auto',
    marginRight: 25,
  },
  nextButton: {
    position: 'absolute',
    width: 345,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FF5570',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});

export default ServiceAgreementScreen;
