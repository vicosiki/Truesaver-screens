import React, { Component } from "react";
import { Overlay, Button } from 'react-native-elements';
import {  ToastAndroid, Platform, AlertIOS, Linking,ActivityIndicator, StyleSheet, Text, View, Alert,TouchableOpacity, RefreshControl,Share} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';
import SegmentedPicker from 'react-native-segmented-picker';
import NetInfo from "@react-native-community/netinfo";
import * as WebBrowser from 'expo-web-browser';
import {PayWithFlutterwave} from 'flutterwave-react-native';
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
    
 
  export default class Slots extends Component {
 
    
  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      data:[],
      error: null,
      refreshing: false,
      interest: null,
      name:null,
      phonenumber: '',
      dataempty: true,
      apikey:'',
      spinner:false,
      isVisiblex:false,
      isVisibleNotonus:false,
      duedate:'',
      commitmentfee:0,
    
    };

    this.segmentedPicker = React.createRef();
    
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

    let groupdata=this.props.route.params.members
    let groupid=this.props.route.params.groupid
    let slots=this.props.route.params.slots
    let commitfee=this.props.route.params.commitfee
    let cardvalid=this.props.route.params.cardvalid
    let adminfee=this.props.route.params.adminfee
    let notonus=this.props.route.params.notonus
    let Interval=this.props.route.params.Interval
    let CollectableAmount=this.props.route.params.CollectableAmount
    let PayableAmount=this.props.route.params.PayableAmount
    let default_collected=this.props.route.params.default_collected
    let default_notcollected=this.props.route.params.default_notcollected
    let topup_note=this.props.route.params.topup_note
    let tsbank=this.props.route.params.tsbank



 

    let phonenumber = await AsyncStorage.getItem('phonenumber')
    let name = await AsyncStorage.getItem('name')
    let email = await AsyncStorage.getItem('email')
    let authorization = await AsyncStorage.getItem('flwauthorization')
    let apikey = await AsyncStorage.getItem('apikey')
    let stacksinfo = await AsyncStorage.getItem('stacksinfo')


     
  this.setState({authorization:authorization, stacksinfo:stacksinfo,topup_note:topup_note,tsbank:tsbank,default_collected:default_collected,default_notcollected:default_notcollected,PayableAmount:PayableAmount,CollectableAmount:CollectableAmount,email:email,name:name,Interval:Interval,notonus:notonus,cardvalid:cardvalid, adminfee:adminfee, apikey:apikey,commitfee:commitfee, data:groupdata,groupid:groupid, slots:slots,phonenumber:phonenumber, refreshing:false})
 
  
  var count = Object.keys(slots).length;
  let drop_down_data = [];
  for(var i=0;i<count;i++){
    drop_down_data.push({ label: slots[i].settlementdate + " " + slots[i].slotprofit, value: slots[i].month}); // Create your array of data
  }
  
  this.setState({ drop_down_data }); // Set the new state

  this.showPicker()

  }


  showPicker = () => {


   this.setState({isVisiblex:false,isVisibleNotonus:false})
    this.segmentedPicker.current.show();
 
  }

  
  hideOverlay = () => {

    this.setState({isVisiblex:false,isVisibleNotonus:false})

  
   }

   
 Stackinfo= (info) => { 

  const {phonenumber,email, name,topup_note, tsbank}= this.state

  Alert.alert(
                   
   "About Stacks",
    info,
          
    [
      { text: "Close"}
     
      ,
  { text: "Top up", onPress: () => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank,name:name,email:email,phonenumber:phonenumber,navto:"Slots"})}
  
    ],

    { cancelable: true }

  );

}



  showOverlay = () => {

    if (this.state.notonus == true) {

    this.setState({isVisiblex:false, isVisibleNotonus:true})
 
   } else {
 
     this.setState({isVisiblex:true, isVisibleNotonus:false})
 
   }
      
 
  
   }

    
 notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}

 onConfirm  =(selection) => {

  if (selection.col_1 != '' ) {

    this.setState({duedate: selection.col_1})

    if (this.state.notonus == true) {

  
      this.showOverlay()
  
      } else {
  
        this.joingroup(selection.col_1)
  
      }
  
  
     
  } else {

    this.notifyMessage('Please select a date from the list');

  }
  
    }
 
  handleOnRedirect = (data) => {

      if (data.status == "successful") {
     
       
        fetch(`${this.state.redirect_url}` + `&status=` + data.status + `&transaction_id=` + data.transaction_id + `&tx_ref=` + data.tx_ref, {
        method: "GET",//Request Type 
        
            })
    
      .catch((error) => {
    
      });

       
      this.searchGroup() 
  
            
      }
 
       
    }
    
    
     
