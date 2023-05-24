import {DeviceEventEmitter} from 'react-native';
import InCallManager from 'react-native-incall-manager';

class ICallManager {
  isCallStarted: boolean = false;

  constructor() {}

  start() {
    InCallManager.start({media: 'video'});
    InCallManager.setKeepScreenOn(true);
    this.isCallStarted = true;
  }

  stop() {
    InCallManager.stop();
    DeviceEventEmitter.removeAllListeners();
    this.isCallStarted = false;
  }
}

const CallManager = new ICallManager();
export default CallManager;
