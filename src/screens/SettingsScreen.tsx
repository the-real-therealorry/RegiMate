import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Switch,
  Platform,
} from 'react-native';
import { 
  List, 
  Text, 
  Divider, 
  Button, 
  RadioButton, 
  TouchableRipple,
  Slider,
  Dialog,
  Portal
} from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useRegion } from '../context/RegionContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { region, setRegion, availableCountries, statesByCountry } = useRegion();
  const { answerSettings, updateAnswerSettings } = useSettings();
  const { signOut } = useAuth();
  
  // Dialog states
  const [countryDialogVisible, setCountryDialogVisible] = useState(false);
  const [stateDialogVisible, setStateDialogVisible] = useState(false);
  const [aboutDialogVisible, setAboutDialogVisible] = useState(false);
  
  const handleFontSizeChange = (value: number) => {
    updateAnswerSettings({ fontSize: value });
  };

  const handleVerbosityChange = (value: 'concise' | 'moderate' | 'detailed') => {
    updateAnswerSettings({ verbosityLevel: value });
  };

  const handleCountrySelect = (country: string) => {
    // When country changes, reset state
    setRegion({ country, state: null });
    setCountryDialogVisible(false);
    
    // If the country has states, open state dialog
    if (statesByCountry[country] && statesByCountry[country].length > 0) {
      setStateDialogVisible(true);
    }
  };

  const handleStateSelect = (state: string) => {
    setRegion({ ...region, state });
    setStateDialogVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <List.Section>
          <List.Subheader style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            Appearance
          </List.Subheader>
          
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  Dark Theme
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  {isDarkMode ? 'On' : 'Off'}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            </View>
          </TouchableRipple>
          
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  Font Size
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  {answerSettings.fontSize}px
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={{ color: theme.colors.secondary }}>12</Text>
                <Slider
                  style={styles.slider}
                  value={answerSettings.fontSize}
                  minimumValue={12}
                  maximumValue={24}
                  step={1}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.border}
                  thumbTintColor={theme.colors.primary}
                  onValueChange={handleFontSizeChange}
                />
                <Text style={{ color: theme.colors.secondary }}>24</Text>
              </View>
            </View>
          </TouchableRipple>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            Region
          </List.Subheader>
          
          <TouchableRipple onPress={() => setCountryDialogVisible(true)}>
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  Country
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  {region.country}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={theme.colors.secondary} 
              />
            </View>
          </TouchableRipple>
          
          {region.country && statesByCountry[region.country] && (
            <TouchableRipple onPress={() => setStateDialogVisible(true)}>
              <View style={styles.preference}>
                <View style={styles.preferenceTextContainer}>
                  <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                    State/Province
                  </Text>
                  <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                    {region.state || 'Select state'}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={theme.colors.secondary} 
                />
              </View>
            </TouchableRipple>
          )}
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            Answer Settings
          </List.Subheader>
          
          <View style={styles.radioGroup}>
            <Text style={[styles.radioGroupTitle, { color: theme.colors.text }]}>
              Response Detail Level
            </Text>
            
            <RadioButton.Group 
              onValueChange={(value) => handleVerbosityChange(value as any)} 
              value={answerSettings.verbosityLevel}
            >
              <TouchableRipple onPress={() => handleVerbosityChange('concise')}>
                <View style={styles.radioButton}>
                  <RadioButton value="concise" color={theme.colors.primary} />
                  <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
                    Concise
                  </Text>
                </View>
              </TouchableRipple>
              
              <TouchableRipple onPress={() => handleVerbosityChange('moderate')}>
                <View style={styles.radioButton}>
                  <RadioButton value="moderate" color={theme.colors.primary} />
                  <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
                    Moderate
                  </Text>
                </View>
              </TouchableRipple>
              
              <TouchableRipple onPress={() => handleVerbosityChange('detailed')}>
                <View style={styles.radioButton}>
                  <RadioButton value="detailed" color={theme.colors.primary} />
                  <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
                    Detailed
                  </Text>
                </View>
              </TouchableRipple>
            </RadioButton.Group>
          </View>
          
          <TouchableRipple 
            onPress={() => updateAnswerSettings({ 
              includeReferences: !answerSettings.includeReferences 
            })}
          >
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  Include References
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  Show standard references in answers
                </Text>
              </View>
              <Switch
                value={answerSettings.includeReferences}
                onValueChange={(value) => updateAnswerSettings({ includeReferences: value })}
                color={theme.colors.primary}
              />
            </View>
          </TouchableRipple>
          
          <TouchableRipple 
            onPress={() => updateAnswerSettings({ 
              showFullClause: !answerSettings.showFullClause 
            })}
          >
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  Show Full Clause By Default
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  Automatically expand full clause text
                </Text>
              </View>
              <Switch
                value={answerSettings.showFullClause}
                onValueChange={(value) => updateAnswerSettings({ showFullClause: value })}
                color={theme.colors.primary}
              />
            </View>
          </TouchableRipple>
          
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  Maximum Words
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  {answerSettings.maxWords} words
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={{ color: theme.colors.secondary }}>100</Text>
                <Slider
                  style={styles.slider}
                  value={answerSettings.maxWords}
                  minimumValue={100}
                  maximumValue={500}
                  step={50}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.border}
                  thumbTintColor={theme.colors.primary}
                  onValueChange={(value) => updateAnswerSettings({ maxWords: value })}
                />
                <Text style={{ color: theme.colors.secondary }}>500</Text>
              </View>
            </View>
          </TouchableRipple>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            About
          </List.Subheader>
          
          <TouchableRipple onPress={() => setAboutDialogVisible(true)}>
            <View style={styles.preference}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
                  About RegiMate
                </Text>
                <Text style={[styles.preferenceDescription, { color: theme.colors.secondary }]}>
                  Version 1.0.0
                </Text>
              </View>
              <Ionicons 
                name="information-circle-outline" 
                size={24} 
                color={theme.colors.secondary} 
              />
            </View>
          </TouchableRipple>
          
          <TouchableRipple onPress={signOut}>
            <View style={[styles.preference, styles.signOutButton]}>
              <Text style={[styles.signOutText, { color: theme.colors.error }]}>
                Sign Out
              </Text>
            </View>
          </TouchableRipple>
        </List.Section>

        {/* Country Selection Dialog */}
        <Portal>
          <Dialog
            visible={countryDialogVisible}
            onDismiss={() => setCountryDialogVisible(false)}
            style={{ backgroundColor: theme.colors.background }}
          >
            <Dialog.Title style={{ color: theme.colors.text }}>Select Country</Dialog.Title>
            <Dialog.Content>
              <ScrollView style={styles.dialogScrollView}>
                <RadioButton.Group onValueChange={handleCountrySelect} value={region.country}>
                  {availableCountries.map((country) => (
                    <TouchableRipple 
                      key={country} 
                      onPress={() => handleCountrySelect(country)}
                    >
                      <View style={styles.radioButton}>
                        <RadioButton value={country} color={theme.colors.primary} />
                        <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
                          {country}
                        </Text>
                      </View>
                    </TouchableRipple>
                  ))}
                </RadioButton.Group>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setCountryDialogVisible(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* State Selection Dialog */}
        <Portal>
          <Dialog
            visible={stateDialogVisible}
            onDismiss={() => setStateDialogVisible(false)}
            style={{ backgroundColor: theme.colors.background }}
          >
            <Dialog.Title style={{ color: theme.colors.text }}>
              Select State/Province
            </Dialog.Title>
            <Dialog.Content>
              <ScrollView style={styles.dialogScrollView}>
                <RadioButton.Group 
                  onValueChange={handleStateSelect} 
                  value={region.state || ''}
                >
                  {region.country && statesByCountry[region.country]?.map((state) => (
                    <TouchableRipple 
                      key={state} 
                      onPress={() => handleStateSelect(state)}
                    >
                      <View style={styles.radioButton}>
                        <RadioButton value={state} color={theme.colors.primary} />
                        <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
                          {state}
                        </Text>
                      </View>
                    </TouchableRipple>
                  ))}
                </RadioButton.Group>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setStateDialogVisible(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* About Dialog */}
        <Portal>
          <Dialog
            visible={aboutDialogVisible}
            onDismiss={() => setAboutDialogVisible(false)}
            style={{ backgroundColor: theme.colors.background }}
          >
            <Dialog.Title style={{ color: theme.colors.text }}>About RegiMate</Dialog.Title>
            <Dialog.Content>
              <Text style={[styles.aboutText, { color: theme.colors.text }]}>
                RegiMate is your electrical standards assistant, providing instant access to 
                relevant information from electrical codes and standards based on your location.
              </Text>
              <Text style={[styles.aboutVersion, { color: theme.colors.secondary }]}>
                Version 1.0.0
              </Text>
              <Text style={[styles.aboutCopyright, { color: theme.colors.secondary }]}>
                © 2025 RegiMate. All rights reserved.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setAboutDialogVisible(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
  },
  preferenceDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  radioGroup: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  radioGroupTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  signOutButton: {
    justifyContent: 'center',
    marginTop: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dialogScrollView: {
    maxHeight: 300,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  aboutVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  aboutCopyright: {
    fontSize: 12,
  },
});