exitGroup = (groupid, duedate,phonenumber) => {
   
  
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
    

  {this.props.navigation.goBack("MembersList")}
   this.setState({spinner: false})
 

})

.catch((error) => {

  this.setState({spinner: false})

   
});
      
 
  
   }
  });
  
 }

  
 joingroup = (duedate) => {
 

  NetInfo.fetch().then(state => {

    if (!this.state.connection_Status) {

  this.notifyMessage("You're offline")
  
  
  } else{


    this.setState({ spinner: true});

    let{phonenumber, groupid, apikey,name,email,topup_note,tsbank}=this.state
    
        const url = 'https://truesaver.net/api/v1/joingrouptempApp.ashx';
    
         //POST json 
         var dataToSend = { phonenumber:phonenumber, groupid:groupid, duedate:duedate  };
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
            , apikey:apikey  
            
          },
        })
        
        
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {

    this.setState({ spinner: false});

            
      if (responseJson.statuscode == "00" ) {  
          
           
        if (this.state.notonus == true) {

         this.setState({sharetext:responseJson.sharetext});

         this.searchGroup()

              } else{

                
            this.setState({commitmentfee:responseJson.commitmentfee,payment_options:responseJson.payment_options, redirect_url:responseJson.redirect_url,subscription_code:responseJson.subscription_code,Interval:responseJson.interval,todate:responseJson.todate, plan:responseJson.plan, frodate:responseJson.frodate})
                  
            this.showOverlay()

              }


        } else if (responseJson.statuscode == "02") {


          Alert.alert(
            "Top up Your Stacks",
            `${responseJson.status}`,
        
       
            [
       { text: "About", onPress: () => this.Stackinfo(this.state.stacksinfo) }  ,
       
          { text: "Ok" }  ,
          { text: "Top up", onPress: () => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank,name:name,email:email,phonenumber:phonenumber,navto:"Slots"})}
       
                
       
       
            ],
            
            
            { cancelable: false }
       
            );
       
       

         } else {
    
    
             this.notifyMessage(responseJson.status)
    
            }
    
            
     
            
        })
    
        //If response is not in json then in error
        .catch((error) => {
      
           this.setState({ spinner: false});

          this.notifyMessage("Error picking slot. Please retry")

          this.showPicker()

          return false;
    
        });
    
  
  }
    
 
});
 
  
}
    


