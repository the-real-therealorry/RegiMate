# RegiMate

RegiMate is a mobile application designed to help electrical workers quickly access relevant electrical standards and regulations through an AI-powered interface.

## Features

- Question and answer interface using OpenAI's ChatGPT
- Region-specific electrical standards lookup
- Save and manage favorite questions and answers
- Customizable answer format and appearance
- Dark/light theme support
- Cross-platform (iOS and Android)

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- Yarn or npm
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Follow the Expo CLI instructions to open the app on your device or emulator

## Environment Variables

Create a `.env` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Project Structure

- `/src/screens` - Main application screens
- `/src/components` - Reusable UI components
- `/src/context` - React Context providers for state management
- `/src/services` - API and utility services
- `/assets` - Static assets like images and icons

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Paper
- OpenAI API
- Clerk Auth
- AsyncStorage

## License

This project is licensed under the MIT License.