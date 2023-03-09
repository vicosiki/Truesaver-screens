import React, { Component, useState }  from  "react";
import { ToastAndroid,
  Platform,
  AlertIOS,View, Text, 
  FlatList,StyleSheet,TouchableOpacity,TouchableHighlight,
  ScrollView, ActivityIndicator,Share ,RefreshControl,Alert, Clipboard, Linking} from "react-native";
import { ListItem, Overlay, Avatar, Icon,Button  } from "react-native-elements"; 
//import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Clipboard from "@react-native-community/clipboard";

import SegmentedPicker from 'react-native-segmented-picker';
import NetInfo from "@react-native-community/netinfo";


class MembersList extends Component { 
  constructor(props) {
    super(props);
         
    this.state = {

      loading: false,
      data: [],
      error: null,
      refreshing: true,
      slotsempty: true,
      slots:[],
      rowphonenumber: null,
      duedate: null,
      drop_down_data:[],
      isVisible: false,
      selectedSlot:'',
      joined: false,
      joinnotonus:undefined,
       
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
  


  componentDidMount = async () => {

    
NetInfo.addEventListener(this.handleConnectivityChange);
    
    let groupdata=this.props.route.params.members
    let groupid=this.props.route.params.groupid
    let slots=this.props.route.params.slots
    let freeslots=this.props.route.params.freeslots
    let commitfee=this.props.route.params.commitfee
    let cardvalid=this.props.route.params.cardvalid
    let adminfee=this.props.route.params.adminfee
    let PayableAmount=this.props.route.params.PayableAmount
    let CollectableAmount=this.props.route.params.CollectableAmount
    let Interval=this.props.route.params.Interval
    let linkchat=this.props.route.params.linkchat
    let sharetext=this.props.route.params.sharetext
    let showReview=this.props.route.params.showReview
    let joinnotonus=this.props.route.params.joinnotonus
    let notonus=this.props.route.params.notonus

    let chargedate=this.props.route.params.chargedate
    let groupinfo=this.props.route.params.groupinfo
 
    let default_collected=this.props.route.params.default_collected
    let default_notcollected=this.props.route.params.default_notcollected
    let topup_note=this.props.route.params.topup_note




    let slotscreen='SlotsIOS'
 

    let phonenumber = await AsyncStorage.getItem('phonenumber')
    let tsbank = await AsyncStorage.getItem('tsbank')


     
  this.setState({topup_note:topup_note,tsbank:tsbank,default_collected:default_collected,default_notcollected:default_notcollected,groupinfo:groupinfo,chargedate:chargedate,CollectableAmount:CollectableAmount,notonus:notonus,joinnotonus:joinnotonus,showReview:showReview, slotscreen:slotscreen,sharetext:sharetext,linkchat:linkchat,Interval:Interval,CollectableAmount:CollectableAmount,PayableAmount:PayableAmount,cardvalid:cardvalid, adminfee:adminfee, commitfee:commitfee,data:groupdata,groupid:groupid, slots:slots,phonenumber:phonenumber, refreshing:false})
 
  this._onRefresh()
  
  if (freeslots > 0) {  
    this.setState({ slotsempty: false});
  } 



  if (Platform.OS === 'android') {
    this.setState({ slotscreen: 'Slots'});
  }  
    

  if (showReview === true) {
      
            
    Alert.alert(
      "Notice of Settlement",
      "Thumbs up! Looks like you've been paid for at least a slot in this plan. Kindly drop a review",
      [
                                   { text: "Later"},
                                   { text: "OK",  onPress: () => this.storeReview()}

  
      ],
  
      { cancelable: true }
    );
  
  
      }
       
 
     

    }


 Stackinfo= (info) => { 

  const {rowphonenumber,row_name, row_email,topup_note, tsbank}= this.state

  Alert.alert(
                   
   "About Stacks",
    info,
          
    [
      { text: "Close"}
     
      ,
  { text: "Top up", onPress: () => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank,name:row_name,email:row_email,phonenumber:rowphonenumber,navto:"MembersList"})}
  
    ],

    { cancelable: true }

  );

}



    
  storeReview = () => {

     if (Platform.OS === 'android') {

      Linking.openURL("https://play.google.com/store/apps/details?id=com.truesaver.truesaver&showAllReviews=true");

       
    } else {

      Linking.openURL(`https://apps.apple.com/app/apple-store/id1548270400?action=write-review`) 
    }


   }

   

