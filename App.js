import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, ScrollView, Alert, ToastAndroid, Keyboard, FlatList, Modal, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
const Stack = createStackNavigator();
import { Formik } from 'formik';
import { AntDesign } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { BlurView } from 'expo-blur';
import * as yup from 'yup';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';
import tyre from './assets/wheelone.png';

function Separator() {
  return <View style={styles.separator} />;
}


function CustomHeader({ navigation, header }) {
  const db = SQLite.openDatabase("details.db");
  const [forceUpdate, forceUpdateId] = useForceUpdate()
  const [modelwheel, setModelwheel] = useState(false);
  const [twowheeldetails, setTwowheeldetails] = useState(null);
  const [fourwheeldetails, setFourwheeldetails] = useState(null);


  return (
    <View style={{ flexDirection: 'row', height: 60, borderWidth: 1, borderColor: '#101010' }}>




      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Text style={{ fontSize: 21, fontWeight: 'bold', color: 'red' }}>{header}</Text>
      </View>



    </View >
  )
}

function CustomHead({ navigation, header }) {
  return (
    <View style={{ flexDirection: 'row', height: 60, borderWidth: 1, borderColor: '#101010' }}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
        <Ionicons name="md-arrow-round-back" size={28} color="yellowgreen" />
      </TouchableOpacity>

      <View style={{ flex: 1.5, alignItems: 'center' }}><Text style={{ fontSize: 21, fontWeight: 'bold', color: 'red' }}>{header}</Text></View>
      <View style={{ flex: 1 }}></View>

    </View>
  )
}


function Customindividual({ navigation, header }) {
  return (
    <View style={{ flexDirection: 'row', height: 60, }}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
        <Ionicons name="md-arrow-round-back" size={28} color="yellowgreen" />
      </TouchableOpacity>

      <View style={{ flex: 7, alignItems: 'center', marginRight: 15, marginTop: 5 }}><Text style={{ fontSize: 21, fontWeight: 'bold', color: 'red' }}>{header}</Text></View>

    </View>
  )
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];

}

function Fun({ onPressItem, navigation }) {
  const db = SQLite.openDatabase("details.db");
  const [fun, setFun] = useState(null);

  useEffect(() => {
    db.transaction(tx => {

      tx.executeSql(
        `select * from itemson ;`,
        [],
        (_, { rows: { _array } }) =>
          setFun(_array)
      );

    });
  }, []);

  if (fun === null || fun.length === 0) {
    return null;
  }

  return (
    <View>
      <FlatList
        data={fun}
        renderItem={({ item }) => (

          <TouchableOpacity
            key={item.id}

            onLongPress={() =>
              Alert.alert(
                "DELETE PERSON",
                ("delete "),
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "OK", onPress: () =>
                      onPressItem && onPressItem(item.id)
                  }

                ],
                { cancelable: false }
              )


            }
            onPress={() => navigation.navigate('IndividualsInfo', item)}
            style={styles.textt}
          >

            <View style={{ flex: 1, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>

            </View>

          </TouchableOpacity>
        )}

        keyExtractor={(item) => (item.id).toString()}

      />

    </View>

  )

}


