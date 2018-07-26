import React, { Component } from 'react';
import { Text, ActivityIndicator, ListView, Image, View, Button, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Picker, Animated, TouchableOpacity } from 'react-native'
import axios from 'axios';
import geolib from 'geolib';
import AnimatedMap from './animatedMap'

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let data = {};

export default class SearchResult extends Component {

    static navigationOptions = {
        title: 'Entreprises',
        tabBarIcon: () => {
            return <Image source={require('../assets/icons/resultNav.png')} style={{ width: 28, height: 28 }} />
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            coordonnees: {
                latitude: this.props.navigation.state.params.coordonnees.latitude,//47.24921510000001,
                longitude: this.props.navigation.state.params.coordonnees.longitude, //-1.5930484999999999,
            },
            APEcode: this.props.navigation.state.params.APEcode,
            radius: this.props.navigation.state.params.radius,
            keyWords: this.props.navigation.state.params.keyWords,
            minStaff: this.props.navigation.state.params.minStaff,
            maxResults: this.props.navigation.state.params.maxResults,
            report: null,
            companies: [],
            companiesToLocalize: [],
            iconWidth: 50,
            iconHeight: 50,
            iconSelected: require('../assets/icons/fullStar2.png'),
            iconUnselected: require('../assets/icons/emptyStar2.png'),
            iconClientSelected: require('../assets/icons/fullClient.png'),
            iconClientUnselected: require('../assets/icons/emptyClient.png'),
            iconMap: require('../assets/icons/fullLocalize.png'),
            iconFilter: require('../assets/icons/filterBlack.png'),
            sortedData: data,
            dataSource: ds.cloneWithRows(data),
            option: 'd_asc',
            value: "",
            notification: "",
            opacity: new Animated.Value(0),
            offset: new Animated.Value(0),
            isStyled: false
        }
        this.fetchCompanies();
    }
  /*  componentDidMount () { 
        
      } */
    sortListView(option) {
        let array = this.state.companies;
        let sortedData;
        switch (option) {
            case 'd_asc':
                sortedData = array.sort((a, b) => {
                    return  b.distance < a.distance  ? 1
                            : b.distance > a.distance ? -1
                            : 0
                })
                this.setState({
                    option: option, companies: sortedData
                });
                break;
            case 'd_desc':
                sortedData = array.sort((a, b) => {
                    return b.distance < a.distance  ? -1
                           : b.distance > a.distance ? 1
                           : 0
                })
                this.setState({
                    option: option, companies: sortedData
                });
        }

    }
    fetchCompanies() {
        let words = this.state.keyWords;
        let maxResults = this.state.maxResults == null ? 3 : this.state.maxResults;
        let radius = this.state.radius == null ? 1000 : this.state.radius * 100;
        let coords = this.state.coordonnees;

        console.log('words  '+ String(words));
        console.log('max result  '+ String(maxResults));
        console.log('latitude   '+String(coords.latitude));
        console.log('longitude   '+String(coords.longitude));
        console.log('radius   '+ String(radius));

        axios.get('http://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene%40public&q=' + String(words) + '&lang=fr&rows=' + String(maxResults) + '&geofilter.distance=' + String(coords.latitude) + '%2C' + String(coords.longitude) + '%2C' + String(radius))
        //axios.get('http://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene%40public&q=menuiserie&lang=fr&rows=20&geofilter.distance=47.2378622%2C-1.5909941%2C150000')
        .then((response) => {
                let companies = [];
                response.data.records.forEach(function (element) {

                    AsyncStorage.getItem(element.recordid).then((result) => {
                        if (result !== null) {
                            companies.push(JSON.parse(result));
                        } else {
                            var company = {
                                id: element.recordid,
                                name: element.fields.l2_normalisee||element.fields.l1_normalisee ,
                                activity: element.fields.libapen,
                                activityInfos: element.fields.modet,
                                monoActivity: element.fields.libmonoact,
                                activityNature: element.fields.activnat,
                                auxiliaryActivity: element.fields.auxilt,
                                category: element.fields.categorie,
                                juridicNature: element.fields.libnj,

                                siren: element.fields.siren,
                                siret: element.fields.siret,
                                creationOrigin: element.fields.origine,
                                creationDate: element.fields.dcren,
                                departement: element.fields.du,
                                adress: element.fields.l4_normalisee + ' ' + element.fields.l6_normalisee+ ' ' + (element.fields.l3_normalisee ? element.fields.l3_normalisee:'') ,
                                ad_street: element.fields.l4_normalisee.toLowerCase(),
                                ad_city: element.fields.l6_normalisee,
                                ad_complement: element.fields.l3_normalisee ? element.fields.l3_normalisee:'',
                                sizeRange: element.fields.libtefet,
                                coordinates: {
                                    latitude: element.fields.coordonnees[0],
                                    longitude: element.fields.coordonnees[1]
                                },
                                distance: (geolib.getDistance(this.state.coordonnees, { latitude: element.fields.coordonnees[0], longitude: element.fields.coordonnees[1] })) / 1000,
                                fav: false,
                                client: false,
                            };
                            companies.push(company);
                        }
                        this.setState({ companies: companies });
                    })
                }.bind(this));
                this.setState({ report: response.data });
            }).catch((error) => {
                alert(error.message);
            });
    }

