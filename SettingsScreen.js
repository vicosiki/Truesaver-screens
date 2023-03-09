import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import settings_banks from '../navigation/settings_banks';

 

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Settings';
 

 export default function SettingsScreen() {
    
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
       
          <Stack.Navigator

             screenOptions={{
             headerShown: false,
            }}

          >
            <Stack.Screen name="Root" component={settings_banks} />
            
          </Stack.Navigator>
      
      </View>
    );
  
}


 

const styles = StyleSheet.create({
 
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  dp:{ width: 100, height: 100, borderRadius: 100/2,alignSelf:'center',

  },

  graytext: {
    marginBottom: 10,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  bio: {
    alignItems: 'center',
     
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  lightText: {
    fontSize: 17,
    color: 'rgb(0,0,0)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgb(0,0,0)',
    textAlign: 'center',
  },
  
});
