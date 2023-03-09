import React, { Component } from 'react';
import {View, ToastAndroid,
  Platform,
  AlertIOS,ActivityIndicator, Image, 
  StyleSheet,ScrollView,TouchableOpacity,Alert,RefreshControl, Text} from 'react-native';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { Button , Input} from 'react-native-elements';
  import Icon from 'react-native-vector-icons/FontAwesome';
   
import NetInfo from "@react-native-community/netinfo";
import { Dropdown } from 'react-native-material-dropdown';

  
export default class banksettings extends Component  {
 
  constructor(props) {
    super(props);

    this.state = {
      email: null, 
        password: '', 
        acctnum: '',
        bank: '',
        spinner: true,
        gotOTP: false,
        icon: "eye-slash",
        showpassword: true,
        prevbank: '',
        prevacctnum:'',

    };

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
   
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  

  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
  
 
bankchangeHandler = (bank) => {
   
  const bankcode = (this.state.drop_down_data.find(drop_down_data => drop_down_data.value === bank)).key;

  this.setState({bank: bank, bankcode: bankcode})
 
 
}


notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}

  Deleteacct_conf = () => {
   
    Alert.alert(
      "ACCOUNT DELETION",
      "Your account will be permanently deleted. \n\nHowever, records of all your transactions will be kept indefinitely."  ,
      [
          { text: "Close" },
          { text: "Delete", onPress:() =>  this.Deleteacct()}

      ],
      
      { cancelable: true }

    );
       
  }
 
  
       
Deleteacct = () => {
   
  if (!this.state.connection_Status) {
     
     
     this.notifyMessage("You're offline")
     
     } else {

     this.setState({spinner: true})

   
      let {email,apikey }= this.state
  
      
  //POST json 
  var dataToSend = {email}
  //making data to send on server
  var formBody = [];
  for (var key in dataToSend) {
    var encodedKey = encodeURIComponent(key);
    var encodedValue = encodeURIComponent(dataToSend[key]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  var url = 'https://truesaver.net/api/v1/deleteacct.ashx';
  
  
  fetch(url, {
    method: "POST",//Request Type 
     body: formBody,//post body 
     headers: {//Header Defination 
       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
       apikey: apikey
       },
    
   })
  
  .then((response) => response.json())
  .then((responseJson) => {
     
    this.setState({spinner: false})
  
    if(responseJson.status == "00"){  
  
      this.notifyMessage("Your request was sucessfully submitted. Deletion will be completed withing 24Hrs")
 
    }else{   
   
     this.notifyMessage(responseJson.status )
   
    }
    
  
  })
  
  .catch((error) => {
  
    this.setState({spinner: false})
  
    this.notifyMessage("Oops, something's not right" )
     
  });
        
   
    
     }
     
    
   }
  

  
 
nameEnquiry() {
  
    
    if (!this.state.connection_Status) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
    const {password, acctnum, bank, bankcode, accountNGN} = this.state;
 

    if  (!accountNGN) {
 
      this.submitchange()

    } else {

      if ( this.state.bank != this.state.prevbank || this.state.acctnum != this.state.prevacctnum) {
  
      
  
        if (password != '') {
         
          if (acctnum != '') {
    
          if (bank != '') {
    
       
        this.setState({spinner: true});
    
        
      //POST json 
      var dataToSend = { accountnumber: acctnum, bankcode: bankcode, accountNGN}
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
            `Your profile name will be changed to ${this.state.name}` ,
        
            [
              { text: "Cancel" , },

              { text: "Continue", onPress: () => this.submitchange()}
    
             
            ],
    
            { cancelable: false }
       
            );
       
    
        }else{   
    
    
          Alert.alert(
            "Account Name Enquiry",
            `Looks like the account number and bank do not match. Please confirm your account number or bank` ,
        
            
            [
              { text: "Ok" },
     
          ],
            { cancelable: false }
       
            );
        }
        
    
      })
    
      .catch((error) => {
    
       this.notifyMessageert("Oops, something's not right");
        this.setState({spinner: false});
    
      });
            
         
    
    } else {
         
      this.notifyMessage('Bank not listed');
    }
    
    } else {
    
    this.notifyMessage('Please enter account number');
    
    }
    
    } else {
    
    this.notifyMessage('Please enter password');
    }
     
      
      } else {
    
        alert("To make changes, enter a different account number or select a different bank")
      }
      
    

    }

     
  }
  
  
   }
  
   
