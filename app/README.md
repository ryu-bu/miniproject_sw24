This is a mobile application built with React Native, Expo, and Google Firebase. This is an <strong>IOS</strong> app.

Before we start...<br>
Create a config.js file in this app directory and put the following configs with appropriate values:
```
export const firebaseConfig = {

    apiKey: "user_defined",

    authDomain: "user_defined",
  
    databaseURL: "user_defined",
  
    projectId: "user_defined",
  
    storageBucket: "user_defined",
  
    messagingSenderId: "user_defined",
  
    appId: "user_defined",
  
    measurementId: "user_defined"
  

};

export const iosClientConfig = {
    IOS_CLIENT_ID: "user_defined"
}


export const restApiConfig = {
    ENDPOINT: "https://restapi-miniproject.herokuapp.com"
}
```

Instruction: <br>
1. Put the config.js file specified above.
2. Download necessary dependencies using yarn.
```
yarn
```
3. Activate the app
```
yarn ios
```