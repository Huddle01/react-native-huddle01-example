import React, {FC, useLayoutEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LayoutMeasurer from './LayoutMeasurer';

interface IProps {
  stickyLeft?: boolean;
  initialOffsetY?: number;
  children: React.ReactNode;
}

const between = (min: number, max: number, value: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

const DraggableView: FC<IProps> = ({
  stickyLeft,
  initialOffsetY = 0,
  children,
}) => {
  const [containerLayout, setContainerLayout] = useState({
    width: 0,
    height: 0,
  });

  const [draggableLayout, setDraggableLayout] = useState({
    width: 0,
    height: 0,
  });

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const savedOffset = useSharedValue({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    const yPosition =
      initialOffsetY >= 0
        ? initialOffsetY
        : containerLayout.height - draggableLayout.height + initialOffsetY;

    if (stickyLeft) {
      offsetX.value = 0;
      offsetY.value = yPosition;
      savedOffset.value = {
        x: 0,
        y: yPosition,
      };
    } else {
      offsetX.value = containerLayout.width - draggableLayout.width;
      offsetY.value = yPosition;
      savedOffset.value = {
        x: containerLayout.width - draggableLayout.width,
        y: yPosition,
      };
    }
  }, [
    containerLayout,
    draggableLayout,
    initialOffsetY,
    offsetX,
    offsetY,
    savedOffset,
    stickyLeft,
  ]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate(e => {
          offsetX.value = between(
            0,
            containerLayout.width - draggableLayout.width,
            e.translationX + savedOffset.value.x,
          );
          offsetY.value = between(
            0,
            containerLayout.height - draggableLayout.height,
            e.translationY + savedOffset.value.y,
          );
        })
        .onFinalize(() => {
          let finalX = 0.0;
          let finalY = 0.0;
          const centerX = offsetX.value + draggableLayout.width / 2;
          const centerY = offsetY.value + draggableLayout.height / 2;

          if (centerX < containerLayout.width / 2) {
            finalX = 0;
          } else {
            finalX = containerLayout.width - draggableLayout.width;
          }

          if (centerY < containerLayout.height / 2) {
            finalY = 0;
          } else {
            finalY = containerLayout.height - draggableLayout.height;
          }

          offsetX.value = withTiming(finalX);
          offsetY.value = withTiming(finalY);

          savedOffset.value = {
            x: finalX,
            y: finalY,
          };
        }),
    [offsetX, offsetY, savedOffset, containerLayout, draggableLayout],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offsetX.value,
        },
        {
          translateY: offsetY.value,
        },
      ],
    };
  });

  return (
    <>
      <LayoutMeasurer onLayout={setContainerLayout} />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          {!!containerLayout.width && React.Children.only(children)}
          <LayoutMeasurer onLayout={setDraggableLayout} />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default DraggableView;
