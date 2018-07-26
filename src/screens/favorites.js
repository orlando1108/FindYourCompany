import React, { Component } from 'react';
import {Text,View,Image} from 'react-native';



export default class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
        favList: [],
        coordonnees: {},
        iconSelected: require('../assets/icons/fullStar2.png'),
        iconUnselected: require('../assets/icons/emptyStar2.png'),
        iconClientSelected: require('../assets/icons/fullClient.png'),
        iconClientUnselected: require('../assets/icons/emptyClient.png'),
        iconMap: require('../assets/icons/fullLocalize.png'),

    }

}
static navigationOptions = ({ navigation }) => {
  return {
      title: 'Favoris ',
      tabBarIcon: () => {
          return <Image source={require('../assets/icons/fav.png')} style={{ width: 28, height: 28 }} />
      }
  }
}
  render() {
    return (
      <View style={{ flex: 1}}>
      <Text>FAVORITES</Text>
      </View>
    );
  }
}
