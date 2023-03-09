import * as WebBrowser from 'expo-web-browser';
import React, { Component } from "react";
import { Overlay, Button } from 'react-native-elements';
import { ActivityIndicator,ToastAndroid,
  Platform,
  AlertIOS, StyleSheet, Text, View, Alert,RefreshControl,Linking, Share,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import NumberFormat from 'react-number-format';
import NetInfo from "@react-native-community/netinfo";
import { FontAwesome } from '@expo/vector-icons';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";




 
const generateRef = (length) => {
  var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  var b = [];  
  for (var i=0; i<length; i++) {
      var j = (Math.random() * (a.length-1)).toFixed(0);
      b[i] = a[j];
  }
  return b.join("");
}
   
export function ReactNativeNumberFormat({ value }) {
  return (
    <NumberFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'₦ '}
      renderText={formattedValue => <Text>{formattedValue}</Text>} // <--- Don't forget this!
    />
  );
}

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class JoinedGroups extends Component { 

  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      error: null,
      data: [],
      refreshing: false,
      spinner:true,
      airtimeMinsub: null,
      airtimeMaxsub: null,
      dstvMinsub: null,
      dstvMaxsub: null,
      paybacklink: null,
      visibleoverlay:false,
      usedstacks:0,
      availablestacks:0,
      totalstacks:0,
      cardregfee:0,
      payupfee:0,

      
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
   
    
    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
   this.setState({spinner: false})
    
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.makeRemoteRequest();});
    
    }
        
     
    });
    
     }
     
      

  async componentDidMount() {

NetInfo.addEventListener(this.handleConnectivityChange);
    
    let phonenumber = await AsyncStorage.getItem('phonenumber')
    let name = await AsyncStorage.getItem('name')
    let email = await AsyncStorage.getItem('email')

    let apikey = await AsyncStorage.getItem('apikey')
    let tsbank = await AsyncStorage.getItem('tsbank')

    let stacksinfo = await AsyncStorage.getItem('stacksinfo')


let authorization = await AsyncStorage.getItem('flwauthorization')
 

    this.setState({stacksinfo:stacksinfo, authorization:authorization,phonenumber:phonenumber, email:email, name:name, apikey:apikey, tsbank:tsbank})

     this.makeRemoteRequest()

    
    
    
  }

   

