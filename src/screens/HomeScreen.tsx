import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useRegion } from '../context/RegionContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAnswer } from '../services/api';
import { Pulse } from 'react-native-animated-spinkit';

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { region } = useRegion();
  const navigation = useNavigation();

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetchAnswer(question, region);
      
      // Navigate to Answer screen with the result
      navigation.navigate('Answer', { 
        questionData: {
          id: Date.now().toString(),
          question,
          answer: response.answer,
          region,
          timestamp: Date.now(),
          standard: response.standard,
          clause: response.clause
        }
      });
      
      // Clear the question field after successful submission
      setQuestion('');
    } catch (error) {
      console.error('Error fetching answer:', error);
      // Show error message (would use proper error handling in production)
      alert('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoidView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
                style={styles.logo}
              />
              <Text style={[styles.title, { color: theme.colors.primary }]}>RegiMate</Text>
              <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                Your Electrical Standards Assistant
              </Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.regionText, { color: theme.colors.secondary }]}>
                Current Region: {region.country}{region.state ? `, ${region.state}` : ''}
              </Text>
              
              <TextInput
                label="Ask a question"
                value={question}
                onChangeText={setQuestion}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={[styles.input, { backgroundColor: theme.colors.background }]}
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                theme={{ colors: { text: theme.colors.text } }}
              />
              
              <Button 
                mode="contained" 
                onPress={handleAskQuestion}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                labelStyle={styles.buttonLabel}
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Pulse size={24} color="#ffffff" />
                    <Text style={styles.loadingText}>Searching...</Text>
                  </View>
                ) : "Ask"}
              </Button>
            </View>

            <View style={styles.helpTextContainer}>
              <Text style={[styles.helpText, { color: theme.colors.secondary }]}>
                Ask questions about electrical standards, regulations, or code requirements.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  regionText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
  },
  helpTextContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  helpText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});