import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import LogoScreen from './screens/LogoScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AllUsers from './screens/AllUsers';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import ChatRoom from './screens/ChatRoom';

const Stack = createNativeStackNavigator();
const App = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
      } else {
        setUser('');
      }
    });
    return () => {
      unregister();
    };
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="All Users" options={{headerShown: false}}>
                {props => <AllUsers {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="ChatRoom" options={{headerShown: false}}>
                {props => <ChatRoom {...props} user={user} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
