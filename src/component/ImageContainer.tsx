import React from 'react';
import {DimensionValue, Image, StyleSheet, View} from 'react-native';

interface ImageContainerProps {
  imageUrl: string; // Optional image URL
  defaultImageUrl?: string; // Default image URL if the main image doesn't exist
  width: DimensionValue; // Width of the image container
  height: DimensionValue; // Height of the image container
  borderRadius?: number; // Height of the image container
  children?: React.ReactNode; // Optional child components to overlay on the image
}

const ImageContainer: React.FC<ImageContainerProps> = (
  props: ImageContainerProps,
) => {
  const {imageUrl, defaultImageUrl, width, height, borderRadius, children} =
    props;
  console.log(imageUrl);
  return (
    <View style={[styles.container, {width, height}]}>
      <Image
        source={
          imageUrl
            ? {uri: imageUrl}
            : defaultImageUrl || require('../assets/unloaded-image.png')
        } // Use imageUrl if it exists, else use defaultImageUrl
        style={[styles.image, {width, height, borderRadius}]}
        resizeMode="cover"
      />

      {/* Overlay children on the image */}
      {children && (
        <>
          <View style={[styles.overlayBackground, {borderRadius}]} />
          <View style={[styles.overlayContent, {borderRadius}]}>
            {children}
            {/*<View style={{position: 'relative'}}>{children}</View>*/}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    // borderRadius: 8, // Add radius if needed
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject, // This makes the view cover the entire container
    backgroundColor: '#00000052', // Semi-transparent gray
    opacity: 0.3,
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject, // Also covers the entire container
    zIndex: 1, // Ensure the content (text) is above the background overlay
  },
});

export default ImageContainer;
