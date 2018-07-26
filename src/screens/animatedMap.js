import React, { Component } from "react";
import {AppRegistry,StyleSheet,Text,View,ScrollView,Animated,Image,Dimensions,TouchableOpacity,ActivityIndicator,Linking,} from "react-native";
import MapView from "react-native-maps";
import CustomCallout from '../components/customCallout'



const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class screens extends Component {

//static finderActivated = false;
static navigationOptions = {
  title: 'Navigation',
  tabBarIcon: () => {
    return <Image source={require('../assets/icons/markerNav2.png')} style={{ width: 28, height: 28 }} />
  }
}
constructor(props) {
  super(props);
  //console.log("prop company" + JSON.stringify(this.props.navigation.state.params.companies));
  this.state = {
    companiesList: this.props.navigation.state.params.selectedCompany || this.props.navigation.state.params.companies,
    mapRegion: null,
    lastLat: this.props.navigation.state.params.coordonnees.latitude,//47.24921510000001,
    lastLong: this.props.navigation.state.params.coordonnees.longitude, //-1.5930484999999999,
    latDelta: 0.0622 * 0.4,
    longDelta: 0.0321 * 0.4,
    report: null,
    markers: [],
    favMarker: require('../assets/icons/favMarker2.png'),
    clientMarker: require('../assets/icons/clientMarker.png'),
    companyMarker: require ('../assets/icons/companyMarker2.png'),
    // visitedMarker: require('../assets/icons/visitedMarker.png'),
    standardMarker: require('../assets/icons/marker.png'),
    markerPressed: false

  }
}


componentWillMount() {
/*  let list = this.retrieveMarkers();
  this.setState({
    markers: list
  });*/
  this.index = 0;
  this.animation = new Animated.Value(0);
}
onRegionChange(region, lastLat, lastLong) {

  this.setState({

    mapRegion: region,
    // If there are no new values set the current ones
    lastLat: lastLat || this.state.lastLat,
    lastLong: lastLong || this.state.lastLong
  });
}

componentWillUnmount() {
  navigator.geolocation.clearWatch(this.watchID);
}
onMapPress(e) {
  let region = {
    latitude: e.nativeEvent.coordinate.latitude,
    longitude: e.nativeEvent.coordinate.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }
  this.onRegionChange(region, region.latitude, region.longitude);
}

componentDidMount() {
  // We should detect when scrolling has stopped then animate
/*  let refini = 0;
  var initialMarkerToShow = this.refs[String(refini)];
    console.log('marker to show    '  +initialMarkerToShow);  //initialMarkerToShow.showCallout();*/

  this.animation.addListener(({ value }) => {
    let index = Math.floor((value + 30) / (CARD_WIDTH)); //value + 30 pour choper la derniere carte de la scroll view

    if (index >= this.state.companiesList.length - 1) {
      index = this.state.companiesList.length - 1;
    }
    if (index <= 0) {
      index = 0;
    }
    console.log('scroll view  '+ this.state.markerPressed );
    if(!this.state.markerPressed){
    clearTimeout(this.regionTimeout);
    this.regionTimeout = setTimeout(() => {
      if (this.index !== index) {
        this.index = index;
        const { coordinates } = this.state.companiesList[index];
        var markerToShow = this.refs[String(index)];
      /* console.log('ref !!!   '+ index );
        console.log('test ref !!!   '+ markerToShow);*/
        //console.log('scroll view  '+ this.state.markerPressed );
        
          markerToShow.showCallout();
          this.map.animateToRegion(
            {
              ...coordinates,
              latitudeDelta: this.state.latDelta,
              longitudeDelta: this.state.longDelta,
            },
            0
          );
          
      }
    }, 5);
  };
  //this.state.markerPressed = false;
  });
}

/*showInitialMarker() {
  var initialMarkerToShow = this.refs['0'];
  initialMarkerToShow.showCallout();

}
*/

findCard(index) {
  // console.log('marker found !!!');
  console.log('index to scroll   ' + index)
  var scrollView = this.refs['myScroll'];
  scrollView._component.scrollTo({ x: CARD_WIDTH * index, y: 0, animated: true });
  this.state.markerPressed = true;
  console.log('find marker  '+ this.state.markerPressed );
  // console.log('component scroll  '+ this.myScroll);
}

render() {
  if (this.state.lastLat === null) {
    return (
      /*<Button onPress={() => this.submit()} title="Trouver une entreprise" color={globalStyle.color}/>
      <Button onPress={() => this.fetchCompanies()} title="Localiser les entreprises" color={globalStyle.color}/>*/
      <View>
        <ActivityIndicator size="large" />
      </View>

    )

  } else {
    const interpolations = this.state.companiesList.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * (CARD_WIDTH),
        ((index + 1) * (CARD_WIDTH)),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });

      return { scale, opacity };
    });


    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          //initialRegion={this.state.region}
          style={styles.container}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          region=/*{this.state.mapRegion}*/
          {{
            latitude: this.state.lastLat, //47.23916450000001,
            longitude: this.state.lastLong,//-1.6024515000000292,
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.longDelta,
          }}
          // onRegionChange={this.onRegionChange.bind(this)}
          onPress={this.onMapPress.bind(this)}
          fitToElements={true}
        >
          {this.state.companiesList.map((marker, index) => {


            return (
              <MapView.Marker ref={String(index)} pinColor={'#D1923A'} title={marker.title}
                coordinate={marker.coordinates}
                image={marker.fav == true ? this.state.favMarker : marker.client == true ? this.state.clientMarker : this.state.companyMarker}
                key={index}
                onPress={(e) => this.findCard(index)}
                onCalloutPress={e => Linking.canOpenURL('geo:' + marker.coordinates.latitude + ',' + marker.coordinates.longitude).then(supported => {
                  if (supported) {
                    Linking.openURL('geo:' + marker.coordinates.latitude + ',' + marker.coordinates.longitude + '?q=' + marker.adress);
                    //Linking.openURL('http://maps.google.com?q=894%20Granville%20Street%20Vancouver%20BC%20V6Z%201K3')
                    // Linking.openURL('http://maps.google.com?q='+marker.adress);
                    //Linking.openURL('geo:'+marker.adress)
                  } else {
                    Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.maps&hl=fr');
                  }
                }).catch(err => console.error('An error occurred', err))}>

                <MapView.Callout tooltip={true} style={styles.callout}>
                  <CustomCallout spot={marker} />
                </MapView.Callout>
              </MapView.Marker>
            );
            //
          })}
        </MapView>
        <Animated.ScrollView
          decelerationRate={0}
          ref={'myScroll'}
          snapToAlignment={"center"}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          horizontal
          // snapToInterval={CARD_WIDTH}
          onMomentumScrollBegin={()=>{this.state.markerPressed = false}}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}>
          {this.state.companiesList.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };

            return (
              <Animated.View style={[styles.card, opacityStyle]} key={index}>

                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>{marker.distance} Km</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>{marker.ad_street}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>{marker.ad_city}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>{marker.ad_complement}</Text>
                </View>
                    <Animated.View style={[styles.ring, scaleStyle, opacityStyle]} />
                   </Animated.View>
            )
          }
          )}
        </Animated.ScrollView>


      </View>
    );
  }
}
}
/*<Animated.View style={[styles.markerWrap, opacityStyle]}>
                <Animated.View style={[styles.ring, scaleStyle]} />
                <View style={styles.marker} />
              </Animated.View>*/

