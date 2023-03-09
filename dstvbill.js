import React, { Component } from "react";
import {  ToastAndroid, Platform, AlertIOS,ActivityIndicator, StyleSheet, Text, View,Button, Alert,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";


 
   
    
  export default class dstvbill extends Component {
 
    
  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      error: null,
      refreshing: false,
      phonenumber: '', 
      apikey:'',
      spinner:false,
      groupid:this.props.route.params.groupid,
      slot: this.props.route.params.slot,
      saverid: this.props.route.params.saverid,
      newsaverid: '',

      
    
    };
  
  }
 
 

 
 render() {
     
  return (
    
 

  <View  style={styles.container}>

       
<ScrollView  >
    

  </ScrollView>


    
    </View>



 );
}

}
 
 
const styles = StyleSheet.create({
     
    paragraph: {
      margin: 20,
          
    },
    
    textstylex: {
    
        fontSize:20,
        fontWeight:'bold',
        paddingLeft: 30,
        paddingRight: 30,
        color: '#008080',
        textAlign: 'center',
  
     
     }, 
     
    textstyle: {
    
      fontSize:15,
      fontWeight:'bold',
      paddingLeft: 30,
      paddingRight: 30,
      color: 'gray',
      textAlign: 'center',

   
   }, 

   
  butview: {
   
    paddingTop:10,
    alignItems: 'center'
 
  },

   
basetextstyle: {
    
    fontSize:15,
    fontWeight:'bold',
    color: '#008080'
},  

   
  favview: {
    flex:1,
    alignItems:'center',
    paddingTop:30,
  },

fixToText: {
    
  paddingTop:10,
  paddingBottom:10,
  alignItems:'center',

  },
 
 textnoint:{
     
      flex: 2,
      alignItems: 'center',
      paddingTop:40
     
    }, 

    container: {
      flex: 1,
      alignContent: 'center',
    },
  });
  