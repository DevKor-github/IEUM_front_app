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

export type SignUpDoneScreenProps = StackScreenProps<
  RootStackParamList,
  'SignUpDone'
>;

const dHeight = Dimensions.get('window').height

const SignUpDoneScreen = ({
  navigation,
  route,
}: SignUpDoneScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{paddingTop: 165}}>
          <Text style={{fontSize: 55}}>🚘</Text>
        </View>
        <View style={{paddingTop: 35}}>
          <Text
            style={{fontSize: 23, fontWeight: 700, fontFamily: 'Pretendard'}}>
            반갑습니다!
          </Text>
        </View>
        <Text
          style={{
            paddingTop: 10,
            fontSize: 14,
            fontWeight: 400,
            color: 'grey',
            textAlign: 'center',
          }}>
          ????????
        </Text>
        <View
          style={{
            position: 'absolute',
            height: dHeight - 90,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>이음 시작하기 😎</Text>
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

export default SignUpDoneScreen;
