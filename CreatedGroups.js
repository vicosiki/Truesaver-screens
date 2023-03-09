import React, { Component } from "react";
import {  ToastAndroid,
  Platform,
  AlertIOS, ActivityIndicator, StyleSheet, Text, View, Button, Alert,TouchableOpacity, RefreshControl} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import NetInfo from "@react-native-community/netinfo";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";


 
   
    
  export default class CreatedGroups extends Component {
 
    
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
      apikey:'',
      spinner:true,
      dataempty:true,
      totalCount:0,
      
    
    };

    
  }
 

  
  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
   
    
 
  Grouptype = () =>
  Alert.alert(
     "Savings Plan",
     `Weekly savings are done once every week. Monthly savings are done once every month. What savings plan do you want to create?`,
 

     [
         { text: "Monthly plan", onPress: () => this.props.navigation.navigate("Newgroup", {interval:"monthly"})
        },

        { text: "Weekly plan", onPress: () => this.props.navigation.navigate("Newgroup", {interval:"weekly"} )},



     ],

     { cancelable: true }

     );

  
 notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
}
 
  _onRefresh = () => {
    
    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
          
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.makeRemoteRequest(this.state.page);});
    
    }
        
     
    });
    
  }

  
  _nextPgRefresh = (page) => {
    
    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.makeRemoteRequest(page);});
    
    }
        
     
    });
    
  }


async componentDidMount() {

NetInfo.addEventListener(this.handleConnectivityChange);

    let apikey = await AsyncStorage.getItem('apikey');

    let phonenumber = await AsyncStorage.getItem('phonenumber')
 

  this.setState({ phonenumber: phonenumber, apikey:apikey})

  this.setState({refreshing: true,},() => {this.makeRemoteRequest(0);});

    
  }
   
 

  makeRemoteRequest = (page) => {
 
    try {

    const url = 'https://truesaver.net/api/v1/created.ashx';

     //POST json 
     var dataToSend = { phonenumber:this.state.phonenumber , page: page}; 
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
        , apikey:this.state.apikey //  
        
      },
    })
    
    
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {

      if (responseJson.count > 0) {


        this.setState({ loading: true, 
              
          data: responseJson.savergroup,
          refreshing: false, spinner:false, totalCount:responseJson.totalPageCount, page:responseJson.page,
          pagestring: "Page " + (parseInt(responseJson.page) + 1)   + " of "  + responseJson.totalPageCount 

        });
 
        this.setState({ dataempty: false});

        if ((parseInt(responseJson.page) + 1) == parseInt(responseJson.totalPageCount)){

          //disable next
          this.setState({ disable_next: true})
  
          } else {
  
          this.setState({ disable_next: false})
  
  
          }
  
          if (parseInt(responseJson.page) ==  0){
  
            //disable prev
            this.setState({ disable_prev: true})
    
            } else {
  
            this.setState({ disable_prev: false})
  
            }  


      } else {



        this.setState({ dataempty: true});


      }
        
            })

    //If response is not in json then in error
    .catch((error) => {
      
      this.setState({ spinner: false, refreshing: false})
     //alert(JSON.stringify(error))
 
      return false;

    });

    
     } catch (error) {

        this.setState({spinner:false, dataempty: true})

       
       }


  }


  render() {
    
    let {phonenumber}= this.state;

       
const  gotoEdit = (slots, groupname,interval,payamtID, frodate, walink, notonus,symbol)  =>{
  
   
 this.props.navigation.navigate("Editgroup", {notonus:notonus,walink:walink, slots: slots, groupname:groupname, interval:interval,payamtID: payamtID, frodate:frodate, symbol:symbol})

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
      
          
          this.props.navigation.navigate("MembersList", {default_collected:responseJson.default_collected,default_notcollected:responseJson.default_notcollected,groupinfo:responseJson.groupinfo,chargedate:responseJson.chargedate,showReview:responseJson.showReview, sharetext:responseJson.Sharetext,linkchat:responseJson.walink,Interval:responseJson.interval,CollectableAmount:responseJson.CollectableAmtFormatted,PayableAmount:responseJson.PayableAmtFormatted,adminfee:responseJson.adminfee,groupid:groupid, members:responseJson.savers, freeslots:responseJson.freeslotcount,  slots: responseJson.slotmonth, commitfee:responseJson.commitfee, cardvalid:responseJson.cardvalid})
      
      
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
  
    
function rollover (groupid) {
  Alert.alert(
     "Rollover Group",
     "You are about to roll over this group to start on the next round"  , 
  
     [
      { text: "Cancel"},

      { text: "Ok", onPress: () => Rollovergp(groupid) },
 
  ],

          { cancelable: false }
   );
}

  
function recycle (groupid) {
  Alert.alert(
     "Recycle Group",
     "You are about to recycle this group to start again. Savers will have to pick their slots anew"  , 
  
     [
      { text: "Cancel"},

      { text: "Ok", onPress: () => Recyclegp(groupid) },
 
  ],

          { cancelable: false }
   );
}

 
function Delete (groupid) {
  Alert.alert(
     "Delete Group",
     "You are about to delete this group permanently"  , 
  
     [
      { text: "Cancel"},

      { text: "Ok", onPress: () => Deletegp(groupid) },
 
  ],

          { cancelable: false }
   );
}

const Deletegp = (groupid) => {

  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
   
    var url = 'https://truesaver.net/api/v1/gotomodifygroup.ashx';
   
    //POST json 
    var dataToSend = { phonenumber:this.state.phonenumber,  groupid:groupid, action:"delete"}; //
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
       , apikey:this.state.apikey //  
    },
        
   })
   
   .then((response) => response.json())
   //If response is in json then in success
   .then((responseJson) => {
    
     
          
     if (responseJson.statuscode == "00") {  
      
      this._onRefresh()
      
      this.notifyMessage(groupid + " successfully deleted")

    } else {

          this.notifyMessage(responseJson.status)
    }
  
   })
   
   
   //If response is not in json then in error
   .catch((error) => {
    
    this.setState({ refreshing: false})
  });
   
  }
      
   
  });
  
  
  }
  


