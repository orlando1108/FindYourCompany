import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, Button, TextInput, Slider, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import AnimatedMap from './animatedMap';
import Result from './searchResult';
import { PermissionsAndroid } from 'react-native';

let watchID = null;

class Search extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        APEcode: '',
        radius: 150,
        keyWords: 'menuiserie',
        minStaff: '',
        maxResults: '20',
        coordonnees: {},
        infoRadius: 0,
        lastPosition: ''

    }
   // this.requestCameraPermission();
   // this.getCurrentLocation();
}

componentWillMount(){
    //this.requestCameraPermission();
   //this.getCurrentLocation();
 }
componentDidMount(){
  this.requestCameraPermission();
  this.getCurrentLocation();
}
componentWillUnmount(){
 // navigator.geolocation.clearWatch(this.watchID);
}


 async requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'FindCompany needs access to your location ' +
                   'so you can search companies arround you.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use your location")
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

static navigationOptions = ({ navigation }) => {
  return {
      title: 'Recherche ',
      tabBarIcon: () => {
          return <Image source={require('../assets/icons/targetNav2.png')} style={{ width: 28, height: 28 }} />
      }
  }
}

getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
      (position) => {
          let coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
          }
          this.setState({ coordonnees: coords });
         console.log('coords ' + coords.latitude);
      },

      (error) => alert(error.message),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
  );
  this.watchID = navigator.geolocation.watchPosition((position) => {
    const lastPosition = JSON.stringify(position);
    this.setState({ lastPosition });
 });
}

goToSearchResult() {
  this.props.navigation.navigate('Result', {
      coordonnees: this.state.coordonnees,
      APEcode: this.state.APEcode,
      radius: this.state.radius,
      keyWords: this.state.keyWords,
      minStaff: this.state.minStaff,
      maxResults: this.state.maxResults,
  })
}
  render() {
    return (
      
      <View style={styles.container} >

                <View style={styles.form}>
                    <View style={styles.group}>
                        <Text style={styles.text} >code APE:</Text>
                        <View style={styles.wrapInput}>
                            <TextInput
                                selectionColor='#006A98'
                                style={styles.input}
                                keyboardType='default'
                                maxLength={5}
                                underlineColorAndroid='transparent'
                                onChangeText={(code) => this.setState({ APEcode: code })}
                                value={this.state.APEcode}/>
                        </View>
                    </View>

                    <View style={styles.groupSlider}>
                        <Text style={styles.text} >rayon:</Text>
                        <View style={styles.wrapSlider}>
                            <Text style={styles.valueSlider} >{this.state.infoRadius}</Text>
                            <Slider
                                style={{ width: 300, height: 30 }}
                                step={1}
                                thumbTintColor='#006A98'
                                minimumValue={1}
                                maximumValue={250}
                                value={this.state.radius}
                                onValueChange={val => this.setState({ infoRadius: val })}
                                onSlidingComplete={val => this.setState({ radius: val })} />
                        </View>
                    </View>

                    <View style={styles.group}>
                        <Text style={styles.text} >mots clés:</Text>
                        <View style={styles.wrapInput}>
                            <TextInput
                                style={styles.input}
                                selectionColor='#006A98'
                                keyboardType='default'
                                underlineColorAndroid='transparent'
                                onChangeText={(words) => this.setState({ keyWords: words })}
                                value={this.state.keyWords}/>
                        </View>
                    </View>
                    <View style={styles.group}>
                        <Text style={styles.text} >nombre minimum de salariés:</Text>
                        <View style={styles.wrapInput}>
                            <TextInput
                                style={styles.input}
                                selectionColor='#006A98'
                                keyboardType='numeric'
                                underlineColorAndroid='transparent'
                                onChangeText={(min) => this.setState({ minStaff: min })}
                                value={this.state.minStaff}/>
                        </View>

                    </View>
                    <View style={styles.group}>
                        <Text style={styles.text} >nombre maximum de resultats:</Text>
                        <View style={styles.wrapInput}>
                            <TextInput
                                style={styles.input}
                                selectionColor='#006A98'
                                keyboardType='numeric'

                                underlineColorAndroid='transparent'
                                onChangeText={(max) => this.setState({ maxResults: max })}
                                value={this.state.maxResults}/>
                        </View>
                    </View>
                    <View style={styles.search}>
                        <TouchableWithoutFeedback
                            style={{ width: 60, height: 60 }}
                            onPress={() => this.goToSearchResult()}>
                            <Image
                                style={styles.searchButton}
                                source={require('../assets/icons/search.png')}/>
                        </TouchableWithoutFeedback>

                    </View>


                </View>

            </View>
    );
  }
}

const fontFamily = 'monospace'
const styles = StyleSheet.create({
    text: {
        fontFamily: fontFamily,
        color: '#858585',
        fontWeight: 'bold',
        margin: 10
    },
    valueSlider: {
        fontFamily: fontFamily,
        color: '#006A98'

    },
    form:{ 
        flex: 1, 
        flexDirection: 'column'
     },
    searchButton: {
        width: 60,
        height: 60
    },
    input: {
        height: 40,
        width: 100,
        fontFamily: fontFamily,
        color: '#006A98'
    },
    wrapInput: {
        borderRadius: 7,
        paddingHorizontal: 10,
        elevation: 2
    },
    group: {
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10,

    },
    groupSlider: {
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center',

    },
    wrapSlider: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    search: {
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 30
    },
    container: {
        backgroundColor: '#EDF7FF',
        flex:1
    }, headerTitle: {
        color: '#FFF',
    },
    header: {
        backgroundColor: "#006A98",
    },
})

const navigationOptions = {
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle
}

export default StackNavigator({
  Search: {
      screen: Search,
      navigationOptions
  },
  Result: {
      screen: Result,
      navigationOptions
  },
  AnimatedMap: {
      screen: AnimatedMap,
      navigationOptions
  },
})
