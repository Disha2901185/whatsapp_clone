import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import React from 'react';

const LogoScreen = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        style={{color: 'white'}}
        backgroundColor="#181d2e"
      />
      <View style={styles.container}>
        <View>
          <Image
            style={{height: 170, width: 170}}
            source={require('../assets/logo.png')}
          />
        </View>
        <View style={styles.metaicon}>
          <Text
            style={{
              color: '#919090',
              fontSize: 16,
              width: 60,
              position: 'absolute',
              left: 17,
              bottom: 25,
            }}>
            from
          </Text>
          <Image
            style={{width: 34, height: 22, left: -12}}
            source={{
              uri: 'https://pngimg.com/d/meta_PNG6.png',
            }}
          />
          <Text
            style={{
              color: '#d2d2d4',
              fontSize: 23,
              width: 60,
              position: 'absolute',
              left: 30,
            }}>
            Meta
          </Text>
        </View>
      </View>
    </>
  );
};

export default LogoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181d2e',
    color: '#d2d2d4',
  },
  metaicon: {
    position: 'absolute',
    top: 760,
    left: 160,
  },
});
