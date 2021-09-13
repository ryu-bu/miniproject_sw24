import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase';
import { TextInput } from 'react-native-gesture-handler';

export default function MainScreen({navigation})  {
    const [serving, setServing] = React.useState('');
    return (
        <View style={styles.container}>
            <Text>MainScreen</Text>
            <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
            <Button title="Show User" onPress={() => showName()} />
            <TextInput placeholder="Serving" onChangeText={serving => setServing(serving)} />
            <Button title="test" onPress={() => alert(serving)} />
            <Button title="Type Ingredients Manually" onPress={() => navigation.navigate('Ingredients')} />
        </View>
    )
}

function showName() {
    const user = firebase.auth().currentUser;
    alert(user.email)
}

// export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
