import React, { Component } from 'react';
import {View, Modal,
  FlatList,ToastAndroid,
  Platform,
  AlertIOS,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator, Image,Clipboard, StyleSheet,ScrollView,TouchableOpacity,Text, Button, Alert, RefreshControl,Linking} from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';
import data from '../Countries' 
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import NetInfo from "@react-native-community/netinfo";
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome } from '@expo/vector-icons';
//import Clipboard from "@react-native-community/clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";



// Default render of country flag
const defaultFlag = data.filter(
  obj => obj.name === 'Nigeria'
  )[0].flag


export default class otp extends Component  {
 
  constructor(props) {
    super(props);
    this.state = {
     
      modalVisible: false,
      
      spinner: false,
      

    };
 
      }

      
  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
  
      
    componentDidMount() {

NetInfo.addEventListener(this.handleConnectivityChange);

    let email = this.props.route.params.email;
    let password = this.props.route.params.password;
    let name = this.props.route.params.name;
    let countryCode = this.props.route.params.countryCode;
    let phoneNumber = this.props.route.params.phoneNumber;
    let acctnum = this.props.route.params.acctnum;
    let bank = this.props.route.params.bank;
    let bankcode = this.props.route.params.bankcode;
    let accountNGN = this.props.route.params.accountNGN;
  
    this.setState({email:email, password:password, name:name,countryCode:countryCode,phoneNumber:phoneNumber, acctnum:acctnum, bank:bank, bankcode:bankcode, accountNGN:accountNGN});
 
    
   }
     
       
  chatLink = async () => {
    try {
       
      
      Clipboard.setString(`https://wa.me/23408159353046?text=Hello+Support`)

      this.notifyMessage("Chat link copied")

     // WebBrowser.openBrowserAsync(`https://wa.me/23408159353046?text=Hello+Support`)
      Linking.openURL(`https://wa.me/23408159353046?text=Hello+Support`)


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
  

confotp = (otp) => {


  try {
    
    
    if (!this.state.connection_Status) {

  this.notifyMessage("You're offline")
  this.setState({refreshing: false})
  
  
  } else{
  
    if (Platform.OS === 'android') {
      this.notifyMessage("Validating OTP...")
    }

  
    const {email,phoneNumber,accountNGN} = this.state;
    const url = 'https://truesaver.net/api/v1/otp.ashx';
    var dataToSend = { otp: otp, email: email, level:"2", saverid: phoneNumber,accountNGN:accountNGN}
  
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
         },
  
  
  })
  
  
  .then((response) =>  response.json())
  .then(async(responseJson) => {
   
  this.setState({spinner: false});
  
  if(responseJson.statuscode == "00"){
  
     this._signUpHandler()
      
    
    }else{ 
  
  
      this.notifyMessage(responseJson.status);
   
  }
   
  })
   
  .catch((error) => {
  
      this.setState({spinner: false});
  
       this.notifyMessage(error);
  
  });
    
  }
      
  
  
    
  } catch (error) {

    // this.notifyMessage("Oops, something's not right");
   
   }

    

}
 

_signUpHandler = () => {
 
  try {


    if (!this.state.connection_Status) {

    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      
    
    const {email, password, name,countryCode,phoneNumber, acctnum, bank, bankcode, accountNGN} = this.state;
   
  
    this.setState({spinner: true});
    
  
    const url = 'https://truesaver.net/api/v1/signup.ashx';
  
     
    //POST json 
    var dataToSend = { password: password, email: email,name:name ,countryCode:countryCode,phonenumber:phoneNumber, accountnumber:acctnum, bank:bank, bankcode:bankcode,accountNGN }
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
       },
  })
  
  .then((response) => response.json())
  .then(async(responseJson) => {
  
    this.setState({spinner: false});
  
    if(responseJson.status == "00"){
  
  
        await AsyncStorage.setItem('name', responseJson.name);
        await AsyncStorage.setItem('apikey', responseJson.apikey);
        await AsyncStorage.setItem('phonenumber', responseJson.phonenumber);
        await AsyncStorage.setItem('email', responseJson.email);
        await AsyncStorage.setItem('bank', bank);
        await AsyncStorage.setItem('bankcode', bankcode);
        await AsyncStorage.setItem('acctnum', acctnum);
        await AsyncStorage.setItem('dpurl', "https://web.truesaver.net/y1Wy2nc3y5ho3QSgQxhPg==/7M1SINPVL940A3MG79BU08091903220.jpg");

  
       //this.props.navigation.navigate("Home");
  
       this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
  
  
    }else{
  
         this.notifyMessage(responseJson.status);
  
    }
  })
  
  .catch((error) => {
     this.notifyMessage(error);
    this.setState({isLoading: false,spinner: false});
  
  });
  
    
    }
    

  } catch (error) {

    // this.notifyMessage("Oops, something's not right");
   
   }

   
} 


