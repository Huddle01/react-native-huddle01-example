import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageSourcePropType,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useAcl} from '@huddle01/react/hooks';
import {useAppUtils} from '@huddle01/react/app-utils';
import {
  useHuddle01,
  useAudio,
  useVideo,
  usePeers,
  useRoom,
} from '@huddle01/react-native/hooks';
import Images from './Images';
import HGridLayout from './Layouts/HGridLayout';
import HSpeakerLayout from './Layouts/HSpeakerLayout';

interface HRoomProps {
  roomId: string;
  isCameraOn: boolean;
  isMicOn: boolean;
  hideToolbar: boolean;
  viewportBgColor: string;
  peerNameColor: string;
  onLeaveRoom: () => void;
  onCameraOnOff?: (isCameraOn: boolean) => void;
  onMicOnOff?: (isMicOn: boolean) => void;
}

type HLayout = 'grid' | 'speaker' | 'auto';

const HRoom = (props: HRoomProps) => {
  const [isMicOn, setMicOn] = useState(props.isMicOn);
  const [isCameraOn, setCameraOn] = useState(props.isCameraOn);
  // const [camStream, setCameraStream] = useState(props.camStream);
  // const [micStream, setMicStream] = useState(props.micStream);
  const [layout, setLayout] = useState<HLayout>('auto');

  const {me, roomState} = useHuddle01();
  const {
    fetchAudioStream,
    produceAudio,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const {roomId, leaveRoom} = useRoom();
  const {peers} = usePeers();
  const {changePeerRole, changeRoomControls, kickPeer} = useAcl();
  const {setDisplayName, sendData} = useAppUtils();

  useEffect(() => {
    console.log({me, roomState});
  }, [me, roomState]);

  useEffect(() => {
    console.log('Room Id: ', roomId);
  }, [roomId]);

  useEffect(() => {
    if (isCameraOn) {
      if (camStream) {
        produceVideo(camStream);
      } else {
        fetchVideoStream();
      }
    } else {
      stopProducingVideo();
    }
  }, [isCameraOn, camStream]);

  useEffect(() => {
    if (isMicOn) {
      if (micStream) {
        produceAudio(micStream);
      } else {
        fetchAudioStream();
      }
    } else {
      stopProducingAudio();
    }
  }, [isMicOn, micStream]);

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

  const onSetDisplayName = () => {
    setDisplayName('Tester');
  };

  const onChangeRole = () => {
    changePeerRole('<Peer-Id>', 'coHost');
  };

  const onSendMessage = () => {
    sendData('*', {
      message: 'Hello World',
    });
  };

  const onDisconnect = () => {
    leaveRoom();
  };

  const mePeer = {
    // peerId: state.context.peerId,
    camStream: isCameraOn ? camStream : undefined,
    micStream: isMicOn ? micStream : undefined,
  };

  const renderBottomButton = (
    icon: ImageSourcePropType,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity style={styles.bottomBtn} onPress={onPress}>
        <Image style={styles.bottomBtnIcon} source={icon} />
      </TouchableOpacity>
    );
  };

  const renderBottomTool = () => {
    if (!props.hideToolbar) {
      return (
        <View>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomInnerShadow} />
            <View style={styles.bottomOutterShadow} />
            {renderBottomButton(
              isCameraOn ? Images.ic_camera_on : Images.ic_camera_off,
              onCamera,
            )}
            {renderBottomButton(
              isMicOn ? Images.ic_mic_on : Images.ic_mic_off,
              onMic,
            )}
            {renderBottomButton(Images.ic_disconnect, onDisconnect)}
          </View>
          <SafeAreaView />
        </View>
      );
    } else {
      return <></>;
    }
  };

  let currentLayout = layout;
  if (currentLayout === 'auto') {
    if (Object.keys(peers).length < 2) {
      currentLayout = 'speaker';
    } else {
      currentLayout = 'grid';
    }
  }
  return (
    <View style={styles.container}>
      {currentLayout === 'grid' && (
        <HGridLayout
          peers={peers}
          viewportBgColor={props.viewportBgColor}
          peerNameColor={props.peerNameColor}
          me={mePeer}
          renderBottomTool={renderBottomTool}
        />
      )}
      {currentLayout === 'speaker' && (
        <HSpeakerLayout
          peers={peers}
          viewportBgColor={props.viewportBgColor}
          peerNameColor={props.peerNameColor}
          me={mePeer}
          renderBottomTool={renderBottomTool}
          onGrid={() => setLayout('grid')}
        />
      )}
    </View>
  );
};

HRoom.defaultProps = {
  isCameraOn: false,
  isMicOn: false,
  hideToolbar: false,
  viewportBgColor: '#181A20',
  peerNameColor: '#E2E8F0',
};

export default HRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewItemList: {
    width: '100%',
    flex: 1,
  },
  viewItemListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 55,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    backgroundColor: '#181A20',
    elevation: 1,
  },
  bottomContainerForFloating: {
    position: 'absolute',
    flexDirection: 'row',
    height: 55,
    left: 16,
    right: 16,
    bottom: 4,
    borderRadius: 16,
    backgroundColor: '#181A20',
    zIndex: 1,
  },
  bottomOutterShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#181A20',
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: 'black',
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 1,
  },
  bottomInnerShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#181A20',
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: -0.5,
    },
    shadowColor: 'white',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  bottomBtn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBtnIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
