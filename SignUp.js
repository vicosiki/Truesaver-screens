import React, { Component } from 'react';
import {View,
  ToastAndroid,
  Platform,
  ActivityIndicator, Image, StyleSheet,ScrollView,TouchableOpacity,Text, Alert,Clipboard, RefreshControl,Linking} from 'react-native';
import { Button , Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
 
import { Dropdown } from 'react-native-material-dropdown';
import data from '../Countries' 
import NetInfo from "@react-native-community/netinfo";



// Default render of country flag
const defaultFlag = data.filter(
  obj => obj.name === 'Nigeria'
  )[0].flag


export default class SignUp extends Component  {
 
  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined,
      flag: defaultFlag,
      modalVisible: false,
      phoneNumber: '',
      countryCode: "234",
      banks:[],
      bank: '',
      bankcode: '',
      email: '',
      password: '',
      showpassword: true,
      icon: "eye-slash",
      username: null,
      acctnum: '',
      otp: '',
      gotOTP: false,
      spinner: false,
      name: '',
      accountNGN: true,

        
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

    this.loadBank();

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


  ValidateEmail = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (reg.test(this.state.email) === true){
        
      if (this.state.accountNGN){ 

      this.nameEnquiry();

      }else{

        this.getotp();

      }

      
    }else{  this.notifyMessage("Oops, invalid email address format");
        
      
    }
}
   
_changeIcon() {
  this.setState(prevState => ({
    icon: prevState.icon === 'eye' ? 'eye-slash' : 'eye',
      showpassword: !prevState.showpassword
  }));
}

validateEntries=(level)=>{

  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
  
  this.notifyMessage("You're offline")
  this.setState({refreshing: false})
  
  
  } else{
  
  
 
    const {email,password,phoneNumber,acctnum, accountNGN, name} = this.state;

    if (accountNGN){

//POST json 
if(level == 1){  
    
  
  if (phoneNumber != '') {
   

    if (email != '') {
   
 
      if (password != '') {
   
        
        if (acctnum != '') {
   

            //cool: do name enquiry
           
              this.ValidateEmail();

           
                      
           } else {
       
              this.notifyMessage('Please Enter Account number');
           }
 
        
         } else {
     
            this.notifyMessage('Please Enter Password');
         }
      
       } else {
   
          this.notifyMessage('Please Enter Email');
    }
   
  } else {

     this.notifyMessage('Please Enter Phone number');
  }

}
 


    } else {


//POST json 
if(level == 1){  
    
  
  if (phoneNumber != '') {
   

    if (email != '') {
   
 
      if (password != '') {
   
        
        if (name != '') {
   

            //cool:
           
              this.ValidateEmail();

           
                      
           } else {
       
              this.notifyMessage('Please Enter your name');
           }
 
        
         } else {
     
            this.notifyMessage('Please Enter Password');
         }
      
       } else {
   
          this.notifyMessage('Please Enter Email');
    }
   
  } else {

     this.notifyMessage('Please Enter Phone number');
  }

}



    }
   
    }
      
   
  });
  
}


 bankchangeHandler = (bank) => {
   
  const bankcode = (this.state.drop_down_data.find(drop_down_data => drop_down_data.value === bank)).key;

  this.setState({bank: bank, bankcode: bankcode})

  this.setState({gotOTP:false})

  // this.notifyMessage(this.state.bankcode);

  // this.notifyMessage(`Selected value: ${bank}`);
}

