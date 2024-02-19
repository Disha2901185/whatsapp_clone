import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../components/Input';
import Login from './Login';
//firestore libraries import
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  mobileNo: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const Signup = props => {
  //handle next button
  const [showNext, setShowNext] = useState(false);
  const [image, setImage] = useState(false);
  const [showImage, setShowImage] = useState(
    'https://www.shutterstock.com/image-vector/man-avatar-profile-picture-vector-260nw-229692004.jpg',
  );
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#9ea3a3" />;
  }
  // function for uplaod image in firebase storage
  const uploadProfilePic = () => {
    launchImageLibrary({quality: 0.5}, response => {
      if (!response || response.didCancel) {
        // Handle cancellation or empty response
        console.log('Image selection canceled');
        return;
      }

      const fileObj = response.assets[0];

      if (!fileObj || !fileObj.uri) {
        console.error('Invalid fileObj:', fileObj);
        return;
      }

      const localFilePath = fileObj.uri;
      const fileName = localFilePath.split('/').pop();
      const fileType = fileName.split('.').pop();

      fetch(localFilePath)
        .then(response => response.blob())
        .then(blob => {
          const uploadTask = storage()
            .ref()
            .child(`/userprofile/${Date.now()}.${fileType}`)
            .put(blob);

          uploadTask.on(
            'state_changed',
            snapshot => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            error => {
              console.error('Error uploading image:', error);
              alert('Error uploading image');
            },
            async () => {
              const downloadURL = await storage()
                .ref(uploadTask.snapshot.metadata.fullPath)
                .getDownloadURL();

              console.log('File available at', downloadURL);
              setImage(downloadURL);
              // console.log(image);
              setShowImage(downloadURL);
              alert('Image uploaded successfully');
            },
          );
        })
        .catch(error => {
          console.error('Error reading image:', error);
          alert('Error reading image');
        });
    });
  };

  useEffect(() => {
    console.log('Updated image state:', image);
  }, [image]);

  //*********Handle submit Function**************
  const handleSubmit = async values => {
    // setLoading(true);
    console.log(values);
    if (!image) {
      alert('please uload an image');
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      firestore().collection('users').doc(result.user.uid).set({
        name: values.name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
      });
      // setLoading(false);
    } catch (error) {
      console.log('something went Wrong while storing data in firestore');
    }
  };
  return (
    <>
      <StatusBar
        barStyle="light-content"
        style={{color: 'white'}}
        backgroundColor="#36454f"
      />
      <KeyboardAvoidingView behavior="position">
        <View style={styles.container}>
          <Formik
            initialValues={{
              name: '',
              email: '',
              mobileNo: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View>
                {showNext === false ? (
                  <>
                    <Text style={styles.input}>Welcome to WhatsApp</Text>
                    <Icon
                      name="logo-whatsapp"
                      size={94}
                      color="#e6e6e6"
                      style={{
                        alignSelf: 'center',
                        marginTop: 40,
                        marginBottom: 20,
                      }}
                    />
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
                      label={'ContactNo.'}
                      value={values.mobileNo}
                      placeholder={'contact '}
                      onChangeText={handleChange('mobileNo')}
                    />
                    {touched.mobileNo && errors.mobileNo && (
                      <Text style={styles.errorText}>{errors.mobileNo}</Text>
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
                    <TouchableOpacity onPress={() => setShowNext(true)}>
                      <Text style={styles.submit}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('Login')}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#e6e6e6',
                          marginTop: 20,
                          marginLeft: 48,
                          fontWeight: 'bold',
                        }}>
                        Already have an account? Login
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity onPress={uploadProfilePic}>
                      <Image
                        source={{uri: showImage}}
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: 100,
                          alignSelf: 'center',
                          marginTop: 100,
                          marginBottom: 20,
                        }}
                      />
                    </TouchableOpacity>
                    <Input
                      label={'Name'}
                      value={values.name}
                      placeholder={'Name'}
                      onChangeText={handleChange('name')}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                    <TouchableOpacity onPress={handleSubmit}>
                      <Text style={styles.submit}>Next</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                    onPress={() => props.navigation.navigate('Login')}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#e6e6e6',
                        marginTop: 20,
                        marginLeft: 48,
                        fontWeight: 'bold',
                      }}>
                      Already have an account? Login
                    </Text>
                  </TouchableOpacity> */}
                  </>
                )}
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Signup;

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
    marginTop: 70,
  },
  submit: {
    fontSize: 25,
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
