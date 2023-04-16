import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Button,
    Modal,
    ActivityIndicator,
    Alert,
    ToastAndroid,
  } from 'react-native';
import uuid from 'react-native-uuid';
// import Storage from './storage';
import { Storage } from 'expo-storage';

import socket from "./socket";

// import bcrypt from 'react-native-bcrypt';
// const bcrypt = dcodeIO.bcrypt;

export default function SignUpScreen({ navigation }) {

    navigation.setOptions({
        headerLeft: () => (
            <View></View>
        ),
    });
    const name = useRef('');
    const password = useRef('');
    const email = useRef('');
    const ques = useRef('');
    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={text => name.current = text}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => email.current = text}
                placeholder="Email"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => password.current = text}
                placeholder="Password"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => ques.current = text}
                placeholder="What is the your fav color?"
            />
            <View style={styles.btn}>
                <Button title="SignUp" onPress={async ()=>{
                    var arr = {name: name.current , password: password.current, email: email.current, ques: ques.current};
                    console.log(arr);
                    var f = true;
                    for(var f in arr){
                        if(arr[f].trim().length <= 0) f = false;
                    }
                    if(f) {
                        var txt = JSON.stringify(arr);
                        await Storage.setItem({
                            key: "UserDetails",
                            value: txt
                        })
                        // console.log(txt);
                        //generate unquie id and send it to server
                        var id = uuid.v4();
                        await Storage.setItem({
                            key: "user_id",
                            value: id
                        });
                        socket.emit("user_signup", {
                            data: id
                        });
                        socket.on("user_signup", (d)=>{
                            if(d.status == 200) navigation.navigate('Home', {initial: true});
                        })
                    }else{
                        ToastAndroid.show("Fill all Details", ToastAndroid.SHORT); 
                    }
                    
                }} style={styles.btn}></Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    btn: {
        margin: 10
    }
});