function Home({ navigation }) {

  const db = SQLite.openDatabase("details.db");
  const [forceUpdate, forceUpdateId] = useForceUpdate()
  const [datevisiblity, setDatevisibility] = useState(false);
  const [choosedate, setChoosedate] = useState('DD-MM-YYYY');


  const datecancel = () => {
    setDatevisibility(false);
  }
  const dateconfirm = (date) => {

    const data = moment(date).format('MMMM, Do')
    setChoosedate(data.toString());
    datecancel();
  }

  const touchshow = () => {
    setDatevisibility(true);
  }
  const [checked, setChecked] = useState('2');

  const [details, setDetails] = useState(null);
  useEffect(() => {
    db.transaction(tx => {

      tx.executeSql(
        "create table if not exists itemson (id integer primary key not null, name text, place text,advance text,hour text,minutes text,choosedate text,wheeler text);"
      );
      tx.executeSql(
        `select * from itemson;`,
        [],
        (_, { rows: { _array } }) =>
          setDetails(_array)
      );
    });
  }, []);

  const nData = (data) => {

    db.transaction(
      tx => {
        tx.executeSql("insert into itemson (name, place, advance,hour,minutes,choosedate,wheeler) values (?, ?,?, ?, ?, ?, ?)", [data.name, data.place, data.advance, data.hour, data.minutes, (choosedate).toString(), checked]);
        tx.executeSql(
          `select * from itemson ;`,
          [],
          (_, { rows: { _array } }) =>
            setDetails(_array)
        );
        tx.executeSql(
          "create table if not exists " + "" + data.name + "" + " (id integer primary key not null, advance text, hour text,minutes text,choosedate text,wheeler text);"
        );
        tx.executeSql("insert into " + "" + data.name + "" + " (advance,hour,minutes,choosedate,wheeler) values (?,?,?,?,?)", [data.advance, data.hour, data.minutes, choosedate, checked]);
      },
      console.log('data added'),
      forceUpdate

    );
  }



  const errorhandler = yup.object({

    name: yup.string().required().min(3),
    place: yup.string().required().min(3),
    advance: yup.string().required().min(1),
    hour: yup.string().required().min(1),
    minutes: yup.string().required().min(1),
  })

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: '#101010' }}>
        <View style={{ marginTop: Constants.statusBarHeight, marginBottom: 0 }}>
          <CustomHeader navigation={navigation} header={'HOME'} style={{ marginTop: Constants.statusBarHeight }} />
          <Text style={{ color: 'white', fontSize: 23, fontWeight: "bold", textAlign: 'center', marginVertical: 10 }}>Enter Details</Text>


          <Formik
            initialValues={{ name: '', place: '', advance: '', hour: '', minutes: '', choosedate: { choosedate }['choosedate'], checked: { checked }['checked'] }}
            validationSchema={errorhandler}
            onSubmit={(values, actions) => {
              nData(values);
              actions.resetForm();
            }}
          >
            {(props) => (
              <View style={{ padding: 38, paddingBottom: 10, paddingTop: 0 }}>
                <TextInput
                  style={styles.textinput, { borderWidth: 1, height: 40, color: 'white', backgroundColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}
                  placeholder='Enter Name'
                  onChangeText={props.handleChange('name')}
                  value={props.values.name}
                />
                <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.name && props.errors.name}</Text>
                <TextInput
                  style={styles.textinput, { borderWidth: 1, height: 40, color: 'white', backgroundColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}

                  placeholder='Enter place'
                  onChangeText={props.handleChange('place')}
                  value={props.values.place}

                />
                <Text style={{ fontSize: 10, color: 'white', marginBottom: 10 }}>{props.touched.place && props.errors.place}</Text>
                <TextInput
                  style={styles.textinput, { borderWidth: 1, height: 40, color: 'white', backgroundColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}
                  placeholder='Enter advance amount'
                  onChangeText={props.handleChange('advance')}
                  value={props.values.advance}
                  keyboardType='numeric'
                />
                <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.advance && props.errors.advance}</Text>
                <View style={{ flexDirection: 'row', marginBottom: 0, height: 40, }}>
                  <View style={{ flex: 1 }}>
                    <TextInput

                      style={[styles.textinput, { alignItems: 'center', color: 'white', marginRight: 5, textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderRadius: 7, borderColor: '#191919', borderBottomColor: 'white' }]}
                      placeholder='Hour'
                      onChangeText={props.handleChange('hour')}
                      value={props.values.hour}
                      defaultValue='0'
                      keyboardType='numeric'
                    />

                  </View>

                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={[styles.textinput, { marginBottom: 0, marginLeft: 5, color: 'white', textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }]}
                      placeholder='Minutes'
                      onChangeText={props.handleChange('minutes')}

                      value={props.values.minutes}
                      defaultValue='0'
                      keyboardType='numeric'
                    />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.hour && props.errors.hour}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.minutes && props.errors.minutes}</Text>
                  </View>
                </View>


                <DateTimePickerModal
                  isVisible={datevisiblity}
                  onConfirm={dateconfirm}
                  onCancel={datecancel}
                  mode={'date'}
                  datePickerModeAndroid={'spinner'}
                />
                <View style={{ flexDirection: 'row', height: 40, marginBottom: 15, backgroundColor: '#191919', borderWidth: 1, borderBottomColor: 'white', borderRadius: 7 }}>
                  <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={touchshow}><Text style={{ fontSize: 20, color: 'white' }}>Tap For Date :</Text></TouchableOpacity>
                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{choosedate}</Text></View>
                </View>


                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                  <View style={{ flex: 1, flexDirection: 'row', marginRight: 9 }}>
                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white' }}>
                      <Text style={{ color: 'white' }}>2 Wheeler</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#191919', borderWidth: 1, borderBottomColor: 'white', borderColor: '#191919', alignItems: 'center' }}>
                      <RadioButton
                        value="2"
                        status={checked === '2' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('2')}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>
                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white' }}>
                      <Text style={{ color: 'white' }}>4 Wheeler</Text>
                    </View>
                    <View style={{
                      flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white'
                    }}>
                      <RadioButton
                        value="4"
                        status={checked === '4' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('4')}
                      />
                    </View>
                  </View>
                </View>


                <Button title="Submit" color='red' onPress={props.handleSubmit} />

              </View>
            )}
          </Formik>

        </View>

        <View style={{ height: 237 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Tap for full Details</Text>
          <ScrollView>
            <Fun navigation={navigation} key={`forceupdate-todo-${forceUpdateId}`} onPressItem={id =>
              db.transaction(
                tx => {
                  tx.executeSql(`delete from itemson where id = ?;`, [id]);
                },
                null,
                forceUpdate
              )

            } />
          </ScrollView>
        </View>
        <Button title='See All' color='yellowgreen' onPress={() => navigation.navigate('Member', details)} />
      </View>
    </TouchableWithoutFeedback >

  );
}


