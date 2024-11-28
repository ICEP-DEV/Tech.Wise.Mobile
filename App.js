import 'react-native-get-random-values';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigations/RootNavigator';
import { DestinationContextProvider, OriginContextProvider } from './src/contexts/contexts'; // Import the context provider
import { DriverDestinationContextProvider, DriverOriginContextProvider } from './src/contexts/driverContexts';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* driver contexts */}
      <DriverOriginContextProvider>
        <DriverDestinationContextProvider>
          {/* customer contexts */}
          <DestinationContextProvider>
            <OriginContextProvider>
              <RootNavigator />
            </OriginContextProvider>
          </DestinationContextProvider>
        </DriverDestinationContextProvider>
      </DriverOriginContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
