import React, { Component } from 'react';
import {Platform,View,StatusBar} from 'react-native';
import {TabNavigator} from 'react-navigation';
import Search from './src/screens/search';
import Favorites from './src/screens/favorites';


const Tabs = TabNavigator({
  Search: {
    screen: Search
  },
  Favorites: {
    screen: Favorites
  }
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    initialRouteName: Search,
    indicatorStyle: {
      height: 3,
      backgroundColor: '#00C9B5'

    },
    style: {
      backgroundColor: "#006A98",
      borderTopWidth: 0,
      borderColor: "#3f101c",
      height: 65
    }
  }
})

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View
          style={{
          backgroundColor: '#006A98',
          height: 24
        }}></View>
        <StatusBar hidden={false} translucent={true}/>
        <Tabs/>
      </View>
    );
  }
}
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 10,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
*/