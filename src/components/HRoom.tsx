import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ImageSourcePropType,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  useMeetingMachine,
  useAudio,
  useVideo,
  usePeers,
  useRoom,
} from '@huddle01/react-native/hooks';
import HViewport from './HViewport';
import Images from './Images';

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

const HRoom = (props: HRoomProps) => {
  const [isMicOn, setMicOn] = useState(props.isMicOn);
  const [isCameraOn, setCameraOn] = useState(props.isCameraOn);

  const [viewListSize, setViewListSize] = useState({width: 0, height: 0});
  const [largeViewItemHeight, setLargeViewItemHeight] = useState(100);
  const [viewItemHeight, setViewItemHeight] = useState(100);

  const {state} = useMeetingMachine();
  const {stream: micStream, produceAudio, stopProducingAudio} = useAudio();
  const {stream: camStream, produceVideo, stopProducingVideo} = useVideo();
  const {leaveRoom} = useRoom();
  const {peers} = usePeers();

  useEffect(() => {
    if (state.value['Initialized'] === 'NotJoined') {
      if (props.onLeaveRoom) {
        props.onLeaveRoom();
      }
    }
  }, [state]);

  useEffect(() => {
    setTimeout(() => {
      if (isCameraOn && camStream) {
        produceVideo(camStream);
      } else if (!isCameraOn) {
        stopProducingVideo();
      }
    }, 50);
  }, [isCameraOn, camStream]);

  useEffect(() => {
    setTimeout(() => {
      if (isMicOn && micStream) {
        produceAudio(micStream);
      } else if (!isMicOn) {
        stopProducingAudio();
      }
    }, 50);
  }, [isMicOn, micStream]);

  const calculateViewHeights = (containerSize: any) => {
    const itemWidth = ((containerSize.width ?? 4) - 4) / 2;
    const itemHeight = itemWidth;
    const containerHeight = (containerSize.height ?? 60) - 60;

    setViewItemHeight(itemHeight);
    setLargeViewItemHeight(containerHeight / 3);
  };

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

  const onDisconnect = () => {
    leaveRoom();
  };

  const peerIds = Object.keys(peers);
  const me = {
    peerId: state.context.peerId,
    camStream: isCameraOn ? camStream : undefined,
    micStream: isMicOn ? micStream : undefined,
  };
  const peerArray = [me, ...peerIds.map(peerId => peers[peerId])];

  const renderViewItem = (peer: object) => {
    const itemHeight =
      peerArray.length > 3 ? viewItemHeight : largeViewItemHeight;
    const margin = peerArray.length > 3 ? 2 : 4;

    return (
      <View style={{flex: 0.5, margin: margin, height: itemHeight}}>
        <HViewport
          peer={peer}
          backgroundColor={props.viewportBgColor}
          nameColor={props.peerNameColor}
        />
      </View>
    );
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

  return (
    <View style={styles.container}>
      <View
        style={styles.viewportContainer}
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          const size = {width: width, height: height};
          if (
            viewListSize.width !== size.width ||
            viewListSize.height !== size.height
          ) {
            setViewListSize(size);
            calculateViewHeights(size);
          }
        }}>
        <FlatList
          style={styles.viewItemList}
          contentContainerStyle={styles.viewItemListContainer}
          bounces={false}
          data={peerArray}
          renderItem={({item}) => renderViewItem(item)}
          key={peerArray.length > 3 ? '#small' : '#large'}
          keyExtractor={(item, index) => index.toString()}
          numColumns={peerArray.length > 3 ? 2 : 1}
          columnWrapperStyle={
            peerArray.length > 3
              ? {flex: 0.5, margin: 2, justifyContent: 'center'}
              : undefined
          }
        />
      </View>

      {!props.hideToolbar && (
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
      )}
      <SafeAreaView />
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
  viewportContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
