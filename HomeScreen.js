import * as WebBrowser from 'expo-web-browser';
import React, { Component } from "react";
import {  ToastAndroid, Platform,ActivityIndicator, ImageBackground, StyleSheet, Text,Linking, TouchableOpacity, View, Alert, RefreshControl, Share} from 'react-native';
import {ScrollView } from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import { AirbnbRating } from 'react-native-ratings';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';
import { Overlay, Button } from 'react-native-elements';
import {PayWithFlutterwave} from 'flutterwave-react-native';

import NetInfo from "@react-native-community/netinfo";

import AsyncStorage from "@react-native-async-storage/async-storage";



//import ReactNativeNumberFormat from '../components/ReactNativeNumberFormat';
  
const generateRef = (length) => {
  var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  var b = [];  
  for (var i=0; i<length; i++) {
      var j = (Math.random() * (a.length-1)).toFixed(0);
      b[i] = a[j];
  }
  return b.join("");
}

export function ReactNativeNumberFormat({ value, currency}) {
  return (
    <NumberFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={currency}
      renderText={formattedValue => <Text>{formattedValue}</Text>} // <--- Don't forget this!
    />
  );
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class HomeScreen extends Component  { 

  constructor(props) {
    super(props);     
    this.state = {

      error: null,
       defautcharge: 0,
      formattedtotalsavings: 0,
      formattedsavingsgoal: 0,
      totalsavings: 0,
       savingsgoal: 0,
      defaultsavings: 0,
      payupfee:0,
      tx_ref:'',
      authorization:'',
      email:'',
      paybacklink: null,
      refreshing: false,
      apikey:null,
      phonenumber: null,
      spinner: true,
      rating: 0,
      connection: false,
      url: 'https://google.com',
      ussd: false,
     currency:'',
     connection_Status:null,
     visibleoverlay:false,
    };

        
   
  }

  


  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
  

  
  _onRefresh = () => {
 
    if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
      
      this.setState({refreshing: true,},() => {this.makeRemoteRequest();});

    
    }
        
     }


componentDidMount = async () => {

 
 //AsyncStorage.clear();
NetInfo.addEventListener(this.handleConnectivityChange);


let savingsgoal = await AsyncStorage.getItem('savingsgoal')

let totalsavings = await AsyncStorage.getItem('totalsavings')

let rating = await AsyncStorage.getItem('rating') 

let token = await AsyncStorage.getItem('pushnotToken') 
 
let authorization = await AsyncStorage.getItem('flwauthorization')
 


 

if (savingsgoal  === ''){
  savingsgoal ='0'
}

if (totalsavings  === ''){
  totalsavings ='0'
}

let apikey = await AsyncStorage.getItem('apikey');
   
let phonenumber = await AsyncStorage.getItem('phonenumber')

let name = await AsyncStorage.getItem('name')

let email = await AsyncStorage.getItem('email')
 
   
this.setState({authorization:authorization, email: email, token:token, apikey: apikey, phonenumber: phonenumber, name:name,rating:rating, savingsgoal:savingsgoal, totalsavings:totalsavings, refreshing: false, spinner: false})


if (!this.state.connection_Status) {
    
  this.notifyMessage("You're offline")
  this.setState({refreshing: false})
   
  } else{

    this.makeRemoteRequest()
 
  }




/*
 
NetInfo.fetch().then(state => {

 if (!state.isInternetReachable) {

this.notifyMessage("You're offline")

} else {

this.makeRemoteRequest()


  }

});

*/

}


onShare = async () => {
  
  try {
    const result = await Share.share({
      message:
        `${this.state.invitetext}`
       
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
     this.notifyMessage("Oops, something's not right");
  }
};

  
  notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
     
 
  handleOnRedirect = (data) => {

    if (data.status == "successful") {
   
     
      fetch(`${this.state.redirect_url}` + `&status=` + data.status + `&transaction_id=` + data.transaction_id + `&tx_ref=` + data.tx_ref, {
      method: "GET",//Request Type 
      
          })

  
    .catch((error) => {
  
    });
  
    this.makeRemoteRequest()
    
    }
   
  }
  
  
  
payUp = () => {

  const { email } = this.state
  
  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {
   
   this.notifyMessage("You're offline")
   
   } else {
 
    let tx_ref = generateRef(11)
    
  this.setState({spinner: true})

      //POST json 
      var dataToSend = {   tx_ref, email  }
      //making data to send on server
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      
      const url = 'https://truesaver.net/api/v1/paybackinApp.ashx';
      
      
      fetch(url, {
        method: "POST",//Request Type 
         body: formBody,//post body 
         headers: {//Header Defination 
           'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            apikey: this.state.apikey
           },
        
       })
      
      .then((response) => response.json())
      .then((responseJson) => {
         
        this.setState({ tx_ref:tx_ref, email:email ,deadline:responseJson.deadline,defaultcount:responseJson.defaultcount, redirect_url :responseJson.redirect_url ,payment_options:responseJson.payment_options,formatted_payupfee :responseJson.formatted_payupfee,payupfee:responseJson.payupfee})
         
        this.setState({ visibleoverlay:true,spinner: false})
        

      
      })
       
  
      .catch((error) => {
      
        this.setState({spinner: false})
      
        this.notifyMessage("Oops. Something's not right");
      
      });
            
                
         }
       
       });
       
       }
   
  makeRemoteRequest = () => {
 
    try {

      this.setState({spinner: true})

      const url = 'https://truesaver.net/api/v1/dashboard.ashx';
 
    
      //POST json 
      var dataToSend = { phonenumber: this.state.phonenumber, pushnotToken: this.state.token}; 
      //making data to send on server
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
 
      //POST request 
         fetch(url, {
       method: "POST",//Request Type 
       body: formBody,//post body 
       headers: {//Header Defination 
         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
         , apikey: this.state.apikey //  yS9wLrajnYfpiHkN+qjMdA==  Zs4R1uw6tNm2jMnEfyMDSQ==
 
       },
     })
     
     .then((response) => response.json())
     //If response is in json then in success
     .then(async(responseJson) => {
  
      
         this.setState({AffiliateOrg_note:responseJson.AffiliateOrg_note, topup_note:responseJson.topup_note, version:responseJson.version, stacksinfo:responseJson.stacksinfo, authorization:responseJson.flwauthorization, tsbank:responseJson.tsbank, user_lenderid:responseJson.user_lenderid,showads:responseJson.showads,invitetext:responseJson.invitetext, totalsavings:responseJson.GroupTab.CumulativeSavings,
            defaultsavings: responseJson.NGNdefaultcharge,  formatteddefaultsavings: responseJson.formattedNGNdefaultcharge,
           savingsgoal: responseJson.GroupTab.CumulativeOutstandingSavings,
           paybacklink: responseJson.paybacklink,alertme:responseJson.send_mails,
           rating: responseJson.rating, bankussd:responseJson.ussdbank,refreshing: false, spinner: false, currency:responseJson.GroupTab.currency,
           formattedsavingsgoal: responseJson.GroupTab.formattedCumulativeOutstandingSavings,formattedtotalsavings:responseJson.GroupTab.formattedCumulativeSavings
                  });

      
           // if(this.state.version != '010001'){
   
          
            //this.version_err();
         
          
                 // } 
          
                  
         if( this.state.defaultsavings > 0 ){
   
           //this.paybackAlert();
           this.payUp()

         } 
 
         if(this.state.savingsgoal == '0'){
   
          
           this.calltoaction();

 
         } 
 
          
         
        await AsyncStorage.setItem('version', this.state.version);
        await AsyncStorage.setItem('savingsgoal', this.state.savingsgoal);
        await AsyncStorage.setItem('totalsavings', this.state.totalsavings);
        await AsyncStorage.setItem('rating', this.state.rating);
        await AsyncStorage.setItem('send_mails', this.state.alertme);
        await AsyncStorage.setItem('showads', this.state.showads);
        await AsyncStorage.setItem('user_lenderid', this.state.user_lenderid);
        await AsyncStorage.setItem('tsbank', this.state.tsbank);
        await AsyncStorage.setItem('flwauthorization', this.state.authorization);
        await AsyncStorage.setItem('stacksinfo', this.state.stacksinfo);
        await AsyncStorage.setItem('topup_note', this.state.topup_note);
        await AsyncStorage.setItem('AffiliateOrg_note', this.state.AffiliateOrg_note);

 
        
         // save stuffs in local storage
         
    
     })
     
     //If response is not in json then in error
     .catch((error) => {
 
       this.setState({refreshing: false, spinner: false})
       
       Alert.alert(
        "Unknown Error",
        `Oops, something's not right.` ,
    
        [
          ,
          { text: "Refresh", onPress: () => this.makeRemoteRequest()}
         
        ],

        { cancelable: false }
   
        );
      
     });

    } 
    
    catch (error) {
      this.notifyMessage("Oops, something's not right");
      this.setState({refreshing: false, spinner: false})

  }
    
  }

  version_err = () =>
  
         Alert.alert(
      "Update Alert",
      "A critical update has been made to this app!\n\nKindly update your app now "  ,
      [
          { text: "Update", onPress: () => Linking.openURL(`https://truesaver.net/api/v1/getapp.ashx`) }
 
      ],
      { cancelable: false }
    );

  calltoaction = () =>
  
         Alert.alert(
      "Getting started",
      "Welcome " + `${this.state.name}` + ", create your Group or get started with 2 easy steps: \n\n1. Tap the GROUPS tab and choose from the list of available plans \n\n2. Join group, read the group rules & pick your settlement date "  ,
      [
          { text: "View Groups", onPress: () =>this.props.navigation.navigate("Groups") }

      ],
      { cancelable: true }
    );

    /*
  paybackAlert = () =>
  
         Alert.alert(
      "Pending Savings",
      "Please payup your pending savings of " + `${this.state.formatteddefaultsavings}`,
      [

          { text: "Later" },

        //  { text: "USSD", onPress: () => this.setState({ussd:true})},

          { text: "Payup ", onPress: () => Linking.openURL(`${this.state.paybacklink}` ) },



      ],
      { cancelable: false }
    );

    */
 
  render() {
    
    const {authorization,token,tx_ref,defaultcount,email,phonenumber,name,payupfee,payment_options,deadline,formatted_payupfee}= this.state

    
const toggleOverlay = () => {

  this.setState({visibleoverlay: false})
  
};


    return (
        

<View  style={styles.container}>
    
 
 <ImageBackground source={require('../assets/images/homepix.jpg')} 
            style={{ flex: 1,
            width: null,
            height: null,
            }}
            

        >

 
<ScrollView scrollEnabled={false} style={styles.container} contentContainerStyle={styles.contentContainer} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>
 

   <View style={{flex: 4 }}>
   
   <Text style={styles.topText}>Total Savings</Text>
    
   {this.state.spinner &&

<ActivityIndicator size="small" color="#00ff00" />
  
}
       <View style={styles.welcomeContainer}>

           <Text style={styles.topText}>{this.state.formattedtotalsavings}</Text>
  

        </View>

    <View style={styles.getStartedContainer}>
         
          <Totalsavingsnote />

      </View>

    </View>     

  

    <View style={{flex:1 }}>
   
    <Text style={styles.getStartedText}>Savings Goal</Text>
 
    {this.state.spinner &&

<ActivityIndicator size="small" color="#00ff00" />
  
}
       <View style={styles.welcomeContainer}>

          <Text style={{ fontSize: 15}}>{this.state.formattedsavingsgoal}</Text> 
  
        </View>

    <View style={styles.getStartedContainer}>
         
          <Outstandingsavingsnote />

      </View>

</View>

<View style={{flex:1}}>


<AirbnbRating
  count={5}
  reviews={["Stone", "Bronze", "Silver", "Gold", "Platinum"]}
  defaultRating={this.state.rating}
  size={15}
  isDisabled = {true}
  reviewSize= {15}
  reviewColor={"teal"}
  selectedColor={"teal"}
/>

<View style={styles.getStartedContainer}>
         
          <Text style={styles.downText}>Save on time to improve your ratings</Text> 

</View>


          
<Overlay 

isVisible={this.state.visibleoverlay} 
  windowBackgroundColor="rgba(255, 255, 255, .5)"
  overlayBackgroundColor="red"
  onBackdropPress={toggleOverlay}
  
   >
    
   
{this.state.spinner &&
      <View >
                            <ActivityIndicator size="large" color="teal" />
      </View>
                        }  

<View style={styles.flexyx}>
  <Text style={styles.rule}>Please pay your pending savings of {formatted_payupfee} before {deadline} to avoid late savings fees </Text>
</View>

<View style={styles.flexy}>
  <Text style={styles.rule}>Remember to pay at least once with your card before your collection date</Text>
</View>

  
<View  style={styles.tabBarInfoContainerx} >  

  
<PayWithFlutterwave

onRedirect={(data) => this.handleOnRedirect(data)} 
options={{
  tx_ref: tx_ref, //  generateRef(11),
  authorization: authorization,
  amount:  payupfee,
  currency: 'NGN', 
  payment_options: payment_options,
  customer: {

      email: email,
      phone_number:phonenumber,
      name:name

  },
  
  meta: {

    txtype: "payback",
    defaultcount:defaultcount,
    reference:tx_ref,
    token:token
}
 
}}
customButton={(props) => (
  <TouchableOpacity
     
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={{ color: 'white', fontWeight:'bold', fontSize: 12}}>PAY UP YOUR PENDING SAVINGS OF {formatted_payupfee}</Text>
    </TouchableOpacity>

    
)}

/>
 </View>
  

 </Overlay>
   

   
<TouchableOpacity 
          style={styles.floatingButton2}
          onPress={this.onShare}
        >
          <FontAwesome name="share" size={20} color="white" />
        </TouchableOpacity>


</View>
    
  

   </ScrollView>

   {this.state.defaultsavings > 0 ?
  

  <TouchableOpacity  style={{padding: 30}} onPress={() => this._onRefresh()}>
  

  <View style={styles.tabBarInfoContainer}>

  <FontAwesome name='warning' raised={true} color='red' />

        <Text style={{ color: 'red',fontWeight:'bold', fontSize: 12}}>Pending savings alert of {formatted_payupfee}</Text>
     </View>

  </TouchableOpacity>
  
   
  
  :
  
  <View></View>
  
  }
   
   </ImageBackground>

</View>
  

  )}
 
   }

 
