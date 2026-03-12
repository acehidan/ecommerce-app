import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Slider from '@react-native-community/slider';

/**
 * VoiceMessagePlayer Component (Updated for expo-audio)
 * Handles playback of recorded audio messages with a progress bar and duration.
 */
export default function VoiceMessagePlayer({ uri, duration, isUser }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const totalDuration = (status.duration || duration / 1000 || 0) * 1000;
  const currentPosition = (status.currentTime || 0) * 1000;

  const playPauseToggle = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (status.currentTime >= status.duration && status.duration > 0) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const onSliderValueChange = (value) => {
    player.seekTo(value / 1000);
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.adminContainer]}>
      <Pressable onPress={playPauseToggle} style={styles.playButton}>
        {!status.isLoaded && !status.playing && status.currentTime === 0 ? (
          <ActivityIndicator size="small" color={isUser ? "#FFFFFF" : "#3B82F6"} />
        ) : (
          <Ionicons
            name={status.playing ? "pause" : "play"}
            size={24}
            color={isUser ? "#FFFFFF" : "#3B82F6"}
          />
        )}
      </Pressable>

      <View style={styles.sliderWrapper}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={totalDuration || 1}
          value={currentPosition}
          onSlidingComplete={onSliderValueChange}
          minimumTrackTintColor={isUser ? "#FFFFFF" : "#3B82F6"}
          maximumTrackTintColor={isUser ? "rgba(255,255,255,0.3)" : "#D1D5DB"}
          thumbTintColor={isUser ? "#FFFFFF" : "#3B82F6"}
        />
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {formatTime(currentPosition)}
          </Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {formatTime(totalDuration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    width: 220,
    borderRadius: 12,
  },
  userContainer: {
    backgroundColor: 'transparent',
  },
  adminContainer: {
    backgroundColor: 'transparent',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sliderWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  slider: {
    width: '100%',
    height: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  timeText: {
    fontSize: 10,
    color: '#6B7280',
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.8)',
  },
});
