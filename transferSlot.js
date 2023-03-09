import React, { Component } from "react";
import {  ToastAndroid, Platform,ActivityIndicator, StyleSheet, Text, View, Alert,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";

import { Button, Input } from 'react-native-elements';

 
   
    
  export default class transferSlot extends Component {
 
    
  constructor(props) {
    super(props);     
    this.state = {

      loading: false,
      error: null,
      refreshing: false,
      phonenumber: '', 
      apikey:'',
      spinner:false,
      groupid:this.props.route.params.groupid,
      slot: this.props.route.params.slot,
      saverid: this.props.route.params.saverid,
      newsaverid: '',

      
    
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

  }
 
 
  
  notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
     
 


  nameEnquiry=() =>{

    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    
    
    } else{
    
    
      const {newsaverid,groupid,saverid,slot }= this.state;

      if (newsaverid !== '') {
  
  
          this.setState({spinner: true});
  
  
    
        //POST json 
        var dataToSend = { groupid: groupid, saverid:saverid, newsaverid:newsaverid, slot:slot, level: "0"}
  
  
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
        
            
            Alert.alert(
              "Account Name Enquiry",
              responseJson.response ,
          
              [
      
                { text: "Cancel" },
                { text: "Yes", onPress: () => this.SlotTransfer()},
  
               
              ],
      
              { cancelable: false }
         
              );
         
      
          }else{   
      
      
           
              this.notifyMessage(responseJson.response)
      
          
          }
          
      
        })
      
        .catch((error) => {
      
          this.notifyMessage("Oops. Something's not right");
          this.setState({spinner: false});
      
        });
           
  
  
      } else {
  
  
          this.notifyMessage("Enter phone number");
  
      }
          
  
    }
        
     
    });
    
}
      

SlotTransfer=() =>{


  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
  
  this.notifyMessage("You're offline")
  
  
  } else{
  
    const {newsaverid,groupid,saverid,slot }= this.state;

    this.setState({spinner: true});



  //POST json 
  var dataToSend = { groupid: groupid, saverid:saverid, newsaverid:newsaverid, slot:slot, level: "1"}


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
     
        this.props.navigation.goBack()

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
      


 
 render() {
    
     
let {newsaverid} = this.state;

       
  return (
    
 

  <View  style={styles.container}>

       
<ScrollView style={{backgroundColor:'white'}} >
    
  
<View>


<View style= {styles.favview}>
 
 <Text style= {styles.textstylex} >Transfer Slot</Text>

  </View> 
<View  style={styles.textnoint}>
<Text style= {styles.textstyle}>Enter the phone number of the person you are transferring to</Text>
</View>

     
 <Input
 label="Phone"
 labelStyle={{color:'teal'}}
inputStyle={{fontSize:15}}
   
   keyboardType="phone-pad"
   autoFocus={true} 
   onSubmitEditing={(newsaverid => this.setState({newsaverid}),() => this.nameEnquiry())}
   onChangeText={newsaverid => this.setState({newsaverid})}
   value={this.state.newsaverid}
  />
       
      {!this.state.spinner &&
          <View style= {styles.fixToText}> 
      
          <Button title="Continue" onPress={this.nameEnquiry}>
          
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
      paddingBottom: 50

   
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
  