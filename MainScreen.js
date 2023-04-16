import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Modal,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
  ToastAndroid,
  StatusBar as RnStatusBar
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { handleBiometricAuth } from './biometric';
// import Storage from './storage';
import { Storage } from 'expo-storage';

import socket from "./socket";

export default function MainScreen({ navigation }) {
    
    const [f, setF] = useState(true);
    
    useEffect(()=>{
        async function fetch(){
            setF(await Storage.getItem({ key: "UserDetails" }));
        }
        fetch();
    }, []);
    
    if(!f) navigation.navigate('SignUp', {initial: true});

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');

  const [modalVisible, setModalVisible] = useState(false);

  const [visible, setScanVisiblity] = useState(true);


  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    // send server message that qr scanned with qr data.

    setScanVisiblity(false);
    setModalVisible(true);
    var id = await Storage.getItem({key: "user_id"});
    socket.emit("connectapp", {id: id, data: data});
    socket.on("connectapp", (d)=>{
      if(d.status == 200){
        setModalVisible(false);
        handleBiometricAuth(data, setScanVisiblity);
      }else{
        ToastAndroid.show("Unexpected Problem", ToastAndroid.SHORT);
      }
    });

    // setTimeout(()=>{
    //   // setScanVisiblity(true);
    // }, 2000);
    console.log('Type: ' + type + '\nData: ' + data);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>
      )
  }

  // Return the View
  return f==null ?(<></>):(
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Modal
            visible={modalVisible}>
            <View style={{ flex:1,backgroundColor:"#00000020", justifyContent:"center",alignItems:"center"}}>
              <View style={{backgroundColor:"white",padding:10,borderRadius:5, width:"80%", alignItems:"center"}}>
                <Text>Loading...</Text>
                <ActivityIndicator size="large" color="#f35588"/>
              </View>
            </View>
          </Modal>
      </View>
      <View style={styles.barcodebox}>
        { visible ? (
          <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
        ) : null }
      </View>
      <Text style={styles.maintext}>Scan QR to Continue</Text>
      {scanned && <Button title={'Scan again?'} onPress={() => {
        setScanned(false);
        setScanVisiblity(true);
      }} color='tomato' />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 26,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});