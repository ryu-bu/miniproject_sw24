import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase';
import { TextInput } from 'react-native-gesture-handler';
import { restApiConfig } from '../config';
import axios from 'axios';

export default function Ingredients({navigation})  {
    const [serving, setServing] = React.useState('');
    const [ingredients, updateIngredients] = useState([]);
    const [tempIng, setTempIng] = useState('');
    const [stringIng, setStringIng] = useState('');
    return (
        <View style={styles.container}>
            <Text>Ingredients: {stringIng}</Text>
            <TextInput style={styles.input}
                placeholder="Enter an Ingredient" 
                onChangeText={ingredient => {
                    setTempIng(ingredient);
                }} 
                value={tempIng}/>
            <Button title="Add an Ingredient" onPress={() => {
                console.log(tempIng);
                updateIngredients([...ingredients, tempIng]);
                setStringIng(showIngredients(ingredients, tempIng));
                setTempIng('');
                }} />
            <Button title="Clear" onPress={() => {
                updateIngredients([]);
                setStringIng('');
            }} />
            <TextInput style={styles.input} 
                placeholder="Enter Serving Size" onChangeText={serving => setServing(serving)} />
            <Button title="Get Calories" onPress={() => getCalories(ingredients, serving, stringIng)} />
            <Button title="Back to Main Screen" onPress={() => navigation.navigate('MainScreen')} />
        </View>
    )
}

// this function stringfy the ingredient array
function showIngredients(ingredientArray, newestItem) {
    let stringIng = "";
    for (let i = 0; i < ingredientArray.length; i++) {
        stringIng += ingredientArray[i] + ", ";
    }
    stringIng += newestItem;
    return stringIng;
}

// API Call using the igredients
function getCalories(ingredientArray, servings, stringArray) {

    // get current user info
    const user = firebase.auth().currentUser;
    axios
        .post(restApiConfig.ENDPOINT + '/calories-record?type=ingredients&servings=' + servings, {
            name: user.displayName,
            email: user.email,
            ingredients: ingredientArray
        })
        .then((res) => {
            console.log(res.data);
            alert(res.data.calories);

            // store the data into firebase
            firebase.firestore().collection("Users").doc(user.uid).collection("calories-record").doc(Date.now().toString())
                    .set({
                        barcode: 'N/A',
                        product_name: stringArray,
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

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
  }
});
