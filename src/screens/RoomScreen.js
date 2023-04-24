import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import HRoom from '../components/HRoom';

export default function RoomScreen({...props}) {
  const navigation = useNavigation();
  const params = props.route.params;

  useEffect(() => {
    InCallManager.start({media: 'audio'});
    InCallManager.setForceSpeakerphoneOn(true);
    InCallManager.setSpeakerphoneOn(true);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <Text style={styles.roomId}>{params.roomId}</Text>
      <HRoom
        roomId={params.roomId}
        isCameraOn={params.isCameraOn}
        isMicOn={params.isMicOn}
        onLeaveRoom={() => {
          navigation.replace('Login');
        }}
      />
      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'grey',
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  roomId: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
});
