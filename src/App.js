import React, { Component } from 'react';
import { View } from 'react-native';
import { NetworkProvider } from 'react-native-offline';
import TabNavigation from './TabNavigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './redux/slices';

const store = configureStore({ reducer: rootReducer });

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'white',
    accent: 'black',
    text: 'black'
  },
};
const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <TabNavigation />
        </View>
      </PaperProvider>
    </Provider>
  );
};

export default App;