handleOnRedirect_reg = (data) => {

  if (data.status == "successful") {
 
   
    fetch(`${this.state.redirect_url_cardreg}` + `&status=` + data.status + `&transaction_id=` + data.transaction_id + `&tx_ref=` + data.tx_ref, {
    method: "GET",//Request Type 
    
        })

  .catch((error) => {

  });

if ( this.state.txttype_reg == "cardreg") {

  alert("Thank you for linking your card. The card will be approved if it is still valid by " & `${this.state.cardvalid}`)

} else if  ( this.state.txttype_reg == "commitfee") {

  alert("You are in! Thanks for picking your slot")


}
  
        
  }
 
}



 handleOnRedirect = (data) => {

  if (data.status == "successful") {
 
   
    fetch(`${this.state.redirect_url}` + `&status=` + data.status + `&transaction_id=` + data.transaction_id + `&tx_ref=` + data.tx_ref, {
    method: "GET",//Request Type 
    
        })

  .catch((error) => {

  });

if ( this.state.txttype_reg == "commitfee") {

  alert("You are in! Thanks for picking your slot")
 
}
   
this._onRefresh

        
  }
 
}


 
 notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}


 Stackinfo= (info) => { 

  const {phonenumber,email, name,topup_note, tsbank}= this.state

  Alert.alert(
                   
   "About Stacks",
    info,
          
    [
      { text: "Close"}
     
      ,
      { text: "Top up", onPress: () => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank, name:name,email:email,phonenumber:phonenumber,navto:"JoinedGroups"})}
      
      
   
     
    ],

    { cancelable: true }

  );

}



  makeRemoteRequest = () => {

     try {

      
 
    const url = 'https://truesaver.net/api/v1/joined.ashx';

    const {phonenumber,apikey}= this.state
    
    
    //POST json 
    var dataToSend = { phonenumber: phonenumber};  
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
       , apikey: apikey                 
     },
   })
   .then((response) => response.json())
   //If response is in json then in success
   .then((responseJson) => {

     if (responseJson.status == "00"){

     this.setState({ loading: false, 
            
               data: responseJson.savergroup,dataempty: false,
               refreshing: false,spinner:false, totalgroups:responseJson.totalgroups,
               airtimeMinsub:responseJson.airtimeMinsub,  airtimeMaxsub:responseJson.airtimeMaxsub,
               dstvMinsub:responseJson.dstvMinsub,  dstvMaxsub:responseJson.dstvMaxsub,
               paybacklink: responseJson.paybacklink,totalstacks:responseJson.totalstacks, availablestacks:responseJson.availablestacks, usedstacks:responseJson.usedstacks,
               topup_note:responseJson.topup_note
               
               
       });

    } else {

     this.setState({ loading: false, dataempty: true, data: [],
       refreshing: false,spinner:false, totalgroups:0

});

    }
               
   
   
   })
   
   //If response is not in json then in error
   .catch((error) => {

    //this.notifyMessage("Oops, something's not right");
    this.setState({spinner:false, dataempty: true})

   });


     } catch (error) {

        this.setState({spinner:false, dataempty: true})

       
       }


  }
  

  
  render() {
   

let {authorization, topup_note, tsbank, interval, phonenumber, name, email, groupid,tx_ref ,duedate,slottransfer ,subscription_code ,todate ,frodate ,plan ,payment_options_cardreg,formatted_payupfee ,payupfee,cardregfee,txttype,cardlinkval,txttype_reg ,cardvalid,defaultcount,payment_options} = this.state;

  

const toggleOverlay = () => {

   this.setState({visibleoverlay: false})
   
};


const AcceptSlot=(groupid,slot) =>{

    
NetInfo.fetch().then(state => {

  if (!this.state.connection_Status) {

 
 this.notifyMessage("You're offline")
 
 } else {
 

    //POST json 
    var dataToSend = { name:name, email:email, groupid: groupid, saverid:phonenumber,  slot:slot, level: "2"}


    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  
    const url = 'https://truesaver.net/api/v1/transslot.ashx';
  
  
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
    
          this._onRefresh()

        if(responseJson.nosub == "true"){ 

          this.notifyMessage(responseJson.response)

        }else{

          
         Linking.openURL(responseJson.response).catch((err) => console.error('An error occurred generating payment link. Please retry', err));

        }
               
   
      }else{   
  
          this.notifyMessage(responseJson.response)
  
      
      }
      
  
    })
  
    .catch((error) => {
  
      this.notifyMessage("Oops. Something's not right");
      this.setState({spinner: false});
  
    });
       

  }

});


}
    

  

const DeclineSlot=(groupid,slot) => {

    
NetInfo.fetch().then(state => {

  if (!this.state.connection_Status) {
 
 this.notifyMessage("You're offline")
 
 } else {
 
 

    //POST json 
    var dataToSend = {  groupid: groupid, saverid:phonenumber,  slot:slot, level: "3"}


    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  
    const url = 'https://truesaver.net/api/v1/transslot.ashx';
  
  
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
    
                
        this.notifyMessage(responseJson.response)

          this._onRefresh()

      }else{   
  
          this.notifyMessage(responseJson.response)
  
      
      }
      
  
    })
  
    .catch((error) => {
  
      this.notifyMessage("Oops. Something's not right");
      this.setState({spinner: false});
  
    });
       


 }

});



}
    
 