    favOnRate(obj) {
        let companiesList = this.state.companies;
        let index = companiesList.findIndex(elem => elem.id == obj.id);
        if (obj.fav == false) {
            obj.fav = true;
            companiesList[index] = obj;
            AsyncStorage.setItem(obj.id, JSON.stringify(obj));
        } else {
            obj.fav = false;
            companiesList[index] = obj;
            AsyncStorage.removeItem(obj.id);
        }
        this.setState({ companies: companiesList });
    }

    clientOnRate(obj) {
        let companiesList = this.state.companies;
        let index = companiesList.findIndex(elem => elem.id == obj.id);
       if (obj.client == false) {
            obj.client = true;
            companiesList[index] = obj; 
            AsyncStorage.setItem(obj.id, JSON.stringify(obj));
        } else {
            obj.client = false;
            companiesList[index] = obj;
            AsyncStorage.removeItem(obj.id);
        }
        this.setState({ companies: companiesList });
    }

    /*deleteCompanies() {
        this.setState({ companies: [] });
    }*/

    localiseCompany(obj) {
        let company = [obj];
        this.props.navigation.navigate('AnimatedMap', { selectedCompany: company, coordonnees: this.state.coordonnees })

    }

    localiseAllCompanies() {
        console.log('methode!!');
        this.props.navigation.navigate('AnimatedMap', { companies: this.state.companies, coordonnees: this.state.coordonnees })

    }

  render() {
    if (this.state.report === null ) {
        return (
            <View style={styles.noData}>
                <ActivityIndicator color='#00C9B5' size='large' />
            </View>
        )
    } else {
        //const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        

        return (
           /* <Animated.View style={[styles.notification, notificationStyle]} ref={notification => (this._notification = notification)}>
                        <Text style={styles.notificationText}>
                            {this.state.notification}
                        </Text>
                    </Animated.View>
                <View style={styles.headerInfo} ><Text style={styles.headerSection} Color='#FFF' >Trier par</Text><Text style={styles.headerSection} Color='#FFF'>Localiser toutes les entreprises</Text></View>

*/
            <View style={styles.container}>
                <ListView
                    
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={ds.cloneWithRows(this.state.companies)}
                    renderRow={(row) =>

                    
                        <View style={styles.rowContainer}>
                           
                            <View style={styles.rowInfos} >
                                <View style={styles.rowInfosDetail}>
                                    <Text style={styles.title}>Nom:</Text>
                                    <Text style={styles.title}>Domaine:</Text>
                                    <Text style={styles.title}>Ville:</Text>
                                    <Text style={styles.title}>Distance:</Text>
                                </View>
                                <View style={styles.rowInfosDetail}>
                                    <Text numberOfLines={1} style={styles.value} >{row.name}</Text>
                                    <Text numberOfLines={1} style={styles.value} >{row.activity}</Text>
                                    <Text numberOfLines={1} style={styles.value} >{row.ad_city}</Text>
                                    <Text numberOfLines={1} style={styles.value} >{row.distance} Km</Text>
                                </View>
                            </View>

                            

                            <View style={styles.actions} > 
                                <TouchableWithoutFeedback
                                    disabled={false}
                                    // style={{ height: 50 , width: 65 }}
                                    onPress={() => this.favOnRate(row)}>
                                    <Image style={styles.touchableImage}
                                        source={row.fav == true ? this.state.iconSelected : this.state.iconUnselected} />
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback
                                    disabled={false}
                                    //style={styles.touchable}
                                    onPress={() => this.clientOnRate(row)}>
                                    <Image style={styles.touchableImage}
                                        source={row.client == true ? this.state.iconClientSelected : this.state.iconClientUnselected} />
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback
                                    disabled={false}
                                    //style={styles.touchable}
                                    onPress={() => this.localiseCompany(row, this.state.coordonnees)}>
                                    <Image style={styles.touchableImage}
                                        source={this.state.iconMap} />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    }
                />
               

                <View style={styles.wrapPicker}>
                        <Picker
                           
                            style={styles.picker}
                            mode='dropdown'
                            selectedValue={this.state.option}
                            onValueChange={(itemValue, itemIndex) => this.sortListView(itemValue)}>
                            <Picker.Item label="distance croissante" value="d_asc" color='#343434' />
                            <Picker.Item label="distance décroissante" value="d_desc" color='#343434' />
                            <Picker.Item label="effectif croissant" value="e_asc" color='#343434' />
                            <Picker.Item label="effectif décroissant" value="e_desc" color='#343434' />
                        </Picker>
                        <Image style={styles.filter} source={this.state.iconFilter} />
                    </View>

                <View style={styles.searchAll}>
                        <TouchableWithoutFeedback
                            style={{ width: 60, height: 60, }}
                            onPress={() => this.localiseAllCompanies()}>
                            <Image
                                style={styles.searchButton}
                                source={require('../assets/icons/allMarkers.png')}
                            />
                        </TouchableWithoutFeedback>
                    </View>

            </View>
        )
    }
  }
}

