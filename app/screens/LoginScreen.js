import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import 'firebase/firestore';
import { iosClientConfig } from '../config';

class LoginScreen extends React.Component {


    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
              if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                  providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
              }
            }
          }
        return false;
        
    };

    onSignIn = (googleUser) => {
        console.log(googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase
        .auth()
        .onAuthStateChanged((firebaseUser) => {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                );
      
            // Sign in with credential from the Google user.
            firebase
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
                console.log("User signed in " + result.additionalUserInfo.profile.given_name);
                if (result.additionalUserInfo.isNewUser) {
                    firebase.database().ref('/users/' + result.user.uid)
                    .set({
                        gmail: result.user.email,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now(),
                        profile_pic: result.additionalUserInfo.profile.picture
                    })
                    .then(function (snapshot){

                    }) 
                } else {
                    console.log("existing user")
                    firebase.database().ref('/users/' + result.user.uid)
                    .update({
                        last_logged_in: Date.now()
                    })
                }
            })
            .catch((error) => {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        })
        .bind(this);  
    };

    signInWithGoogleAsync = async() => {

        try {
            const result = await Google.logInAsync({
            // androidClientId: YOUR_CLIENT_ID_HERE,
            // behavior: 'web',
            iosClientId: iosClientConfig.IOS_CLIENT_ID,
            scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onSignIn(result);
            return result.accessToken;
            } else {
            return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    };


    render() {
        return (
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headerText}>NutriScanner</Text>
                <Text style={styles.subheaderText}>EC463 Mini Project SW-24</Text>
              </View>
              <Button title="Sign In" onPress={() => this.signInWithGoogleAsync()} />
              <View style={styles.footer}>
                <Text>by Ryuichi and Olivier</Text>
              </View>
            </View>
        )
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 0,
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 30,
    backgroundColor: '#fff',
    marginLeft: 20,
  },
  subheaderText: {
    marginBottom: 15,
    fontSize: 12,
    marginLeft: 20,
  },
  footer: {
    flex: 1,
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 15,
  },
});