const searchGroup = (groupid) => {
     
     
    
NetInfo.fetch().then(state => {

  if (!this.state.connection_Status) {
  
 
 this.notifyMessage("You're offline")
 
 } else {
 
  
  if (groupid != null) {
 
  
    //POST json 
    var dataToSend = { groupid, phonenumber,caller:"mobile"}
    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    const url = 'https://truesaver.net/api/v1/searchgroup.ashx';
    
    
    fetch(url, {
      method: "POST",//Request Type 
       body: formBody,//post body 
       headers: {//Header Defination 
         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
         },
      
     })
    
    .then((response) => response.json())
    .then((responseJson) => {
       
    
      if(responseJson.status == "00"){  
    
        
        this.props.navigation.navigate("MembersList", {topup_note:topup_note,default_collected:responseJson.default_collected,default_notcollected:responseJson.default_notcollected,groupinfo:responseJson.groupinfo,chargedate:responseJson.chargedate,showReview:responseJson.showReview, sharetext:responseJson.Sharetext,linkchat:responseJson.walink,Interval:responseJson.interval,CollectableAmount:responseJson.CollectableAmtFormatted,PayableAmount:responseJson.PayableAmtFormatted,adminfee:responseJson.adminfee,groupid:groupid, members:responseJson.savers, freeslots:responseJson.freeslotcount,  slots: responseJson.slotmonth, commitfee:responseJson.commitfee, cardvalid:responseJson.cardvalid})
    
    
      }else{   
    
       this.setState({spinner: false})
        
       this.notifyMessage(responseJson.status )
     
      }
      
    
    })
    
    .catch((error) => {
    
      this.setState({spinner: false})
    
      this.notifyMessage(error);
    
    });
          
       
    
    } else {
    
       
      this.notifyMessage('Group ID not provided');
    
    }
  
    
 }

});

 }

 
const regCard = (groupid, duedate) => {
     
    
  NetInfo.fetch().then(state => {
  
    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
   
    
    if (groupid != null) {
   
    
      //POST json 
      var dataToSend = { groupid, phonenumber,caller:"mobile"}
      //making data to send on server
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      
      const url = 'https://truesaver.net/api/v1/searchgroup.ashx';
      
      
      fetch(url, {
        method: "POST",//Request Type 
         body: formBody,//post body 
         headers: {//Header Defination 
           'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
           },
        
       })
      
      .then((response) => response.json())
      .then((responseJson) => {
         
      
        if(responseJson.status == "00"){  
      
         
          Alert.alert(
            "Confirm card expiry date",
            "Please check your card and continue if it's still valid by " + responseJson.cardvalid , 
         
            [
             { text: "Cancel"},
       
             { text: "Continue", onPress: () => Linking.openURL(`${this.state.paybacklink} + &groupid=` + groupid + `&duedate=` + duedate + `&apikey=` + `${this.state.apikey}` + `&cardReg=true` ) }
  
         ],
       
                 { cancelable: true }
          );
      
          
      
        }else{   
      
         this.setState({spinner: false})
          
         this.notifyMessage(responseJson.status )
       
        }
        
      
      })
      
      .catch((error) => {
      
        this.setState({spinner: false})
      
        this.notifyMessage("Oops. Something's not right");
      
      });
            
         
      
      } else {
      
         
        this.notifyMessage('Group ID not provided');
      
      }
    
      
   }
  
  });
  
   }
  
  
   
const borrowcredit = (groupid, duedate) => {

  
  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
 
    this.props.navigation.navigate("airtimebill", {groupid:groupid, slot:duedate})
    
   }
  
  });

}
 
const exitAlert = (groupid, duedate) => {

  
  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
 
    Alert.alert(
      "Exit Alert",
      "You are about to exit your slot on " + groupid , 
   
      [
       { text: "Cancel"},
 
       { text: "Exit", onPress: () => exitGroup(groupid, duedate) },
  
   ],
 
           { cancelable: false }
    );

   }
  
  });

}
 

const PayNote = (admbank, note) => {

  
  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
 
    Alert.alert(
      "Pay Note",
      "Use the following bank details for your savings." + "\n\nRemember to add the admin fee if your group admin requires so: \n\n" + admbank , 
   
      [
       { text: "Cancel"},
 
       { text: "Share Paynote", onPress: () => onShare(note) },
  
   ],
 
           { cancelable: true }
    );

   }
  
  });

}
 


