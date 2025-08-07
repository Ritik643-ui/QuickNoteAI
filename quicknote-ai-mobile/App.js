import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
 
import NoteInputScreen from './src/screens/NoteInputScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import SavedNotesScreen from './src/screens/SavedNotesScreen';
 
const Stack = createStackNavigator();
 
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="NoteInput"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F2F2F7',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 17,
              color: '#1C1C1E',
            },
            headerBackTitleVisible: false,
            headerTintColor: '#007AFF',
          }}
        >
          <Stack.Screen 
            name="NoteInput" 
            component={NoteInputScreen}
            options={{
              title: 'QuickNote AI',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen 
            name="Summary" 
            component={SummaryScreen}
            options={{
              title: 'Summary',
            }}
          />
          <Stack.Screen 
            name="SavedNotes" 
            component={SavedNotesScreen}
            options={{
              title: 'Saved Notes',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}