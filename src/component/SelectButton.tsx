import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SvgProps} from 'react-native-svg';

export interface ISelectButtonProps {
  index: number;
  isSelected: boolean;
  text: string;
  onPress: () => void;
  selectedStyle?: StyleSheet.NamedStyles<any>;
  icon?: React.FC<SvgProps>;
}

const SelectButton = (props: ISelectButtonProps) => {
  const Icon = props.icon;

  return (
    <TouchableOpacity
      key={props.index}
      style={[
        styles.button,
        props.isSelected &&
          (props.selectedStyle?.selectedButton || styles.selectedButton),
      ]}
      onPress={props.onPress}>
      {Icon && <Icon style={styles.icon} />}
      <Text
        style={[
          styles.buttonText,
          props.isSelected &&
            (props.selectedStyle?.selectedButtonText ||
              styles.selectedButtonText),
        ]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 23,
    borderWidth: 0.8,
    borderColor: '#D9D9D9',
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
    fontWeight: '600',
    fontSize: 14,
  },
  selectedButton: {
    backgroundColor: '#FF5570',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  icon: {
    marginRight: 5,
  },
});

export default SelectButton;