function Members({ route, navigation }) {
  const db = SQLite.openDatabase("details.db");
  const detail = route.params;
  const [newdetail, setNewdetail] = useState(null);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from itemson ;`,
        [],
        (_, { rows: { _array } }) => setNewdetail(_array),
      );


    });
  }, []);

  const showToastNoData = () => {

    ToastAndroid.show("No Data To Refresh", ToastAndroid.SHORT);
  };
  const showToastError = () => {
    ToastAndroid.show("Data Error", ToastAndroid.SHORT);
  };
  const showToastRefreshed = () => {
    ToastAndroid.show("Data Refreshed", ToastAndroid.SHORT);
  };



  return (

    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <View style={{ marginTop: Constants.statusBarHeight, flex: 1, marginBottom: 30 }}>
        <CustomHead navigation={navigation} header={'Members'} />

        <FlatList
          data={newdetail}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.text} onPress={() => navigation.navigate('IndividualsInfo', item)} >

              <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>

            </TouchableOpacity>
          )}
          keyExtractor={(item) => (item.id).toString()}
        />
      </View>

    </View >

  );
}



function Finalamount({ detai, twoprice, fourprice }) {

  const [num, setNum] = useState(0);
  const [mnny, setMnny] = useState(0);



  if (detai[num]) {
    if ((detai[num].wheeler) === '2') {
      setMnny(mnny + (detai[num].hour * (twoprice * 60)) + (detai[num].minutes * twoprice));
      setNum(num + 1);
    } else {
      setMnny(mnny + (detai[num].hour * (fourprice * 60)) + (detai[num].minutes * fourprice));
      setNum(num + 1);
    }
  }


  return (
    <View>
      <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', color: 'yellowgreen' }}>TOTAL AMOUNT :   {mnny}</Text>
    </View>
  )
}



function Tabletab({ tabletabname, personname, onPressItem, twoprice, fourprice, navigation }) {
  const db = SQLite.openDatabase("details.db");
  const [nid, setNid] = useState(null);
  const [newdetai, setNewdetai] = useState();
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [modeltime, setModeltime] = useState(false);
  const [twowheelprice, setTwowheelprice] = useState(null);
  const [fourwheelprice, setFourwheelprice] = useState(null);


  const errorhandler = yup.object({

    hour: yup.string().required(),
    minutes: yup.string().required(),

  })

  const errorhandlertwo = yup.object({

    twowheel: yup.string().required(),
    fourwheel: yup.string().required(),

  })

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists wheeldeta (id integer primary key not null, twowheel int, fourwheel int);"
      );
      tx.executeSql("insert into wheeldeta (twowheel,fourwheel) values (?, ?)",
        [30, 40]);
      tx.executeSql(
        `select * from ` + `` + personname + `` + ` ;`,
        [],
        (_, { rows: { _array } }) => setNewdetai(_array),
      );
      tx.executeSql(
        `select * from wheeldeta where id = 1;`, [],
        (_, { rows: { _array } }) => setTwowheelprice(_array[0].twowheel),
      );
      tx.executeSql(
        `select * from wheeldeta where id = 1;`, [],
        (_, { rows: { _array } }) => setFourwheelprice(_array[0].fourwheel),
      );


    });
  }, []);



  const timedata = (data) => {

    db.transaction(
      tx => {
        tx.executeSql('UPDATE ' + '' + personname + '' + ' set hour=?, minutes=?  where id=?',
          [data.hour, data.minutes, nid]);

        tx.executeSql(
          `select * from ` + `` + personname + `` + ` ;`,
          [],
          (_, { rows: { _array } }) => setNewdetai(_array),
        );
      },

      console.log('data added'),
      forceUpdate

    );
  }



  const [indivimodel, setIndivimodel] = useState(false);

  const wheeldata = (data) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE wheeldeta set twowheel=?, fourwheel=?  where id=?',
          [data.twowheel, data.fourwheel, 1]);

        tx.executeSql(
          `select * from wheeldeta where id = 1 ;`,
          [],
          (_, { rows: { _array } }) => setTwowheelprice(_array[0].twowheel),
        );

        tx.executeSql(
          `select * from wheeldeta where id = 1 ;`,
          [],
          (_, { rows: { _array } }) => setFourwheelprice(_array[0].fourwheel),
        );
      },

      console.log('data added'),
      forceUpdate

    );
    setIndivimodel(!indivimodel);
  }

  if (twowheelprice === null) {
    return false;
  }


  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={{ flex: 1, marginLeft: 15, }}>
          <Finalamount detai={newdetai} name={personname} twoprice={twowheelprice} fourprice={fourwheelprice} />

        </View>

        <View style={{ flex: 1 }}></View>

      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
        <View style={{ padding: 10, flex: 1.5, marginRight: 20, borderWidth: 1, borderColor: 'white', borderRadius: 7, alignItems: 'center', backgroundColor: 'black' }}>
          <Text style={{ color: 'white' }}>Two Wheeler cost/minute    -  <Text style={{ color: 'yellowgreen', fontWeight: 'bold', fontSize: 18 }}>{twowheelprice}</Text> </Text>
          <Text style={{ color: 'white' }}>Four Wheeler cost/minute   -  <Text style={{ color: 'yellowgreen', fontWeight: 'bold', fontSize: 18 }}>{fourwheelprice}</Text></Text>
        </View>



        <TouchableOpacity onPress={() => setIndivimodel(true)} style={{
          flex: 1, height: 30, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderRadius: 7, backgroundColor: 'black',
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            change price
          </Text>
        </TouchableOpacity>

      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'yellowgreen', borderRadius: 7, borderBottomLeftRadius: 0, borderBottomEndRadius: 0, height: 38, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1.3, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Date</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Advance</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Wheels</Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Time</Text>
        </View >

        <View style={{ flex: 1, }}>
          <Text style={{ fontWeight: 'bold' }}>Amount</Text>
        </View>
      </View>
      <View >
        <FlatList
          data={newdetai}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flex: 1.3, justifyContent: 'center', marginLeft: 2 }}>
                <Text style={{ color: 'white', fontSize: 13, }}>{item.choosedate}</Text>
              </View>
              <View style={{ flex: .7, justifyContent: 'center', }}>
                <Text style={{ color: 'white', fontSize: 15, }}>{item.advance}</Text>
              </View>
              <View style={{ flex: .7, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 15, }}>{item.wheeler}</Text>
              </View>
              <View style={{ flex: .9, justifyContent: 'center', alignItems: 'center' }}>
                {item.hour === '0' && item.minutes === '0'
                  ? <TouchableOpacity onPress={() => [setModeltime(true), setNid(item.id)]}>
                    <Ionicons name="md-add" size={28} color="yellowgreen" />
                  </TouchableOpacity>
                  : <Text style={{ color: 'white', fontSize: 15, }}>{item.hour}h:{item.minutes}m</Text>}

              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>

                <View style={{ flex: 2 }}>
                  {((item.wheeler) === '2') ? <Text style={{ padding: 8, color: 'white', fontSize: 15, }}>{(item.hour * (twowheelprice * 60) + item.minutes * twowheelprice) - item.advance}</Text> : <Text style={{ padding: 8, color: 'white', fontSize: 15 }}>{(item.hour * (fourwheelprice * 60) + item.minutes * fourwheelprice) - item.advance}</Text>}
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity
                    key={item.id}

                    onPress={() =>
                      Alert.alert(
                        "DELETE PERSON",
                        ("delete "),
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          {
                            text: "OK", onPress: () =>
                              onPressItem && onPressItem(item.id)

                          }

                        ],
                        { cancelable: false }
                      )

                    }
                  >


                    <MaterialIcons name="delete" size={20} color="white" />

                  </TouchableOpacity>

                </View>
              </View >
            </View>
          )}
          keyExtractor={(item) => (item.id).toString()}
        />


        <Modal visible={indivimodel} transparent={true} animationType={'slide'}>
          <BlurView intensity={200} tint='dark' style={[StyleSheet.absoluteFill, { height: 300, marginTop: 150, marginBottom: 200, marginLeft: 20, marginRight: 20, borderRadius: 10 }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>

              </View>
              <View style={{ flex: .5 }}>
                <TouchableHighlight onPress={() => setIndivimodel(!indivimodel)} style={{ alignItems: 'flex-end' }}>
                  <Entypo name="cross" size={40} color="red" />
                </TouchableHighlight>
              </View>
            </View>

            <View>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 28 }}>Enter New Price / minute</Text>
              <Formik
                initialValues={{ twowheel: '', fourwheel: '' }}
                validationSchema={errorhandlertwo}
                onSubmit={(values, actions) => {
                  wheeldata(values);
                  actions.resetForm();
                }}
              >
                {(props) => (
                  <View style={{ paddingLeft: 28, paddingRight: 28 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, height: 50, }}>
                      <View style={{ flex: 1, }}>
                        <TextInput
                          style={[styles.textinput, { alignItems: 'center', color: 'white', backgroundColor: '#191919', marginRight: 5, textAlign: 'center', borderRadius: 7, }]}
                          placeholder={' 2-wheeler'}
                          onChangeText={props.handleChange('twowheel')}
                          value={props.values.twowheel}
                          keyboardType='numeric'
                        />
                      </View>


                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={[styles.textinput, { marginBottom: 30, marginLeft: 5, color: 'white', backgroundColor: '#191919', textAlign: 'center' }]}
                          placeholder={'4-Wheeler'}
                          onChangeText={props.handleChange('fourwheel')}
                          value={props.values.fourwheel}
                          keyboardType='numeric'
                        />
                      </View>

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.twowheel && props.errors.twowheel}</Text>
                      </View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.fourwheel && props.errors.fourwheel}</Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 30 }}>
                      <Button title="Submit" color='yellowgreen' onPress={props.handleSubmit} />
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </BlurView>
        </Modal>




        <Modal visible={modeltime} transparent={true} animationType={'slide'}>
          <BlurView intensity={200} tint='dark' style={[StyleSheet.absoluteFill, { height: 300, marginTop: 150, marginBottom: 200, marginLeft: 20, marginRight: 20, borderRadius: 10 }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>

              </View>
              <View style={{ flex: .5 }}>
                <TouchableHighlight onPress={() => setModeltime(!modeltime)} style={{ alignItems: 'flex-end' }}>
                  <Entypo name="cross" size={40} color="red" />
                </TouchableHighlight>
              </View>
            </View>

            <View>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 28 }}>Enter Time Details</Text>
              <Formik
                initialValues={{ hour: '', minutes: '', id: nid }}
                validationSchema={errorhandler}
                onSubmit={(values, actions) => {
                  timedata(values);
                  actions.resetForm();
                }}
              >
                {(props) => (
                  <View style={{ paddingLeft: 28, paddingRight: 28 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 0, height: 40, }}>
                      <View style={{ flex: 1 }}>
                        <TextInput

                          style={[styles.textinput, { alignItems: 'center', color: 'white', marginRight: 5, textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderRadius: 7, borderColor: '#191919', borderBottomColor: 'white' }]}
                          placeholder='Hour'
                          onChangeText={props.handleChange('hour')}
                          value={props.values.hour}

                          keyboardType='numeric'
                        />

                      </View>

                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={[styles.textinput, { marginBottom: 0, marginLeft: 5, color: 'white', textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }]}
                          placeholder='Minutes'
                          onChangeText={props.handleChange('minutes')}
                          value={props.values.minutes}

                          keyboardType='numeric'
                        />

                      </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.hour && props.errors.hour}</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.minutes && props.errors.minutes}</Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 30 }}>
                      <Button title="Submit" color='yellowgreen' onPress={props.handleSubmit} />
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </BlurView>
        </Modal>
      </View>
    </View >
  )
}



function IndividualsInfo({ route, navigation }) {
  const db = SQLite.openDatabase("details.db");
  const details = route.params;
  const [datevisiblity, setDatevisibility] = useState(false);
  const [choosedate, setChoosedate] = useState('DD-MM-YYYY');

  const [detai, setDetai] = useState([{ id: 0, advance: details.advance, hour: details.hour, minutes: details.minutes, choosedate: details.choosedate, wheeler: details.wheeler }]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists " + "" + details.name + "" + " (id integer primary key not null, advance text, hour text,minutes text,choosedate text,wheeler text);"
      );
      tx.executeSql(
        `select * from ` + `` + details.name + `` + ` ;`,
        [],
        (_, { rows: { _array } }) => setDetai(_array),
      );

    });
  }, []);

  const datecancel = () => {
    setDatevisibility(false);
  }
  const dateconfirm = (date) => {

    const data = moment(date).format('MMMM, Do')
    setChoosedate(data.toString());
    datecancel();
  }

  const touchshow = () => {
    setDatevisibility(true);
  }
  const [checked, setChecked] = useState('2');

  const [model, setModel] = useState(false);


  const [forceUpdate, forceUpdateId] = useForceUpdate()

  const nData = (data) => {

    db.transaction(
      tx => {
        if (data) {
          tx.executeSql("insert into " + "" + details.name + "" + " (advance,hour,minutes,choosedate,wheeler) values (?,?,?,?,?)", [data.advance, data.hour, data.minutes, choosedate, checked]);
          tx.executeSql(
            `select * from ` + `` + details.name + `` + ` ;`,
            [],
            (_, { rows: { _array } }) => setDetai(_array),
          );
        } else {
          tx.executeSql(
            `select * from ` + `` + details.name + `` + ` ;`,
            [],
            (_, { rows: { _array } }) => setDetai(_array),
          );
        }

      },
      console.log('data added'),
      forceUpdate

    );
  }
  const errorhandler = yup.object({
    advance: yup.string().required(),
    hour: yup.string().required(),
    minutes: yup.string().required(),

  })

  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <View style={{ marginTop: Constants.statusBarHeight, flex: 1, marginBottom: 100 }}>
        <Customindividual navigation={navigation} header={'IndividualsInfo'} />

        <TouchableOpacity onPress={() => setModel(true)} style={{ alignItems: 'flex-end', paddingRight: 15 }}><Ionicons name="md-add" size={35} color="yellowgreen" /></TouchableOpacity>

        <View >
          <View style={{ margin: 15 }}>
            <Text style={{ color: 'white', fontSize: 15 }}>NAME : {details.name}</Text>
          </View>
          <View style={{ margin: 15, marginTop: 0, marginBottom: 0 }}>

            <Text style={{ color: 'white', fontSize: 15 }}>PLACE : {details.place}</Text>

          </View>

        </View>
        <View style={{ marginTop: 15 }}>
          <Tabletab tabletabname={detai} personname={details.name} key={`forceupdate-todo-${forceUpdateId}`} onPressItem={id =>
            db.transaction(
              tx => {

                tx.executeSql(`delete from ` + `` + details.name + `` + ` where id = ?;`, [id]);
                tx.executeSql(
                  `select * from ` + `` + details.name + `` + ` ;`,
                  [],
                  (_, { rows: { _array } }) => setDetai(_array),
                );

              },
              null,
              forceUpdate
            )
          } />
        </View>

      </View>

      <Modal visible={model} transparent={true} animationType={'slide'}>
        <BlurView intensity={180} tint='dark' style={[StyleSheet.absoluteFill, { height: 400, marginTop: 150, marginBottom: 200, marginLeft: 20, marginRight: 20, borderRadius: 10 }]}>
          <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10 }}>
            <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Enter Details</Text>
            </View>
            <View style={{ flex: .5 }}>
              <TouchableHighlight onPress={() => setModel(!model)} style={{ alignItems: 'flex-end' }}>
                <Entypo name="cross" size={40} color="red" />
              </TouchableHighlight>
            </View>
          </View>

          <View>

            <Formik
              initialValues={{ advance: '', hour: '', minutes: '', choosedate: { choosedate }['choosedate'], checked: { checked }['checked'] }}
              validationSchema={errorhandler}
              onSubmit={(values, actions) => {
                nData(values);
                actions.resetForm();
              }}
            >
              {(props) => (
                <View style={{ paddingLeft: 28, paddingRight: 28 }}>
                  <View style={{ marginBottom: 10, height: 38, flexDirection: 'row' }}>

                    <View style={{ flex: 1, }}>
                      <TextInput
                        style={[styles.textinput, { alignItems: 'center', color: 'white', backgroundColor: '#191919', marginRight: 5, textAlign: 'center', borderRadius: 7, }]}
                        placeholder='Hour'
                        onChangeText={props.handleChange('hour')}
                        value={props.values.hour}

                        keyboardType='numeric'
                      />

                    </View>

                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={[styles.textinput, { marginBottom: 30, marginLeft: 5, color: 'white', backgroundColor: '#191919', textAlign: 'center' }]}
                        placeholder='Minutes'
                        onChangeText={props.handleChange('minutes')}
                        value={props.values.minutes}

                        keyboardType='numeric'
                      />

                    </View>

                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.hour && props.errors.hour}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.minutes && props.errors.minutes}</Text>
                    </View>
                  </View>

                  <TextInput
                    style={[styles.textinput, { alignItems: 'center', color: 'white', backgroundColor: '#191919', marginRight: 5, textAlign: 'center', borderRadius: 7, }]}
                    placeholder='advance amount'
                    onChangeText={props.handleChange('advance')}
                    value={props.values.advance}
                    keyboardType='numeric'
                  />

                  <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.advance && props.errors.advance}</Text>
                  <DateTimePickerModal
                    isVisible={datevisiblity}
                    onConfirm={dateconfirm}
                    onCancel={datecancel}
                    mode={'date'}
                    datePickerModeAndroid={'spinner'}
                  />
                  <View style={{ flexDirection: 'row', height: 40, marginBottom: 15, borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}>
                    <TouchableNativeFeedback style={{ flex: 1, }} onPress={touchshow}><Text style={{ color: 'white', marginTop: 8, fontSize: 15, fontWeight: 'bold' }}>Tap For Date :</Text></TouchableNativeFeedback>
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingLeft: 8, flex: 1, marginBottom: 15 }}><Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{choosedate}</Text></View>
                  </View>

                  <View style={{ flexDirection: 'row', marginBottom: 20, }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginRight: 9, borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}>
                      <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>2 Wheeler</Text>
                      </View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <RadioButton
                          value="2"
                          status={checked === '2' ? 'checked' : 'unchecked'}
                          onPress={() => setChecked('2')}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}>
                      <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>4 Wheeler</Text>
                      </View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <RadioButton
                          value='4'
                          status={checked === '4' ? 'checked' : 'unchecked'}
                          onPress={() => setChecked('4')}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 30 }}>
                    <Button title="Submit" color='yellowgreen' onPress={props.handleSubmit} />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </BlurView>
      </Modal>

    </View >
  )
}



export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'black' }, headerTintColor: 'yellowgreen', headerTitleStyle: { marginRight: 15, textAlign: 'center', fontWeight: 'bold' } }} >
        <Stack.Screen name="Home" component={Home} options={{
          title: 'Home',
          headerShown: false,
        }} />
        <Stack.Screen name="Member" component={Members} options={{ title: 'Member', headerShown: false }} />
        <Stack.Screen name="IndividualsInfo" component={IndividualsInfo} options={{ title: 'IndividualsInfo', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}




const styles = StyleSheet.create({
  separator: {
    marginTop: 10,
    marginHorizontal: 0,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },

  textinput: {
    borderBottomWidth: 2,
    borderColor: 'white',
    height: 40,
    marginBottom: 0,
    color: 'white',

  },
  text: {
    marginTop: 5,
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: "flex-start",
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: 'white',
    shadowOffset: {
      width: 1, height: 7
    },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  textt: {
    marginTop: 5,
    borderBottomColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: "flex-start",
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: 'black',
    borderRadius: 20,
    shadowColor: 'white',
    shadowOffset: {
      width: 1, height: 7
    },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },

  latest: {
    marginTop: 10,
    borderColor: 'white',
    borderWidth: 0,
    alignItems: 'center',
    paddingLeft: 100,
    paddingRight: 100,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: 'yellowgreen',
    borderRadius: 10,
    shadowColor: 'white',
    shadowOffset: {
      width: 1, height: 7
    },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  nonBlurredContent: {
    alignItems: 'center',
    justifyContent: 'center',

  },
});