  hideOverlay = () => {

    this.setState({isVisible:false})
  
   }

   
  showOverlay = () => {

    this.setState({isVisible:true})
  
   }

    
 notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}

  _onRefresh = () => {

    if (!this.state.connection_Status) {

    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.makeRemoteRequest();});
    
    }
        
    
     }
     
  groupDet() {

    Alert.alert(
                   
      this.state.groupid,
      this.state.groupinfo
       

    );
 
   }  

 makeRemoteRequest () {

    try {

      if (!this.state.connection_Status) {

    
    this.notifyMessage("You're offline")
    
    
    } else{
    
    
      let {groupid,phonenumber,joinnotonus} = this.state
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
        
        this.setState({refreshing: false});
      
        if(responseJson.status == "00"){  
        
          
  var count = Object.keys(responseJson.slotmonth).length;
  let drop_down_data = [];
  for(var i=0;i<count;i++){
    drop_down_data.push({ label: responseJson.slotmonth[i].settlementdate , value: responseJson.slotmonth[i].month}); // Create your array of data
  }
        if (responseJson.freeslotcount > 0) {  
        this.setState({ slotsempty: false});
       } else{
        this.setState({ slotsempty: true});
  
       }
  
    this.setState({  stacksinfo:responseJson.stacksinfo, drop_down_data:drop_down_data , data:responseJson.savers, notonus:responseJson.notonus }); // Set the new state
  
    if (joinnotonus == true) {

    let {CollectableAmount,phonenumber,slots,groupid,commitfee,cardvalid, adminfee, slotscreen, notonus,Interval,PayableAmount,default_notcollected,default_collected}=this.state

    Alert.alert(
                   
      "You are in!",
      "Thank you for picking a slot.\n\nSavings will kick-off after the group gets filled.\n\nHere's what you might do next:"  , 

      [
       { text: "Share & Invite", onPress: () => this.onShare()},
 
       !this.state.slotsempty &&
       { text: "Pick another Slot", onPress:() => this.props.navigation.replace(slotscreen, {default_collected:default_collected,default_notcollected:default_notcollected,CollectableAmount:CollectableAmount,PayableAmount:PayableAmount,Interval:Interval,notonus:notonus,cardvalid:cardvalid, adminfee:adminfee,commitfee:commitfee,groupid:groupid,phonenumber:phonenumber, slots: slots}, this.setState({ toolTipVisible: false }))}
                                                 
   ],
 
           { cancelable: true }
    );
 
  } else  if (joinnotonus == false){
 

  let {stacksinfo,topup_note,tsbank,default_collected,default_notcollected,phonenumber,slots,groupid,commitfee,cardvalid, adminfee, slotscreen, notonus,Interval,PayableAmount}=this.state

  Alert.alert(
    "You are in!",
    "Thank you for picking a slot.\n\nSavings will kick-off after the group gets filled.\n\nHere's what you might do next:"  , 
 
    [
     { text: "Share & Invite", onPress: () => this.onShare()},

     !this.state.slotsempty &&
     { text: "Pick another Slot", onPress:() => this.props.navigation.replace(slotscreen, {stacksinfo:stacksinfo,topup_note:topup_note,tsbank:tsbank,default_collected:default_collected,default_notcollected:default_notcollected,Interval:Interval,CollectableAmount:CollectableAmount,PayableAmount:PayableAmount,Interval:Interval,notonus:notonus,cardvalid:cardvalid, adminfee:adminfee,commitfee:commitfee,groupid:groupid,phonenumber:phonenumber, slots: slots}, this.setState({ toolTipVisible: false }))}

 ],

         { cancelable: true }
  );}
    
  
  this.setState({joinnotonus:undefined});


        }else{   
      
          this.notifyMessage(responseJson.status)
       
      
        }
        
      
      })
      
      .catch((error) => {
      
        this.notifyMessage("Oops, looks like something went wrong");
        this.setState({spinner: false});
      
      });
            
      
    
    }
        
     
        
    } catch (error) {
      this.notifyMessage("Oops, something's not right");
    }
  }
  
  calltoaction = () => {
  
    let {stacksinfo,topup_note,tsbank,default_collected,default_notcollected,CollectableAmount,phonenumber,slots,groupid,commitfee,cardvalid, adminfee, slotscreen, notonus,Interval,PayableAmount}=this.state

            
if (this.state.slotsempty == true) {

  this.chatLink()

} else { 


    Alert.alert(
      "Pick a Slot",
      "If you want to join this group, pick a slot now! A slot is the date you want to collect the group's savings. Please be sure to read the group's rules. \n\nSavings will kickoff when the group gets filled up. \n\nYou can also join the chat room for news and announcements."  ,
      [
          { text: "Go to Chat Room", onPress: () =>this.chatLink() },
          { text: "Pick a Slot", onPress:() =>  this.props.navigation.replace(slotscreen, {stacksinfo:stacksinfo,topup_note:topup_note,tsbank:tsbank,default_collected:default_collected,default_notcollected:default_notcollected,CollectableAmount:CollectableAmount,PayableAmount:PayableAmount,Interval:Interval,notonus:notonus,cardvalid:cardvalid, adminfee:adminfee,commitfee:commitfee,groupid:groupid,phonenumber:phonenumber, slots: slots}, this.setState({ toolTipVisible: false }))}

      ],
      
      { cancelable: true }

    );

}
       
  }

     
   chatLink = async () => {

    
    try {
       
     
      Clipboard.setString(this.state.linkchat)

      this.notifyMessage("Chat link copied")

     // WebBrowser.openBrowserAsync(`${this.state.linkchat}`)
      Linking.openURL(`${this.state.linkchat}`)


    } catch (error) {
       this.notifyMessage("Oops, something's not right");
    }
  };


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

  renderSeparator = () => {

    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    //View to set in Header

    let {stacksinfo,topup_note,tsbank,default_collected,default_notcollected,CollectableAmount,phonenumber,slots,groupid,commitfee,cardvalid, adminfee, slotscreen, notonus,Interval,PayableAmount}=this.state

    const [toolTipVisible, setToolTipVisible] = useState(false);

    return (

  <View>

          
{ this.state.slotsempty == true ?

     
<TouchableHighlight style={styles.header_footer_style}  onPress={() => this.groupDet() } >

    <View style={styles.header_footer_style} >

      <FontAwesome  name = "calendar-check-o" size={15} color='white'  />

      <Text style={styles.textStyle}> {this.state.groupid} ({this.state.PayableAmount} | {this.state.CollectableAmount}) </Text>
     

             
     </View>

</TouchableHighlight>

     :

    
     
<TouchableHighlight style={styles.header_footer_style}  onPress={() => this.props.navigation.replace(slotscreen, {stacksinfo:stacksinfo,topup_note:topup_note,tsbank:tsbank,default_collected:default_collected,default_notcollected:default_notcollected,Interval:Interval,CollectableAmount:CollectableAmount,PayableAmount:PayableAmount,Interval:Interval,notonus:notonus,cardvalid:cardvalid, adminfee:adminfee,commitfee:commitfee,groupid:groupid,phonenumber:phonenumber, slots: slots}, this.setState({ toolTipVisible: false }))} >

 

<View style={styles.header_footer_style}>
        <Text style={styles.textStyle}>Tap to Join {this.state.groupid} ({this.state.PayableAmount} | {this.state.CollectableAmount})  </Text>
</View>
 
 </TouchableHighlight>

  


 

}

</View>
 
    );
  };



  render() {

      let {phonenumber,groupid,slotsempty} = this.state

const Slotmgt =(duedate, rowphonenumber, paylog) =>{

  if  (paylog == "yes") {

    if (slotsempty==true) {


      Alert.alert(
        "Manage Slot",
        "Hey! Just tap on what you'll like to do. The rest is easy:"  , 
     
        [
   

         { text: "Collected", onPress: () =>  txlog("collected",duedate,groupid,phonenumber) },
         { text: "-DR", onPress: () =>  txlog("dr",duedate,groupid,phonenumber) },
         { text: "+CR", onPress: () =>  txlog("cr",duedate,groupid,phonenumber) },




    
     ],
   
             { cancelable: true }
      );


   } else {


      Alert.alert(
        "Manage Slot",
        "Hey! Just tap on what you'll like to do. The rest is easy:"  , 
     
        [
   
         { text: "Change Slot", onPress: () => changeSlot(duedate, rowphonenumber) },

         { text: "-DR", onPress: () =>  txlog("dr",duedate,groupid,phonenumber) },

         { text: "+CR", onPress: () =>  txlog("cr",duedate,groupid,phonenumber) },
 
         



    
     ],
   
             { cancelable: true }
      );

    }


  } else{
    
    if (slotsempty==true) {

      this.notifyMessage("All slots taken")

    } else {

      Alert.alert(
        "Manage Slot",
        "Hey! Just tap on what you'll like to do. The rest is easy:"  , 
     
        [
         
         { text: "Exit Slot", onPress: () => exitGroup(groupid, duedate) },

         { text: "Change Slot", onPress: () => changeSlot(duedate, rowphonenumber) },
         


    
     ],
   
             { cancelable: true }
      );


    }
  }



}

      
const exitGroup = (groupid, duedate) => {
   
if (!this.state.connection_Status) {
   
   
   this.notifyMessage("You're offline")
   
   } else {
 

    
//POST json 
var dataToSend = { groupid, phonenumber,  duedate}
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
   
  
 }

const changeSlot =(duedate, rowphonenumber) =>{
  
      if (slotsempty==true) {

      this.notifyMessage("All slots taken")

      } else {

        
        //set states for the tapped row
       this.setState({rowphonenumber:rowphonenumber, duedate:duedate})
        

       searchGroup()

      }

    }
 

   const searchGroup = () => {
    if (!this.state.connection_Status) {

    this.notifyMessage("You're offline")
    
    
    } else{
    
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
       
       this.setState({spinner: false});
     
       if(responseJson.status == "00"){  
       
         
 var count = Object.keys(responseJson.slotmonth).length;
 let drop_down_data = [];
 for(var i=0;i<count;i++){
   drop_down_data.push({ label: responseJson.slotmonth[i].settlementdate + " " + responseJson.slotmonth[i].slotprofit, value: responseJson.slotmonth[i].month}); // Create your array of data
 }
 
 this.setState({ drop_down_data:drop_down_data }); // Set the new state

 
   if (Platform.OS === 'android') {
   
    this.segmentedPicker.current.show();

  } else {

    this.showOverlay();
    
  }

  

 }else{   


     
 this.notifyMessage(responseJson.status)
      
     
       }
       
     
     })
     
     .catch((error) => {
     
       this.notifyMessage(error);
       this.setState({spinner: false});
     
     });
           
     
    
    }
        
   
     
       }
      
    
       
   const txlog = (transaction,duedate,groupid,phonenumber) => {
    if (!this.state.connection_Status) {

    
    this.notifyMessage("You're offline")
    
    
    } else{
    
     //POST json 
     var dataToSend = { groupid, phonenumber, duedate,transaction}
     //making data to send on server
     var formBody = [];
     for (var key in dataToSend) {
       var encodedKey = encodeURIComponent(key);
       var encodedValue = encodeURIComponent(dataToSend[key]);
       formBody.push(encodedKey + "=" + encodedValue);
     }
     formBody = formBody.join("&");
     
     const url = 'https://truesaver.net/api/v1/txlog.ashx';
     
     
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
     
       if(responseJson.statuscode == "00"){  
       
        this.notifyMessage(responseJson.status)
        
        this._onRefresh()

           }else{   
 
     
        this.notifyMessage(responseJson.status)
      
     
       }
       
     
     })
     
     .catch((error) => {
     
       this.notifyMessage(error);
       this.setState({spinner: false});
     
     });
           
     
    
    }
        
    
       }
      
    
 
 
  const onConfirm =(selections)=> {
      
    if (!this.state.connection_Status) {

    
    this.notifyMessage("You're offline")
    
    
    } else{
    
    
      let {groupid, rowphonenumber, duedate,tsbank, topup_note }= this.state
      
            
      const url = 'https://truesaver.net/api/v1/modifygroupsaver.ashx';
  
       //POST json 
       var dataToSend = { phonenumber:rowphonenumber, groupid:groupid, duedate:duedate, newduedate:selections.col_1 };
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
      //If response is in json then in success
      .then((responseJson) => {
          
             this.setState({row_email: responseJson.row_email, row_name: responseJson.row_name});

       if (responseJson.statuscode == "00") {  
            

        this.notifyMessage(responseJson.status)
        
       
        this._onRefresh()

        
      } else if (responseJson.statuscode == "02") {


        Alert.alert(
          "Top up Your Stacks",
          `${responseJson.status}`,
      
     
          [
     { text: "About", onPress: () => this.Stackinfo(this.state.stacksinfo) }  ,
       { text: "Ok" }  ,
        { text: "Top up", onPress: () => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank,name:this.state.row_name,email:this.state.row_email,phonenumber:rowphonenumber,navto:"MembersList"})}
      

          ],
          
          
          { cancelable: false }
     
          );
     
      
  
          } else {
  
  
            this.notifyMessage(responseJson.status)

  
          }
  
          
   
          
      })
  
      //If response is not in json then in error
      .catch((error) => {
       
        return false;
  
      });
  
      

    
    }
        
    
  
    }
     
   
    const onConfirmIOS =()=> {
      
      if (!this.state.connection_Status) {

      this.notifyMessage("You're offline")
      
      
      } else{
      
        let {groupid, rowphonenumber,duedate, selectedSlot ,tsbank, topup_note}= this.state

        //reset selected slot state
        this.setState({selectedSlot:''})

        if (selectedSlot != '' ) {

        
        this.hideOverlay()
 
              
          const url = 'https://truesaver.net/api/v1/modifygroupsaver.ashx';
    
          //POST json 
          var dataToSend = { phonenumber:rowphonenumber, groupid:groupid, duedate:duedate, newduedate:selectedSlot};
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
         //If response is in json then in success
         .then((responseJson) => {
             
             this.setState({row_email: responseJson.row_email, row_name: responseJson.row_name});

          if (responseJson.statuscode == "00") {  
               
           
            this._onRefresh()
            

           this.notifyMessage(responseJson.status)
          
          } else if (responseJson.statuscode == "02") {


            Alert.alert(
              "Top up Your Stacks",
              `${responseJson.status}`,
          
         
              [
          { text: "About", onPress: () => this.Stackinfo(this.state.stacksinfo) }  ,
            { text: "Ok" }  ,
            { text: "Top up", onPress: () => this.props.navigation.navigate("topupstack",{topup_note:topup_note,tsbank:tsbank,name:this.state.row_name,email:this.state.row_email,phonenumber:rowphonenumber,navto:"MembersList"})}
          
    
              ],
              
              
              { cancelable: false }
         
              );
         
          
     
             } else {
     
     
               this.notifyMessage(responseJson.status)
   
     
             }
     
             
      
             
         })
     
         //If response is not in json then in error
         .catch((error) => {
          
           return false;
     
         });
      


        } else {

          this.notifyMessage('Please select a date from the list');

        }


      }
        
    
      }
     
     
      
    return (
       
       
    <View style={styles.MainContainer}>

   

      <FlatList   refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}
        data={this.state.data}
        renderItem={({ item }) => (
/*
          <ListItem  

           onPress= {() => changeSlot(item.duedate, item.saverid)} 
                
            title={item.name} 
            subtitle={`${item.settlementdate}  | ${item.totalsavings} `}
            leftAvatar={{ source: { uri: item.dpurl} }}
            disabled={item.AllowEdit == 'no' ? true : false}
            chevron={item.AllowEdit == 'no' ? {color: 'white'} : { color: 'teal'} }
            topDivider
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            rightElement= {item.CollectedAmount > 0 ?  <FontAwesome name='check-circle' raised={true} color='gray' />
             :  false }
            
          />
        */
          <ListItem  onPress= {() => Slotmgt(item.duedate, item.saverid,item.PayLog)}  
             disabled={item.AllowEdit == 'no' ? true : false} 
             bottomDivider >
  
            <Avatar  rounded size ="medium" source={{uri: item.dpurl}} />   
            
              <ListItem.Content>

              <ListItem.Title style={styles.titleStyle} >
              {item.name} 


              {item.vip == 'yes' ?

 <Avatar  rounded  size={13} source={require('../assets/images/badge.jpg')}  />   

:  false }
              
              </ListItem.Title>

              <ListItem.Subtitle style={styles.subtitleStyle} >
              {`${item.settlementdate}  | ${item.totalsavings} ${item.slotprofit} `}
              </ListItem.Subtitle>
 
               </ListItem.Content>


            {item.interest > 0 ? 
               
               <Avatar rounded  size={20} source={require('../assets/images/fav.png')}  />   

                  
                  :  false }



        {item.AllowEdit == 'yes'  ?

           <FontAwesome  name = "chevron-right" size={10} color='green'  />

           :  false }

               {item.CollectedAmount > 0 ? 
               
            <FontAwesome  name="check-circle" size={15} color='gray' raised={true} />
            
               
               :  false }


               

          </ListItem>
          
          
        )}

        

        keyExtractor={item => item.duedate}
       // ItemSeparatorComponent={this.renderSeparator}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={this.renderHeader} 
        stickyHeaderIndices={[0]}


      />

 
       <TouchableOpacity 
          style={styles.floatingButton3}
          onPress={this.onShare}
        >
          <FontAwesome name="share" size={20} color="green" />
        </TouchableOpacity>

        
