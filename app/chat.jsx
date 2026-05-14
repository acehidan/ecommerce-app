import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated as RNAnimated,
  PanResponder,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';
import VoiceMessagePlayer from './components/VoiceMessagePlayer';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { io } from 'socket.io-client';
import { getMessages, sendMessage } from '../services/chat/messages';
import { useAuthStore } from '../store/authStore';

const socket = io.connect('https://api.komindiystore.com', {
  transports: ['websocket'],
  secure: true,
});

const SoundWave = () => {
  const animValues = useRef([
    new RNAnimated.Value(1),
    new RNAnimated.Value(1),
    new RNAnimated.Value(1),
    new RNAnimated.Value(1),
    new RNAnimated.Value(1),
  ]).current;

  useEffect(() => {
    const animations = animValues.map((anim, i) =>
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(anim, {
            toValue: 1.5 + Math.random() * 2,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(anim, {
            toValue: 1,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.soundWaveContainer}>
      {animValues.map((anim, i) => (
        <RNAnimated.View
          key={i}
          style={[styles.soundWaveBar, { transform: [{ scaleY: anim }] }]}
        />
      ))}
    </View>
  );
};

const LoadingImage = ({ source, style, resizeMode, modal = false }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[style, styles.imageLoadingContainer]}>
      <Image
        source={source}
        style={[
          style,
          loading ? { position: 'absolute', opacity: 0 } : { opacity: 1 },
        ]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={[styles.skeletonOverlay, style]}>
          <ActivityIndicator size={modal ? 'large' : 'small'} color="#3B82F6" />
        </View>
      )}
    </View>
  );
};

export default function Chat() {
  // ── State ──────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [fullViewImage, setFullViewImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const initialLoadComplete = useRef(false);

  // ── Voice Recording Setup (expo-audio) ────────────────────────────────
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 100);

  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const dxAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const isCancelled = useRef(false);
  const isMicPressed = useRef(false);
  const isRecordingStarted = useRef(false);
  const pressTimer = useRef(null);

  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { user } = useAuthStore();

  // ── Socket connection listeners (on mount) ─────────────────────────────
  useEffect(() => {
    socket.on('connect', () => {
      // console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      // console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      // console.error('Socket connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('chat:message');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync();
  }, []);

  // ── Join room & start listening for messages ───────────────────────────
  const joinAndListen = (convId) => {
    // console.log('joinAndListen called with:', convId);

    // Remove any previous listener to avoid duplicates
    socket.off('chat:message');

    // Register the message listener (with duplicate check)
    socket.on('chat:message', (message) => {
      // console.log('Incoming message:', message);
      setMessages((prev) => {
        // Skip if message already exists in state (avoid duplicate keys)
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    // Helper to emit join
    const emitJoin = () => {
      socket.emit('chat:join', convId);
      // console.log('Joined conversation:', convId);
    };

    // If socket is already connected, join immediately
    // Otherwise, wait for connection first
    if (socket.connected) {
      emitJoin();
    } else {
      // console.log('Socket not connected yet, waiting to join...');
      socket.once('connect', () => {
        emitJoin();
      });
    }
  };

  // ── Load existing messages on mount ────────────────────────────────────
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async (pageNum = 1) => {
    // console.log('loadMessages called for page:', pageNum);
    try {
      if (pageNum === 1) setLoading(true);
      else setFetchingMore(true);

      const response = await getMessages(pageNum, 20);
      if (response.success) {
        // console.log(`Page ${pageNum} loaded:`, response.data);
        const newMessages = response.data.messages.reverse();

        if (newMessages.length === 0) {
          setHasMore(false);
        } else {
          setMessages((prev) => {
            if (pageNum === 1) return newMessages;
            // Filter out any duplicates that might have come in via socket
            const filteredNew = newMessages.filter(
              (nm) => !prev.some((pm) => pm._id === nm._id),
            );
            return [...filteredNew, ...prev];
          });
          setPage(pageNum);
        }

        if (pageNum === 1 && response.data.conversation?._id) {
          setConversationId(response.data.conversation._id);
          joinAndListen(response.data.conversation._id);
        }
      }
    } catch (error) {
      // console.error('Error loading messages:', error);
      if (pageNum === 1) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load messages',
        });
      }
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const loadMoreMessages = () => {
    if (!fetchingMore && hasMore) {
      loadMessages(page + 1);
    }
  };

  const handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    // When y is near 0, user is at the top
    // Only trigger if initial load is complete to avoid loading page 2 immediately
    if (
      y < 50 &&
      hasMore &&
      !fetchingMore &&
      !loading &&
      initialLoadComplete.current
    ) {
      loadMoreMessages();
    }
  };

  // ── Send Message Handler (always HTTP POST) ─────────────────────────────
  const handleSendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);

    try {
      const response = await sendMessage(text);
      if (response.success) {
        if (!conversationId && response.data.conversation?._id) {
          setConversationId(response.data.conversation._id);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to send message',
        });
      }
    } catch (error) {
      // console.error('Error sending message:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message',
      });
    } finally {
      setSending(false);
    }
  }, [input, sending, conversationId]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Sorry, we need camera roll permissions to make this work!',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      await handleSendImage(asset);
    }
  };

  const handleSendImage = async (asset) => {
    if (sending) return;
    setSending(true);

    try {
      const formData = new FormData();

      const filename = asset.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('message', {
        uri: asset.uri,
        name: filename,
        type: type,
      });

      const response = await sendMessage(formData);
      // console.log("res", response);

      if (response.success) {
        // console.log('Image sent successfully');
        if (!conversationId && response.data.conversation?._id) {
          setConversationId(response.data.conversation._id);
          setMessages(response.data.messages);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to send image',
        });
      }
    } catch (error) {
      // console.error('Error sending image:', error.response);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send image',
      });
    } finally {
      setSending(false);
    }
  };

  // ── Helper Functions ───────────────────────────────────────────────────
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUserMessage = (message) => {
    return message.senderModel === 'User';
  };

  const getSenderName = (message) => {
    if (message.senderModel === 'User') {
      return message.senderId?.userName || 'You';
    }
    return message.senderId?.name || 'Admin';
  };

  useEffect(() => {
    if (conversationId) {
      // console.log('conversationId', conversationId);
      joinAndListen(conversationId);
    }
  }, [conversationId]);

  // Auto-scroll logic helper
  const scrollToBottom = useCallback((animated = true) => {
    if (scrollViewRef.current) {
      // Use setImmediate or a small timeout to ensure content is rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated });
      }, 100);
    }
  }, []);

  // ── Voice Recording Handlers ──────────────────────────────────────────
  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Microphone access is required for voice messages.',
        });
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Reset state for new recording
      isRecordingStarted.current = false;
      isCancelled.current = false;
      slideAnim.setValue(0);
      dxAnim.setValue(0);

      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      isRecordingStarted.current = true;

      // If user released before recording started, stop it now
      if (!isMicPressed.current) {
        stopRecording(false);
        return;
      }

      // Start pulsing animation
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          RNAnimated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } catch (err) {
      // console.error('Failed to start recording', err);
      isRecordingStarted.current = false;
      isMicPressed.current = false;
    }
  };

  const stopRecording = async (shouldSend = true) => {
    // If it never started recording, there's nothing to stop
    if (!isRecordingStarted.current) {
      return;
    }

    isRecordingStarted.current = false;

    try {
      scaleAnim.stopAnimation(() => {
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start();
      });

      const uri = audioRecorder.uri;

      // Wrapping stop in a try-catch to ignore native "stop failed" errors
      // which often happen if called too quickly after start.
      try {
        await audioRecorder.stop();
      } catch (stopErr) {
        // console.warn('Native recording stop error (ignoring):', stopErr.message);
        // If stop fails, we shouldn't send whatever was captured
        return;
      }

      // Simple duration check - avoid sending extremely short accidental taps (e.g. < 500ms)
      const duration = recorderState.durationMillis;
      const isTooShort = duration < 500;

      if (shouldSend && !isCancelled.current && uri && !isTooShort) {
        await handleSendAudio(uri);
      }
    } catch (err) {
      // console.error('Failed to stop recording', err);
    }
  };

  const handleSendAudio = async (uri) => {
    if (sending) return;
    setSending(true);

    try {
      const formData = new FormData();
      const filename = uri.split('/').pop();

      formData.append('message', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: filename || 'voice_message.m4a',
        type: 'audio/m4a',
      });

      const response = await sendMessage(formData);
      if (response.success) {
        if (!conversationId && response.data.conversation?._id) {
          setConversationId(response.data.conversation._id);
        }
      }
    } catch (error) {
      // console.error('Error sending audio:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send voice message',
      });
    } finally {
      setSending(false);
    }
  };

  const startRecordingRef = useRef(startRecording);
  const stopRecordingRef = useRef(stopRecording);
  useEffect(() => {
    startRecordingRef.current = startRecording;
    stopRecordingRef.current = stopRecording;
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: () => {
          isMicPressed.current = true;
          // Clear any existing timer
          if (pressTimer.current) clearTimeout(pressTimer.current);

          // Delay starting the recording by 200ms to avoid accidental taps
          pressTimer.current = setTimeout(() => {
            if (isMicPressed.current) {
              startRecordingRef.current();
            }
          }, 200);
        },
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.dx < 0) {
            dxAnim.setValue(gestureState.dx);
          }
          if (gestureState.dx < -80) {
            if (!isCancelled.current) {
              isCancelled.current = true;
              RNAnimated.timing(slideAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }).start();
            }
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          isMicPressed.current = false;
          if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
          }

          const shouldSend = gestureState.dx >= -80;
          stopRecordingRef.current(shouldSend);

          RNAnimated.spring(dxAnim, {
            toValue: 0,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          isMicPressed.current = false;
          if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
          }
          stopRecordingRef.current(false);
          RNAnimated.spring(dxAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [],
  );

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      > */}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Customer Support</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={(w, h) => {
          // If we are loading more messages, we want to maintain scroll position
          if (fetchingMore) {
            const heightDiff = h - contentHeight;
            scrollViewRef.current?.scrollTo({ y: heightDiff, animated: false });
          } else if (page === 1) {
            scrollToBottom();
          }
          setContentHeight(h);
        }}
        onLayout={scrollToBottom}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {fetchingMore && (
          <ActivityIndicator
            size="small"
            color="#3B82F6"
            style={{ marginVertical: 10 }}
          />
        )}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Start a Conversation</Text>
            <Text style={styles.emptyText}>
              Send a message to connect with our support team.
            </Text>
          </View>
        ) : (
          messages.map((message, index) => (
            <View
              key={message._id || index}
              style={[
                styles.messageContainer,
                isUserMessage(message)
                  ? styles.userMessageContainer
                  : styles.adminMessageContainer,
              ]}
            >
              {/* Show admin avatar for admin messages */}
              {!isUserMessage(message) && (
                <View style={styles.adminAvatar}>
                  <Ionicons name="headset-outline" size={16} color="#3B82F6" />
                </View>
              )}

              <View style={styles.messageBubbleWrapper}>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedMessageId((prev) =>
                      prev === (message._id || index)
                        ? null
                        : message._id || index,
                    )
                  }
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isUserMessage(message)
                        ? styles.userBubble
                        : styles.adminBubble,
                      message.messageType === 'image' && styles.imageBubble,
                    ]}
                  >
                    {message.messageType === 'image' ? (
                      <TouchableOpacity
                        onPress={() => {
                          setFullViewImage(message.message);
                          setIsModalVisible(true);
                        }}
                      >
                        <LoadingImage
                          source={{ uri: message.message }}
                          style={styles.chatImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ) : message.messageType === 'voice' ? (
                      <VoiceMessagePlayer
                        uri={message.message}
                        duration={message.duration}
                        isUser={isUserMessage(message)}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.messageText,
                          isUserMessage(message)
                            ? styles.userMessageText
                            : styles.adminMessageText,
                        ]}
                      >
                        {message.message}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {selectedMessageId === (message._id || index) && (
                  <View
                    style={[
                      styles.messageInfo,
                      isUserMessage(message)
                        ? styles.userMessageInfo
                        : styles.adminMessageInfo,
                    ]}
                  >
                    <Text style={styles.messageInfoText}>
                      {getSenderName(message)} • {formatTime(message.createdAt)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input Area */}
      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom || 12 }]}
      >
        {recorderState.isRecording ? (
          <RNAnimated.View
            style={[
              styles.recordingContainer,
              { transform: [{ translateX: dxAnim }] },
            ]}
          >
            <View style={styles.recordingInfo}>
              <Ionicons name="mic" size={20} color="#EF4444" />
              <Text style={styles.recordingDuration}>
                {Math.floor(recorderState.durationMillis / 60000)}:
                {((recorderState.durationMillis % 60000) / 1000)
                  .toFixed(0)
                  .padStart(2, '0')}
              </Text>
              <SoundWave />
            </View>
            <RNAnimated.Text
              style={[
                styles.slideCancelText,
                {
                  opacity: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              Slide to cancel
            </RNAnimated.Text>
          </RNAnimated.View>
        ) : (
          <View style={styles.inputRow}>
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={sending}
              style={styles.attachButton}
            >
              <Ionicons name="image-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
              multiline
              maxLength={500}
              editable={!sending}
            />
          </View>
        )}

        <View style={styles.actionButtons}>
          {recorderState.isRecording || input.trim() === '' ? (
            <RNAnimated.View
              {...panResponder.panHandlers}
              style={[
                styles.sendButton,
                styles.micButton,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Ionicons name="mic" size={24} color="#fff" />
            </RNAnimated.View>
          ) : (
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!input.trim() || sending}
              style={[
                styles.sendButton,
                input.trim() && !sending
                  ? styles.sendButtonActive
                  : styles.sendButtonDisabled,
              ]}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={input.trim() && !sending ? '#fff' : '#999'}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}

      {/* Full View Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.modalContent}>
            {fullViewImage && (
              <LoadingImage
                source={{ uri: fullViewImage }}
                style={{ width: windowWidth, height: windowHeight }}
                resizeMode="contain"
                modal={true}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerSpacer: {
    width: 40,
  },
  // Messages
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  // Message Bubbles
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  adminMessageContainer: {
    justifyContent: 'flex-start',
  },
  adminAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 20,
  },
  messageBubbleWrapper: {
    maxWidth: '75%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  chatImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageBubble: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  adminMessageText: {
    color: '#1F2937',
  },
  messageInfo: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  userMessageInfo: {
    alignItems: 'flex-end',
  },
  adminMessageInfo: {
    alignItems: 'flex-start',
  },
  messageInfoText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  // Input
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  slideCancelText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    marginBottom: 2,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    marginBottom: 2,
  },
  micButton: {
    backgroundColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  soundWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 8,
    height: 20,
  },
  soundWaveBar: {
    width: 2,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  skeletonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
});
