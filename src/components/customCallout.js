
import React, { Component } from 'react'
import { StyleSheet, View, Text,TouchableWithoutFeedback,Image } from 'react-native'

export default class CustomCallout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconFav: require('../assets/icons/fullStar.png'),
            iconNotFav: require('../assets/icons/emptyStar2.png'),
            iconClient: require('../assets/icons/fullClient.png'),
            iconNotClient: require('../assets/icons/emptyClient.png'),
            iconInfo: require('../assets/icons/info.png'),
            iconNav: require('../assets/icons/GO2.png')
        }
    }

    render() {
        const { spot } = this.props;
        let adress = spot.adress;
        console.log(spot.adress);
        return (
            <View>
                         <Image source={this.state.iconNav} style={{width:40, height:40}}/>
                        {/*  <Text style={{ marginBottom: 5, color: 'black' }}>
                            {spot.adress}
                        </Text>
                        <Text style={{ color: 'black' }}>
                            {spot.name}
                        </Text> */}
                        
                         
            </View>


           /* 

            <Text style={{ marginBottom: 5, color: 'black' }}>
                            {spot.title}
                        </Text>
           
           /* <Text style={{ marginBottom: 5, color: 'black' }}>
                            {spot.title}
                        </Text>
           
           
           
           <View >
                <View style={{ flexDirection: 'row', elevation: 5 }}>
                    <View
                        style={{
                            backgroundColor: '#8BA8C9',
                            padding: 10,
                            borderTopLeftRadius: 10,
                            //borderBottomLeftRadius: 10,
                            height: 80,
                            width: 60,
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }}>
                        <Image style={{ height: 80, width: 80 }} source={this.state.iconInfo} />
                    </View>
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderTopRightRadius: 10,
                            //borderBottomRightRadius: 10,
                            height: 80,
                            width: 250,
                            // justifyContent         : 'center'
                        }}>
                        <Text style={{ marginBottom: 5, color: '#78909C' }}>
                            {spot.title}
                        </Text>
                        <Text style={{ marginBottom: 5, color: '#78909C' }}>
                            {adress}
                        </Text>
                        <Text style={{ marginBottom: 5, color: '#78909C' }}>
                            {spot.description}
                        </Text>
                    </View>
                    

                </View>
                <View style={{
                            flexDirection: 'row',
                            backgroundColor: '#CFD8DC',
                            
                            //borderBottomColor : '#BE57CC',
                            padding: 5,
                            borderColor: '#BE57CC',
                            borderBottomWidth: 2,
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10,
                            height: 40,
                            width: 310,
                            // justifyContent         : 'center'
                        }}>

                    <TouchableWithoutFeedback
                        disabled={false}
                        //style={{ height: this.state.iconHeight, width: 65 }} >
                        <Image style={{ height: 30, width: 30 }}
                            source={spot.fav == true ? this.state.iconFav : this.state.iconNotFav} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        disabled={false}
                        //style={styles.touchable}>
                        <Image style={{ height: 30, width: 30 }}
                            source={spot.client == true ? this.state.iconClient : this.state.iconNotClient} />
                    </TouchableWithoutFeedback>

                </View>



            </View>
*/

        )
    }
}

/*<Image style={{ height: 100, width: 100 }}
                        source={spot.require('./icons/fullLocalize.png')} />
                    <Image style={{ height: 100, width: 100 }}
                        source={require('./icons/fullLocalize.png')} />
                    <Image style={{ height: 100, width: 100 }}
                        source={require('./icons/fullLocalize.png')} />
*/