<TouchableOpacity 
          style={styles.floatingButton2}
          onPress={this.calltoaction}
        >
          <FontAwesome name="comments" size={20} color="green" />
        </TouchableOpacity>


<TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => this.props.navigation.goBack()}

        >
          <FontAwesome name="arrow-left" size={20} color="white" />
        </TouchableOpacity>

 <View>   
 
 <Overlay 

isVisible={this.state.isVisible}
 windowBackgroundColor="rgba(255, 255, 255, .5)"
 overlayBackgroundColor="red"
  >
 
<View  style={styles.textnoint}>

<Text style= {styles.modsetstyle}>Change your settlement date</Text>

</View>

<View  style={styles.Slotsty}>


 
<Picker 
style={{width:'80%'}}

selectedValue={this.state.selectedSlot}
onValueChange={(itemValue)=>this.setState({selectedSlot:itemValue})} >

<Picker.Item label='' value='' />
{this.state.drop_down_data.map(v => <Picker.Item  key={v.value} label={v.label} value={v.value} />)}
 
</Picker>
 

</View>
 
<View style={styles.container}> 

<View style= {styles.Rulesbt} >  

<Button titleStyle={{ fontSize: 12}} title='UPDATE' raised={true} onPress={() => {onConfirmIOS()}}>
 
 </Button>
  
