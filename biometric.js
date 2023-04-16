import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Storage } from 'expo-storage';

import socket from "./socket";

(async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
})();

const fallBackToDefaultAuth = () => {
  console.log('fall back to password authentication');
};

const alertComponent = (title, mess, btnTxt, btnFunc) => {
  return Alert.alert(title, mess, [
    {
      text: btnTxt,
      onPress: btnFunc,
    },
  ]);
};

const handleBiometricAuth = async (data, setScanVisiblity) => {
  // Check if hardware supports biometrics
  const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
  
  // Fallback to default authentication method (password) if Fingerprint is not available
  if (!isBiometricAvailable)
  return alertComponent(
    'Please enter your password',
    'Biometric Authentication not supported',
    'OK',
    () => fallBackToDefaultAuth()
    );
    
    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
    supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
    return alertComponent(
      'Biometric record not found',
      'Please login with your password',
      'OK',
      () => fallBackToDefaultAuth()
      );
      
      // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)
      
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login withnnn Biometrics',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });
      console.log(biometricAuth);
      // Log the user in on success
      //send a confirmation to server about the state.
      if (biometricAuth.success == true) {
        Storage.getItem({key: "user_id"}).then(e=>{
      socket.emit("scancomplete", { status: 200, msg: { data, user_id: e } });
      // setScanVisiblity(true);
    });
  }else{
    socket.emit("scancomplete", { status: 500 });
    // setScanVisiblity(true);
  }
  
  // console.log({ isBiometricAvailable });
  // console.log({ supportedBiometrics });
  // console.log({ savedBiometrics });
  // console.log({ biometricAuth });
};
  
module.exports = {
    handleBiometricAuth
}