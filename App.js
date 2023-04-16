import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainScreen from './MainScreen';
import SignUpScreen from './SignUpScreen'; 
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainScreen}
          options={{title: 'CredScan'}}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} 
          options={({ navigation, route }) => ({
            headerLeft: () => (
              null
            ),
          })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;