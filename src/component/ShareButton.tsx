import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ShareIcon from '../assets/share-icon.svg';

export interface IShareButtonProps {
  onPress?: () => void;
}

const ShareButton = (props: IShareButtonProps) => {
  const defaultOnPress = () => {
    console.log('press');
  };
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={props.onPress || defaultOnPress}>
      <ShareIcon />
      <Text style={styles.buttonText}>공유</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 70,
    height: 30,
    backgroundColor: '#FF5570',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: 13,
    marginLeft: 6,
  },
});

export default ShareButton;
