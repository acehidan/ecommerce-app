import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getMessages, sendMessage } from '../services/chat/messages';
import { useAuthStore } from '../store/authStore';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await getMessages();
      if (response.success) {
        setMessages(response.data.messages.reverse());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await sendMessage(messageText);
      if (response.success) {
        loadMessages();
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

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
      return message.senderId.userName || 'You';
    }
    return message.senderId.name || 'Admin';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Customer Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {loading ? (
            <View style={styles.centerContainer}>
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                No messages yet. Start a conversation!
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message._id}
                style={[
                  styles.messageContainer,
                  isUserMessage(message)
                    ? styles.userMessageContainer
                    : styles.adminMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUserMessage(message)
                      ? styles.userBubble
                      : styles.adminBubble,
                  ]}
                >
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
                </View>
                <View style={styles.messageInfo}>
                  <Text style={styles.messageInfoText}>
                    {getSenderName(message)} • {formatTime(message.createdAt)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              style={styles.textInput}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              style={[
                styles.sendButton,
                newMessage.trim() && !sending
                  ? styles.sendButtonActive
                  : styles.sendButtonDisabled,
              ]}
            >
              <Ionicons
                name="send"
                size={20}
                color={newMessage.trim() && !sending ? '#fff' : '#999'}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 32,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  adminMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  adminMessageText: {
    color: '#1F2937',
  },
  messageInfo: {
    marginTop: 4,
    paddingHorizontal: 8,
  },
  messageInfoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
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
    backgroundColor: '#D1D5DB',
  },
});
