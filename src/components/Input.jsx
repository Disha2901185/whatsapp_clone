// import {StyleSheet, View} from 'react-native';
import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
// import {TextInput} from 'react-native-paper';

const Input = ({label, value, onChangeText, placeholder}) => {
  return (
    <View>
      <Text
        style={{color: '#007f66', marginLeft: 30, fontSize: 22, marginTop: 20}}>
        {label}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={'#666869'}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    height: 50,
    fontSize: 20,
    borderColor: '#007f66',
    borderBottomWidth: 3,
    marginHorizontal: 30,
    // marginBottom: 10,
    borderRadius: 20,
    paddingHorizontal: 23,
    color: '#e6e6e6',
    fontWeight: 'bold',
  },
});
