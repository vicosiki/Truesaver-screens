import React, { Component } from 'react';
import {View,ToastAndroid,
  Platform,
  AlertIOS,
   ActivityIndicator, Image, 
   StyleSheet,ScrollView,TouchableOpacity,Alert,Text} from 'react-native';

import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";

import NetInfo from "@react-native-community/netinfo";

  
export default class SignIn extends Component  {
 
  constructor(props) {
    super(props);

    this.state = {
      username: null, 
        password: null, 
        spinner: false,
        showpassword: true,
        icon: "eye-slash",
        apikey: null,
    };

     //this._signInHandler = this._signInHandler.bind(this);

      
  (async () => {
  
    let email = await AsyncStorage.getItem('email');
    let apikey = await AsyncStorage.getItem('apikey');
 
 
         this.setState({ apikey:apikey,username: email});
 
  
     })();
  

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

_signInHandler = async () => {

  try {
    
    NetInfo.fetch().then(state => {
      if (state.isConnected === null) {
        setTimeout(() => NetInfo.fetch().then(state => this.signIn(state)), 3000);
      }
      else this.signIn(state);
    });
  
  } catch (error) {
    
  }
  
}

signIn(state)  {

  
  //NetInfo.fetch().then(state => {
    
  if (!state) {
  
  this.notifyMessage("You're offline")
  this.setState({refreshing: false})
  
  
  } else{
  
  
   
    const {username, password} = this.state;


    if (username != null) {
       
        if (password != null) {
          //all cool
 
    this.setState({spinner: true});
    

    const url = 'https://truesaver.net/api/v1/signin.ashx';

     
    //POST json 
    var dataToSend = { password: password, username: username}
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

        this.notifyMessage(responseJson.status);

    }
})
.catch((error) => {
    this.notifyMessage("Oops, something's not right");
    this.setState({isLoading: false,spinner: false});

});
  

        } else {
          this.notifyMessage('Please Enter password');

        }
      
    } else {

      this.notifyMessage('Please Enter phone or email');
    }

 
  }
      
   
  //});
  
      
} 

  render() {
     
    return (
    
<ScrollView scrollEnabled={true}  contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>


<View style= {styles.favview}>
 <Image
      source={require("../assets/images/fav.png")}
      style={styles.fav}/>

<Text style= {styles.textstyle} >Login to your Account</Text>

  </View> 

  <View>
  
  
 <Input
 label="Phone or email"
 labelStyle={{color:'teal'}}
inputStyle={{fontSize:20}}
   
   onChangeText={username => this.setState({ username})}
   keyboardType="email-address"
   autoFocus={true} 
   value={this.state.username}
  />
 
 <Input
 label="Password"
 labelStyle={{color:'teal'}}
inputStyle={{fontSize:20}}
   
   onChangeText={password => this.setState({ password})}
   secureTextEntry={this.state.showpassword}
   value={this.state.password}
   rightIcon = {
    <Icon style={{color:'teal',paddingRight: 20}} name={this.state.icon} onPress={() => this._changeIcon()} />
  }

  />
            
            

{!this.state.spinner &&
            <View style= {styles.fixToText}> 

            <Button title="Log in" onPress={this._signInHandler}>
            
          </Button>

  </View>

  } 

  <View>
              
{this.state.spinner &&
                        <ActivityIndicator size="small" color="teal" />
                    }
</View>


<TouchableOpacity  style={{paddingTop: 30}} onPress={() => this.props.navigation.navigate("Passwordreset")}>

<View style= {styles.butview}>
  


<Text style= {styles.basetextstyle}> Forgot password? </Text>
</View>
 
 </TouchableOpacity>
   
<TouchableOpacity  style={{paddingTop: 30}} onPress={() => this.props.navigation.navigate("SignUp")}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Don't have an account? Create one </Text>
</View>
 
 </TouchableOpacity>

 
</View>

</ScrollView>
      );
    }
  }

     

const styles = StyleSheet.create({
  container: {
   flex:1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
 

  favview: {
    alignItems:'center',
    paddingTop:30,
    backgroundColor: 'white',
  },

  butview: {
   
    paddingTop:50,
    alignItems: 'center'
 
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
      
})