const blue = '#6C8EB3'
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EDF7FF',
        flex: 1
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    test: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
   /* headerInfo: {
        backgroundColor: '#B9D6E2',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },*/
    header: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        height:70,
        left:18

    },
    headerSection: {
        color: '#FFF',
    },
    filter: {
        width: 25,
        height: 25,
        left: -40,
        backgroundColor:'white'

    },
    title: {
        fontWeight: 'bold',
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: 12
    },
    value: {
        marginLeft: 5,
        //marginRight: 5,
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: 12,
        width: 280

    },
    rowInfosDetail: {
        flexDirection: 'column',
        justifyContent: 'center',
      //  padding:10
       // right:20
    },
    input: {

        height: 40,
        width: 250,
        top: 0,
        left: 0,
        borderColor: 'blue',
        paddingHorizontal: 10,
        borderWidth: 1,
        marginBottom: 0
    },
    iconsContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#D0E3EC',
        width: 200,
        paddingVertical:5,
        borderBottomWidth:1
    },
    list: {
        backgroundColor: '#D0E3EC',
        
        
    },
    rowContainer: {
        flex: 1,
        margin: 5,
        top:30,
        alignItems: 'center',
        flexDirection: 'column',
       // padding:10

    },
    rowInfos: {
      //  flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        padding: 15
        ,
        //borderWidth: 0,
        backgroundColor: '#45ABB4',
        width: 380

    },
    buttonRow: {
        margin: 5,
        width: 200

    },

    touchable: {
        width: 40,
        height: 40
    },
    actions:{
        flexDirection: 'row',
    },
    touchableImage: {
        height: 30,
        width: 30
    },
    searchButton: {
        width: 60,
        height: 60

    },
    notification: {
        position: "absolute",
        paddingHorizontal: 7,
        paddingVertical: 15,
        left: 0,
        top: 0,
        right: 0,
        backgroundColor: "rgba(255, 185, 66,1)",
    },
    notificationText: {
        color: "#FFF",
    },

    notifContainer: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    notifButton: {
        backgroundColor: "tomato",
        padding: 15,
        marginTop: 10,
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
    },
    picker: {
        width: 200,
        backgroundColor: 'white', //rgba(255, 255, 255,0)
        height: 20
    },
    wrapPicker: {
        borderRadius: 10,
        flexDirection: 'row',
        padding: 3,
        left:100,
        alignItems: 'center',
        position:'absolute',
        backgroundColor: 'white'//'#EDF7FF',
    }, searchAll: {
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 326,
        height: 60,
        width:70,
        bottom:15,
        backgroundColor: '#EDF7FF',
        elevation:3,
        borderRadius: 10,
       position:'absolute',
    },


});

