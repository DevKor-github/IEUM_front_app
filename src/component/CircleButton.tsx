import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {SvgProps} from 'react-native-svg';

export interface ICircleButton {
  isSelected?: boolean;
  onPress: () => void;
  icon: React.FC<SvgProps>;
  selectedStyle?: StyleSheet.NamedStyles<any>;
}

const CircleButton = (props: ICircleButton) => {
  const Icon = props.icon;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        props.isSelected && // todo
          (props.selectedStyle?.selectedButton || styles.selectedButton),
      ]}
      onPress={props.onPress}>
      {Icon && <Icon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.8},
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  selectedButton: {
    backgroundColor: '#FF5570',
  },
});

export default CircleButton;
