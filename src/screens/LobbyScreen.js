import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import HLobby from '../components/HLobby';

export default function LobbyScreen({...props}) {
  const navigation = useNavigation();
  const params = props.route.params;

  let isJoined = false;

  const gotoRoomScreen = (isCameraOn, isMicOn) => {
    if (!isJoined) {
      isJoined = true;

      navigation.replace('Room', {
        roomId: params.roomId,
        isCameraOn,
        isMicOn,
      });
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <Text style={styles.roomId}>{params.roomId}</Text>
      <View style={{height: '50%'}}>
        <HLobby roomId={params.roomId} onJoinedRoom={gotoRoomScreen} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'grey',
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomId: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 20,
  },
});
