import React, { Component } from "react";
import {  ToastAndroid, Platform, AlertIOS,ActivityIndicator, StyleSheet, Text, View, Alert,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";
 
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
 
   
    
  export default class airtimebill extends Component {
 
    
  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      error: null,
      refreshing: false,
      apikey:'',
      spinner:false,
      groupid:this.props.route.params.groupid,
      slot: this.props.route.params.slot,
      saverid: this.props.route.params.phonenumber,
      phonenumber: this.props.route.params.phonenumber,
      icon: "eye-slash",
      showpassword: true,
      password: '',

      
      amount:'1000',
      airtimeMinsub:this.props.route.params.airtimeMinsub ,
      airtimeMaxsub:this.props.route.params.airtimeMaxsub,

      
    
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


  notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
     
 

  
_changeIcon() {
  this.setState(prevState => ({
    icon: prevState.icon === 'eye' ? 'eye-slash' : 'eye',
      showpassword: !prevState.showpassword
  }));
}



submitreq=()=>{


  NetInfo.fetch().then(state => {
    
    if (!state.isConnected) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
    const {groupid,duedate,amount,password,phonenumber,airtimeMinsub,airtimeMaxsub} = this.state;
   
    if (phonenumber != '') {
  
      if (amount != '')  {
    
     if ( amount >  499.9  && amount <  1000.9 ) {
      
       
    if (password != '') {
  
        
     
        this.setState({spinner: true});
  
        const url = 'https://truesaver.net/api/v1/saveracctmod.ashx';
    
         
        //POST json 
         
          var dataToSend = { bankcode: bankcode, acctnum: acctnum, bank: bank, password: password, level:'2', phonenumber: phonenumber}
     
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
  
  await AsyncStorage.setItem('bank', this.state.bank);
  await AsyncStorage.setItem('bankcode', this.state.bankcode);
  await AsyncStorage.setItem('acctnum', this.state.acctnum);
  await AsyncStorage.setItem('name', this.state.name);
  
  
  
  
  
        this.setState({spinner: false});
                
    
  
    
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
  
        this.notifyMessage('Please enter your truesaver password');
   }


  
  } else {
  
     
  this.notifyMessage('Please enter an amount between ' + this.state.airtimeMinsub + ' and ' + this.state.airtimeMaxsub);

  }

  
} else {
  
     
  this.notifyMessage('Please enter an amount between ' + this.state.airtimeMinsub + ' and ' + this.state.airtimeMaxsub);

  }
 
  
  } else {
  
  this.notifyMessage('Please enter phone number');

  }
  
  
  }
      
   
  });
  
  
   }
 
  
 render() {
    
     
let {newsaverid} = this.state;

       
  return (
    
 

  <View  style={styles.container}>

       
<ScrollView  >
    
  
<View>


<View style= {styles.favview}>
 
 <Text style= {styles.textstylex} >Borrow Airtime</Text>

  </View> 
<View  style={styles.textnoint}>
<Text style= {styles.textstyle}>Enter the phone number you want to topup</Text>
</View>

   
   
<Input
label="Phone number"
labelStyle={{color:'teal'}}
   placeholder="Phone #"
   onChangeText={phonenumber => this.setState({ phonenumber})}
   value={this.state.phonenumber}
   keyboardType="numeric"
  />      
  
  <Input
  label="Amount"
  labelStyle={{color:'teal'}}
     placeholder="Amount"
     onChangeText={amount => this.setState({ amount})}
     value={this.state.amount}
     keyboardType="numeric"
    />      

 <Input
 label="TrueSaver Password"
 labelStyle={{color:'teal'}}
   placeholder="Password"
   onChangeText={password => this.setState({ password})}
   value={this.state.password}
   secureTextEntry={this.state.showpassword}
   onSubmitEditing={(password => this.setState({password}),() => this.submitreq())}
   rightIcon = {
    <Icon style={{color:'teal',paddingRight: 20}} name={this.state.icon} onPress={() => this._changeIcon()} />
  }

  /> 
      
      
      {!this.state.spinner &&
          <View style= {styles.fixToText}> 
      
          <Button title="Continue" onPress={this.submitreq}>
          
        </Button>
      
      </View>
      
      } 

      
      
<TouchableOpacity  style={{paddingTop: 20}}  onPress={() => this.props.navigation.goBack()}>
       

<View style= {styles.butview}>
  
  <Text style= {styles.basetextstyle}> Back to Groups </Text>
  </View>
    </TouchableOpacity>

  <View>
              
{this.state.spinner &&
                        <ActivityIndicator size="small" color="teal" />
                    }
</View>
 
</View>

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
  