const Recyclegp = (groupid) => {

  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
   
    var url = 'https://truesaver.net/api/v1/recycle.ashx';
   
    //POST json 
    var dataToSend = { phonenumber:this.state.phonenumber,  groupid:groupid, scope:"1"}; //
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
       , apikey:this.state.apikey //  
    },
        
   })
   
   .then((response) => response.json())
   //If response is in json then in success
   .then((responseJson) => {
    
     
          
     if (responseJson.status == "00") {  
      
      this._onRefresh()
      this.notifyMessage(groupid + " successfully recycled")

      /*

      if (responseJson.notonus == true){
 
        Alert.alert(
          "Recycled Group",
          "You will be charged a one-off fee of " + responseJson.adm_charge + " for each slots" ,
          [
                       { text: "Cancel"},
                       { text: "Continue",  onPress: () => Linking.openURL(responseJson.payauth_url)}
      
          ],
      
          { cancelable: false }
        );

      } else {

      this._onRefresh()
      this.notifyMessage(groupid + " successfully recycled")


      }
      
      */

    } else {

          this.notifyMessage(responseJson.status)
    }
  
   })
   
   
   //If response is not in json then in error
   .catch((error) => {
    
    this.setState({ refreshing: false})
  });
   
  }
      
   
  });
  
  
  }
  

const Rollovergp = (groupid) => {

  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {

  
  this.notifyMessage("You're offline")
  
  
  } else{
  
  
   
    var url = 'https://truesaver.net/api/v1/grouprollover.ashx';
   
    //POST json 
    var dataToSend = { saverid:this.state.phonenumber,  groupid:groupid}; //
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
       , apikey:this.state.apikey //  
    },
        
   })
   
   .then((response) => response.json())
   //If response is in json then in success
   .then((responseJson) => {
    
     
          
     if (responseJson.status == "00") {  
      
      this._onRefresh()
      
      this.notifyMessage("Roll-over was successful")

    } else {

          this.notifyMessage(responseJson.status)
    }
  
   })
   
   
   //If response is not in json then in error
   .catch((error) => {
    
    this.setState({ refreshing: false})
  });
   
  }
      
   
  });
  
  
  }
  
  
