import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Text,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import {RTCView} from 'react-native-webrtc';
import {useAudio, useVideo, useRoom} from '@huddle01/react-native/hooks';
import {useEventListener} from '@huddle01/react-native/hooks';
import Images from './Images';
import Avatar from './Avatar';

interface HLobbyProps {
  roomId: string;
  showControls: boolean;
  showJoinButton: boolean;
  backgroundColor: string;
  toolbarBgColor: string;
  buttonColor: string;
  buttonTextColor: string;
  isCameraOn: boolean;
  isMicOn: boolean;
  onJoinedRoom?: (isCameraOn: boolean, isMicOn: boolean) => void;
  onCameraOnOff?: (isCameraOn: boolean) => void;
  onMicOnOff?: (isMicOn: boolean) => void;
}

const HLobby = (props: HLobbyProps) => {
  const {fetchAudioStream} = useAudio();
  const {fetchVideoStream, stream: camStream, switchCamera} = useVideo();
  const {joinRoom, isLoading, isRoomJoined} = useRoom();

  const [isCameraOn, setCameraOn] = useState(props.isCameraOn);
  const [isMicOn, setMicOn] = useState(props.isMicOn);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideoStream();
    fetchAudioStream();
  }, []);

  useEffect(() => {
    setLoading(isLoading);

    if (!isLoading && isRoomJoined) {
      if (props.onJoinedRoom) {
        props.onJoinedRoom(isCameraOn, isMicOn);
      }
    }
  }, [isCameraOn, isLoading, isMicOn, isRoomJoined, props]);

  useEventListener('app:cam-on', () => {
    console.log('useEventListener:- Lobby Camera On');
  });

  useEventListener('app:cam-off', () => {
    console.log('useEventListener:- Lobby Camera Off');
  });

  useEventListener('app:mic-on', () => {
    console.log('useEventListener:- Lobby Mic On');
  });

  useEventListener('app:mic-off', () => {
    console.log('useEventListener:- Lobby Mic Off');
  });

  const onCamera = () => {
    const newValue = !isCameraOn;
    setCameraOn(newValue);

    if (props.onCameraOnOff) {
      props.onCameraOnOff(newValue);
    }
  };

  const onMic = () => {
    const newValue = !isMicOn;
    setMicOn(newValue);

    if (props.onMicOnOff) {
      props.onMicOnOff(newValue);
    }
  };

  const onJoinMeeting = () => {
    setLoading(true);
    joinRoom();
  };

  const renderControlItem = (
    onIcon: ImageSourcePropType,
    offIcon: ImageSourcePropType,
    text: string,
    isOn: boolean,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity style={styles.control} onPress={onPress}>
        <Image style={styles.controlIcon} source={isOn ? onIcon : offIcon} />
        <Text
          style={[
            styles.controlText,
            !isOn ? styles.controlTextOff : undefined,
          ]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderJoinButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: props.buttonColor},
          loading
            ? {...styles.waitingButton, borderColor: props.buttonColor}
            : undefined,
        ]}
        onPress={onJoinMeeting}
        disabled={loading}>
        {loading && (
          <View style={styles.progressHudContainer}>
            <MaterialIndicator color={props.buttonColor} size={20} />
          </View>
        )}
        <Text style={{...styles.buttonText, color: props.buttonTextColor}}>
          {'Join Meeting'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.cameraContainer,
          backgroundColor: props.backgroundColor,
        }}>
        <View style={styles.camera}>
          {isCameraOn && (
            <RTCView
              style={{height: '100%', width: '100%'}}
              mirror={true}
              objectFit={'cover'}
              streamURL={camStream?.toURL() ?? undefined}
              zOrder={0}
            />
          )}
          {!isCameraOn && <Avatar size={75} />}
        </View>
      </View>

      {props.showControls && (
        <View
          style={{
            ...styles.controlContainer,
            backgroundColor: props.toolbarBgColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {renderControlItem(
              Images.ic_camera_on,
              Images.ic_camera_off,
              'Video',
              isCameraOn,
              onCamera,
            )}
            {renderControlItem(
              Images.ic_mic_on,
              Images.ic_mic_off,
              'Mic',
              isMicOn,
              onMic,
            )}
            {renderControlItem(
              Images.ic_mirror,
              Images.ic_mirror,
              'Switch Camera',
              true,
              switchCamera,
            )}
          </View>
        </View>
      )}

      {props.showJoinButton && renderJoinButton()}
    </View>
  );
};

HLobby.defaultProps = {
  showControls: true,
  showJoinButton: true,
  backgroundColor: '#181A20',
  toolbarBgColor: '#181A20',
  buttonColor: '#246BFD',
  buttonTextColor: 'white',
  isCameraOn: false,
  isMicOn: false,
};

export default HLobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  micIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraMirror: {
    transform: [{scaleX: -1}],
  },
  controlContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  control: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  controlText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#94A3B8',
  },
  controlTextOff: {
    color: '#F87171',
  },
  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressHudContainer: {
    width: 30,
    height: 30,
    marginRight: 16,
    marginLeft: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