export default HomeScreen;


function Totalsavingsnote() {
  
    return (
      <Text style={styles.topblueText}>
        Total savings for all groups joined </Text>
    );
   
}
function Outstandingsavingsnote() {
  
  return (
    <Text style={styles.downText}>
      What's left to save for all groups joined</Text>
  );
 
}


const styles = StyleSheet.create({
 
     container: {
    flex: 1,
    
  },
  downText: {
    marginBottom: 10,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

  topblueText: {
    
    color: 'silver',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    marginHorizontal: 30,

  },
  contentContainer: {
    flexGrow:1,
    paddingTop: 50,
  },

  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    
  },
  
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 30,
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
  getStartedText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  topText: {
    fontSize: 15,
    color: 'white',
    lineHeight: 24,
    textAlign: 'center',
  },
  
  tabBarInfoContainerx: {
    position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0,
     ...Platform.select({
       ios: {
         shadowColor: 'black',
         shadowOffset: { width: 0, height: -3 },
         shadowOpacity: 0.1,
         shadowRadius: 3,
       },
       android: {
         elevation: 10,
       },
     }),
     alignItems: 'center',
    alignContent: 'center',
    paddingTop:15,
     backgroundColor: 'teal',
 
     height:50,
   },
     

  tabBarInfoContainer: {
   position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 10,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    height:67,
  },
   
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgb(0,0,0)',
    textAlign: 'center',
  },
    
  lightText: {
    fontSize: 17,
    color: 'teal',
    lineHeight: 24,
    textAlign: 'center',
  },
fixToText: {
    
  paddingTop:20,
   alignSelf:'center',
  alignItems:'center',


  },
 
   
  
  flexyx: {

    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
    paddingTop:10
  },
  
  flexy: {

    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:60,
    paddingTop:10
  },

  fixToTextz: {
      
    paddingTop:20,
    paddingBottom:80,
    alignItems:'center',
    backgroundColor: 'white',

  
    },

  moreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },

  bio: {
    alignItems: 'center',
    marginHorizontal: 50,
    paddingTop:20
    
  },

  
  listx: {
    
  marginHorizontal: 50,
  flexDirection: 'row',
  //justifyContent: 'flex-start',
  padding: 15,

  },
  
  
  list: {
    
  justifyContent: 'center',
  paddingBottom: 20,

  },

     
floatingButton2: {
  borderWidth: 1,
  borderColor: 'green',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 30,
  right: 25,
  width: 50,
  height: 50,
  backgroundColor: 'green',
  borderRadius: 100,
},

  graytext: {
    marginBottom: 10,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
  },
 
  defdev: {
    marginBottom: 10,
    color: 'black',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
  },
 
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

});