nameEnquiry() {
 
  try {

    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
      const {acctnum, bankcode} = this.state;
     
      this.setState({spinner: true});
      
    //POST json 
    var dataToSend = { accountnumber: acctnum, bankcode: bankcode}
    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  
    const url = 'https://truesaver.net/api/v1/resolveaccount.ashx';
  
  
    fetch(url, {
      method: "POST",//Request Type 
       body: formBody,//post body 
       headers: {//Header Defination 
         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
         },
      
     })
  
    .then((response) => response.json())
    .then((responseJson) => {
      
      this.setState({spinner: false});
  
      if(responseJson.status == "00"){  
    
        
        this.setState({name: responseJson.account_name }) ;
        Alert.alert(
          "Account Name Enquiry",
          `A one-time-password will be sent to ${this.state.email}. Continue as ${this.state.name}` ,
      
          [
            
            { text: "Change entries" },
            { text: "Continue", onPress: () => this.getotp()}
           
          ],
  
          { cancelable: true }
     
          );
     
  
      }else{   
  
  
        Alert.alert(
          "Account Name Enquiry",
          `Looks like the account number and bank do not match. Please confirm your account number or bank` ,
      
          
          [
            { text: "Ok" },
   
        ],
          { cancelable: true }
     
          );
      }
      
  
    })
  
    .catch((error) => {
  
      this.notifyMessage("Oops. Something's not right");
      this.setState({spinner: false});
  
    });
    }
        
     
    });
     
  } catch (error) {

    // this.notifyMessage("Oops, something's not right");
   
   }
   
    }
  
    

    

 notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}
  

 getotp = () => {

  try{


    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      
    this.setState({spinner: true});
  
    const {email,password,acctnum,bankcode,phoneNumber,accountNGN, bank, countryCode,name} = this.state;
      
  
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
  
                this.props.navigation.navigate("otp", {email:email, password:password, name:name,countryCode:countryCode,phoneNumber:phoneNumber, acctnum:acctnum, bank:bank, bankcode:bankcode, accountNGN:accountNGN}) 
                this.setState({spinner: false})

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
        
     
    });
    


  } catch (error) {

      // this.notifyMessage("Oops, something's not right");
     
     }

    
   
}
 


  
loadBank() {
 
  try {


    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    
    
    } else{
    
    
      fetch('https://api.flutterwave.com/v3/banks/NG', {
      method: "GET",//Request Type
      headers: {//Header Defination 
           'Authorization': 'Bearer FLWSECK-eae1d7d14873b74f9986f8dd04a348cb-X' //+ authorization
           }, 
      
          })
  
    .then((response) => response.json())
    .then(async(responseJson) => {
      var count = Object.keys(responseJson.data).length;
      let drop_down_data = [];
      for(var i=0;i<count;i++){
        drop_down_data.push({ value: responseJson.data[i].name , key: responseJson.data[i].code }); // Create your array of data
        this.setState({value : responseJson.data[i].code})
      }
      this.setState({ drop_down_data, refreshing: false }); // Set the new state
     
    })
    .catch((error) => {
  
      this.notifyMessage("Oops, something's not right");
      this.setState({refreshing: false }); // Set the new state
  
    });
          
    }
        
     
    });
    
    

  } catch (error) {
    this.notifyMessage("Oops, something's not right");
 }

}

  
  _onRefresh = () => {
   
    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.loadBank();});
    
    }
        
     
    });
    
  

    }
   
   
 
  
  render() {
    
    let { flag } = this.state
    const countryData = data
    let { otp } = this.state;

    return (
    
<ScrollView   style = {{backgroundColor: 'white'}}  scrollEnabled={true} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} refreshControl={
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


  <View style={{flex:2, backgroundColor:'white'}} >

                  {/* phone section  */}
                  <Input style={{ paddingRight:15}}
                     label="Phone number"
                     labelStyle={{color:'teal'}}
                     placeholder='08053123322'
                      placeholderTextColor='#adb4bc'
                      keyboardType={'phone-pad'}
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      autoFocus={true} 
                      secureTextEntry={false}
                      ref='PhoneInput'
                      value={this.state.phoneNumber}
                       onChangeText={phoneNumber => this.setState({ phoneNumber})}
 
                    
                    />
                   
                     
                 

 
<Input
label="Email"
labelStyle={{color:'teal'}}
inputStyle={{fontSize:15}}

   placeholder="yours@email.com"
   onChangeText={email => this.setState({ email})}
   keyboardType="email-address"
  
  />
 
 <Input
 label="Password"
inputStyle={{fontSize:15}}

 labelStyle={{color:'teal'}}
   placeholder="Password"
   onChangeText={password => this.setState({ password})}
   value={this.state.password}
   secureTextEntry={this.state.showpassword}
   rightIcon = {
    <Icon style={{color:'teal',paddingRight: 20}} name={this.state.icon} onPress={() => this._changeIcon()} />
  }

  /> 
      
<Input
label="Account number"
inputStyle={{fontSize:15}}

labelStyle={{color:'teal'}}
   placeholder="Account #"
   onChangeText={acctnum => this.setState({ acctnum})}
   value={this.state.acctnum}
   keyboardType="numeric"
  />      
            

<View style= {styles.dropdown}><Dropdown 
label="Select bank" labelFontSize={17}
 itemCount={7} baseColor ='teal'
 data={this.state.drop_down_data} 
 animationDuration={100}
 onChangeText={value => this.bankchangeHandler(value)}
 /></View>
 
 
  <View>
              
{this.state.spinner &&
                        <ActivityIndicator size="small" color="teal" />
                    }
</View>


{!this.state.spinner &&

            <View style= {styles.fixToText}> 

            <Button title="Continue" onPress={() => this.validateEntries(1)}>
            
          </Button>

          </View>
  }

 
<TouchableOpacity  style={{paddingTop: 30}} onPress={() => this.props.navigation.navigate("SignIn")}>

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
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  favview: {
    alignItems:'center',
    paddingTop:30,
    backgroundColor: 'white',
    paddingBottom:50
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  }, 

  butview: {
 
    paddingBottom:50,
    alignItems: 'center'
 
  },
 
  fav:{ width: 40, height: 40, borderRadius: 40/2 
},
 
fixToText: {
    flex:2,
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
   
   
})
