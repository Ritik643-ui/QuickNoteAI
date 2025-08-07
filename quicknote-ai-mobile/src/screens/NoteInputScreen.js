import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 
const NoteInputScreen = ({ navigation }) => {
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSummarize = async () => {
    if (!noteText.trim()) {
      Alert.alert('Empty Note', 'Please enter some text to summarize.');
      return;
    }
 
    setIsLoading(true);
 
    // Mock data version (replace with your actual API call)
    setTimeout(() => {
      const mockSummaryData = {
        title: "AI Summary of Your Note",
        summary: `Here's what I found in your note: ${noteText.substring(0, 100)}... The main points have been organized and key themes identified.`,
        tags: ["note", "summary", "ai-generated", "organized"],
        sentiment: "neutral"
      };
      
      navigation.navigate('Summary', { summaryData: mockSummaryData });
      setNoteText('');
      setIsLoading(false);
    }, 2000);
 
    
    try {
      const response = await fetch('http://10.0.0.139:8080/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: noteText,
        }),
      });
 
      if (!response.ok) {
        throw new Error('Failed to summarize');
      }
 
      const summaryData = await response.json();
      navigation.navigate('Summary', { summaryData });
      setNoteText('');
    } catch (error) {
      console.error('Error summarizing:', error);
      Alert.alert(
        'Error', 
        'Failed to summarize your note. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
    
  };
 
  const clearText = () => {
    setNoteText('');
  };
 
  const navigateToSavedNotes = () => {
    navigation.navigate('SavedNotes');
  };
 
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Saved Notes Button */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>📝 New Note</Text>
            <Text style={styles.headerSubtitle}>
              Paste your messy notes or transcripts below
            </Text>
          </View>
          <TouchableOpacity
            style={styles.savedNotesButton}
            onPress={navigateToSavedNotes}
            activeOpacity={0.7}
          >
            <Text style={styles.savedNotesIcon}>📚</Text>
            <Text style={styles.savedNotesText}>Saved</Text>
          </TouchableOpacity>
        </View>
      </View>
 
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Text Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.textInputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Start typing or paste your notes here..."
                placeholderTextColor="#8E8E93"
                value={noteText}
                onChangeText={setNoteText}
                multiline
                textAlignVertical="top"
              />
              
              {/* Character count and clear button */}
              {noteText.length > 0 && (
                <View style={styles.inputFooter}>
                  <Text style={styles.characterCount}>
                    {noteText.length} characters
                  </Text>
                  <TouchableOpacity onPress={clearText} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
 
          {/* Sample text suggestions */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>💡 Try pasting:</Text>
            <Text style={styles.suggestionItem}>• Meeting transcripts or voice memos</Text>
            <Text style={styles.suggestionItem}>• Brainstorming sessions or random thoughts</Text>
            <Text style={styles.suggestionItem}>• Research notes or article highlights</Text>
          </View>
        </ScrollView>
 
        {/* Bottom Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSummarize}
            disabled={isLoading || !noteText.trim()}
            style={[
              styles.submitButton,
              (isLoading || !noteText.trim()) && styles.submitButtonDisabled
            ]}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.submitButtonText}>Summarizing...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>✨ Summarize with AI</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerContainer: {
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#636366',
    lineHeight: 18,
  },
  savedNotesButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
    minWidth: 70,
  },
  savedNotesIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  savedNotesText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  textInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 300,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    lineHeight: 22,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  characterCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#48484A',
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
    marginBottom: 12,
  },
  suggestionItem: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#AEAEB2',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
 
export default NoteInputScreen;