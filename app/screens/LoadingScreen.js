import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

class LoadingScreen extends React.Component {

    componentDidMount() {
        this.isLoggedIn();
    }

    // manage screens based on the authentication status
    isLoggedIn = () => {
        firebase.auth().onAuthStateChanged((usr) => {
            if (usr) {
                this.props.navigation.navigate('MainScreen');
            } else {
                this.props.navigation.navigate('LoginScreen');
            }
        }).bind(this)
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
