import React, { Component } from 'react';
 import {View, ToastAndroid,
  Platform,
  AlertIOS,ActivityIndicator, Image, 
  StyleSheet,ScrollView,TouchableOpacity,Alert,RefreshControl,Share,Switch,Text} from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button , Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
  
export default class Editgroup extends Component  {
 
  constructor(props) {
    super(props);

    this.state = {
      groupname: '', 
        slots: '', 
        payamt:undefined,
        startdate: undefined,
        spinner: true,
      toggle: this.props.route.params.notonus,
      slotswitch: false,
         walink:'',
         
    };
 
  }
 


  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
  


dateHandler = (startdate) => {
   
  const frodate = (this.state.drop_down_dates.find(drop_down_dates => drop_down_dates.value === startdate)).key;

  this.setState({startdate: startdate, frodate: frodate})
 
}

amtHandler = (payamt) => {
   
  const payamtID = (this.state.drop_down_data.find(drop_down_data => drop_down_data.value === payamt)).key;

  this.setState({payamt: payamt, payamtID: payamtID})

}


curHandler = (currency) => {
   
  const symbol = (this.state.drop_down_cur.find(drop_down_cur => drop_down_cur.value === currency)).key;

  this.setState({currency: currency, symbol: symbol})
 

}


notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}


 searchGroup = (groupname) => {
     
  NetInfo.fetch().then(state => {
  
    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
   
    const {phonenumber,groupname } = this.state;

    
    this.setState({spinner:true})
    
    
    if (groupname != null) {
   
    
  //POST json 
  var dataToSend = { groupid:groupname, phonenumber:phonenumber,caller:"mobile"}
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
    
     this.props.navigation.navigate("MembersList", {default_collected:responseJson.default_collected,default_notcollected:responseJson.default_notcollected,groupinfo:responseJson.groupinfo,chargedate:responseJson.chargedate,sharetext:responseJson.Sharetext,linkchat:responseJson.walink,Interval:responseJson.interval,CollectableAmount:responseJson.CollectableAmtFormatted, PayableAmount:responseJson.PayableAmtFormatted,adminfee:responseJson.adminfee, groupid:groupname, members:responseJson.savers,freeslots:responseJson.freeslotcount, slots: responseJson.slotmonth, commitfee:responseJson.commitfee, cardvalid:responseJson.cardvalid})
  
  
    }else{   
  
     
     this.notifyMessage(responseJson.status)
   
    }
    
  
  })
  
  .catch((error) => {
  
    this.setState({spinner: false})
  
    this.notifyMessage("Oops, something's not right" )

  
  });
        
     
  
  } else {
  
     
  this.notifyMessage('Group ID not provided');
  
  }
    
     }
   
   });
   
   }

   
   onShare = async () => {
    try {
      const result = await Share.share({
        message:
          `${this.state.sharetext}`
         
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


 groupNew (groupname) {
  Alert.alert(
     "Savings Group Updated",
     "If you made changes to the savings group remember to inform group members especially if some need to adjust their slots"  , 
  
     [
      { text: "Share & Invite", onPress: () => this.onShare()},

      { text: "View Group", onPress: () => this.searchGroup(groupname) },
 
  ],

          { cancelable: true }
   );
}

  

editGp=()=>{


  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
    const {phonenumber,groupname,slots,payamtID,frodate, interval,apikey, walink, toggle, symbol} = this.state;

   
    if (groupname != '') {

      
  
      if (slots != '') {


      if (payamtID != '') {

     
        this.setState({spinner: true});
  
        const url = 'https://truesaver.net/api/v1/editgp.ashx';
    
         
        //POST json 
         
          var dataToSend = {phonenumber:phonenumber, payable: payamtID, frodate: frodate, groupid: groupname, maxsavers: slots, interval:interval, wagrouplink:walink, NotonUs:toggle, groupcurrency:symbol}
     
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
    
    
    .then((response) =>  response.json())
    .then(async(responseJson) => { 
    
     if(responseJson.statuscode == "00"){
     
        this.setState({spinner: false, sharetext:responseJson.sharetext});

        this.groupNew(groupname)

        /*
       
      if(responseJson.payedit == true){  //group edit will be paid for


        Alert.alert(
          "Edit Group ( " + responseJson.newslots + " )" ,
          "You will be charged a one-off fee of " + responseJson.adm_charge + " for each new slot" ,
          [
                       { text: "Cancel"},
                       { text: "Continue",  onPress: () => Linking.openURL(responseJson.payauth_url)}
      
          ],
      
          { cancelable: false }
        );


      } else {

        this.groupNew(groupname)

      }

*/
          
             
    
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
  
    this.notifyMessage('Please enter a savings amount');
   
   }
  
  
  } else {
  
   this.notifyMessage('Please enter number of slots');
  
  }
  
  } else {
  
  this.notifyMessage('Please enter group name');
  }
  
  
  }
      
   
  });
  
  
   }
 
  
   SavetypePrompt = () => {
 

    if (!this.state.toggle == true) {
    
       alert(`You'll keep the money saved by this group, and credit group members turn-by-turn`)
             
       this.setState({slotswitch: true, payamtID:''} )

    } else{
    
       alert(`TrueSaver will debit & credit group members automatically`)

       this.setState({slotswitch: false} ) 

       //call the group det  api to set slot and amount states accordingly
       this.groupDet(this.state.interval)
 
    }
            
    

     }

 
groupDet (interval) {
     
    
  NetInfo.fetch().then(state => {
  
    if (!this.state.connection_Status) {

   
   this.notifyMessage("You're offline")
   
   } else {
   
        
      //POST json 
      var dataToSend = { interval}
      //making data to send on server
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      
      const url = 'https://truesaver.net/api/v1/creategroupdet.ashx';
      
      
      fetch(url, {
        method: "POST",//Request Type 
         body: formBody,//post body 
         headers: {//Header Defination 
           'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
           },
        
       })
      
       .then((response) => response.json())
      .then(async(responseJson) => {
    var count = Object.keys(responseJson.savergroup).length;
    var countdates = Object.keys(responseJson.kickoffdates).length;
    var countcur = Object.keys(responseJson.groupcurrency).length;

    
    let drop_down_data = [];
    let drop_down_dates = [];
    let drop_down_cur = [];

    for(var i=0;i<countcur;i++){

      drop_down_cur.push({ value: responseJson.groupcurrency[i].currency , key: responseJson.groupcurrency[i].symbol }); // Create your array of data
     
       if (this.state.symbol == responseJson.groupcurrency[i].symbol) {

        this.setState({currency: responseJson.groupcurrency[i].currency })
   
        }
    }

    
//set a default entry incase symbol is not listed    
if (this.state.symbol == undefined) {

  this.setState({currency: responseJson.groupcurrency[0].currency })

  }


    for(var i=0;i<count;i++){

      drop_down_data.push({ value: responseJson.savergroup[i].payamt , key: responseJson.savergroup[i].payamtID }); // Create your array of data
    
 
    if (this.state.payamtID == responseJson.savergroup[i].payamtID) {

     this.setState({payamt: responseJson.savergroup[i].payamt })

     }
 
    }
 
//set a default entry incase pay amount is not listed    
    if (this.state.payamtID == undefined) {

      this.setState({payamt: responseJson.savergroup[0].payamt })
 
      }
  
     
    for(var i=0;i<countdates;i++){

      drop_down_dates.push({ value: responseJson.kickoffdates[i].startdate , key: responseJson.kickoffdates[i].startdateValue }); // Create your array of data
     

      if (this.state.frodate == responseJson.kickoffdates[i].startdateValue) {

        this.setState({startdate: responseJson.kickoffdates[i].startdate })
   
        }
    
       }
   
   //set a default entry incase date is not listed    
   if (this.state.startdate == undefined) {
   
    this.setState({startdate: responseJson.kickoffdates[1].startdate })

    }


    this.setState({drop_down_cur, drop_down_data,drop_down_dates, refreshing: false }); // Set the new state
   
  })
      
      .catch((error) => {
      
        this.setState({spinner: false})
      
        this.notifyMessage(error);
      
      });
            
         
    
      
   }
  
  });
  
   }

   
  
   _onRefresh = () => {
 
    NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
          
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.groupDet(this.state.interval);});
    
    }
        
     
    });
    
     }
     
      

  async  componentDidMount() {

NetInfo.addEventListener(this.handleConnectivityChange);


    let apikey = await AsyncStorage.getItem('apikey');

    let interval=this.props.route.params.interval
    let groupname=this.props.route.params.groupname
    let slots=this.props.route.params.slots
    let payamtID=this.props.route.params.payamtID
    let frodate=this.props.route.params.frodate
    let walink=this.props.route.params.walink 
    let symbol=this.props.route.params.symbol
    
 
    let phonenumber = await AsyncStorage.getItem('phonenumber')
 
      
    this.setState({symbol:symbol,frodate:frodate, walink:walink, payamtID:payamtID ,slots:slots, groupname:groupname,phonenumber:phonenumber,interval:interval, apikey: apikey, spinner:false})
 
    
    this.groupDet(interval)

    
    if (this.state.toggle){

      this.setState({slotswitch:true})

    } else {

      this.setState({slotswitch:false})
    }

  }
   
 
  render() {
     
    let { payamt, startdate, walink,groupname,slots,toggle,payamtID, currency} = this.state;
  
       
    
    return (
    
<ScrollView   style={{backgroundColor:'white'}}  showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>

<View style= {styles.favview}>
   

<Text style= {styles.textstyle} >Edit Savings Group</Text>

  </View> 

  <View>
 
<View>


                   
<View style={styles.flexy}>

       <Switch
       trackColor={{ false: 'gray', true: 'teal' }}
       thumbColor={this.state.toggle ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        value={toggle}
        onValueChange={(toggle)=>this.setState({toggle})}
        onChange={ ()=>this.SavetypePrompt()}



      />   

  <Text>I'll keep my group members' savings</Text>


            </View>

            <Input
label="Group Name"
placeholder="ID"
inputStyle={{fontSize:15, color:'gray'}}
labelStyle={{color:'teal'}}
value={groupname}  
editable={false} 
 maxLength={10}
  />
  
<Input
label="Group Chat Link"
labelStyle={{color:'teal'}}
inputStyle={{fontSize:15}}
   placeholder="e.g WhatsApp group link"
   onChangeText={walink => this.setState({ walink})}
   value={walink} 
  />      
 
 
<Input
label="Number of Slots"
inputStyle={{fontSize:15}}
labelStyle={{color:'teal'}}
   placeholder="Slots #"
   onChangeText={slots => this.setState({ slots})}
   keyboardType={'numeric'} 
   value={slots} 
  />   
            
   

{ this.state.slotswitch == false  ?

<View style= {styles.dropdown}><Dropdown 
label="Savings Amount" labelFontSize='15'
 itemCount='10' baseColor ='teal'
 data={this.state.drop_down_data} 
 value={payamt}
 onChangeText={value => this.amtHandler(value)}
  
 /></View>

 :
 
 <View>

<Input
label="Savings Amount"
labelStyle={{color:'teal'}}
   placeholder="Amount"
   onChangeText={payamtID => this.setState({ payamtID})}
   keyboardType={'numeric'} 
 value={payamtID}

  />   
            
    
 </View>

 }

 
 
<View style= {styles.dropdown}><Dropdown 
label="Kickoff Date" labelFontSize='15'
 itemCount='5' baseColor ='teal'
 data={this.state.drop_down_dates} 
 value={startdate}

 onChangeText={value => this.dateHandler(value)}
 
  
 />
 
 </View>

    
{this.state.spinner &&
                        <ActivityIndicator size="large" color="teal" />
                    }

            {!this.state.spinner &&
            <View style= {styles.fixToText}> 

            <Button title="Save Changes" onPress={() => this.editGp()}>
            
          </Button>

         </View>

  } 


<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'CreatedGroups' }],
    })}>

<View style= {styles.butview}>
  
<Text style= {styles.basetextstyle}> Back to Created Groups </Text>
</View>
 
 </TouchableOpacity>
 
</View>
 
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

dropdown: {
  paddingLeft:15,
  paddingRight:2,
},
  favview: {
    flex:1,
    alignItems:'center',
   
    backgroundColor: 'white',
  },

  contview: {
    flex:2,
    alignItems: 'center',
    paddingTop:30
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

  flexy: {

    flex: 1,

    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom:30,

 
},

basetextstyle: {
    
  fontSize:15,
  fontWeight:'bold',
  color: '#008080',
  paddingBottom: 30

  

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
