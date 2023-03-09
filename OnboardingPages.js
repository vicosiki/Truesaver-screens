import  React, { Component} from 'react';
import {View, Text, StatusBar, Image, StyleSheet,ImageBackground,TouchableOpacity, Alert} from 'react-native';
import { Button } from 'react-native-elements';



 
export default class OnboardingPages extends Component  {
 
  constructor(props) {
    super(props);
 
}


accounttypeAlert = () =>
Alert.alert(
   "Account Type",
   `What type of account would you like to create? If you choose a Dollar account, we'll use PayPal to settle you. If you do not have a PayPal account, please signup for one first. You can switch at anytime.`,


   [

    { text: " ($) Dollar Account", onPress: () =>this.props.navigation.navigate("SignUpPaypal") },

    { text: "(₦) Naira Account", onPress: () =>this.props.navigation.navigate("SignUp") }
 
   ],
   
   { cancelable: true }

   );



render() {
  
  
  return (


    <ImageBackground source={require('../assets/images/tslayout.png')} 
    style={{ flex: 1,
    width: null,
    height: null,
    }}
>

<View style= {styles.container}>

<StatusBar hidden={true}/>

<View style= {styles.favview}>
<Image
source={require("../assets/images/fav.png")}
style={styles.fav}/>
</View>
<View style= {styles.contview}><Text style= {styles.textstyle} >The best way to Save, Lend & Borrow</Text>
<View style= {styles.fixToText}> 
<Button title='Create account' raised={true} onPress={() => this.props.navigation.navigate("SignUp") }>
</Button>
</View>


</View>

<TouchableOpacity  style={{paddingTop: 20}} onPress={() => this.props.navigation.navigate("SignIn")}>

<View style= {styles.butview}>
<Text style= {styles.basetextstyle}> Have an account already? Log in </Text>
</View>

</TouchableOpacity>

</View>

</ImageBackground>

    
    );
  }
}

   


const styles = StyleSheet.create({
     
  container: {
    flex:1,
    justifyContent:'space-between',
     
  },

  favview: {
    flex:1,
    alignItems:'center',
    paddingTop:50
  },

  contview: {
    flex:2,
    paddingTop:30
    
  },

  butview: {
        paddingBottom:30,
        paddingLeft:30,
         
     
    
  },

  butstyle: {
    paddingTop:30
     
  },

  fav:{ width: 40, height: 40, borderRadius: 40/2 
},

fixToText: {
    
  paddingTop:40,
    alignItems:'center',

  },

basetextstyle: {
    
  fontSize:15,
  fontWeight:'bold',
  color: '#008080'

  

},

  textstyle: {
    
    fontSize:30,
    fontWeight:'bold',
    paddingLeft: 30,
    paddingRight: 20,

    color: '#008080'

    

 }

});