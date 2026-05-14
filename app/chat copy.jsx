import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';

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

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

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
  const initialLoadComplete = useRef(false);

  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  // ── Socket connection listeners (on mount) ─────────────────────────────
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.off('chat:message');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
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
      console.error('Error loading messages:', error);
      if (pageNum === 1) Alert.alert('Error', 'Failed to load messages');
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
      // Optimistically add the message to local state
      // const optimisticMessage = {
      //   _id: Date.now().toString(),
      //   message: text,
      //   senderModel: 'User',
      //   senderId: {
      //     _id: user?._id,
      //     userName: user?.userName || 'You',
      //   },
      //   createdAt: new Date().toISOString(),
      // };

      // Always send via HTTP POST
      const response = await sendMessage(text);

      if (response.success) {
        // console.log('Message sent:', response.data);

        // If we don't have a conversationId yet, get it from response
        // (the useEffect on conversationId will handle join & listen)
        if (!conversationId && response.data.conversation?._id) {
          setConversationId(response.data.conversation._id);
        }
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  }, [input, sending, conversationId, user]);

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

  // Auto-scroll whenever messages change (only for first page or new messages)
  useEffect(() => {
    if (messages.length > 0 && page === 1) {
      scrollToBottom();
      // Mark initial load as complete after the first scroll to bottom
      if (!initialLoadComplete.current) {
        setTimeout(() => {
          initialLoadComplete.current = true;
          // console.log('Initial load complete');
        }, 500);
      }
    }
  }, [messages, page, scrollToBottom]);

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
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
              scrollViewRef.current?.scrollTo({
                y: heightDiff,
                animated: false,
              });
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
                    <Ionicons
                      name="headset-outline"
                      size={16}
                      color="#3B82F6"
                    />
                  </View>
                )}

                <View style={styles.messageBubbleWrapper}>
                  <Pressable
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
                        message.messageType === 'image'
                          ? styles.imageBubble
                          : isUserMessage(message)
                            ? styles.userBubble
                            : styles.adminBubble,
                      ]}
                    >
                      {/* {console.log(message)} */}
                      <View style={styles.imageWrapper}>
                        {/* {console.log(message.message)} */}
                        <Image
                          source={{ uri: message.message }}
                          style={styles.image}
                          contentFit="cover"
                          transition={1000}
                        />
                      </View>
                      {/* {message.messageType === 'image' ? (
                        <View style={styles.imageWrapper}>
                          <Image
                            source={{ uri: "https://media.istockphoto.com/id/1973365581/vector/sample-ink-rubber-stamp.jpg?s=612x612&w=0&k=20&c=_m6hNbFtLdulg3LK5LRjJiH6boCb_gcxPvRLytIz0Ws=" }}
                            style={styles.image}
                          />
                        </View>
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
                      )} */}
                    </View>
                  </Pressable>

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
                        {getSenderName(message)} •{' '}
                        {formatTime(message.createdAt)}
                        {message.messageType === 'image' &&
                          `\nURL: ${message.message.substring(0, 30)}...`}
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
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom || 12 },
          ]}
        >
          <View style={styles.inputRow}>
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
            <Pressable
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
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  imageBubble: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  imageWrapper: {
    backgroundColor: 'red',
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatImage: {
    width: 240,
    height: 180,
    // backgroundColor: '#E5E7EB', // Visible grey placeholder
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
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
});
