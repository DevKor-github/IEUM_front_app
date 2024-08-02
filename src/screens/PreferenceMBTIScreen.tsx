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
import BackButton from '../assets/back-button.svg';
import ActiveIndex from '../assets/preference-activate.svg';
import NotActiveIndex from '../assets/preference-deactivate.svg';
import DotDotDot from '../assets/dot-dot-dot.svg';
import MBTINumbering1 from '../assets/mbti-numbering-1.svg';
import MBTINumbering2 from '../assets/mbti-numbering-2.svg';
import MBTINumbering3 from '../assets/mbti-numbering-3.svg';
import MBTINumbering4 from '../assets/mbti-numbering-4.svg';

export type PreferenceMBTIScreenProps = StackScreenProps<
  RootStackParamList,
  'PreferenceMBTI'
>;

interface SelectedGroup {
  E_I: string | null;
  N_S: string | null;
  T_F: string | null;
  J_P: string | null;
}

const dWidth = Dimensions.get('window').width;
const dHeight = Dimensions.get('window').height;

const PreferenceMBTIScreen = ({
  navigation,
  route,
}: PreferenceMBTIScreenProps) => {
  const [selectedGroup, setSelectedGroup] = React.useState<SelectedGroup>({
    E_I: null,
    N_S: null,
    T_F: null,
    J_P: null,
  });

  const handlePress = (group: keyof SelectedGroup, buttonId: string) => {
    setSelectedGroup(prev => ({
      ...prev,
      [group]: prev[group] === buttonId ? null : buttonId,
    }));
  };

  const allGroupsSelected = () => {
    return Object.values(selectedGroup).every(value => value !== null);
  };

  const handleNavigate = () => {
    if (allGroupsSelected()) {
      navigation.navigate('PreferenceArea');
    } else {
      Alert.alert('선택 완료', '모든 항목을 선택해 주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.navigate('PreferenceStart');
            }}>
            <BackButton style={styles.backButton} />
          </Pressable>
          <Text style={styles.headerText}>나의 취향 찾기</Text>
        </View>

        <View style={styles.indexContainer}>
          <View style={styles.indexWrapper}>
            <ActiveIndex />
            <Text style={styles.activeIndexText}>1</Text>
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
            <NotActiveIndex />
            <Text style={styles.indexText}>4</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>나의 MBTI는?</Text>
        </View>

        <View style={styles.contentContainer}>
          <MBTINumbering1 />
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => handlePress('E_I', 'E')}
              style={[
                styles.button,
                selectedGroup.E_I === 'E' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.E_I === 'E' && styles.buttonTextPressed,
                ]}>
                E
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handlePress('E_I', 'I')}
              style={[
                styles.button,
                selectedGroup.E_I === 'I' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.E_I === 'I' && styles.buttonTextPressed,
                ]}>
                I
              </Text>
            </Pressable>
          </View>
          <MBTINumbering2 />
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => handlePress('N_S', 'S')}
              style={[
                styles.button,
                selectedGroup.N_S === 'S' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.N_S === 'S' && styles.buttonTextPressed,
                ]}>
                S
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handlePress('N_S', 'N')}
              style={[
                styles.button,
                selectedGroup.N_S === 'N' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.N_S === 'N' && styles.buttonTextPressed,
                ]}>
                N
              </Text>
            </Pressable>
          </View>
          <MBTINumbering3 />
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => handlePress('T_F', 'T')}
              style={[
                styles.button,
                selectedGroup.T_F === 'T' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.T_F === 'T' && styles.buttonTextPressed,
                ]}>
                T
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handlePress('T_F', 'F')}
              style={[
                styles.button,
                selectedGroup.T_F === 'F' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.T_F === 'F' && styles.buttonTextPressed,
                ]}>
                F
              </Text>
            </Pressable>
          </View>
          <MBTINumbering4 />
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => handlePress('J_P', 'J')}
              style={[
                styles.button,
                selectedGroup.J_P === 'J' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.J_P === 'J' && styles.buttonTextPressed,
                ]}>
                J
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handlePress('J_P', 'P')}
              style={[
                styles.button,
                selectedGroup.J_P === 'P' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.buttonText,
                  selectedGroup.J_P === 'P' && styles.buttonTextPressed,
                ]}>
                P
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
          <Pressable onPress={handleNavigate} style={styles.nextButton}>
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
  contentContainer: {
    alignItems: 'center',
    width: dWidth,
    marginTop: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 18,
    marginBottom: 36,
  },
  button: {
    width: 165,
    height: 44,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#FF557030',
    borderColor: '#FF5570',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
    color: '#C1C1C1',
  },
  buttonTextPressed: {
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

export default PreferenceMBTIScreen;