getotp = () => {

  try{

    if (!this.state.connection_Status) {

    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      
    this.setState({spinner: true});
  
    const {email,password,acctnum,bankcode,phoneNumber,accountNGN} = this.state;
      
  
      const url = 'https://truesaver.net/api/v1/otp.ashx';
  
       
      //POST json 
       
        var dataToSend = { email: email, level:'1' ,accountnumber:acctnum, bankcode:bankcode, saverid: phoneNumber, caller: "auto", accountNGN:accountNGN}
  
    
  
  
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
         },
  
  
  })
  
  
  .then((response) =>  response.json())
  .then(async(responseJson) => { 
  
             if(responseJson.statuscode == "00"){
  
              this.notifyMessage("Please check your email for the OTP just sent");
 
             }else{
    
             this.notifyMessage(responseJson.status);
            this.setState({spinner: false});
     
         }
  
  })
  
  
  
  .catch((error) => {
  
      this.setState({spinner: false});
  
      this.notifyMessage("Oops. Something's not right");
  
  });
    
  
    }
        
    

  } catch (error) {

      // this.notifyMessage("Oops, something's not right");
     
     }

    
   
}
 



  render() {
     
    let { otp } = this.state;

    return (
    
<ScrollView    scrollEnabled={false} showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>

<View style= {styles.favview}>
 <Image
      source={require("../assets/images/fav.png")}
      style={styles.fav}/>

<Text style= {styles.textstyle} >Create your Account</Text>

  </View> 


  <View  >

   <View style={styles.section}>
          <Text style={styles.title}>Tap to enter OTP</Text>
          <SmoothPinCodeInput
            placeholder="-"
            cellStyle={{
              borderWidth: 2,
              borderRadius: 24,
              borderColor: 'green',
              backgroundColor: 'teal',
            }}
            cellStyleFocused={{
              borderColor: 'teal',
              backgroundColor: 'white',
            }}
            textStyle={{
              fontSize: 24,
              color: 'white'
            }}
            textStyleFocused={{
              color: 'teal'
            }}
            value={otp}
            onTextChange={ otp => this.setState({ otp })}
            onFulfill={this.confotp}

            />
        </View>

<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.getotp()}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Didn't get OTP? Resend</Text>
</View>
 
 </TouchableOpacity>

<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.props.navigation.goBack()}>
 
<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Double check your email or bank details</Text>
</View>
 
 </TouchableOpacity>


 <TouchableOpacity  style={{paddingTop: 30}} onPress={() => this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Have an account already? Login </Text>
</View>
 
 </TouchableOpacity>
 
 
<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.chatLink()}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Need some help with this?</Text>
</View>
 
 </TouchableOpacity>

        
</View>

  

</ScrollView>

      );
    }
  }

     

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  favview: {
    flex:1,
    alignItems:'center',
    paddingTop:30,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contview: {
    flex:2,
    alignItems: 'center',
    paddingTop:30
  },

  butview: {
   
    paddingBottom:50,
    alignItems: 'center'
 
  },

  butstyle: {
    paddingTop:30
     
  },

  fav:{ width: 40, height: 40, borderRadius: 40/2 
},

section: {
  alignItems: 'center',
  margin: 16,
  paddingTop:30
  
},
fixToText: {
    
  paddingTop:20,
  width: 400,
  alignSelf:'center',
  alignItems:'center',


  },
  dropdown: {
  paddingLeft:15,
  paddingRight:2,

     
  
    },
basetextstyle: {
    
  fontSize:15,
  fontWeight:'bold',
  color: '#008080'

  

},

  textstyle: {
    
    fontSize:25,
    fontWeight:'bold',
    paddingTop: 30,

    color: '#008080'

  },
  
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#5059ae',
  },
  itemStyle: {
    marginBottom: 10,
  },
  iconStyle: {
    color: 'black',
    fontSize: 20,
    
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#b44666',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
  textStyle: {
    padding: 5,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  countryStyle: {
    flex: 1,
    
    borderTopWidth: 1,
    padding: 12,
  },

  
  closeButtonStyle: {
    flex: 1,
    padding: 10,
    alignItems: 'center', 
    backgroundColor: 'white',
    
  }
})
