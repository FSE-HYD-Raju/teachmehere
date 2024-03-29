import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Time,
  Message,
  Avatar as Ava,
} from 'react-native-gifted-chat';
import { View, StyleSheet, Text, BackHandler, Alert } from 'react-native';
import {
  IconButton,
  TextInput,
  ActivityIndicator,
  Colors,
  Snackbar,
} from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { loginSelector } from '../../../redux/slices/loginSlice';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import OptionsMenu from 'react-native-options-menu';
import {
  chatSelector,
  setLoading,
  setCurrentOpenedChat,
  fetchChats,
  setChatPageOpened,
} from '../../../redux/slices/chatSlice';
import {
  sendChatNotificationUrl,
  submitfeedbackUrl,
} from '../../../redux/urls';
import PushNotification from 'react-native-push-notification';

export default function ChatRoom({ route, navigation }) {
  console.log('in chatroom ');
  const { userInfo } = useSelector(loginSelector);
  const [messages, setMessages] = useState([]);
  const [didBlock, setDidBlock] = useState(false);
  const [gotBlocked, setGotBlocked] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const { chatResults, getChatsEventCalled, loading } = useSelector(
    chatSelector,
  );
  const dispatch = useDispatch();

  const [thread, setThread] = useState(route.params?.thread || {});
  console.log('thread', thread);
  const isSupport = !!route.params?.thread?.support;
  const [newChat, setNewChat] = useState(thread.newChat);
  const [fetchedChatData, setFetchedChatData] = useState(false);
  const [senderObj, setSenderObj] = useState(
    thread.userDetails.find(o => {
      console.log('o', o);
      return o.id != userInfo._id;
    }),
  );

  var isChatDeleted = false;

  console.log('senderObj', senderObj);

  const stateRef = useRef();
  stateRef.current = newChat;
  const backButtonHandler = () => {
    return BackHandler.addEventListener('hardwareBackPress', () => {
      checkToRemoveChat();
      return true;
    });
  };

  let messagesListener = null;
  let threadListener = null;
  let backhandler = null;

  useEffect(() => {
    if (
      // !fetchedChatData &&
      // thread.fromNotification &&
      // !senderObj.displaypic &&
      chatResults &&
      chatResults.length
    ) {
      const currentChat = chatResults.filter(chat => chat._id == thread._id);

      if (currentChat && currentChat.length && currentChat !== thread) {
        console.log('currentChat', currentChat);
        setThread(currentChat[0]);
        // alert(JSON.stringify(currentChat[0].blockedIds));

        checkBlockedChat(currentChat[0]);
        // setFetchedChatData(true);
        const senderInfo = currentChat[0].userDetails.find(
          o => o.id != userInfo._id,
        );
        setSenderObj({
          ...senderObj,
          displaypic: senderInfo.displaypic,
        });
      }
    }

    console.log(chatResults, 'chatResults');
  }, [chatResults]);

  useEffect(() => {
    if (thread.fromNotification && !getChatsEventCalled) {
      dispatch(fetchChats(userInfo));
    }

    console.log('in useeffect ', messages);

    if (!backhandler) {
      backhandler = backButtonHandler();
    }
    if (!messagesListener) messagesListener = getMessages();
    // if (!threadListener) threadListener = listenForThread();

    // dispatch(setLoading(false));
    // Stop listening for updates whenever the component unmounts
    return () => {
      dispatch(setChatPageOpened(false));
      console.log('unmounting');
      backhandler.remove();
      messagesListener();
      // chatResults.map(data => {
      if (!isChatDeleted) {
        markMessagesRead(thread);
      }
      // });

      // threadListener();
      // dispatch(setCurrentOpenedChat({}))
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      PushNotification.cancelAllLocalNotifications();
    }, 3000);
  }, [messages]);

  const checkToRemoveChat = () => {
    if (stateRef.current && (!messages || !messages.length)) {
      console.log('in checkToRemoveChat If', stateRef.current);
      console.log('in  checkToRemoveChat if', messages);
      // if (isSupport) {
      var colRef = firestore()
        .collection('THREADS')
        .doc(thread._id)
        .collection('MESSAGES');

      colRef.get().then(querySnapshot => {
        Promise.all(querySnapshot.docs.map(d => d.ref.delete())).then(() => {
          firestore()
            .collection('THREADS')
            .doc(thread._id)
            .delete()
            .then(() => {
              isChatDeleted = true;
              if (navigation.canGoBack())
                // setTimeout(() => {
                navigation.goBack();
              // navigation.navigate('Chat', { screen: 'ChatPage' });
              // }, 100);
              else
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'BottomNav' }],
                });
            })
            .catch(error => {
              console.log('error', error);
            });
        });
      });
      return;
    } else if (navigation.canGoBack()) {
      navigation.goBack();
      // navigation.navigate('Chat', { screen: 'ChatPage' });
    } else
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomNav' }],
      });
  };

  const getMessages = () => {
    console.log('in getMessages');
    return firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('serverTime', 'desc')
      .onSnapshot(querySnapshot => {
        console.log('in getMessages snapshot');
        const messagesArr = [];
        for (var i in querySnapshot.docs) {
          const doc = querySnapshot.docs[i];
          // const messagesArr = querySnapshot.docs.filter(doc => {
          const firebaseData = doc.data();
          console.log('getejlkj', firebaseData);

          console.log(firebaseData.deletedIds);
          console.log(userInfo._id);
          // PushNotification.cancelLocalNotification({
          //   id: firebaseData?.sentTime,
          // });

          if (
            !firebaseData.deletedIds ||
            !firebaseData.deletedIds.length ||
            (firebaseData.deletedIds.length &&
              firebaseData.deletedIds.indexOf(userInfo._id) == -1)
          ) {
            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              ...firebaseData,
            };

            // if (!firebaseData.system) {
            //     data.user = {
            //         ...firebaseData.user,
            //         name: firebaseData.user.username
            //     };
            // }
            messagesArr.push(data);
          }

          // });
        }
        console.log('updagteig masgs', JSON.stringify(messagesArr));
        if (messages.length != messagesArr.length) {
          setMessages(messagesArr);
        }
      });
  };

  const checkBlockedChat = data => {
    // thread..map(data => {
    //   // for (var i in querySnapshot.docs) {
    //   console.log('listenforthresads');

    //   console.log(data);
    //   alert(JSON.stringify(data.blockedIds));
    if (
      data.blockedIds &&
      data.blockedIds.length &&
      data.blockedIds.indexOf(userInfo._id) > -1
    ) {
      // alert('You have been blocked by this user');
      setGotBlocked(true);
    } else {
      setGotBlocked(false);
    }
    if (
      data.blockedIds &&
      data.blockedIds.length &&
      data.blockedIds.indexOf(senderObj.id) > -1
    ) {
      setDidBlock(true);
    } else {
      setDidBlock(false);
    }

    // if (
    //   thread &&
    //   thread.blockedIds &&
    //   thread.blockedIds.length &&
    //   thread.blockedIds.indexOf(userInfo._id) > -1
    // ) {
    //   setGotBlocked(true);
    // } else {
    //   setGotBlocked(false);
    // }
    // markMessagesRead(data);
    // }
    // });
  };

  const markMessagesRead = async data => {
    console.log('data', data);
    if (
      !isChatDeleted &&
      data &&
      data.latestMessage &&
      data.latestMessage.senderId !== userInfo._id
      // &&
      // data.latestMessage.read == false
    ) {
      console.log('markMessagesRead');

      var updateObj = {
        latestMessage: {
          // ...data.latestMessage,
          read: true,
        },
      };
      await firestore()
        .collection('THREADS')
        .doc(thread._id)
        .set(updateObj, { merge: true });
    }
  };

  const handleSend = messages => {
    const text = messages[0].text;
    if (didBlock) {
      Alert.alert(
        '',
        'Unblock to send message',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
          {
            text: 'Unblock',
            onPress: () => {
              blockUserConfirmed();
              updateMessage(text);
            },
          },
        ],
        { cancelable: false },
      );
    } else updateMessage(text);
    // alert(JSON.stringify(thread.ids))
  };

  const updateMessage = async text => {
    console.log('updateMessage', JSON.stringify(thread));
    setNewChat(false);

    var msgObj = {
      text: text,
      serverTime: new Date().getTime(),
      // serverTime: firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().getTime(),
      user: {
        _id: userInfo._id,
        email: userInfo.email,
        name: userInfo.username,
      },
    };
    // alert(gotBlocked);

    if (gotBlocked) {
      // msgObj.deletedIds = firestore.FieldValue.arrayRemove(userInfo._id)
      msgObj.deletedIds = [senderObj.id];
    }

    var updateObj = {
      userDetails: [
        {
          id: userInfo._id,
          name: userInfo.username,
          displaypic: userInfo.displaypic,
        },
        { ...senderObj },
      ],
      latestMessage: {
        text: text,
        createdAt: new Date().getTime(),
        serverTime: new Date().getTime(),
        senderId: userInfo._id,
        read: false,
        // deletedIds: msgObj.deletedIds,
        // serverTime: firestore.FieldValue.serverTimestamp()
      },
      deletedIds: [], //firestore.FieldValue.arrayRemove(userInfo._id),
      newChat: false,
      support: isSupport,
      // displaypic: userInfo.displaypic
    };

    // if (newChat) {
    //   updateObj.deletedIds = firestore.FieldValue.arrayRemove(senderObj.id);
    // }

    console.log('msgObj', JSON.stringify(msgObj));
    console.log('updateObj', JSON.stringify(updateObj));

    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add(msgObj);

    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(updateObj, { merge: true });
    if (!gotBlocked) sendNotification(text);
  };

  const sendNotification = text => {
    console.log('sendnotification', JSON.stringify(thread));
    // console.log(thread)
    // console.log(thread.ids)
    var receiverId = thread.ids.filter(ele => ele != userInfo._id);
    var dataobj = {
      ...thread,
      type: 'CHAT',
      name: userInfo.username,
    };
    dataobj.displaypic = '';
    var temp = [];
    dataobj.userDetails.filter(elem => {
      // delete elem["displaypic"]
      var obj = {
        ...elem,
        displaypic: '',
      };
      temp.push(obj);
      return JSON.parse(JSON.stringify(obj));
    });
    dataobj.userDetails = JSON.parse(JSON.stringify(temp));
    console.log('dataobj');
    console.log(dataobj);
    fetch(sendChatNotificationUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userInfo.username,
        message: text,
        _id: receiverId[0],
        data: dataobj,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Showing response message coming from server after inserting records.
      })
      .catch(error => {
        console.error(error);
      });

    if (isSupport) {
      let obj = {
        username: userInfo.username,
        userid: userInfo._id,
        feedbackrating: 'SUPPORT',
        description: text,
      };
      sendSupportEmail(obj);
    }
  };

  const sendSupportEmail = obj => {
    fetch(submitfeedbackUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then(responseJson => {})
      .catch(error => {});
  };

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'rgb(0, 95, 132)',
          },
          left: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgb(217, 231, 235)',
            borderWidth: 1,
          },
        }}
        textStyle={{
          left: {
            paddingVertical: 8,
            paddingHorizontal: 5,
            color: 'black',
          },
          right: {
            paddingVertical: 8,
            paddingHorizontal: 5,
            color: 'white',
          },
        }}
      />
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#105883" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#105883" />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  function renderTime(props) {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: '#7b8a91',
          },
        }}
      />
    );
  }

  function renderMessage(props) {
    return (
      <Message
        {...props}
        timeTextStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: '#7b8a91',
          },
        }}
      />
    );
  }

  function renderMessage(props) {
    return (
      <Message
        {...props}
        containerStyle={{
          right: {
            paddingRight: 5,
          },
          left: {
            paddingLeft: 0,
          },
        }}
      />
    );
  }

  function renderAvatar(props) {
    return (
      <Ava
        {...props}
        imageStyle={{
          left: {
            backgroundColor: 'rgb(0, 62, 86)',
          },
        }}
      />
    );
  }

  const deleteConfirmed = async () => {
    dispatch(setLoading(true));

    // const querySnapshot = await firestore()
    //     .collection('THREADS')
    //     .doc(thread._id)
    //     .collection('MESSAGES').get();

    // for (var i in querySnapshot.docs) {
    //     const document = querySnapshot.docs[i]
    //     const data = document.data()
    //     if (data.deletedIds && data.deletedIds.length && data.deletedIds.indexOf(userInfo._id) == -1) {
    //         firestore()
    //             .collection('THREADS')
    //             .doc(thread._id)
    //             .collection('MESSAGES')
    //             .doc(document.id).delete()
    //     } else {
    //         firestore()
    //             .collection('THREADS')
    //             .doc(thread._id)
    //             .collection('MESSAGES')
    //             .doc(document.id)
    //             .set(
    //                 {
    //                     deletedIds: [userInfo._id]
    //                 },
    //                 { merge: true }
    //             );
    //     }
    // }
    const collection = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES');

    const newDocumentBody = {
      deletedIds: [userInfo._id],
    };

    collection.get().then(response => {
      let batch = firestore().batch();
      response.docs.forEach(doc => {
        const docRef = collection.doc(doc.id);
        const data = doc.data();
        if (
          data.deletedIds &&
          data.deletedIds.length &&
          data.deletedIds.indexOf(userInfo._id) == -1
        ) {
          batch.delete(docRef);
        } else {
          batch.update(docRef, newDocumentBody);
        }
      });
      batch.commit().then(() => {
        console.log('updated all documents insidde');
      });
    });

    // const threadquerySnapshot = await firestore()
    //     .collection('THREADS')
    //     .doc(thread._id).get();

    // // console.log(threadquerySnapshot.data)
    // if (threadquerySnapshot.data && threadquerySnapshot.data.deletedIds && threadquerySnapshot.data.deletedIds.length && threadquerySnapshot.data.deletedIds.indexOf(userInfo._id) == -1) {
    //     await firestore()
    //         .collection('THREADS')
    //         .doc(thread._id).delete();
    // }
    // else {
    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          deletedIds: firestore.FieldValue.arrayUnion(userInfo._id),
        },
        { merge: true },
      );
    // }

    navigation.goBack();
    // navigation.navigate('ChatPage');
    dispatch(setLoading(false));
    return;
  };

  const deleteChat = () => {
    if (!stateRef.current)
      Alert.alert(
        '',
        'Do you want to delete the chat?',
        [
          {
            text: 'No',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => deleteConfirmed() },
        ],
        { cancelable: false },
      );
    // else alert("sfjskfjl")

    // await foreach(querySnapshot,  (documentSnapshot) => {
    //     // await firestore()
    //     //     .collection('THREADS')
    //     //     .doc(thread._id)
    //     //     .collection('MESSAGES')
    //     //     .doc(documentSnapshot.id)
    //     //     .set(
    //     //         {
    //     //             deletedIds: [userInfo._id]
    //     //         },
    //     //         { merge: true }
    //     // );
    //     alert(documentSnapshot.id)
    // });
    // querySnapshot.forEach(async (documentSnapshot) => {
    //     // data = documentSnapshot.data();
    //     // if (data["ids"].indexOf(item.userinfo._id) > -1) {
    //     //     exists = true;

    //     //     item = {
    //     //         ...item,
    //     //         _id: documentSnapshot.id,
    //     //         name: item.userinfo.username
    //     //     }
    //     // }
    //     await firestore()
    //         .collection('THREADS')
    //         .doc(thread._id)
    //         .collection('MESSAGES')
    //         .doc(documentSnapshot.id)
    //         .set(
    //             {
    //                 deletedIds: [userInfo._id]
    //             },
    //             { merge: true }
    //         );

    // })
  };

  const snackComponent = () => {
    return (
      <Snackbar
        visible={!!visibleSnackbar}
        onDismiss={() => setVisibleSnackbar('')}
        duration={3000}
        action={{
          label: 'X',
          onPress: () => {
            setVisibleSnackbar('');
          },
        }}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          borderWidth: 0.4,
          borderColor: 'grey',
        }}
        wrapperStyle={{ backgroundColor: 'white' }}>
        <Text style={{ color: 'black', fontSize: 16, letterSpacing: 1 }}>
          {visibleSnackbar}
        </Text>
      </Snackbar>
    );
  };

  const loadingComponent = () => {
    setTimeout(() => {
      dispatch(setLoading(false));
      setVisibleSnackbar('Something went wrong, Please try again');
    }, 10000);
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={Colors.black} />
      </View>
    );
  };

  // const deleteChat = () => {
  //     alert("deleteChat")
  // }

  const blockUserConfirmed = async () => {
    console.log('didBlock');
    console.log(senderObj.id);
    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          blockedIds: !didBlock
            ? firestore.FieldValue.arrayUnion(senderObj.id)
            : firestore.FieldValue.arrayRemove(senderObj.id),
        },
        { merge: true },
      );

    setDidBlock(!didBlock);
  };

  const blockUser = () => {
    Alert.alert(
      'block ' + senderObj.name + ' ?',
      "you won't receive any messages from this user",
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => blockUserConfirmed() },
      ],
      { cancelable: false },
    );
  };

  const unblockUser = () => {
    Alert.alert(
      'Unblock ' + senderObj.name + ' ?',
      'User will be able to send messages',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => blockUserConfirmed() },
      ],
      { cancelable: false },
    );
  };

  const goToProfile = thread => {
    if (!isSupport) {
      navigation.navigate('UserDetailsPage', {
        userinfo: {
          ...thread,
          uid: senderObj.id,
          displaypic: senderObj.displaypic,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 0 }}>
      <View style={styles.headerComponent}>
        <TouchableOpacity onPress={() => checkToRemoveChat()}>
          <Icons
            name={'keyboard-backspace'}
            // color="#fff"
            size={27}
          />
        </TouchableOpacity>
        <View
          style={{
            // alignItems: "center",
            // justifyContent: "center",
            flex: 0.8,
            // width: '70%',
            // flexDirection: "row",
            marginLeft: 20,
            // justifyContent: ""
          }}>
          <TouchableOpacity onPress={() => goToProfile(thread)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar
                rounded
                containerStyle={{ margin: 7 }}
                size={30}
                // source={require('../../../assets/img/default-mask-avatar.png')}
                source={
                  senderObj.displaypic
                    ? { uri: senderObj.displaypic }
                    : require('../../../assets/img/default-mask-avatar.png')
                }
              />
              <Text style={styles.headerTitle} numberOfLines={1}>
                {senderObj.name}
                {/* {alert(senderObj.id)} */}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
          <OptionsMenu
            customButton={
              <Icons
                name={'dots-vertical'} // color="#fff"
                size={25}
                style={{ paddingRight: 15 }}
              />
            }
            destructiveIndex={1}
            options={
              !isSupport
                ? ['Delete Chat', didBlock ? 'Unblock' : 'Block']
                : ['Delete Chat']
            }
            actions={
              !isSupport
                ? [deleteChat, didBlock ? unblockUser : blockUser]
                : [deleteChat]
            }
          />
        </View>
        {/* <Icons
                    name={"camera"}
                    // color="#fff"
                    size={27}
                    style={{ flex: 0.2 }}
                    onPress={() => handleAddPicture()}
                /> */}
      </View>
      {!!loading && loadingComponent()}
      {!loading && (
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{ _id: userInfo._id }}
          placeholder="Type your message here..."
          alwaysShowSend
          showUserAvatar={false}
          scrollToBottom
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          renderAvatar={renderAvatar}
          // renderLoadEarlier={true}
          // renderAvatar={null}
          renderSend={renderSend}
          renderTime={renderTime}
          scrollToBottomComponent={scrollToBottomComponent}
          renderSystemMessage={renderSystemMessage}
          showAvatarForEveryMessage={false}
          renderAvatarOnTop={true}
          // renderActions={() => (
          //     <Feather
          //         style={styles.uploadImage}
          //         onPress={this.uploadImage}
          //         name='image'
          //         size={30}
          //         color='#000'
          //     />
          // )}
          // bottomOffset={155}
          // isTyping={true}
        />
      )}
      {snackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 9,
    paddingHorizontal: 14,
    marginHorizontal: 10,
    // marginBottom: 30,
  },
  systemMessageText: {
    fontSize: 15,
    color: 'black',
    opacity: 0.8,
    // fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  headerComponent: {
    flexDirection: 'row',
    // height: 40,
    alignItems: 'center',
    paddingLeft: 20,
    paddingVertical: 10,
    // marginTop: 20,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
  },
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    zIndex: 99999,
    width: '100%',
    height: '100%',
  },
});