loadBank() {
 
    if (!this.state.connection_Status) {

  this.notifyMessage("You're offline")
  
  
  } else{
  
  
    fetch('https://api.flutterwave.com/v3/banks/NG', {
    method: "GET",//Request Type
    headers: {//Header Defination 
         'Authorization': 'Bearer FLWSECK-eae1d7d14873b74f9986f8dd04a348cb-X' //+ this.state.authorization

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
      
  
  
}

submitchange=()=>{


  if (!this.state.connection_Status) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
    const {password,acctnum,bank,bankcode,phonenumber, accountNGN} = this.state;

    
   
    if (password != '') {
  
      if (acctnum != '') {
  
      if (bank != '') {
  
     
        if ( this.state.bank != this.state.prevbank || this.state.acctnum != this.state.prevacctnum) {
  

        this.setState({spinner: true});
  
        const url = 'https://truesaver.net/api/v1/saveracctmod.ashx';
    
         
        //POST json 
         
          var dataToSend = { bankcode: bankcode, acctnum: acctnum, bank: bank, password: password, level:'2', phonenumber: phonenumber,accountNGN}
     
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
    
      this.notifyMessage("Update was successful");

        this.setState({spinner: false});

  
  await AsyncStorage.setItem('bank', this.state.bank);
  await AsyncStorage.setItem('acctnum', this.state.acctnum);
  await AsyncStorage.setItem('name', this.state.name);
  await AsyncStorage.setItem('bankcode', this.state.bankcode);
  
  
    
               }else{
      
                this.notifyMessage(responseJson.status);
              this.setState({spinner: false});
       
           }
    
    })
    
    
    
    .catch((error) => {
    
        this.setState({spinner: false});
    
        this.notifyMessage("Oops,something's not right");
    
    });
  
  
    
} else {
    
  alert("To make changes, enter a different account number or bank")

}

       } else {
  
        this.notifyMessage('Enter Bank');
   }
  
  } else {
  
   this.notifyMessage('Please enter account number');
  
  }
  
  } else {
  
  this.notifyMessage('Please enter password');

  }
   

  }
      
  
   }
 
  
   _onRefresh = () => {
 
    if (!this.state.connection_Status) {

    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.loadBank();});
    
    }
        
     
     }
     
      


_changeIcon() {
  this.setState(prevState => ({
    icon: prevState.icon === 'eye' ? 'eye-slash' : 'eye',
      showpassword: !prevState.showpassword
  }));
}


componentDidMount = async () => {
 

NetInfo.addEventListener(this.handleConnectivityChange);
    
    let apikey = await AsyncStorage.getItem('apikey');

    let email = await AsyncStorage.getItem('email')

    let bank = await AsyncStorage.getItem('bank')

    let acctnum = await AsyncStorage.getItem('acctnum')

    let phonenumber = await AsyncStorage.getItem('phonenumber')

    let accountNGN = this.props.route.params.accountNGN

    let authorization = await AsyncStorage.getItem('flwauthorization')
    
    this.setState({authorization:authorization,accountNGN:accountNGN, phonenumber:phonenumber,prevbank:bank, prevacctnum:acctnum, apikey: apikey, email:email,  acctnum: acctnum, bank:bank, spinner:false})
  

    this.loadBank()



  }
   
 
  render() {
     
    let { password,acctnum ,bank} = this.state;
  
       
    
    return (
    
<ScrollView   style = {{backgroundColor: 'white'}} scrollEnabled={false}   showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>

<View style= {styles.favview}>
   

<Text style= {styles.textstyle} >Change bank details</Text>

  </View> 
 
  <View >
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
   keyboardType="phone-pad"
  />      
          
 
<View style= {styles.dropdown}><Dropdown 
label="Select bank" labelFontSize='15'
 itemCount='5' baseColor ='teal'
 data={this.state.drop_down_data} 
 value={bank}
 onChangeText={value => this.bankchangeHandler(value)}
  
 /></View>


    
{this.state.spinner &&
                        <ActivityIndicator size="large" color="teal" />
                    }

            {!this.state.spinner &&
            <View style= {styles.fixToText}> 

            <Button title="Continue" onPress={() => this.nameEnquiry()}>
            
          </Button>

         </View>

  } 


<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'Settings' }],
    })}>

<View style= {styles.butview}>
  
<Text style= {styles.basetextstyle}> Back to Profile </Text>
</View>
 
 </TouchableOpacity>

<TouchableOpacity   style={{paddingTop: 70}} onPress={() => this.Deleteacct_conf()}>

<View style= {styles.butview}>
  
<Text style= {styles.basetextstylex}> Delete Account </Text>
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

  spinnerTextStyle: {
    textAlign: 'center'
},

  
dropdown: {
  paddingLeft:15,
  paddingRight:2,
},
  favview: {
    alignItems:'center',
    backgroundColor: 'white',
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
  paddingBottom:30,
  paddingTop:30,



  },

basetextstyle: {
    
  fontSize:15,
  fontWeight:'bold',
  color: '#008080'

  

},


basetextstylex: {
    
  fontSize:15,
  fontWeight:'bold',
  color: 'red'

  

},

  textstyle: {
    
    fontSize:20,
    fontWeight:'bold',
    paddingTop: 30,
    paddingBottom:30,
    color: '#008080'

  },
  
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  }, 
    

  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#b44666',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  
})