const onShare = async (note) => {
  try {
    const result = await Share.share({
      message:
        `${note}`
       
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


 
const payUp = (groupid, duedate) => {

  const { email } = this.state
  
  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
 
    let tx_ref = generateRef(11)
    
  this.setState({spinner: true})

      //POST json 
      var dataToSend = { groupid, tx_ref, email , duedate, paybackattempt:"no"}
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
         
        this.setState({interval:responseJson.interval,groupid:groupid, tx_ref:tx_ref, email:email , duedate:duedate,redirect_url_cardreg :responseJson.redirect_url_cardreg,redirect_url :responseJson.redirect_url,slottransfer :responseJson.slottransfer,subscription_code :responseJson.subscription_code,todate :responseJson.todate,frodate :responseJson.frodate,plan :responseJson.plan,payment_options_cardreg:responseJson.payment_options_cardreg,formatted_payupfee :responseJson.formatted_payupfee,payupfee:responseJson.payupfee,cardregfee:responseJson.cardregfee,txttype:responseJson.txttype,cardlinkval:responseJson.cardlinkval,txttype_reg : responseJson.txttype_reg,cardvalid:responseJson.cardvalid,defaultcount:responseJson.defaultcount,payment_options:responseJson.payment_options})
   

        this.setState({visibleoverlay: true, spinner: false})
         
        
      
      })
       
  
      .catch((error) => {
      
        this.setState({spinner: false})
      
        this.notifyMessage("Oops. Something's not right");
      
      });
            
                
         }
       
       });
       
       }
    
const exitGroup = (groupid, duedate) => {
   
  
  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
 

    
//POST json 
var dataToSend = { groupid: groupid, phonenumber: phonenumber, duedate: duedate}
//making data to send on server
var formBody = [];
for (var key in dataToSend) {
  var encodedKey = encodeURIComponent(key);
  var encodedValue = encodeURIComponent(dataToSend[key]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");

var url = 'https://truesaver.net/api/v1/exitgroup.ashx';


fetch(url, {
  method: "POST",//Request Type 
   body: formBody,//post body 
   headers: {//Header Defination 
     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
     },
  
 })

.then((response) => response.json())
.then((responseJson) => {
   

  if(responseJson.statuscode == "00"){  

   this.notifyMessage(responseJson.status )
    
     this._onRefresh()

  }else{   

   this.setState({spinner: false})
    
   this.notifyMessage(responseJson.status )
 
  }
  

})

.catch((error) => {

  this.setState({spinner: false})

   
});
      
 
  
   }
  });
  
 }

 const transferslot = (groupid,slot,saverid) => {


  this.props.navigation.navigate("transferSlot", {groupid:groupid, slot:slot, saverid:saverid})


 }
 
   

  let renderCards = this.state.data.map(function (item, index) {
    
      

    return (

      

  item.completedsavings=="true" ?
            
    <View key={item.duedate + item.groupid}>

<Card style={styles.paragraph}>
 

<CardTitle title={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FIcon name="group" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{ item.groupid + " | "  + item.monthlysavings + " " + item.interval + " savings"}</Text>
    
    
   </View>}

   />

   
<CardContent text={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FIcon name="money" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{"Total Savings: " + item.cummsavings + " (Completed)"}</Text>
     
   </View>}

   />

                 
                {item.collected > 0  ?
                
                
                <CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="calendar-check-o" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Settlement Date: " + item.settlementdate  + " (Collected)" }</Text>
                   
                   
                  </View>}
               
                  />
                 :

                  
                <CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="calendar-check-o" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Settlement Date: " + item.settlementdate  }</Text>
                   
                   
                  </View>}
               
                  />

                  }


<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="credit-card" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{item.carddetails}</Text>
                   
                   
                  </View>}
               
                  />

                <CardAction
                   separator={true}
                   inColumn={false}>
                   <CardButton
                    onPress={() => searchGroup(item.groupid)}
                     title="View"
                     color="green"
         
                   />
         
                 </CardAction>

                </Card>
            
                       
              </View>
         
            : /// not completed



        <View key={item.duedate + item.groupid}>

          <Card style={styles.paragraph}>
 
 
<CardTitle title={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FIcon name="group" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{ item.groupid + " | "  + item.monthlysavings + " " + item.interval + " savings"}</Text>
    
    
   </View>}

   />

   
<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="money" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Total Savings: " + item.cummsavings +  " (" + item.roundsLeft + " to go)"  }
               </Text>
                   
                   
                  </View>}
               
   />
                {item.collected > 0  ?
                
               
<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="calendar-check-o" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Settlement Date: " + item.settlementdate  + " (Collected)"  }
               </Text>
                   
                   
                  </View>}
               
   />  
                 
                 :
        
<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="calendar-check-o" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Settlement Date: " + item.settlementdate }
               </Text>
                   
                   
                  </View>}
               
   />   

                  }


