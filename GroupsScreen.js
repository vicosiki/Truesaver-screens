import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import TopTabNavigator from '../navigation/TopTabNavigator'; 
const Stack = createStackNavigator();
 

export default function GroupsScreen() {
    
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
       
          <Stack.Navigator

             screenOptions={{
             headerShown: false,
            }}

          >
            <Stack.Screen name="Root" component={TopTabNavigator}  />
          </Stack.Navigator>
      
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:10
  },
  
});
