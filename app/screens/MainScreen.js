import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase';

class MainScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>MainScreen</Text>
                <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
            </View>
        )
    }
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
