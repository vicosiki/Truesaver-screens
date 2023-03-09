import React, { Component } from "react";
import { TextInput, ToastAndroid,
  Platform,
  AlertIOS, StyleSheet,Button, Text, View, Alert,RefreshControl, Clipboard, ActivityIndicator,Linking,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Input, SearchBar } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';
import NumberFormat from 'react-number-format';
import NetInfo from "@react-native-community/netinfo";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Clipboard from "@react-native-community/clipboard";





 
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

class Groups extends Component { 

  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      error: null,
      data: [],
      refreshing: false,
      groupid: null,
     spinner: true,
     search: '',
     alertme:false,

    };

    
  
    
  }


  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
  
  async componentDidMount() {

NetInfo.addEventListener(this.handleConnectivityChange);

    let phonenumber = await AsyncStorage.getItem('phonenumber')
    let care = await AsyncStorage.getItem('care')
    let send_mails = await AsyncStorage.getItem('send_mails'); 
  let email = await AsyncStorage.getItem('email')
  
  
    if (send_mails == "yes") {
  
      this.setState({ alertme: true,send_mails:send_mails});
  
    } else {
  
    this.setState({ alertme: false,send_mails:send_mails});
  
  
    }
  
  
  
    this.setState({phonenumber:phonenumber, care:care, email:email})  
      
   
  NetInfo.fetch().then(state => {
  
    if (!this.state.connection_Status) {
   
   this.notifyMessage("You're offline")
     
   this.setState({spinner:false, dataempty: true})
  
   
   } else {
   
    this.makeRemoteRequest();
  
  
   
     }
   
   });
   
    }
  
   
 notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}
 
searchGroup(groupid) {
 
  
    try {


   
      NetInfo.fetch().then(state => {

        
        if (!this.state.connection_Status) {
       
       this.notifyMessage("You're offline")
       
       } else {
       
        
        this.setState({spinner:true})
      
          const {phonenumber,topup_note} = this.state;
        
            if (groupid != null) {
          
        //POST json 
        var dataToSend = { groupid:groupid, phonenumber:phonenumber,caller:"mobile"}
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
          
          this.setState({spinner: false});
        
          if(responseJson.status == "00"){  
         
      
           this.props.navigation.navigate("MembersList", {topup_note:topup_note,default_collected:responseJson.default_collected,default_notcollected:responseJson.default_notcollected,groupinfo:responseJson.groupinfo,chargedate:responseJson.chargedate,sharetext:responseJson.Sharetext,linkchat:responseJson.walink,Interval:responseJson.interval,CollectableAmount:responseJson.CollectableAmtFormatted,PayableAmount:responseJson.PayableAmtFormatted,adminfee:responseJson.adminfee,groupid:this.state.groupid, members:responseJson.savers, freeslots:responseJson.freeslotcount,  slots: responseJson.slotmonth, commitfee:responseJson.commitfee, cardvalid:responseJson.cardvalid})
      
        
          }else{   
        
      
            this.notifyMessage(responseJson.status)
         
        
          }
          
        
        })
        
        .catch((error) => {
        
         //alert(error);
         this.notifyMessage("Oops. Something's not right")
          this.setState({spinner: false});
        
        });
              
           
        
        } else {
        
          this.setState({spinner:false})
           
          this.notifyMessage('Please enter Group ID');
        
        }
       
         }
       
       });
      

    } catch (error) {
       
      //this.notifyMessage("Oops, something's not right");
      
      }
     
}
  

