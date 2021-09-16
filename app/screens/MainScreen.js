import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'react-native-axios';
import { restApiConfig } from '../config';


export default function MainScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');
  const [serving, setServing] = React.useState('');
  const [barcode, setBarcode] = React.useState('');

  // camera permission
  useEffect(() => {
      (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
      })();
  }, []);

  // barcode scanned
  const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);

      // in case the barcode length is more than 13
      if (data.length > 12) {
        data = data.slice(data.length - 12)
    }
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      setBarcode(data);
      console.log(data);
  };

  if (hasPermission === null) {
      return (
          <View style={styles.container}>
              <Text>Requesting for camera permission</Text>
          </View >
      )
  }
  if (hasPermission === false) {
      return (
          <View style={styles.container}>
              <Text>No access to camera</Text>
              <Button title={'Allow Camera'} onPress={() => askForCameraPermission()}/>
          </View >
      )
  }

  return (
      <View style={styles.container}>
          <View style={styles.barcodebox}>
          <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject} />
          </View>
          <Text style={styles.maintext}>{text}</Text>
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)}/>}
            <TextInput 
                style={styles.input} 
                placeholder="Enter Serving Size" onChangeText={serving => setServing(serving)} />
            <Button title="Get Calories" onPress={() => getCalories(barcode, serving)} />
            <Button title="Type Ingredients Manually" onPress={() => navigation.navigate('Ingredients')} />
            <Button title="Show History" onPress={() => navigation.navigate('HistoryScreen')} />
          <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
      </View>
  );
};

function getCalories(barcode, servings) {
    const user = firebase.auth().currentUser;
    axios
        .post(restApiConfig.ENDPOINT + '/calories-record?type=barcode&servings=' + servings, {
            name: user.displayName,
            email: user.email,
            barcode: barcode
        })
        .then((res) => {
            console.log(res.data);
            alert(res.data.calories);
            firebase.firestore().collection("Users").doc(user.uid).collection("calories-record").doc(Date.now().toString())
                    .set({
                        barcode: barcode,
                        product_name: res.data.product_name,
                        servings: servings,
                        calories: res.data.calories,
                        record_time: Date.now()
                    });
        })
        .catch((err) => {
            console.log(err);
            alert("No such UPC in FDC site or no input!")
        })
}

function showName() {
    const user = firebase.auth().currentUser;
    console.log(user);
    alert(user.displayName)
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },

  barcodebox: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
      width: 300,
      overflow: 'hidden',
      borderRadius: 30,
      backgroundColor: 'tomato'
  },

  textsize: {
      fontSize: 16,
      margin: 20,
  },

  input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
  },
});
