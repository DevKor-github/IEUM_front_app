import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

export interface ICustomOverlay {
  isVisible: boolean;
  onClose: () => void;
  children: any;
}

const CustomOverlay = (props: ICustomOverlay) => {
  const {isVisible, onClose, children} = props;
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});
export default CustomOverlay;
