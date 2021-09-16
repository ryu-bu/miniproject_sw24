import React, { Suspense, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Card } from 'react-native';
import firebase from 'firebase';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { TextInput } from 'react-native-gesture-handler';
import { ScrollView } from '@react-navigation/native';

export default function HistoryScreen({navigation})  {
    const user = firebase.auth().currentUser;
    // const state = {
    //     HeadTable: ['Product Name', 'Servings', 'Calories', 'Date', 'Barcode'],
    // };
    const dataTest = [];

    const [state, setState] = useState({
        HeadTable: [],
        DataTable: []
    })

    const [isLoading, setLoading] = useState(true);
    

    const docRef = firebase.firestore().collection("Users").doc(user.uid).collection("calories-record");
    useEffect(() => {
        docRef.get()
        .then((collection) => {
            var dataTable = [];
            collection.forEach(doc => {
                const temp_record = [];
                var dt = new Date(doc.data().record_time);
                var newTime = dt.toLocaleString('en-US', { timeZone: 'America/New_York' });
                console.log(newTime);
                temp_record.push(doc.data().product_name, doc.data().servings, doc.data().calories, newTime, doc.data().barcode);

                // put the most recent record in the beginning
                dataTable.unshift(temp_record);
                // dataTest.unshift(doc.data());
            })
            // console.log(dataTest);
            setState({ 
                HeadTable: ['Product Name', 'Servings', 'Calories', 'Date', 'Barcode'],
                DataTable: dataTable 
            });
            setLoading(false);
        })
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    console.log(state.DataTable);

        return (
            <View style={styles.container}>
                <Text>Showing History for {user.displayName}. </Text>
                <ScrollView horizontal={true}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
                    <Row 
                        data={state.HeadTable} 
                        widthArr={state.widthArr}
                        style={styles.HeadStyle} 
                        textStyle={styles.TableText}
                    />
                    <Rows 
                        data={state.DataTable} 
                        widthArr={state.widthArr}
                        style={styles.DataStyle} 
                        textStyle={styles.TableText}
                    />
                </Table>
                </ScrollView>
                <Button title="Back to Main Screen" onPress={() => navigation.navigate('MainScreen')} />
            </View>
        )
}

const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
container: { 
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  HeadStyle: { 
    height: 40,
    width: 1000,
    alignContent: "center",
    flexDirection: 'row',
    backgroundColor: '#ffe0f0'
  },
  DataStyle: { 
    width: 1000,
    alignContent: "center",
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  TableText: {
    margin: 10
  }
});
