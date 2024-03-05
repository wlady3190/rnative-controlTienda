import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite'
// import CalculateScreen from './screens/CalculateScreen';
import ContainerApp from './navigators/StackNavigator';



const App = () => {


  return (

    <ContainerApp />
  );
};

export default App;
