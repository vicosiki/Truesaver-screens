import * as React from 'react';
import { ToastAndroid, Platform,Image, StyleSheet,Alert, Text, Button, View ,TouchableOpacity, Switch,RefreshControl,Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Avatar from 'react-native-interactive-avatar';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'react-native/Libraries/Network/FormData';
import NetInfo from "@react-native-community/netinfo";
import mime from "mime";
//import * as Permissions from 'expo-permissions';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";




export default class  Settings extends React.Component{

   
  constructor(props) {
    super(props);     
    this.state = {
       
      refreshing: false,
      filePath: {},
      localUri:null, 
      linkedBanks:0,
      linkbank: false,
      accountNGN: true,
       

    };

    
  (async () => {
  
    let signedinToggle = await AsyncStorage.getItem('signedinToggle');
 
     
    if(signedinToggle == "true"){  

      this.setState({ toggle: true});
 
    } else {

      
      this.setState({ toggle: false});


    }
 
  
     })();
  

  }


  handleConnectivityChange = state => {
    if (state.isConnected) {
      this.setState({connection_Status: true});
    } else {
      this.setState({connection_Status: false});
    }
  };
  
   
  
  async  toggleSignin () {
 
      

  if (!this.state.toggle == true) {
   
  await AsyncStorage.setItem('signedinToggle', "true")


  } else{
  
      await AsyncStorage.setItem('signedinToggle', "false")

  }
          
  

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
     
  _onRefresh = () => {
     
    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    } else{
    
    
      this.setState({refreshing: true,},() => {this.componentDidMount();},() => {this.linkedBanks();} );
    
    }
        
     
    });
    
    
  }

  async componentDidMount() {
  
    NetInfo.addEventListener(this.handleConnectivityChange);

          let name = await AsyncStorage.getItem('name');
       
          let phonenumber = await AsyncStorage.getItem('phonenumber')
    
          let email = await AsyncStorage.getItem('email')

          let bank = await AsyncStorage.getItem('bank')

          let acctnum = await AsyncStorage.getItem('acctnum')

          let dpurl = await AsyncStorage.getItem('dpurl')
          
         
          let apikey = await AsyncStorage.getItem('apikey');
          

          

    this.setState({apikey:apikey,refreshing:false, email: email, phonenumber: phonenumber, name:name, bank:bank, acctnum:acctnum, dpurl:dpurl})


    this.linkedBanks()

  }

  
linkedBanks() {

  NetInfo.fetch().then(state => {
    
    if (!this.state.connection_Status) {
  
  this.notifyMessage("You're offline")
  
  
  } else{
  
    const { phonenumber} = this.state;
 
    var dataToSend = {   phonenumber:phonenumber }
 
    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    fetch('https://truesaver.net/api/v1/linkedBanks.ashx', {
      method: "POST",//Request Type 
       body: formBody,//post body 
       headers: {//Header Defination 
         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
         },
      
     })
  
    .then((response) => response.json())
    .then(async(responseJson) => {


      this.setState({verified:responseJson.verified,vip:responseJson.vip,accountNGN:responseJson.accountNGN,banklisting:responseJson.banklisting,linkedBanks:responseJson.linkedBanks, expectedBankLinks:responseJson.expectedBankLinks})


      if (responseJson.showprompt) {

        this.setState({linkbank:true})

    Alert.alert(
    "Link your Bank accounts",

    "To ensure an uninterrupted savings you must link " + this.state.expectedBankLinks + " bank accounts. You have linked " + this.state.linkedBanks + ". "  + `\n \n` + this.state.banklisting ,
    [
    
       { text: "LATER" },
    
       
       { text: "LINK NOW", onPress: () => this.props.navigation.navigate("okrapay", {phonenumber:this.state.phonenumber})},
        
    ],
    { cancelable: false }
    
    );
     
        
          }

          
    


    })

  .catch((error) => {

    this.notifyMessage("Oops, something's not right");

   });
        
  }
      
   
  });
  
}




   openImagePickerAsync = async () => {
 
    //let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

   // let permissionResult = await Permissions.askAsync(Permissions.CAMERA_ROLL);


   // if (permissionResult.granted === false) {
     // Alert.alert("Permission to access camera roll is required!");
    //  return;
   // }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return;
    }
    
    

    this.setState({ localUri: pickerResult.uri });

  this.setState({spinner: false, dpurl: pickerResult.uri});

    this.dpchange()


  };
  

  dpchange=()=>{

    NetInfo.fetch().then(state => {
    
      if (!this.state.connection_Status) {
    
    this.notifyMessage("You're offline")
    this.setState({refreshing: false})
    
    
    } else{
    
     
      const {localUri, phonenumber} = this.state;

        
      this.setState({spinner: true});

      const url = 'https://truesaver.net/api/v1/saveracctmod.ashx';
  
       
      //POST json 
       // extract the filetype
//let fileType = uri.substring(uri.lastIndexOf(".") + 1);

    let formBody = new FormData();
    
    const newImageUri =  "file:///" + localUri.split("file:/").join("");

    formBody.append("image", { uri: newImageUri ,
       name: newImageUri.split("/").pop(), 
       type: mime.getType(newImageUri)});
    formBody.append("level", "0");
    formBody.append("phonenumber", phonenumber);

    //POST request 
      fetch(url, {

       method: "POST",//Request Type 
       body: formBody,//post body 
      
  })
  
  
  .then((response) =>  response.json())
  .then(async(responseJson) => { 
  
   if(responseJson.statuscode == "00"){
  
  this.notifyMessage("Update was successful");

  //this.setState({spinner: false, dpurl: responseJson.dpurl});

   await AsyncStorage.setItem('dpurl', this.state.dpurl);

  
   }else{
    
    this.notifyMessage(responseJson.status);
            this.setState({spinner: false});
     
         }
  
  })
   
  .catch((error) => {
  
    this.setState({spinner: false});

    this.notifyMessage("oops, something's not right. Please try another picture");
      
});

  

    }
        
     
    });
    
    
     }
   
   
     
     
