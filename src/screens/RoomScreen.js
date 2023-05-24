import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import HRoom from '../components/HRoom';
import CallManager from '../utils/CallManager';

export default function RoomScreen({...props}) {
  const navigation = useNavigation();
  const params = props.route.params;

  useEffect(() => {
    CallManager.start();

    return () => {
      CallManager.stop();
    };
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <View style={styles.container}>
        <HRoom
          roomId={params.roomId}
          isCameraOn={params.isCameraOn}
          isMicOn={params.isMicOn}
          onLeaveRoom={() => {
            navigation.replace('Login');
          }}
        />
      </View>

      <Text style={styles.roomId}>{params.roomId}</Text>
      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'grey',
    flex: 1,
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
