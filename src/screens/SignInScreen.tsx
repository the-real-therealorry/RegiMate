import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignInScreen() {
  const { theme } = useTheme();
  const { signIn, skipAuth } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />
      
      <View style={styles.headerBackground} />
      
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.logo}
        />
        <Text style={styles.appTitle}>RegiMate</Text>
        <Text style={styles.appSubtitle}>Your Electrical Standards Assistant</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
          Welcome to RegiMate
        </Text>
        
        <Text style={[styles.descriptionText, { color: theme.colors.secondary }]}>
          Get instant access to electrical standards and regulations specific to your region. 
          Ask questions and receive accurate, AI-powered answers from current standards.
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.featureIconText}>?</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Ask Questions
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.secondary }]}>
                Get answers about electrical standards
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.accent }]}>
              <Text style={styles.featureIconText}>★</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Save Favorites
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.secondary }]}>
                Keep important information at hand
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.colors.success }]}>
              <Text style={styles.featureIconText}>✓</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Region-Specific
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.secondary }]}>
                Standards tailored to your location
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={signIn}
          style={[styles.signInButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
        >
          Sign In
        </Button>
        
        <Button
          mode="outlined"
          onPress={skipAuth}
          style={[styles.skipButton, { borderColor: theme.colors.primary }]}
          labelStyle={[styles.skipButtonLabel, { color: theme.colors.primary }]}
        >
          Continue Without Account
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 40,
  },
  signInButton: {
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 6,
  },
  skipButton: {
    borderRadius: 8,
    borderWidth: 2,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 2,
    color: '#FFFFFF',
  },
  skipButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
});