</View>

<View style= {styles.Rulesbt} >  
 
<Button titleStyle={{ fontSize: 12}} title='CLOSE' raised={true} onPress={() => {this.hideOverlay()}}>
 
 </Button>
  
</View>

</View>

 

</Overlay>

</View>
        
<SegmentedPicker
        ref={this.segmentedPicker}
        onConfirm={onConfirm}
        
        confirmText="Tap here to change your settlement date"
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

export default MembersList;


const styles = StyleSheet.create({
    MainContainer: {
      justifyContent: 'center',
      flex: 1,
      

    },

    rowViewContainer: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },

    header_footer_style: {
      width: '100%',
      height: 45,
      backgroundColor: 'green',
      alignItems: 'center',
      alignContent:'center',
      flexDirection: 'row',
      justifyContent:'center'
      
    },

    modsetstyle: {
    
      fontSize:15,
      fontWeight:'bold',
      paddingLeft: 30,
      paddingRight: 30,
      color: '#008080',
      textAlign: 'center',

   
   }, 

   
Slotsty: {
  
  paddingBottom:50,
  alignItems:'center',

  },
 
  dp:{ width: 50, height: 50, borderRadius: 50/2
  },


    textStyle: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 14,
      padding: 10,
    },
    
Rulesbt: {
  
  
  flex: 1,
  padding: 10,


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

    
    floatingButton3: {
      borderWidth: 1,
      borderColor: 'green',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 200,
      right: 25,
      width: 40,
      height: 40,
      backgroundColor: 'white',
      borderRadius: 100,
    },

    titleStyle: {
    paddingTop: 10,
    fontSize: 12,
    fontWeight:'bold',
 
    },
  

    subtitleStyle: {

      fontSize: 12,
      paddingTop: 5,
      paddingBottom: 8,


  
      },

      
 textnoint:{
  
  alignItems: 'center',
  paddingBottom:50,
  paddingTop:20,


      
}, 


    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

  });