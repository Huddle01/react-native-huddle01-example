import React, {useState, useEffect} from 'react';
import {Image, Text, ViewStyle} from 'react-native';
import {View, StyleSheet} from 'react-native';
import Images from './Images';
import Avatar from './Avatar';
import {MediaStream, RTCView} from 'react-native-webrtc';

interface HViewportProps {
  peer: object;
  isRaiseHand?: boolean;
  reaction?: string;
  backgroundColor: string;
  nameColor: string;
  hideInfo: boolean;
  style?: ViewStyle;
  resizeMode: 'contain' | 'cover';
  zOrder: number;
}

const HViewport = (props: HViewportProps) => {
  const [viewSize, setViewSize] = useState({width: 0, height: 0});

  useEffect(() => {}, []);

  const peer = props.peer;
  const isCameraOn = peer.cam || peer.camStream;
  const isMicOn = peer.mic || peer.micStream;

  const avatarSize = Math.min(viewSize.width, viewSize.height) * 0.4;
  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  };

  let icons = [];
  if (!isMicOn) {
    icons.push(Images.ic_mic_off);
  }
  if (!isCameraOn) {
    icons.push(Images.ic_camera_off);
  }
  if (props.isRaiseHand) {
    icons.push(Images.ic_hand);
  }

  const renderRTCView = () => {
    let stream: MediaStream | undefined = undefined;

    if (peer.cam) {
      stream = new MediaStream(undefined);
      stream.addTrack(peer.cam);
    } else if (peer.camStream) {
      stream = peer.camStream;
    }

    return (
      <View pointerEvents="none">
        <RTCView
          streamURL={stream?.toURL() ?? ''}
          style={{backgroundColor: 'transparent', ...viewSize, flex: 1}}
          objectFit={props.resizeMode}
          zOrder={props.zOrder}
        />
      </View>
    );
  };

  const renderContent = () => {
    return <View style={styles.content}>{renderRTCView()}</View>;
  };

  return (
    <View
      {...props}
      style={{
        ...styles.container,
        backgroundColor: props.backgroundColor,
        ...props.style,
      }}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        const size = {width: width, height: height};
        if (viewSize.width !== size.width || viewSize.height !== size.height) {
          setViewSize(size);
        }
      }}>
      {isCameraOn && renderContent()}
      {!isCameraOn && (
        <View style={avatarStyle}>
          <Avatar size={avatarSize} />
          {props.reaction && (
            <Text style={styles.action}>{props.reaction}</Text>
          )}
        </View>
      )}

      {!props.hideInfo && (
        <View style={styles.bottomLeftSectionContainer}>
          <View style={styles.nameContainer}>
            <Text style={{...styles.name, color: props.nameColor}}>{peer.peerId}</Text>
          </View>

          {icons.length > 0 && (
            <View style={styles.iconContainer}>
              {icons.map(icon => (
                <Image style={styles.icon} source={icon} />
              ))}
            </View>
          )}

          <View style={{flex: 1}} />
        </View>
      )}
      {isCameraOn && props.reaction && (
        <Text style={[styles.action, styles.actionOnTopLeft]}>
          {props.reaction}
        </Text>
      )}
    </View>
  );
};

HViewport.defaultProps = {
  peer: {},
  isRaiseHand: false,
  isSmall: true,
  backgroundColor: '#181A20',
  nameColor: '#E2E8F0',
  hideInfo: false,
  resizeMode: 'contain',
  zOrder: 20,
};

export default HViewport;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#181A20',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLeftSectionContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    bottom: 0,
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  iconContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    marginHorizontal: 2,
    paddingHorizontal: 2,
    backgroundColor: '#23262F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    resizeMode: 'contain',
  },
  nameContainer: {
    minHeight: 20,
    flexShrink: 1,
    marginHorizontal: 2,
    backgroundColor: '#202027',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 11,
    fontWeight: '400',
    color: '#E2E8F0',
  },
  fullScreenIcon: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
    marginVertical: 4,
  },
  hand: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  action: {
    position: 'absolute',
    fontSize: 50,
  },
  actionOnTopLeft: {
    top: 10,
    left: 10,
    fontSize: 20,
  },
});
