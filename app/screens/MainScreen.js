import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TextInput } from 'react-native-gesture-handler';

export default function MainScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not Scanned');
  const [serving, setServing] = React.useState('');

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
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      console.log(data)
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
          <Button title="Show User" onPress={() => showName()} />
            <TextInput placeholder="Serving" onChangeText={serving => setServing(serving)} />
            <Button title="test" onPress={() => alert(serving)} />
            <Button title="Type Ingredients Manually" onPress={() => navigation.navigate('Ingredients')} />
          <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
      </View>
  );
};

function showName() {
    const user = firebase.auth().currentUser;
    alert(user.email)
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
});
