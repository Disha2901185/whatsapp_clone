import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {launchImageLibrary} from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../components/Input';
import AllUsers from './AllUsers';
//firestore libraries import
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const Login = props => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#9ea3a3" />;
  }

  //*********Handle submit Function**************
  const handleSubmit = async values => {
    setLoading(true);
    console.log(values);

    try {
      await auth().signInWithEmailAndPassword(values.email, values.password);

      setLoading(false);
      alert('login successfully');
    } catch (error) {
      console.log('something went Wrong while Login');
    }
  };
  return (
    <>
      <StatusBar
        barStyle="light-content"
        style={{color: 'white'}}
        backgroundColor="#36454f"
      />
      <View style={styles.container}>
        <Text style={styles.input}>Welcome to WhatsApp </Text>
        <Icon
          name="logo-whatsapp"
          size={94}
          color="#e6e6e6"
          style={{alignSelf: 'center', marginTop: 20}}
        />
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
            <View>
              <Input
                label={'Email'}
                value={values.email}
                placeholder={'email@gmail.com'}
                onChangeText={handleChange('email')}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Input
                label={'Password'}
                value={values.password}
                placeholder={'Password'}
                onChangeText={handleChange('password')}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.submit}>SignIn</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => props.navigation.navigate('Signup')}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#e6e6e6',
                    marginTop: 20,
                    marginLeft: 48,
                    fontWeight: 'bold',
                  }}>
                  Doesn't have any account? Signup
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#36454f',
  },
  input: {
    fontSize: 35,
    color: '#e6e6e6',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  submit: {
    fontSize: 22,
    paddingHorizontal: 120,
    paddingVertical: 10,
    backgroundColor: '#007f66',
    color: '#e6e6e6',
    width: '80%',
    marginTop: 25,
    borderRadius: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  upload: {
    fontSize: 25,
    paddingHorizontal: 80,
    paddingVertical: 10,
    backgroundColor: '#018c39',
    color: '#e6e6e6',
    width: '80%',
    marginTop: 25,
    borderRadius: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
  },
});