<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="credit-card" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{item.carddetails}</Text>
                   
                   
                  </View>}
               
                  />

    {item.notonus == true ?


item.collected > 0  ?
 
  <CardAction
  separator={true}
  inColumn={false}>
  <CardButton
   onPress={() => searchGroup(item.groupid)}

    title="View"
    color="green"

  />
  
  
  <CardButton

onPress={() => PayNote(item.groupadmbank, item.paynote)}

    title="Pay Note"
    color="brown"

  />
 
  </CardAction>


        :
        
item.transferto=="true" ? // check if slot was transferred

<CardAction
separator={true}
inColumn={false}>
<CardButton
onPress={() => searchGroup(item.groupid)}

title="View"
color="green"

/>


<CardButton
onPress={() => AcceptSlot(item.groupid, item.duedate)} 
title="Accept"
color="teal"

/>

<CardButton

onPress={() => DeclineSlot(item.groupid, item.duedate)}

title="Decline"
color="red"

/>

</CardAction>


:


<CardAction
  separator={true}
  inColumn={false}>
  <CardButton
onPress={() => searchGroup(item.groupid)}

    title="View"
    color="green"

  />

  
<CardButton
   
  onPress={() => transferslot(item.groupid, item.duedate, item.saverid)}

    title="Transfer"
    color="teal"

  />
   
   
  <CardButton

onPress={() => PayNote(item.groupadmbank, item.paynote)}

    title="Pay Note"
    color="brown"

  />
 
  <CardButton

onPress={() => exitAlert(item.groupid, item.duedate)}

    title="Exit"
    color="red"

  />
   
  
  
</CardAction>


             :   //notonus == false


             item.collected > 0  ?
 
              <CardAction
              separator={true}
              inColumn={false}>

              <CardButton
               onPress={() => searchGroup(item.groupid)}

                title="View"
                color="green"

              />
              
              <CardButton

            onPress={() => payUp(item.groupid, item.duedate)}

                title="Pay Up"
                color="brown"

              />

              </CardAction>

          
                    :
                    
      item.transferto=="true" ? // check if slot was transferred

      <CardAction
      separator={true}
      inColumn={false}>
      <CardButton
    onPress={() => searchGroup(item.groupid)}

        title="View"
        color="green"

      />

      
    <CardButton
        onPress={() => AcceptSlot(item.groupid, item.duedate)} 
        title="Accept"
        color="teal"

      />
      
      <CardButton

    onPress={() => DeclineSlot(item.groupid, item.duedate)}

        title="Decline"
        color="red"

      />
      
    </CardAction>
  

      :


           <CardAction
              separator={true}
              inColumn={false}>
              <CardButton
            onPress={() => searchGroup(item.groupid)}

                title="View"
                color="green"

              />

              
            <CardButton
               
              onPress={() => transferslot(item.groupid, item.duedate, item.saverid)}

                title="Transfer"
                color="teal"

              />
              
            <CardButton

            onPress={() => payUp(item.groupid, item.duedate)}

                title="Pay Up"
                color="brown"

              />
          

               
              
              
            </CardAction>
          

                }

 
                                   
                 
               </Card>
            
                       
         </View>
         
               
         
         
          
         )
    });


  

      return (

        
    
    <View >
   
   <ScrollView    showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>
   
   
   <Card>
      
      
<CardImage
  source={{ uri: 'https://truesaver.net/images/stackpic.jpg' }}
/>


<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="money" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Your Stack: " + this.state.totalstacks}</Text>
                   
                   
                  </View>}
               
                  />

<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="unlock-alt" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Available: " + this.state.availablestacks}</Text>
                   
                   
                  </View>}
               
                  />

                  
<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="lock" color="rgba(35, 166, 240, 1)" /> 
               
                    <Text style={{paddingLeft:10 }}>{"Used: " + this.state.usedstacks}</Text>
                   
                   
                  </View>}
               
                  />
       
       <CardAction 
         separator={true} 
         inColumn={false}>
   
         <CardButton
           onPress={()=> this.Stackinfo(this.state.stacksinfo)} 
           title="About"
           color="green"
         />
            
     <CardButton
           onPress={() => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank,name:name,email:email,phonenumber:phonenumber,navto:"JoinedGroups"})}
           title="Top Up"
           color="teal"
         />
         
       </CardAction>
   
   
     </Card>
    
   
   
