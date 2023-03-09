import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import members_membersdetails from '../navigation/members_membersdetails';

 

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'MembersList';
 

 export default function Groupmembers() {
    
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
       
          <NavigationContainer linking={LinkingConfiguration}>

          <Stack.Navigator
          
          screenOptions={{headerLeft : props => <ActionBarIcon {...props}/>, 
                         
        }}
          
           >
            <Stack.Screen name="Root" component={members_membersdetails}  />
          </Stack.Navigator>

        </NavigationContainer>
      
      </View>
    );
  
}

