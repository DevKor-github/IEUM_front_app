import {ScrollView, StyleSheet, Text, View} from 'react-native';

export interface IHashTags {
  hashtags?: string[];
}

const TagButton = ({label}: {label: string}) => {
  return (
    <View style={styles.tagButton}>
      <Text style={styles.tagText}># {label}</Text>
    </View>
  );
};

const HashTags = (props: IHashTags) => {
  const hashtags = props?.hashtags || [];
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hashtags.map((tag, index) => (
          <TagButton key={index} label={tag} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagButton: {
    backgroundColor: '#FFDBE1',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    color: '#FF5570', // 진한 분홍색 텍스트
    fontWeight: '600',
  },
});

export default HashTags;
