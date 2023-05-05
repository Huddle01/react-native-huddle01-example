import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import HViewport from '../HViewport';
import {ILayoutProps} from './types';
import DraggableView from '../DraggableView';
import Images from '../Images';

interface HSpeakerLayoutProps extends ILayoutProps {
  onGrid?: () => void;
  onSwitchCamera?: () => void;
}

const HSpeakerLayout = (props: HSpeakerLayoutProps) => {
  const peers = props.peers;
  const peerIds = Object.keys(peers);
  const peerArray = peerIds.map(peerId => peers[peerId]);

  const spearkPeer = peerArray.length > 0 ? peerArray[0] : props.me;
  const smallPeer = peerArray.length > 0 ? props.me : undefined;

  const renderSpeakerView = (peer: object) => {
    return (
      <View style={styles.speakerView}>
        <HViewport
          peer={peer}
          backgroundColor={props.viewportBgColor}
          nameColor={props.peerNameColor}
          style={{borderRadius: 0}}
          hideInfo={true}
        />
      </View>
    );
  };

  const renderSmallView = (peer: object) => {
    const isCameraOn = peer.cam || peer.camStream;

    return (
      <View style={styles.smallView}>
        <HViewport
          peer={peer}
          backgroundColor={props.viewportBgColor}
          nameColor={props.peerNameColor}
          hideInfo={true}
        />
        <View style={{...styles.btnInSmallView, top: 3, left: 3}}>
          <TouchableOpacity onPress={props.onGrid}>
            <Image style={styles.btnIcon} source={Images.ic_grid} />
          </TouchableOpacity>
        </View>

        {isCameraOn && (
          <View style={{...styles.btnInSmallView, bottom: 3, right: 3}}>
            <TouchableOpacity onPress={props.onSwitchCamera}>
              <Image style={styles.btnIcon} source={Images.ic_switch_camera} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSpeakerView(spearkPeer)}
      <View style={{flex: 1}}>
        <SafeAreaView />
        {smallPeer && (
          <View style={styles.viewportContainer}>
            <DraggableView initialOffsetY={-1}>
              {renderSmallView(smallPeer)}
            </DraggableView>
          </View>
        )}
      </View>
      {props.renderBottomTool && props.renderBottomTool()}
    </View>
  );
};

HSpeakerLayout.defaultProps = {
  peers: [],
  me: {},
  viewportBgColor: '#181A20',
  peerNameColor: '#E2E8F0',
};

export default HSpeakerLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  speakerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  viewportContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallView: {
    width: 100,
    height: 150,
  },
  btnInSmallView: {
    position: 'absolute',
    width: 25,
    height: 25,
    backgroundColor: 'grey',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    width: 15,
    height: 15,
  },
});
