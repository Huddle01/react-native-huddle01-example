import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import Images from '../components/Images';
import HHome from '../components/HHome';
import {API_KEY, PROJECT_ID} from '../constants';

export default function LoginScreen(props) {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <View style={{marginTop: 20, marginHorizontal: 20}}>
        <HHome
          projectId={PROJECT_ID}
          apiKey={API_KEY}
          logo={Images.ic_logo}
          onJoinnedLobby={roomId => {
            navigation.replace('Lobby', {roomId});
          }}
          createMeetingSection={{}}
          joinMeetingSection={{}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'grey',
    flex: 1,
  },
});
