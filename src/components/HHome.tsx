import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import {
  useLobby,
  useHuddle01,
  useEventListener,
} from '@huddle01/react-native/hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

interface SectionProps {
  title?: string;
  titleColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholderColor?: string;
  inputPlaceholder?: string;
  hide?: boolean;
}

interface HHomeProps {
  projectId: string;
  apiKey: string;
  logo?: ImageSourcePropType;
  createMeetingSection?: SectionProps;
  joinMeetingSection?: SectionProps;
  onJoinnedLobby?: (roomId: string) => void;
  onJoinLobbyFailed?: (error: string) => void;
}

const HHome = (props: HHomeProps) => {
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [isCreatingRoom, setCreatingRoom] = useState(false);
  const [isJoiningRoom, setJoiningRoom] = useState(false);

  const {initialize} = useHuddle01();
  const {joinLobby, isLoading, isLobbyJoined} = useLobby();

  const createMeetingSectionProps: SectionProps = {
    title: 'Meeting Space',
    titleColor: '#A199FF',
    backgroundColor: '#181A20',
    buttonColor: '#246BFD',
    buttonTextColor: 'white',
    inputBackgroundColor: '#1C1E24',
    inputBorderColor: '#64748B',
    inputTextColor: 'white',
    inputPlaceholderColor: '#5E6272',
    inputPlaceholder: 'Enter Room ID',
    hide: false,
    ...props.createMeetingSection,
  };
  const joinMeetingSectionProps: SectionProps = {
    title: 'Join a meeting',
    titleColor: '#A199FF',
    backgroundColor: '#181A20',
    buttonColor: '#246BFD',
    buttonTextColor: 'white',
    inputBackgroundColor: '#1C1E24',
    inputBorderColor: '#64748B',
    inputTextColor: 'white',
    inputPlaceholderColor: '#5E6272',
    inputPlaceholder: 'Enter Room ID',
    hide: false,
    ...props.joinMeetingSection,
  };

  useEffect(() => {
    initialize(props.projectId);
  }, []);

  useEffect(() => {
    if (!isLoading && isLobbyJoined) {
      setCreatingRoom(false);
      setJoiningRoom(false);

      if (props.onJoinnedLobby) {
        props.onJoinnedLobby(roomId);
      }
    }
  }, [props, roomId, isLoading, isLobbyJoined]);

  useEventListener('lobby:failed', () => {
    console.log('useEventListener:- JoinLobbyFailed');

    if (props.onJoinLobbyFailed) {
      props.onJoinLobbyFailed('Failed to join to lobby');
    }
  });

  const createRoom = async (title?: string) => {
    try {
      const response = await axios.post(
        'https://iriko.testing.huddle01.com/api/v1/create-room',
        {
          title: title ?? 'Huddle01-Test',
          hostWallets: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': props.apiKey,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      return undefined;
    }
  };

  const getRoomInfo = async (roomId: string) => {
    try {
      const response = await axios.get(
        `https://iriko.testing.huddle01.com/api/v1/meeting-details/${roomId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': props.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      return undefined;
    }
  };

  const onCreateMeeting = async () => {
    setCreatingRoom(true);
    const createdRoom = await createRoom();
    if (createdRoom) {
      setRoomId(createdRoom.roomId);
      joinLobby(createdRoom.roomId);
    }
  };

  const onJoinMeeting = async () => {
    setJoiningRoom(true);
    const roomInfo = await getRoomInfo(inputRoomId);
    if (roomInfo) {
      setRoomId(roomId);
      joinLobby(inputRoomId);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView bounces={false}>
        <View style={styles.header}>
          {props.logo && (
            <Image
              source={props.logo}
              style={styles.logo}
              resizeMode={'contain'}
            />
          )}
        </View>

        {/* Create Meeting section */}
        {!createMeetingSectionProps.hide && (
          <View
            style={{
              ...styles.sectionContainer,
              backgroundColor: createMeetingSectionProps.backgroundColor,
            }}>
            <Text
              style={{
                ...styles.sectionTitle,
                color: createMeetingSectionProps.titleColor,
              }}
              ellipsizeMode="middle"
              numberOfLines={1}>
              {createMeetingSectionProps.title}
            </Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: isCreatingRoom
                      ? undefined
                      : createMeetingSectionProps.buttonColor,
                    borderColor: isCreatingRoom
                      ? createMeetingSectionProps.buttonColor
                      : undefined,
                  },
                ]}
                disabled={isCreatingRoom}
                onPress={onCreateMeeting}>
                {isCreatingRoom && (
                  <View style={styles.progressHudContainer}>
                    <MaterialIndicator
                      color={createMeetingSectionProps.buttonColor}
                      size={20}
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: createMeetingSectionProps.buttonTextColor,
                    },
                  ]}>
                  {'Start Meeting'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Join Meeting section */}
        {!joinMeetingSectionProps.hide && (
          <View
            style={{
              ...styles.sectionContainer,
              backgroundColor: joinMeetingSectionProps.backgroundColor,
            }}>
            <Text
              style={{
                ...styles.sectionTitle,
                color: joinMeetingSectionProps.titleColor,
              }}
              ellipsizeMode="middle"
              numberOfLines={1}>
              {joinMeetingSectionProps.title}
            </Text>
            <View
              style={{
                ...styles.roomIdInputContainer,
                backgroundColor: joinMeetingSectionProps.inputBackgroundColor,
                borderColor: joinMeetingSectionProps.inputBorderColor,
              }}>
              <TextInput
                style={{
                  ...styles.roomIdInput,
                  color: joinMeetingSectionProps.inputTextColor,
                }}
                placeholder={joinMeetingSectionProps.inputPlaceholder}
                placeholderTextColor={
                  joinMeetingSectionProps.inputPlaceholderColor
                }
                onChangeText={text => setInputRoomId(text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: isJoiningRoom
                      ? undefined
                      : joinMeetingSectionProps.buttonColor,
                    borderColor: isJoiningRoom
                      ? joinMeetingSectionProps.buttonColor
                      : undefined,
                  },
                  !inputRoomId ? styles.disabledButton : undefined,
                ]}
                disabled={isJoiningRoom || !inputRoomId}
                onPress={onJoinMeeting}>
                {isJoiningRoom && (
                  <View style={styles.progressHudContainer}>
                    <MaterialIndicator
                      color={joinMeetingSectionProps.buttonColor}
                      size={20}
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: joinMeetingSectionProps.buttonTextColor,
                    },
                    !inputRoomId ? styles.disabledButtonText : undefined,
                  ]}>
                  {'Join Meeting'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

HHome.defaultProps = {};

export default HHome;

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  logo: {
    width: undefined,
    height: 25,
    marginLeft: 5,
    aspectRatio: 4.5,
  },
  sectionContainer: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#1C1E24',
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#475569',
  },
  roomIdInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomIdInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 15,
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