const styles = StyleSheet.create({
container: {
  flex: 1,
},
scrollView: {
  position: "absolute",
  bottom: -10,
  left: -10,
  right: 0,
  //paddingVertical: 5,
  height: 140
},
endPadding: {
  paddingRight: width - CARD_WIDTH,
},

card: {
  //padding: 10,
  //elevation: 2,
  backgroundColor: 'rgba(251,251,255,1)',//'#D0E3EC',         
  marginHorizontal: 10,
  left: 10,
  borderRadius:10,
  
  //bottom:5,


  /* shadowColor: "#990033",
    shadowRadius: 10,
    shadowOpacity: 0.5,
    shadowOffset: { x: 10, y: -10 },*/
  height: CARD_HEIGHT-60,
  width: CARD_WIDTH - 20, //pour eviter que les cartes se decalent !!! IMPORTANT
  overflow: "visible",
},
cardImage: {
  flex: 3,
  width: "100%",
  height: "100%",
  alignSelf: "center",
},
textContent: {
  flex: 1,
  top: 10,
  marginHorizontal: 10,
},
cardtitle: {
  fontSize: 12,
  fontWeight: "bold",
},
cardDescription: {
  fontSize: 12,
  color: "#444",
},
markerWrap: {
  
  height: 20

},
marker: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#006A98",
},
ring: {
  // alignItems: "center",
  justifyContent: "center",

  width: 45,
  height: 3,
  bottom: 5,
  borderRadius: 12,
  backgroundColor: "rgba(0,191,178,1)",//"rgba(17,157,164, 1)",
  left:((CARD_WIDTH-20)/2)-(45/2)
  // position: "absolute",
  /*borderWidth: 0.5,
  borderColor: "rgba(124,252,255, 0.5)",*/
  
},
callout: {
  flex: 1,
  position: 'relative'
},
indicator: {
  height: 10,
  width: CARD_WIDTH,
  backgroundColor: '#28BEFF',
  bottom: 30
},

});
