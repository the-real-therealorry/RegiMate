import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Share,
  Animated
} from 'react-native';
import { Card, Text, Button, IconButton, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites, QuestionAnswer } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnswerScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { answerSettings } = useSettings();
  const [showFullClause, setShowFullClause] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Get question data from route params or show last answer
  const [questionData, setQuestionData] = useState<QuestionAnswer | null>(null);

  useEffect(() => {
    if (route.params?.questionData) {
      setQuestionData(route.params.questionData);
    } else if (favorites.length > 0) {
      // Show most recent favorite if no data passed
      setQuestionData(favorites[0]);
    }

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [route.params?.questionData]);

  if (!questionData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-outline" size={80} color={theme.colors.secondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Ask a question on the home screen to see an answer here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const toggleFavorite = () => {
    if (isFavorite(questionData.id)) {
      removeFavorite(questionData.id);
    } else {
      addFavorite(questionData);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Question: ${questionData.question}\n\nAnswer: ${questionData.answer}\n\nFrom RegiMate - Your Electrical Standards Assistant`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(
      `Question: ${questionData.question}\n\nAnswer: ${questionData.answer}`
    );
    // Show feedback (would use proper toast in production)
    alert('Copied to clipboard');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
          <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Card.Content>
              <Text style={[styles.dateText, { color: theme.colors.secondary }]}>
                {new Date(questionData.timestamp).toLocaleString()}
              </Text>
              
              <Text style={[styles.question, { color: theme.colors.text }]}>
                {questionData.question}
              </Text>
              
              <Divider style={styles.divider} />
              
              <Text style={[
                styles.answer, 
                { 
                  color: theme.colors.text,
                  fontSize: answerSettings.fontSize 
                }
              ]}>
                {questionData.answer}
              </Text>

              {questionData.standard && (
                <View style={styles.standardContainer}>
                  <Text style={[styles.standardText, { color: theme.colors.secondary }]}>
                    Standard: {questionData.standard}
                  </Text>
                  {questionData.clause && (
                    <Text style={[styles.standardText, { color: theme.colors.secondary }]}>
                      Clause: {questionData.clause}
                    </Text>
                  )}
                </View>
              )}
            </Card.Content>

            <Card.Actions style={styles.actionButtons}>
              {questionData.clause && (
                <Button 
                  mode="outlined" 
                  onPress={() => setShowFullClause(!showFullClause)}
                  style={styles.actionButton}
                >
                  {showFullClause ? "Hide Full Clause" : "View Full Clause"}
                </Button>
              )}

              <Button 
                mode="outlined" 
                onPress={copyToClipboard}
                style={styles.actionButton}
                icon="content-copy"
              >
                Copy
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={handleShare}
                style={styles.actionButton}
                icon="share-variant"
              >
                Share
              </Button>
              
              <IconButton
                icon={isFavorite(questionData.id) ? "star" : "star-outline"}
                iconColor={theme.colors.primary}
                size={24}
                onPress={toggleFavorite}
              />
            </Card.Actions>
          </Card>

          {showFullClause && questionData.clause && (
            <Card style={[styles.clauseCard, { backgroundColor: theme.colors.card }]}>
              <Card.Content>
                <Text style={[styles.clauseTitle, { color: theme.colors.primary }]}>
                  Full Clause Reference
                </Text>
                <Text style={[styles.clauseText, { color: theme.colors.text }]}>
                  {/* This would display the full clause from the standard */}
                  This is where the full clause text would be displayed. In a real implementation, 
                  this would contain the complete text of clause {questionData.clause} from 
                  {questionData.standard}, providing the user with the exact regulatory language.
                </Text>
              </Card.Content>
            </Card>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
    height: 1,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
  },
  standardContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  standardText: {
    fontSize: 14,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 8,
  },
  actionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  clauseCard: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  clauseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  clauseText: {
    fontSize: 14,
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});