import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {useNavigation} from '@react-navigation/native';
const ChatRoom = ({route, user}) => {
  const {name, pic, uid} = route.params;
  // console.log(uid, user.uid);
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const onSend = messageArray => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };
  const CustomInputToolbar = props => {
    return (
      <>
        <ImageBackground
          style={{height: '94.4%', paddingBottom: 10}}
          source={{
            uri: 'https://i.pinimg.com/736x/77/e5/f9/77e5f973a6b3f56d57b24fd1b2b66943.jpg',
          }}>
          <View
            style={{
              position: 'relative',

              backgroundColor: 'blue',
              top: 40,
            }}>
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: '#36454f',
                color: 'white',
                borderWidth: 2,

                borderRadius: 50,
                borderColor: '#36454f',

                height: 43,
                marginRight: 50,
                marginLeft: 8,
              }}
              renderActions={props => {
                return (
                  <>
                    <Icon
                      name="attach"
                      size={32}
                      color="white"
                      style={{
                        position: 'relative',
                        left: 293,
                        bottom: 10,
                        transform: [{rotate: '30deg'}],
                      }}
                    />
                  </>
                );
              }}
            />
          </View>
        </ImageBackground>
      </>
    );
  };
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#36454f" />
      <View style={styles.roomTitle}>
        <View style={styles.user}>
          <Icon
            name="arrow-back"
            size={26}
            color="white"
            style={{marginLeft: 7, marginTop: 3}}
            onPress={() => navigation.goBack()}
          />
          <Image
            source={{uri: pic}}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              marginLeft: 6,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              color: '#e6e6e6',
              fontWeight: 'bold',
              marginLeft: 12,
              marginTop: 4,
            }}>
            {name}
          </Text>
        </View>
        <View style={styles.icons}>
          <Icon
            style={{marginRight: 30, marginTop: 3}}
            name="videocam"
            size={24}
            color="#e6e6e6"
          />
          <Icon
            style={{marginRight: 20, marginTop: 3}}
            name="call"
            size={24}
            color="#e6e6e6"
          />
          <Icon
            style={{marginRight: 10, marginTop: 3}}
            name="ellipsis-vertical"
            size={24}
            color="#e6e6e6"
          />
        </View>
      </View>
      <ImageBackground
        style={{height: '94.4%', paddingBottom: 10}}
        source={{
          uri: 'https://i.pinimg.com/736x/77/e5/f9/77e5f973a6b3f56d57b24fd1b2b66943.jpg',
        }}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: user.uid,
          }}
          placeholder="Message"
          alwaysShowSend={true}
          textInputStyle={{color: 'white', fontSize: 18}}
          renderSend={props => {
            return (
              <Send {...props}>
                <View
                  style={{
                    backgroundColor: 'green',
                  }}>
                  <Icon
                    name="send"
                    size={24}
                    color="white"
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 58,
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                      backgroundColor: '#007f66',
                      borderRadius: 50,
                    }}
                  />
                </View>
              </Send>
            );
          }}
          renderBubble={props => {
            return (
              <View>
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: {
                      backgroundColor: '#007f66',
                      borderRadius: 10,
                      borderBottomRightRadius: 20,
                      marginBottom: 10,
                      paddingHorizontal: 10,
                    },
                    left: {
                      backgroundColor: '#36454f',
                      borderBottomLeftRadius: 30,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    },
                  }}
                  textStyle={{
                    left: {
                      color: 'white',
                    },
                  }}
                />
              </View>
            );
          }}
          renderInputToolbar={toolbarProps => (
            <CustomInputToolbar {...toolbarProps} />
          )}
        />
      </ImageBackground>
    </>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  roomTitle: {
    backgroundColor: '#36454f',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    height: 55,
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