alertmeStatus() {
 
  
  try {

 
    NetInfo.fetch().then(state => {

      if (!this.state.connection_Status) {

     
     this.notifyMessage("You're offline")
     
     } else {
     
      
      this.setState({spinner:true})



    
        const {phonenumber,send_mails} = this.state;
      
        
      //POST json 
      var dataToSend = {  phonenumber:phonenumber }
      //making data to send on server
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      
      const url = 'https://truesaver.net/api/v1/searchgroup.ashx?alertme=' + send_mails;
      
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
       
    if(this.state.alertme){

        this.setState({alertme: false});
         
        await AsyncStorage.setItem('send_mails', "no");


    }else{

      this.setState({alertme: true});

      await AsyncStorage.setItem('send_mails', "yes");

    }
      
        }else{   
      
    
          this.notifyMessage(responseJson.status)
       
      
        }
        
      
      })
      
      .catch((error) => {
      
       //alert(error);
       this.notifyMessage("Oops. Something's not right")
        this.setState({spinner: false});
      
      });
        
     
       }
     
     });
    

  } catch (error) {
     
    //this.notifyMessage("Oops, something's not right");
    
    }
   
}



  
   _onRefresh = () => {
 
    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {

    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.makeRemoteRequest();});
    
    }
        
     
    });
    
     }
     
      

  
  setNoti =  () => {

    if (!this.state.alertme) {

  
      Alert.alert(
        "New Group Alert",
        `New Group Alert is turned-off. We won't notify you when there's a new group` ,
    
        [
          ,
          { text: "Turn-on", onPress: () => this.setState({send_mails: "yes" }, this.alertmeStatus())}
 
         
        ],

        { cancelable: true }
   
        );
   


    } else {


      Alert.alert(
        "New Group Alert",
        `New Group Alert is turned-on. We will notify you when there's a new group` ,
    
        [
          ,
          { text: "Turn-off", onPress: () => this.setState({send_mails: "no" }, this.alertmeStatus())}
         
        ],

        { cancelable: true }
   
        );
   

    }

  }
   
  chatLink = async () => {
    try {
       
      
      Clipboard.setString(this.state.care)

      this.notifyMessage("Chat link copied")

     // WebBrowser.openBrowserAsync(`${this.state.care}`)

      Linking.openURL(`${this.state.care}`)

    } catch (error) {
       this.notifyMessage("Oops, something's not right");
    }
  };





   

  makeRemoteRequest = () => {


    try {

let {email} = this.state;

     
    const url = 'https://truesaver.net/api/v1/groups.ashx';

     //POST request 
        fetch(url, {
      method: "POST",//Request Type 
      
    })
    
    .then((response) => response.json())
    //If response is in json then in success
    .then(async(responseJson) => {

     
        this.setState({ loading: true, 
             
                data: responseJson.savergroup,topup_note:responseJson.topup_note + email,
                refreshing: false,
                spinner:false
        
        });
         
      
        if (JSON.stringify(this.state.data) != '{}') {  
          this.setState({ dataempty: false});
        } 

    
    })
    
    //If response is not in json then in error
    .catch((error) => {

 this.setState({spinner:false, dataempty: true})

    });
  }
  
  catch (error) {

 this.setState({spinner:false, dataempty: true})
 
}

}
  
  render() {
 
let {phonenumber, groupid, topup_note} = this.state;



const Groupinfo= (info,groupid) => { 


  Alert.alert(
                   
   groupid,
    info,
          
    [
      { text: "Close"}
     
      ,
      { text: "View Group", onPress: () => searchGroup(groupid)}
     
    ],

    { cancelable: true }

  );

}

const searchGroup = (groupid) => {
     
NetInfo.fetch().then(state => {

  if (!this.state.connection_Status) {

 
 this.notifyMessage("You're offline")
 
 } else {
 
  
  this.setState({spinner:true})
  
  
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
   
  this.setState({spinner: false})

  if(responseJson.status == "00"){  
  
   this.props.navigation.navigate("MembersList", {topup_note:topup_note,default_collected:responseJson.default_collected,default_notcollected:responseJson.default_notcollected,groupinfo:responseJson.groupinfo,chargedate:responseJson.chargedate,sharetext:responseJson.Sharetext,linkchat:responseJson.walink,Interval:responseJson.interval,CollectableAmount:responseJson.CollectableAmtFormatted, PayableAmount:responseJson.PayableAmtFormatted,adminfee:responseJson.adminfee, groupid:groupid, members:responseJson.savers,freeslots:responseJson.freeslotcount, slots: responseJson.slotmonth, commitfee:responseJson.commitfee, cardvalid:responseJson.cardvalid})


  }else{   

   
   this.notifyMessage(responseJson.status)
 
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

   



    let renderCards = this.state.data.map(function (item) {

      


      return (
              

<View key={item.groupid}>


<Card style={styles.paragraph}>
 
 
<CardTitle title={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FontAwesome name="group" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{ item.groupid}</Text>
    
    
   </View>}

   />
   
<CardContent text={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FontAwesome name="money" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{ item.monthlysavings + " " + item.interval + " savings to collect " + item.collectable}</Text>
    
    
   </View>}

   />
   
   
 <CardContent text={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FontAwesome name="calendar-check-o" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{"KickOff Date: " + item.chargedate }</Text>
    
    
   </View>}
   
   />


<CardContent text={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FontAwesome name="calendar" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{"Tenure: " + item.tenure }</Text>
    
    
   </View>}

   />
 
    
 <CardContent text={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FontAwesome name="object-ungroup" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{"Slots left: " + item.slotleft }</Text>
    
    
   </View>}
   
   />

<CardAction
  separator={true}
  inColumn={false}>
  <CardButton
   onPress={() => searchGroup(item.groupid)}
    title="View Group"
    color="green"

  />

<CardButton
   onPress={() =>  Groupinfo(item.groupinfo,item.groupid)}
    title="Group Info"
    color="teal"

  />
</CardAction>

</Card>

  
           
                         
                       </View>
           
           )


      });

      
      

  return (
    
    <View >
   
   <ScrollView   showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>

 
    <Card>
   
    
<Input style={styles.input} onSubmitEditing={(groupid => this.setState({groupid}),() => this.searchGroup(groupid))} 
        placeholder='Enter Group ID' onChangeText={groupid => this.setState({groupid})}
        value={this.state.groupid}  leftIcon={
    <FontAwesome name='group'  size={16}  color='rgba(35, 166, 240, 1)' />
  }
  
/>

    <CardContent text="Enter a search or choose from the listed plans below" />
    <CardAction 
      separator={true} 
      inColumn={false}>

      <CardButton
        onPress={()=> this.searchGroup(this.state.groupid)} 
        title="Search"
        color="green"
      />
 
    </CardAction>


  </Card>
 
 
{this.state.spinner &&
      <View >
                            <ActivityIndicator size="large" color="teal" />
      </View>
                        }  

       {renderCards}  


            
{ this.state.dataempty &&

<View>

<View  style={styles.textnoint}>
<Text style= {styles.textstyle}>Something went wrong. Check your connection and try again</Text>
</View>


<View style= {styles.fixToText} >  
<Button title='Try again' raised={true} onPress={() => this._onRefresh()}>
  </Button>
  </View>

</View>

  }
  
     

    </ScrollView>

 {this.state.dataempty === false &&
 
<View>


<TouchableOpacity 
          style={styles.floatingButton}
          onPress={this.setNoti}
        >

          {this.state.alertme == true ?

          <FontAwesome name="bell" size={15}  color="brown" />

          :

          <FontAwesome name="bell" size={15}  color="gray" />

          }

        </TouchableOpacity>

 
<TouchableOpacity 
          style={styles.floatingButton2}
          onPress={this.chatLink}
        >
          <FontAwesome name="comment" size={20} color="white" />
        </TouchableOpacity>

</View>

        } 

    </View>
)}
 
}

export default Groups;


 
 
const styles = StyleSheet.create({
    input: {
        width: '100%',
        textAlign:'left',
        paddingLeft: 10,
        
        fontSize: 14,
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
  paddingTop:20
 
}, 


floatingButton: {
  borderWidth: 1,
  borderColor: 'green',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 120,
  right: 30,
  width: 40,
  height: 40,
  backgroundColor: 'white',
  borderRadius: 100,
},

floatingButton2: {
  borderWidth: 1,
  borderColor: 'green',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 50,
  right: 25,
  width: 50,
  height: 50,
  backgroundColor: 'green',
  borderRadius: 100,
},


  });
  