let renderCards = this.state.data.map(function (item, index) {


      return (
           
 <View key={item.groupid}>
  
    
<Card style= {styles.paragraph}> 



<CardTitle title={
   <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
     
     <FIcon name="group" color="rgba(35, 166, 240, 1)"  /> 

     <Text style={{paddingLeft:10 }}>{item.groupid }</Text>
    
    
   </View>}

   />



<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="money" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{ item.currencysymbol + item.savings + " " + item.cat + " savings"}
               </Text>
                   
                   
                  </View>}
               
   />
    
<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="calendar" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{item.tenure  }
               </Text>
                   
                   
                  </View>}
               
   />
    
    
<CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="object-ungroup" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Slots left: "  + item.slotsleft + " out of " + item.totalslots }
               </Text>
                   
                   
                  </View>}
               
   />
    

    <CardContent text={
                  <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row" }}>
                    
                    <FIcon name="bar-chart-o" color="rgba(35, 166, 240, 1)"  /> 
               
                    <Text style={{paddingLeft:10 }}>{"Savings: " + item.groupsavingsperc + "   |   Payouts: " + item.groupcollectionsperc}
               </Text>
                   
                   
                  </View>}
               
   />
     

  { item.recycle =="true"  ?

<CardAction
                 separator={true}
                 inColumn={false}>
                 <CardButton 
                   onPress={() => searchGroup(item.groupid)}
                   title="View"
                   color="green"
       
                 />

              <CardButton 
                   onPress= {() => recycle(item.groupid)}
                   title="Recycle"
                   color="teal"
       
                 />
       
       
               </CardAction>
               


:

 item.rollover =="true"  ?
<CardAction
                 separator={true}
                 inColumn={false}>
                 <CardButton 
                  onPress={() => searchGroup(item.groupid)}
                   title="View"
                   color="green"
       
                 />

                 <CardButton 
                  onPress={() => rollover(item.groupid)}
                   title="Rollover"
                   color="teal"
       
                 />

                 
                 <CardButton 
                  onPress={() => gotoEdit(item.totalslots, item.groupid,item.cat, item.savings, item.frodate, item.walink, item.notonus, item.currencysymbol)}
                 
                  title="Edit"
                   color="orange"
       
                 />
       
       
       <CardButton 
                   onPress= {() => Delete(item.groupid)}
                   title="Delete"
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
      
               </CardAction>

               
}       

</Card>
 
                           
</View>
           
           )
      });



  return (
    
   
  <View  style={styles.container}>
   
   
<TouchableOpacity  style={{padding: 30}} onPress= {() => this.Grouptype()}>

<View style={styles.tabBarInfoContainer}>

    <Text  style={styles.textstyle} >Tap here to create a new Savings Group </Text>

    
</View>

</TouchableOpacity>

    
   <ScrollView  showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>
    
 
               

                    
{renderCards}  


{this.state.totalCount > 10 ?

<View style={{ paddingLeft: 20, paddingRight: 20, justifyContent: 'space-between',alignItems: "center",flexDirection: "row", paddingTop:20, paddingBottom:20 }}>
      
   <Button
                onPress={() => this._nextPgRefresh(parseInt(this.state.page - 1))}

                title="PREV"

                disabled={this.state.disable_prev === true ? true : false}

                buttonStyle={{
                  backgroundColor: 'white',
                  
                }}
                containerStyle={{
                  height: 40,
                  width: 100,
                   
                }}
                titleStyle={{ color: 'black' }}
              />

      <Text >{this.state.pagestring}</Text>
     
      <Button   onPress={() => this._nextPgRefresh(parseInt(this.state.page) + 1)}
                title="NEXT"

                disabled={this.state.disable_next === true ? true : false}

                buttonStyle={{
                  backgroundColor: 'white',
                  
                }}
                containerStyle={{
                  height: 40,
                  width: 100,
                   
                }}
                titleStyle={{ color: 'black' }}
              />
     
    </View>
 
:
  
<View></View>

}

     
{ this.state.dataempty &&

<View>

<View  style={styles.textnoint}>
<Text style= {styles.textstyle2}>Your created groups will appear here</Text>
</View>


</View>

  }

  

  </ScrollView>

 
   
    </View>
 );
}

}
 
 
const styles = StyleSheet.create({
     
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor:'#fbfbfb',
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
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: 'green',
    justifyContent:'center',
    height:60,
  },
    paragraph: {
      margin: 20,
          
    },

    textstyle: {
    
      textAlign: 'center',
      color: '#fff',
      fontSize: 14,
      padding: 10,
 
   }, 

   
   textstyle2: {
    
    fontSize:14,
    fontWeight:'bold',
    paddingLeft: 30,
    paddingRight: 30,
    textAlign: 'center',


 }, 

   
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

fixToText: {
    
  paddingTop:40,
    alignItems:'center',

  },
 
 textnoint:{
     
      flex: 2,
      alignItems: 'center',
      paddingTop:150,

     
    }, 

    container: {
      flex: 1,
      alignContent: 'center',
    },
  });
  