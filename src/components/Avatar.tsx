import React from 'react';
import {
  Image,
  ImageSourcePropType,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Images from './Images';

interface AvatarProps extends TouchableOpacityProps {
  size: number;
  uri?: string;
  source?: ImageSourcePropType;
  placeholder?: string | string[];
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Avatar = (props: AvatarProps) => {
  const size = props.size;

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
    },
    content: {
      width: '100%',
      height: '100%',
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    video: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    },
    placeholderText: {
      fontSize: 16,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity
      {...props}
      style={[styles.container, props.containerStyle]}
      activeOpacity={1.0}>
      <View style={[styles.content, props.style]}>
        {props.uri && (
          <Image
            style={styles.image}
            defaultSource={Images.ic_default_avatar}
            source={{uri: props.uri}}
          />
        )}
        {!props.uri && (
          <Image
            style={styles.image}
            defaultSource={Images.ic_default_avatar}
            source={props.source}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Avatar;
