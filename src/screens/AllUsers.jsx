import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ChatRoom from './ChatRoom';
import {useNavigation} from '@react-navigation/native';

const RenderCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChatRoom', {
          name: item.name,
          pic: item.pic,
          uid: item.uid,
        })
      }>
      <View
        style={{
          backgroundColor: '#192121',
          display: 'flex',
          flexDirection: 'row',
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}>
        <Image source={{uri: item.pic}} style={styles.pic} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const AllUsers = ({user}) => {
  console.log('heyyyy', user);
  const [users, setUsers] = useState(null);

  const getUsers = async () => {
    const querySnap = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allUsers = querySnap.docs.map(docSnap => docSnap.data());
    console.log(allUsers);
    setUsers(allUsers);
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#36454f" />
      <View style={styles.aboveTitle}>
        <Text style={styles.whatsapp}>WhatsApp</Text>
        <View style={styles.icons}>
          <Icon name="camera-outline" size={24} color="#e6e6e6" />
          <Icon name="search" size={24} color="#e6e6e6" />
          <TouchableOpacity
            onPress={() => {
              auth().signOut();
              // props.navigation.navigate('Login');
            }}>
            <Icon name="ellipsis-vertical" size={24} color="#e6e6e6" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            paddingLeft: 7,
          }}>
          <Image source={require('../assets/group.png')} style={styles.image} />
          <View style={styles.titles}>
            <Text style={styles.title}>Chats</Text>
            <Text style={styles.title}>Updates</Text>
            <Text style={styles.title}>Calls</Text>
          </View>
        </View>
      </View>
      <View
        styles={{backgroundColor: '##192121', height: 800, marginVertical: 40}}>
        <FlatList
          data={users}
          keyExtractor={item => item.uid}
          renderItem={({item}) => <RenderCard item={item} />}
        />
        <View style={{height: 700, backgroundColor: '#192121'}}></View>
      </View>
    </>
  );
};

export default AllUsers;

const styles = StyleSheet.create({
  aboveTitle: {
    backgroundColor: '#36454f',
    height: 120,
    paddingTop: 8,
  },
  whatsapp: {
    color: '#e6e6e6',
    fontSize: 30,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    display: 'flex',
    gap: 25,
    position: 'relative',
    left: 250,
    bottom: 30,
    fontWeight: 'bold',
  },
  pic: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    color: '#e6e6e6',
    marginHorizontal: 15,
    marginTop: 13,
  },
  titles: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
  },
  title: {
    color: '#bdbdbd',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginRight: 50,
  },
  chatBox: {
    backgroundColor: '#181d2e',
    height: '70%',
  },
  image: {
    height: 35,
    width: 35,
  },
});