verAlert () {
  
  if  (this.state.vip == 'yes') {
  
  
   Alert.alert(
    "You may lose your blue tick badge!" ,
    "If the new account name is even slightly different from the current one, your badge will be reviewed",
    [
    
      { text: "CANCEL" },
    
      
      { text: "CONTINUE", onPress: () => this.props.navigation.navigate("banksettings", {accountNGN:this.state.accountNGN})},
       
    ],

    { cancelable: false }
    
    );

  }  else {
 
   this.props.navigation.navigate("banksettings", {accountNGN:this.state.accountNGN})
   
  }

}

 banklinkAlert = () =>
  
 
  Alert.alert(
"Why do we ask you to link all your bank accounts?",
"This is to ensure an uninterrupted savings. Also, you only get paid after linking all your bank accounts successfully",
[

   { text: "LATER" },

   
   { text: "CONTINUE", onPress: () => this.props.navigation.navigate("okrapay", {phonenumber:this.state.phonenumber})},
    
],
{ cancelable: false }

);

  
  render() {

    const {linkedBanks} = this.state;


    return (
    
      

      <View style={styles.container}>

 

     <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer} refreshControl={
         
         
         
         <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
   />}>
     
     <View style={{flex: 3,   justifyContent:'center'}}>
      
             
      <Avatar  style={styles.dp}
                rounded
               uri={this.state.dpurl}
                size={'default'}
                placeholderSource={require('../assets/images/avatarplaceholder.jpg')}
                interactive
                
               // onChange
                onPress={this.openImagePickerAsync}
            />
 
  
      <View style={styles.biox}>

   
      <Text style={styles.lightText}>
          {this.state.name} </Text>

          {this.state.vip == 'yes' ?
     <Avatar   style={styles.badge} rounded  source={require('../assets/images/badge.jpg')}  />   
      : false }

</View>

<View style={styles.bio}>

 
        <Text style={styles.graytext}>
        {this.state.phonenumber}</Text>
  
  <Text style={styles.graytext}>
  {this.state.email}  </Text>

      
        </View>
  
      </View>     
  
  
             
<View style={styles.flexy}>
  

<Switch
 trackColor={{ false: 'gray', true: 'teal' }}
 thumbColor={this.state.toggle ? '#f5dd4b' : '#f4f3f4'}
 ios_backgroundColor="#3e3e3e"
 value={this.state.toggle}
 onValueChange={(toggle)=>this.setState({toggle})}
 onChange={()=>this.toggleSignin() }
 
 
/>   


<Text>Keep me signed in</Text>


     </View>


      <View
    style={{
      borderBottomColor: 'silver',
      borderBottomWidth: 0.5,
    }}
  />
    
      <View style={styles.bio}>
           
      <Text style={styles.graytext}>
        Your money will be sent here when it is your turn to collect. Also, if you create a group, this bank details may be visible to the group </Text>

  <Text style={styles.lightText}> {this.state.bank} </Text>
   
         <View style={styles.welcomeContainer}>
  
            <Text style={styles.lightText}> {this.state.acctnum} </Text> 
  
          </View>


      </View>     
  
  
        <View style= {styles.fixToText}> 

            <Button title="Manage Account" onPress={() => this.verAlert() }>
            
          </Button>

          </View>

      
{this.state.linkbank &&
  
  <View style={styles.tabBarInfoContainer}>

 
    <TouchableOpacity   onPress={() => this.props.navigation.navigate("okrapay", {phonenumber:this.state.phonenumber, linkedBanks:this.state.linkedBanks})}>
  

           <Text style={{ color: 'white', fontWeight:'bold', fontSize: 12}}>LINK YOUR BANK ACCOUNTS  | {linkedBanks} LINKED</Text>
        
  
  </TouchableOpacity>

  </View>

 
  
  }

      </ScrollView>
  
  
      </View>
   
  );
}

}  
  

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  dp:{ width: 100, height: 100, borderRadius: 100/2,alignSelf:'center'}
  ,

  badge:{ width: 13, height: 13, borderRadius: 13/2}
,
  
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
     

fixToText: {
    
 flex: 1,
  width: 400,
  alignSelf:'center',
  alignItems:'center',
  paddingBottom:70,

},
  graytext: {
    marginBottom: 10,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    flexGrow:1,
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  bio: {
    alignItems: 'center',
    marginHorizontal: 50,
    flex: 1,  
     
  },

  biox: {
    alignItems: 'center',
    marginHorizontal: 50,
    flex: 1,  
  alignItems: 'center',
  alignContent:'center',
  flexDirection: 'row',
  justifyContent:'center'

  },

  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  lightText: {
    fontSize: 17,
    color: 'teal',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgb(0,0,0)',
    textAlign: 'center',
  },
  
  
    
  flexy: {

    flex: 1,

    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom:70,
 
},
  
});
