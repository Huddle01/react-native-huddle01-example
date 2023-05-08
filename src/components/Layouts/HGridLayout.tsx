import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import HViewport from '../HViewport';
import {ILayoutProps} from './types';

interface HGridLayoutProps extends ILayoutProps {}

const HGridLayout = (props: HGridLayoutProps) => {
  const [viewListSize, setViewListSize] = useState({width: 0, height: 0});
  const [largeViewItemHeight, setLargeViewItemHeight] = useState(100);
  const [viewItemHeight, setViewItemHeight] = useState(100);

  const calculateViewHeights = (containerSize: any) => {
    const itemWidth = ((containerSize.width ?? 4) - 4) / 2;
    const itemHeight = itemWidth;
    const containerHeight = (containerSize.height ?? 60) - 60;

    setViewItemHeight(itemHeight);
    setLargeViewItemHeight(containerHeight / 3);
  };

  const peers = props.peers;
  const peerIds = Object.keys(peers);
  const peerArray = [props.me, ...peerIds.map(peerId => peers[peerId])];

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

      {props.renderBottomTool && props.renderBottomTool()}
    </View>
  );
};

HGridLayout.defaultProps = {
  peers: [],
  me: {},
  viewportBgColor: '#181A20',
  peerNameColor: '#E2E8F0',
  renderBottomTool: undefined,
};

export default HGridLayout;

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
});
