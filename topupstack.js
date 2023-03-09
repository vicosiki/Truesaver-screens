import React, { Component } from "react";
import {  ToastAndroid, Platform, AlertIOS,ActivityIndicator, Clipboard,StyleSheet, Linking,Text, View,Button, Alert,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";
import RadioButtonRN from 'radio-buttons-react-native-expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Clipboard from "@react-native-community/clipboard";



 
   
    
export default class topupstack extends Component {
 
    
  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      error: null,
      refreshing: false,
      apikey:'',
      spinner:false,
     amount:500,
      email:this.props.route.params.email,
      name: this.props.route.params.name,
      phonenumber: this.props.route.params.phonenumber,
      navto: this.props.route.params.navto,
      tsbank: this.props.route.params.tsbank, 
      
    };
  
    this.loadpara()
    
  }
 
 
  
  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };

  
loadpara = async () => {

  NetInfo.addEventListener(this.handleConnectivityChange);

  try {
let authorization = await AsyncStorage.getItem('flwauthorization')
let topup_note = await AsyncStorage.getItem('topup_note')
 
this.setState({authorization:authorization, topup_note:topup_note})
 
} catch (error) {
  this.notifyMessage("Oops, something's not right");
}

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
      icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
      showpassword: !prevState.showpassword
  }));
}


handleOnRedirect = (data) => {

  if (data.status == "successful") {
 
    alert("Your stack topup was successful. Keep saving!")

  } 

  }
  

  chatLink = async () => {
    try {
       
      
      Clipboard.setString(this.state.topup_note)

      this.notifyMessage("Chat link copied")

     // WebBrowser.openBrowserAsync(`${this.state.care}`)

      Linking.openURL(`${this.state.topup_note}`)

    } catch (error) {
       this.notifyMessage("Oops, something's not right");
    }
  };
  
 Stacktopup= () => { 

  const {tsbank,topupnote}= this.state

//reset amont 

  this.setState({amount: 5000});


  Alert.alert(
                   
   "Direct Transfer",
    `You can top up your stacks by doing a direct transfer to: ` + tsbank,
          
    [
      { text: "Close"}
     
      ,
      { text: "Transfer Done", onPress: () => this.chatLink()}
      
      
   
     
    ],

    { cancelable: true }

  );

}




topup=(amount)=>{


  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
    const {email} = this.state;
   
        
     
        this.setState({spinner: true});
  
        const url = 'https://truesaver.net/api/v1/topupstacks.ashx';
    
         
        //POST json 
         
          var dataToSend = { email: email, amount: amount}
     
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
  
  
  }
      
   
  });
  
  
   }
 
  
 render() {
     
  
const generateRef = (length) => {
  var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  var b = [];  
  for (var i=0; i<length; i++) {
      var j = (Math.random() * (a.length-1)).toFixed(0);
      b[i] = a[j];
  }
  return b.join("");
}
  
const data = [
  {
    label: '₦500',
    accessibilityLabel: '500'
   },
   {
    label: '₦1,000',
    accessibilityLabel: '1000'
   },
   {
    label: '₦2,000',
    accessibilityLabel: '2000'
   },
   {
    label: '₦3,000',
    accessibilityLabel: '3000'
   },
   {
    label: '₦4,000',
    accessibilityLabel: '4000'
   },
   {
    label: '₦5,000',
    accessibilityLabel: '5000'
   },
   {
    label: 'MORE',
    accessibilityLabel: 'more'
   }
  ];
  

let {authorization, phonenumber, email, name, amount,navto} = this.state;

       
  return (
    
 

  <View  style={styles.container}>

       
<ScrollView  >
    
  
<View>


<View style= {styles.favview}>
 
 <Text style= {styles.textstylex} >Top up your Stacks</Text>

  </View>
<View  style={styles.textnoint}>
<Text style= {styles.textstyle}>Choose your preferred top up</Text>
</View>

<RadioButtonRN
  data={data}
  initial={1}
  selectedBtn={(e) => this.setState(amount => ({amount: e.accessibilityLabel === 'more' ? this.Stacktopup() : e.accessibilityLabel }))
  
  }

  icon={
    <Icon
      name="check-circle"
      size={25}
      color="teal"
    />
  }
/>
     


</View>

  </ScrollView>


  <View  style={styles.tabBarInfoContainer} >  
     
     <PayWithFlutterwave
     
     onRedirect={(data) => this.handleOnRedirect(data)} 
     options={{
       tx_ref: generateRef(11),
       authorization: authorization,
       amount:  amount,
       currency: 'NGN',
       payment_options: "ussd,card,banktransfer,barter, paga, qr",
       customer: {
     
           email: email,
           phone_number:phonenumber,
           name:name
     
       },
     
       meta: {
     
         txtype: "topupstacks"
         
     
     }
      
     }}
     customButton={(props) => (
       <TouchableOpacity
          
           onPress={props.onPress}
           isBusy={props.isInitializing}
           disabled={props.disabled}>
             <Text style={{ color: 'white', fontWeight:'bold', fontSize: 16}}>Top up</Text>
         </TouchableOpacity>
     
         
     )}
     
     />
     
     </View>
     
     
     
  <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => this.props.navigation.navigate(navto)}
          
        >
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
     
    
    </View>



 );
}

}
 
 
const styles = StyleSheet.create({
  
  
 floatingButton: {
  borderWidth: 1,
  borderColor: 'green',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 70,
  right: 15,
  width: 60,
  height: 60,
  backgroundColor: 'green',
  borderRadius: 100,
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
    alignContent: 'center',
    paddingTop:15,
     backgroundColor: 'teal',
 
     height:50,
   },
     

     
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
  