{this.state.spinner &&
      <View >
                            <ActivityIndicator size="large" color="teal" />
      </View>
                        }  
      
 

{  this.state.totalgroups == 0  || this.state.dataempty == true ?

<View>

<View  style={styles.textnoint}>
<Text style= {styles.textstyle}>Your Joined groups will appear here</Text>
</View>


<View style= {styles.fixToText} >  
<Button title='View available plans' raised={true} onPress={() => this.props.navigation.navigate("Groups")}>
  </Button>
  </View>

</View>

:

renderCards


  }
  
              
             
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

<View style={styles.flexy}>
  <Text style={styles.rule}>If you just want to link your card, tap Link Card. Linking your card will ensure auto-debits and help you avoid saving late. Please link a card that is still valid by {cardvalid}</Text>
</View>

<View style={styles.flexy}>
  <Text style={styles.rule}>If you want to save or pay up your pending savings, tap Pay up. You can also link your card by paying up with it</Text>
</View>

  
<View style= {styles.fixToTextz} >  

  
  
<PayWithFlutterwave

onRedirect={(data) => this.handleOnRedirect_reg(data)} 
options={{
  tx_ref: tx_ref, //  generateRef(11),
  authorization: authorization,
  amount:  cardregfee,
  currency: 'NGN',
  payment_options: payment_options_cardreg,
  customer: {

      email: email,
      phone_number:phonenumber,
      name:name

  },

  meta: {

    txtype: txttype_reg,
    slottransfer:slottransfer,
    duedate:duedate,
    groupid:groupid,
    plan: plan,
    reference:tx_ref,
    interval:interval,
    frodate:frodate,
    todate:todate,
    subscription_code : subscription_code,
       

}
 
}}
customButton={(props) => (
  <TouchableOpacity
     
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={{ color: 'teal', fontWeight:'bold', fontSize: 12}}>LINK CARD TO THIS PLAN</Text>
    </TouchableOpacity>

    
)}

/>


</View>
   

<View  style={styles.tabBarInfoContainer} >  
  
<PayWithFlutterwave

onRedirect={(data) => this.handleOnRedirect(data)} 

options={{
  tx_ref: tx_ref,
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

    txtype: txttype,
    slottransfer: slottransfer,
    duedate:duedate,
    groupid: groupid,
    plan:  plan,
    defaultcount:  defaultcount,
    subscription_code:  subscription_code,
    todate:  todate,
    frodate:  frodate,
    reference:tx_ref,
     
       
}
  

}}
customButton={(props) => (
  <TouchableOpacity
     
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={{ color: 'white', fontWeight:'bold', fontSize: 12}}>PAY UP {formatted_payupfee} </Text>
    </TouchableOpacity>

    
)}

/>
 
</View>
   

</Overlay>
   

  
    </ScrollView>

 

    </View>
)}
 
}

export default JoinedGroups;


 
 
const styles = StyleSheet.create({

  
  
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
     

   flexy: {

    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
    paddingTop:10


},

   fixToTextz: {
      
    paddingTop:20,
    paddingBottom:80,
    alignItems:'center',
    backgroundColor: 'white',

  
    },
   
   fixToText: {
  
    paddingTop:20,
    paddingBottom:20,
    alignItems:'center',
  
    },

    input: {
        width: '100%',
        textAlign:'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#ecf0f1',
        justifyContent: 'center'
      },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 20,
      backgroundColor: '#ecf0f1',
      
    },
    paragraph: {
      margin: 24,
      fontSize: 10,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#34495e',
      justifyContent: 'center',
      
    },
    
    textstyle: {
    
      fontSize:15,
      fontWeight:'bold',
      paddingLeft: 30,
      paddingRight: 30,
      color: 'gray',
      textAlign: 'center',

   
   }, 

fixToText: {
    
  paddingTop:20,
    alignItems:'center',

  },
  
 textnoint:{
     
  flex: 2,
  alignItems: 'center',
  paddingTop:50,
  alignContent: 'center',


 
}, 

  });
  
  