searchGroup = () => {
     
      NetInfo.fetch().then(state => {
      
        if (!this.state.connection_Status) {

       
       this.notifyMessage("You're offline")
       
       } else {
       
        const {phonenumber,groupid,notonus } = this.state;
    
        
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
         
        this.setState({spinner: false})
      
        if(responseJson.status == "00"){  
        
          
          if (notonus == true) {

            this.setState({joinnotonus:true})
  
          } else {
  
          this.setState({joinnotonus:false})
  
          }
 
         this.props.navigation.replace("MembersList", {default_collected:responseJson.default_collected,default_notcollected:responseJson.default_notcollected,groupinfo:responseJson.groupinfo,chargedate:responseJson.chargedate,joinnotonus:this.state.joinnotonus,showReview:responseJson.showReview, sharetext:responseJson.Sharetext,linkchat:responseJson.walink,Interval:responseJson.interval,CollectableAmount:responseJson.CollectableAmtFormatted,PayableAmount:responseJson.PayableAmtFormatted,adminfee:responseJson.adminfee,groupid:groupid, members:responseJson.savers, freeslots:responseJson.freeslotcount,  slots: responseJson.slotmonth, commitfee:responseJson.commitfee, cardvalid:responseJson.cardvalid})
 
        
      
        }else{   
      
         
         this.notifyMessage(responseJson.status)
       
        }
        
      
      })
      
      .catch((error) => {
      
        this.setState({spinner: false})
      
        this.notifyMessage(error);
      
      });
            
                
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
    
    
      
  render() {
    
    let { authorization,default_notcollected,default_collected,PayableAmount,CollectableAmount,commitmentfee,payment_options,commitfee, cardvalid,adminfee, duedate, groupid, name, phonenumber, email,subscription_code,Interval,todate,frodate,plan}= this.state;

  return (
    
 

  <View  style={styles.container}>

        
<Overlay 

 isVisible={this.state.isVisiblex}
  windowBackgroundColor="rgba(255, 255, 255, .5)"
  overlayBackgroundColor="red"
   >
  
   
  {this.state.spinner &&
      <View >
          <ActivityIndicator size="large" color="teal" />
      </View>
                        }  

    <View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>When will your card expire? Please use a card that is still valid by {cardvalid} or choose other payment options like Bank transfer </Text>
    </View>

    <View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>Your card will be charged automatically for your savings until the end of the savings tenure</Text>
</View>


<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>If you have collected, late savings will be charged daily & incrementally at {default_collected} of the savings amount and may attract legal actions</Text>
</View>

<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>In addition to your periodic savings, an administrative fee of {adminfee} is payable every time you save. This means you will be saving {PayableAmount} + {adminfee} {Interval} </Text>
</View>

<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>Once the group is full, exit will not be allowed. Please be sure before you join</Text>
</View>


{this.state.Interval == 'daily' ?
<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>To ensure commitment, you will be charged your first round of savings of {commitfee} when you pick a slot</Text>
</View>
 :
 <View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>To ensure commitment, you will be charged a one-time commitment fee of {commitfee} when you pick a slot</Text>
</View>
  }

<View style= {styles.fixToTextx} >  

<Button titleStyle={{ fontSize: 12}} type="outline" title='I DO NOT ACCEPT THE GROUP RULES' raised={true} onPress={() => {this.exitGroup(groupid, duedate,phonenumber)} }>
 </Button>
  </View>


  <View style= {styles.fixToTextz} >  
<Button titleStyle={{ fontSize: 12, color:'teal'}} type="outline" title='CHANGE SETTLEMENT DATE' raised={true} onPress={() => {this.hideOverlay(), this.showPicker()}}>
 </Button>
  </View>

  <View  style={styles.tabBarInfoContainer} >  
  
  
<PayWithFlutterwave

onRedirect={(data) => this.handleOnRedirect(data)} 
options={{
  tx_ref: generateRef(11),
  authorization: authorization,
  amount:  commitmentfee,
  currency: 'NGN',
  payment_options: payment_options,
  customer: {

      email: email,
      phone_number:phonenumber,
      name:name

  },

  meta: {

    txtype: 'commitfee',
    slottransfer:'false',
    duedate:duedate,
    groupid: groupid,
    plan:plan,
    frodate:frodate,
    todate:todate,
    interval:Interval,
    subscription_code:subscription_code

}
  
}}
customButton={(props) => (
  <TouchableOpacity
     
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={props.disabled}>
        <Text style={{ color: 'white', fontWeight:'bold', fontSize: 12}}>I ACCEPT THE GROUP RULES  |  PAY {commitfee} FOR THE SLOT</Text>
    </TouchableOpacity>
)}
/>

 </View>
 
   

</Overlay>
   
             
<Overlay 

isVisible={this.state.isVisibleNotonus}
  windowBackgroundColor="rgba(255, 255, 255, .5)"
  overlayBackgroundColor="red"
   >
   
   <View >
   
  {this.state.spinner &&
      <View >
          <ActivityIndicator size="large" color="teal" />
      </View>
                        }  

    <View style={styles.flexy}>
  <Text style={styles.rule}>In addition to the rules handed down by your group admin, the following will apply:</Text>
</View>

<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>This group was not created by TrueSaver. Thus, we'll not be responsible for administering it</Text>
</View>

<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>TrueSaver is hereby indemnified against any damages that might be caused by this group</Text>
</View>

<View style={styles.flexy}>
    <FontAwesome name='check-circle' raised={true} color='green' />
  <Text style={styles.rule}>Once the group is full, exit will not be allowed. Please be sure before you join</Text>
</View>


  
  <View style= {styles.fixToText} >  
<Button titleStyle={{ fontSize: 12}} type="outline" title='I DO NOT ACCEPT THE GROUP RULES' raised={true} onPress={() => {this.props.navigation.goBack()}}>
 </Button>
  </View>


  <View style= {styles.fixToTextz} >  
<Button titleStyle={{ fontSize: 12, color:'teal'}} type="outline" title='CHANGE SETTLEMENT DATE' raised={true} onPress={() => {this.hideOverlay(), this.showPicker()}}>
 </Button>
  </View>
  
  

  <View  style={styles.tabBarInfoContainer} >  
   
  <TouchableOpacity  onPress={() => this.joingroup(duedate)}>
  
       <Text style={{ color: 'white', fontWeight:'bold', fontSize: 12}}>I HAVE READ & ACCEPTED THE GROUP RULES</Text>
   
  </TouchableOpacity>

   </View>
   
   </View >


</Overlay>
   

   <ScrollView  >
    
  
<View>

<View  style={styles.textnoint}>
<Text style= {styles.textstyle}>Choose your settlement date</Text>


<Text style={styles.downText}>
     You will be credited {CollectableAmount} on this date </Text>

<View style= {styles.fixToText} >  
<Button titleStyle={{ fontSize: 12}} title='TAP TO CHOOSE YOUR DATE OR SLOT' raised={true} onPress={() => {this.showPicker()}}>
 </Button>
  </View>

</View>

{this.state.spinner &&
      <View >
                            <ActivityIndicator size="large" color="teal" />
      </View>
                        }  

</View>
 
  </ScrollView>

   
   
   <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => this.props.navigation.goBack()}

      >
        <FontAwesome name="arrow-left" size={20} color="white" />
      </TouchableOpacity>
    
    
<SegmentedPicker
        ref={this.segmentedPicker}
        onConfirm={this.onConfirm}
        
        confirmText=  "Done picking my settlement date"
        pickerItemTextColor="teal"
        backgroundColor="white"
        selectionBackgroundColor="white"
        options={[
          { flex: 1,
            key: 'col_1',
            items: this.state.drop_down_data,
          },
           
        ]}
      />



    </View>

    
 );
}

}
 
 
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
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:15,
        justifyContent: 'space-between'

    },

    
   fixToTextx: {
    
    paddingTop:10,
    paddingBottom:30,
    alignItems:'center',
  
    },
   
  fixToTextz: {
      
    paddingTop:10,
    paddingBottom:70,
    alignItems:'center',
  
    },
   
    
  downText: {
    marginBottom: 10,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

    rule: {

        color: 'black',
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:10,
        fontSize:10,
    },
    textstyle: {
    
      fontSize:15,
      fontWeight:'bold',
      paddingLeft: 30,
      paddingRight: 30,
      color: '#008080',
      textAlign: 'center',

   
   }, 

   
   floatingButton: {
    borderWidth: 1,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 35,
    right: 15,
    width: 60,
    height: 60,
    backgroundColor: 'green',
    borderRadius: 100,
  },
  
  floatingButton2: {
    borderWidth: 1,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 120,
    right: 25,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 100,
  },

  
fixToTextx: {
    
  paddingTop:10,
  paddingBottom:30,
  alignItems:'center',

  },
 
fixToTextz: {
    
  paddingTop:10,
  paddingBottom:70,
  alignItems:'center',

  },
 
  
fixToText: {
    
  paddingTop:10,
  paddingBottom:10,
  alignItems:'center',

  },
 
 textnoint:{
     
      flex: 2,
      alignItems: 'center',
      paddingTop:80
     
    }, 

    container: {
      flex: 1,
      alignContent: 'center',
    },
  });
  