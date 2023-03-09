import React, { Component } from 'react';
import {View, ToastAndroid,
  Platform,
  AlertIOS,
   ActivityIndicator, Image, StyleSheet,ScrollView,TouchableOpacity,Alert, Text} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import NetInfo from "@react-native-community/netinfo";
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
  
export default class Passwordreset extends Component  {
 
  constructor(props) {
    super(props);

    this.state = {
      email: null, 
        password: null, 
        otp: '',
        spinner: false,
        gotOTP: false,
        icon: "eye-slash",
        showpassword: true,
    };
}

handleConnectivityChange = state => {
  if (state.isConnected) {
    this.setState({connection_Status: true});
  } else {
    this.setState({connection_Status: false});
  }
};


componentDidMount = async () => {

NetInfo.addEventListener(this.handleConnectivityChange);

}

_changeIcon() {
  this.setState(prevState => ({
    icon: prevState.icon === 'eye' ? 'eye-slash' : 'eye',
      showpassword: !prevState.showpassword
  }));
}


notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}


reqotp=()=>{

  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
  
  this.notifyMessage("You're offline")
  this.setState({refreshing: false})
  
  
  } else{
  
  
    
  const {email,password} = this.state;
   
  if (email != null) {

     if (password != null) {
      
       
this.setState({spinner: true});

const url = 'https://truesaver.net/api/v1/resetpassword.ashx';

 var dataToSend = { email: email, level:'1'}


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

this.setState({isLoading: false,spinner: false});

if(responseJson.status == "00"){

 this.setState({gotOTP: true});
  this.notifyMessage(responseJson.statusdesc);


}else{

this.notifyMessage(responseJson.statusdesc);
this.setState({gotOTP: false});

}

})

.catch((error) => {

this.setState({isLoading: false,spinner: false});

this.notifyMessage("Oops, something's not right");

});

      } else {

       this.notifyMessage('Please Enter password');
 }

} else {

  this.notifyMessage('Please Enter email');
}


  
  }
      
   
  });
  
   
  }
  

  confotp=(otp)=>{

    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
       
    const {email,password} = this.state;
     
    if (email != null) {
  
       if (password != null) {
        
         
this.setState({spinner: true});
 
 const url = 'https://truesaver.net/api/v1/resetpassword.ashx';

   var dataToSend = { email: email, level:'2', otp:otp, password: password}


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

 this.setState({isLoading: false,spinner: false});

 if(responseJson.status == "00"){

   this.setState({spinner: false});

    await AsyncStorage.setItem('name', responseJson.name);
    await AsyncStorage.setItem('apikey', responseJson.apikey);
    await AsyncStorage.setItem('phonenumber', responseJson.phonenumber);
    await AsyncStorage.setItem('email', responseJson.email);
    await AsyncStorage.setItem('dpurl', responseJson.dpurl);
    await AsyncStorage.setItem('bank', responseJson.bank);
    await AsyncStorage.setItem('acctnum', responseJson.acctnum);
    await AsyncStorage.setItem('care', responseJson.care);


   //this.props.navigation.navigate("Home");

   this.props.navigation.reset({
    index: 0,
    routes: [{ name: 'Home' }],
    
  });


}else{

     this.notifyMessage((responseJson.statusdesc));

}

})

.catch((error) => {

 this.setState({isLoading: false,spinner: false});

  this.notifyMessage("Oops, something's not right");

});

        } else {
  
         this.notifyMessage('Password not provided');
   }
  
 } else {

    this.notifyMessage('Email not provided');
 }

    
    }
        
     
    });
    
    
  
    }


  render() {
     
    let { otp,code } = this.state;
    const { label, icon, onChange } = this.props;

    return (
    
<ScrollView  scrollEnabled={false} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

<View style= {styles.favview}>
   <Image
      source={require("../assets/images/fav.png")}
      style={styles.fav}/>

<Text style= {styles.textstyle} >Change your Password</Text>

  </View> 

  <View>

                        
{!this.state.gotOTP &&

<View>

      
 <Input
 label="Email"
 labelStyle={{color:'teal'}}
   
   onChangeText={email => this.setState({ email})}
   keyboardType="email-address"
   autoFocus={true} 
   value={this.state.email}
  />
 
 <Input
 label="New password"
 labelStyle={{color:'teal'}}
   
   onChangeText={password => this.setState({ password})}
   secureTextEntry={this.state.showpassword}
   value={this.state.password}
   rightIcon = {
    <Icon style={{color:'teal',paddingRight: 20}} name={this.state.icon} onPress={() => this._changeIcon()} />
  }

  />

            {!this.state.spinner &&
            <View style= {styles.fixToText}> 

            <Button title="Continue" onPress={() => this.reqotp()}>
            
          </Button>

         </View>

  } 

</View>

  }
  
   {this.state.gotOTP &&

       <View>   
 
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
             color: 'white',
           }}
           textStyleFocused={{
             color: 'teal',
           }}
           value={otp}
           onTextChange={ otp => this.setState({ otp })}
           onFulfill={this.confotp} 

           />
       </View>

      
 <TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.reqotp()}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Didn't get OTP? Resend</Text>
</View>
 
 </TouchableOpacity>
      
           
<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.setState({gotOTP: false})}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Change email or password</Text>
</View>
 
 </TouchableOpacity>

</View>

  }

  <View>
              
{this.state.spinner &&
                        <ActivityIndicator size="large" color="teal" />
                    }
</View>


<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.props.navigation.navigate("SignIn")}>

<View style= {styles.butview}>
  
<Text style= {styles.basetextstyle}> Have an account already? Login </Text>
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

  spinnerTextStyle: {
    textAlign: 'center'
},

  favview: {
    alignItems:'center',
    paddingTop:30,
    backgroundColor: 'white',
  },
 

  
  title: {

    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  butview: {
   
    paddingTop:10,
    alignItems: 'center'
 
  },

  butstyle: {
    paddingTop:30,

     
  },

  fav:{ width: 40, height: 40, borderRadius: 40/2 
},

fixToText: {
    
  paddingTop:20,
   alignSelf:'center',
  alignItems:'center',


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
    paddingBottom:50,
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
  
section: {
  alignItems: 'center',
  margin: 16,
  paddingTop:30
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
