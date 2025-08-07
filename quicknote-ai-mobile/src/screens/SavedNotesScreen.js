import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
 
const SavedNotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
 
  const fetchNotes = async () => {
    try {
      const response = await fetch('http://10.0.0.139:8080/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      Alert.alert('Error', 'Failed to load saved notes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
 
  useEffect(() => {
    fetchNotes();
  }, []);
 
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes();
  }, []);
 
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://10.0.0.139:8080/api/notes/${id}`, {
        method: 'DELETE',
      });
 
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
 
      setNotes(notes.filter(note => note.id !== id));
      Alert.alert('Success', 'Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note');
    }
  };
 
  const confirmDelete = (id, title) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
      ]
    );
  };
 
  const getSentimentStyle = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return { color: '#4CAF50', emoji: '😊' };
      case 'negative':
        return { color: '#F44336', emoji: '😔' };
      default:
        return { color: '#2196F3', emoji: '😐' };
    }
  };
 
  const renderDeleteButton = (id, title) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => confirmDelete(id, title)}
    >
      <Text style={styles.deleteButtonText}>🗑️</Text>
      <Text style={styles.deleteButtonLabel}>Delete</Text>
    </TouchableOpacity>
  );
 
  const renderNoteItem = ({ item }) => {
    const sentimentStyle = getSentimentStyle(item.sentiment);
    
    return (
      <Swipeable
        renderRightActions={() => renderDeleteButton(item.id, item.title)}
        rightThreshold={40}
      >
        <TouchableOpacity
          style={styles.noteCard}
          onPress={() => navigation.navigate('Summary', { summaryData: item })}
          activeOpacity={0.7}
        >
          <View style={styles.noteHeader}>
            <Text style={styles.noteTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.sentimentContainer}>
              <Text style={styles.sentimentEmoji}>{sentimentStyle.emoji}</Text>
            </View>
          </View>
          
          <Text style={styles.noteSummary} numberOfLines={3}>
            {item.summary}
          </Text>
          
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
              {item.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
              )}
            </View>
          )}
          
          <View style={styles.noteFooter}>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <Text style={[styles.sentimentText, { color: sentimentStyle.color }]}>
              {item.sentiment}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
 
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No Saved Notes</Text>
      <Text style={styles.emptySubtitle}>
        Create your first AI summary to see it here!
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('NoteInput')}
      >
        <Text style={styles.createButtonText}>✨ Create New Note</Text>
      </TouchableOpacity>
    </View>
  );
 
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading your notes...</Text>
        </View>
      </SafeAreaView>
    );
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Saved Notes</Text>
        <Text style={styles.headerSubtitle}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
        </Text>
      </View>
 
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={notes.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  list: {
    paddingHorizontal: 20,
  },
  emptyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  sentimentContainer: {
    alignItems: 'center',
  },
  sentimentEmoji: {
    fontSize: 20,
  },
  noteSummary: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: 16,
  },
  deleteButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  deleteButtonLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
 
export default SavedNotesScreen;