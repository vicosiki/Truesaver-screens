import React, { Component }  from 'react';
import {View, ToastAndroid,
  Platform,
  AlertIOS,ActivityIndicator, Image, 
  StyleSheet,ScrollView,TouchableOpacity,Alert,RefreshControl,Share,Switch,Text} from 'react-native';
  
import { Button , Input} from 'react-native-elements';
import NetInfo from "@react-native-community/netinfo";
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";

  
export default class Newgroup extends Component  {
 
  constructor(props) {
    super(props);

    this.state = {
      groupname: '', 
      walink:'',
      payamtID:'',
      slots: '', 
      spinner: true,
      toggle: true,
      slotswitch: true,


      
         
         
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
  
    this.notifyMessage(error);
  
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
     "New Savings Group",
     "Wow! You created a new " + this.state.interval + " savings group. Here's what you should do next:"  , 
  
     [
      { text: "Share & Invite", onPress: () => this.onShare()},

      { text: "View Group", onPress: () => this.searchGroup(groupname) },
 
  ],

          { cancelable: true }
   );
}

  

createGp=()=>{


  
  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
    

  this.notifyMessage("You're offline")
  
  
  } else{
  
  
    const {phonenumber,groupname,slots,payamtID,frodate, interval,apikey,toggle,walink,symbol} = this.state;

   
    if (groupname != '') {

      
  
      if (slots != '') {


        if (payamtID != '') {
   
     
        this.setState({spinner: true});
  
        const url = 'https://truesaver.net/api/v1/creategp.ashx';
    
         
        //POST json 
         
          var dataToSend = {phonenumber:phonenumber, payable: payamtID, frodate: frodate, groupid: groupname, maxsavers: slots, interval:interval, NotonUs:toggle, wagrouplink:walink, groupcurrency:symbol}
     
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

      this.groupNew(groupname);


     /*
      if(this.state.toggle == true){  //group creation will be paid for



        Alert.alert(
          "New Group",
          "You will be charged a one-off fee of " + this.state.adm_charge + " for each slots" ,
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
 
  
 
groupDet (interval, phonenumber) {
     
    
  
  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {

   this.notifyMessage("You're offline")
   
   } else {
   
        
      //POST json 
      var dataToSend = { interval,phonenumber}
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
     
      this.setState({currency : responseJson.groupcurrency[0].currency,symbol: responseJson.groupcurrency[0].symbol})
    }


    for(var i=0;i<count;i++){

      drop_down_data.push({ value: responseJson.savergroup[i].payamt , key: responseJson.savergroup[i].payamtID }); // Create your array of data
     
      this.setState({payamt : responseJson.savergroup[0].payamt,payamtID: responseJson.savergroup[0].payamtID})
    }


    for(var i=0;i<countdates;i++){

      drop_down_dates.push({ value: responseJson.kickoffdates[i].startdate , key: responseJson.kickoffdates[i].startdateValue }); // Create your array of data
     
      this.setState({startdate : responseJson.kickoffdates[0].startdate, frodate : responseJson.kickoffdates[0].startdateValue})

    }


    this.setState({ drop_down_data,drop_down_cur,drop_down_dates,adm_charge:responseJson.adm_charge, refreshing: false }); // Set the new state
   
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
    
    
      this.setState({refreshing: true,},() => {this.groupDet(this.state.interval,this.state.phonenumber);});
    
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
       this.groupDet(this.state.interval,this.state.phonenumber)
 
    }
            
    

     }

      

  async  componentDidMount() {

    NetInfo.addEventListener(this.handleConnectivityChange);
 
    let apikey = await AsyncStorage.getItem('apikey');

    let interval=this.props.route.params.interval
    
    let phonenumber = await AsyncStorage.getItem('phonenumber')
 
      
    this.setState({ phonenumber:phonenumber,interval:interval,  apikey,apikey: apikey, spinner:false})
  
    
    this.groupDet(interval,phonenumber)

  }
   
 
  render() {
     
    let { payamt, startdate, walink, currency} = this.state;
   
    
    return (
    
<ScrollView   style={{backgroundColor:'white'}}  showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>

<View style= {styles.favview}>
   

<Text style= {styles.textstyle} >New Savings Group</Text>

  </View> 

  <View>
 
<View>

                   
<View style={styles.flexy}>

       <Switch
        trackColor={{ false: 'gray', true: 'teal' }}
        thumbColor={this.state.toggle ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        value={this.state.toggle}
        onValueChange={(toggle)=>this.setState({toggle})}
        onChange={ ()=>this.SavetypePrompt()}



      />   

  <Text>I'll keep my group members' savings</Text>


            </View>



<Input
label="Group Name"
inputStyle={{fontSize:15}}
placeholder="ID"
labelStyle={{color:'teal'}}
   onChangeText={groupname => this.setState({ groupname})}
   maxLength={10}
  />
  
<Input
label="Group Chat Link"
inputStyle={{fontSize:15}}
labelStyle={{color:'teal'}}
   placeholder="e.g WhatsApp group link"
   onChangeText={walink => this.setState({ walink})}
  
  />      
 
 
<Input
label="Number of Slots"
inputStyle={{fontSize:15}}
labelStyle={{color:'teal'}}
   placeholder="Slots #"
   onChangeText={slots => this.setState({ slots})}
   keyboardType={'numeric'} 
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
inputStyle={{fontSize:15}}
labelStyle={{color:'teal'}}
   placeholder="Amount"
   onChangeText={payamtID => this.setState({ payamtID})}
   keyboardType={'numeric'} 
  />   
        
            
<View style= {styles.dropdown}><Dropdown 
label="Choose Currency" labelFontSize='15'
 itemCount='10' baseColor ='teal'
 data={this.state.drop_down_cur} 
 value={currency}
 onChangeText={value => this.curHandler(value)}
  
 /></View>

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

            <Button title="Create Group" onPress={() => this.createGp()}> </Button>

             
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
 
  flexy: {

    flex: 1,

    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom:10,
 
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
  flex:2,
  alignSelf:'center',
  alignItems:'center',
  paddingTop:50


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
