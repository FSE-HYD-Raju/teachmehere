import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Button,
  Image,
  RefreshControl,
} from 'react-native';
import {
  IconButton,
  Title,
  List,
  Divider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import { Avatar } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { loginSelector } from '../../../redux/slices/loginSlice';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  chatSelector,
  fetchChats,
  setChatResults,
  checkChatExists,
  disableLoading,
  setNewChatList,
} from '../../../redux/slices/chatSlice';
import {
  addToRequestedCoursesUrl,
  newChatListByidUrl,
  sendChatNotificationUrl,
} from '../../../redux/urls';

export default function NewChat({ navigation }) {
  // const [allUsers, setAllUsers] = useState([]);
  const [newChatLoading, setLoading] = useState(false);
  const { userInfo } = useSelector(loginSelector);
  const { chatResults, newChatList } = useSelector(chatSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('newchat length');
    console.log(newChatList.length);
    if (userInfo._id && !newChatList.length) getNewChatList();
  }, []);

  const getNewChatList = () => {
    setLoading(true);
    fetch(newChatListByidUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userInfo._id,
      }),
    })
      .then(response => response.json())
      .then(requestedJson => {
        if (requestedJson.length) {
          let userslist = requestedJson.filter((ele, ind) => {
            let status = ele.status == 'ACCEPTED';
            let matchInd = requestedJson.findIndex(
              elem =>
                elem.userinfo._id === ele.userinfo._id &&
                elem.status == 'ACCEPTED',
            );
            let duplicate = ind === matchInd;
            return status && duplicate;
          });
          dispatch(setNewChatList(userslist));
        }

        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  // function sendRequest(item) {
  //     setLoading(true);
  // fetch(addToRequestedCoursesUrl, {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //             "uid": user._id,
  //             "courseid": item._id,
  //         })

  //     }).then((response) => response.json())
  //         .then((responseJson) => {
  //             addFirebaseNotification(item);
  //         }).catch((error) => {
  //             navigation.navigate('Home');
  //             console.error(error);
  //             setLoading(false);
  //         });
  // }

  // const addFirebaseNotification = (item) => {
  //     // notifyobj = {
  //     //     senderName: user.username,
  //     //     senderId: user._id,
  //     //     receiverName: item.username,
  //     //     receiverId: item._id,
  //     //     status: "PENDING",
  //     //     type: "REQUEST",
  //     //     createdAt: new Date().getTime(),
  //     //     message: "Lets be friends..!"
  //     // }

  //     // firestore().collection('NOTIFICATIONS').add(notifyobj).then(docRef => {
  //     //     sendNotification(item, notifyobj)
  //     // });
  // }

  // const sendNotification = (item, notifyobj) => {
  // fetch(sendChatNotificationUrl, {
  //         method: 'POST',
  //         headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //             "username": user.username,
  //             "message": notifyobj.message,
  //             "_id": item._id,
  //             "data": notifyobj
  //         })

  //     }).then((response) => response.json())
  //         .then((responseJson) => {
  //             alert("Notification sent to the user")
  //             navigation.navigate('Home');
  //             setLoading(false);
  //             // Showing response message coming from server after inserting records.
  //         }).catch((error) => {
  //             navigation.navigate('Home');
  //             console.error(error);
  //             setLoading(false);
  //         });
  // }

  function sendMessage(item) {
    const ref = firestore()
      .collection('THREADS')
      .doc();

    var messageObj = {
      // id: ref.id,
      userDetails: [
        {
          id: userInfo._id,
          name: userInfo.username,
          displaypic: userInfo.displaypic,
        },
        {
          id: item.userinfo._id,
          name: item.userinfo.username,
          displaypic: item.userinfo.displaypic,
        },
      ],
      ids: [userInfo._id, item.userinfo._id],
      latestMessage: {
        text: 'Say Hello..',
        createdAt: Date.now(),
      },
      deletedIds: [item.userinfo._id],
      newChat: true,
    };
    ref.set(messageObj).then(() => {
      // ref.get().then(doc => {
      //    alert(JSON.stringify(doc.data()))
      // })
      ref
        .collection('MESSAGES')
        .add({
          text: 'Say Hello..',
          createdAt: Date.now(),
          system: true,
        })
        .then(() => {});
    });

    var itemObj = {
      // ...item,
      ...messageObj,
      _id: ref.id,
      name: item.userinfo.username,
      displaypic: item.userinfo.displaypic,
      senderDetailsId: item.userinfo._id,
    };
    // navigation.popToTop();
    // setLoading(false);
    navigation.navigate('ChatRoom', { thread: itemObj });
  }

  const checkIfChatExists = item => {
    // alert("item" + JSON.stringify(item))
    // alert("userInfo" + JSON.stringify(userInfo))
    var exists = false;

    setLoading(true);

    firestore()
      .collection('THREADS')
      .where('ids', 'array-contains', userInfo._id)
      .get()
      .then(querySnapshot => {
        for (var i in querySnapshot.docs) {
          const documentSnapshot = querySnapshot.docs[i];
          const data = documentSnapshot.data();
          if (data['ids'].indexOf(item.userinfo._id) > -1) {
            exists = true;
            item = {
              ...data,
              _id: documentSnapshot.id,
              name: item.userinfo.username,
            };
            break;
          }
        }
        // querySnapshot.forEach(documentSnapshot => {
        //     data = documentSnapshot.data();
        //     if (data["ids"].indexOf(item.userinfo._id) > -1) {
        //         exists = true;

        //         item = {
        //             ...item,
        //             _id: documentSnapshot.id,
        //             name: item.userinfo.username
        //         }
        //     }
        // })
        setLoading(false);
        if (!exists) {
          sendMessage(item);
        } else {
          // navigation.popToTop();
          navigation.navigate('ChatRoom', { thread: item });
        }
      });

    // alert("item " + JSON.stringify(item))
    // alert("chatResults" + JSON.stringify(chatResults))

    // var filterRes = chatResults.filter(ele => ele["ids"].indexOf(item.userinfo._id) > -1)
    // if (filterRes.length) {
    //     navigation.popToTop();
    //     navigation.navigate('ChatRoom', { thread: filterRes[0] });
    // } else {
    //     sendMessage(item)
    // }

    // dispatch(checkChatExists(userInfo, item))

    // firestore().collection('THREADS').
    //     where("ids", "array-contains", user._id).
    //     get().then(querySnapshot => {
    //         querySnapshot.forEach(documentSnapshot => {
    //             data = documentSnapshot.data();
    //             if (data["ids"].indexOf(item._id) > -1) {
    //                 exists = true;

    //                 item = {
    //                     ...item,
    //                     _id: documentSnapshot.id,
    //                     name: item.username
    //                 }
    //             }
    //         })
    //         if (!exists) {
    //             sendMessage(item)
    //         } else {
    //             navigation.navigate('Room', { thread: item });
    //         }
    //     });
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={Colors.black} />
        {/* <Image
                    source={require('../../../assets/img/loading_gif.gif')}
                    size={5}
                    style={{ }}
                /> */}
      </View>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.headerComponent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons
            name={'keyboard-backspace'}
            // color="#fff"
            size={27}
            // style={{ flex: 0.2 }}
          />
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            paddingLeft: 20,
            justifyContent: 'center',
            // flex: 0.4
          }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Your Connections
          </Text>
        </View>
      </View>
      {!newChatLoading && !!newChatList.length && (
        <FlatList
          data={newChatList}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => <Divider />}
          refreshControl={
            <RefreshControl
              refreshing={newChatLoading}
              onRefresh={getNewChatList}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => checkIfChatExists(item)}>
              <List.Item
                title={item.userinfo.username}
                left={props => (
                  <Avatar
                    rounded
                    containerStyle={{ margin: 7, marginTop: 15 }}
                    size={30}
                    // source={{ uri: item.userinfo.displaypic ? item.userInfo.displaypic : '../../../assets/img/default-mask-avatar.png' }}
                    source={
                      item.userinfo.displaypic
                        ? { uri: item.userinfo.displaypic }
                        : require('../../../assets/img/default-mask-avatar.png')
                    }
                    // source={require('../../../assets/img/default-mask-avatar.png')}
                  />
                )}
                right={props => (
                  <Icons
                    style={{ margin: 7, marginTop: 20 }}
                    name={'message-text-outline'}
                    color="rgb(102, 94, 94)"
                    size={25}
                  />
                )}
                // description={item.coursedetails.coursename}
                // right={props =>
                //     <View style={styles.iconContainer}>
                //         {!item.request_status && <Button title="Send Request" onPress={() => sendRequest(item)} />}
                //         {(item.request_status == "REJECTED" || item.request_status == "PENDING") && <Button title={item.request_status} disabled={true} />}
                //         {item.request_status == "ACCEPTED" && <Button title="Message" onPress={() => checkIfChatExists(item)} />}
                //     </View>
                // }
                // titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
                titleNumberOfLines={1}
                style={{
                  padding: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </TouchableOpacity>
          )}
        />
      )}
      {!!newChatLoading && loadingComponent()}

      {!newChatLoading && !newChatList.length && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            // width={Dimensions.get('window').width}
            //     resizeMode={"center"}
            style={styles.backgroundImage}
            source={require('../../../assets/img/chatroom.png')}
          />
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: 20,
              color: '#105883',
            }}>
            You have no accepted requests!
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              margin: 10,
              color: 'grey',
              fontSize: 15,
            }}>
            Search for skills you like, send them requests and chat with them.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    // width: 360,
    // height: 275,
    // flex: 1,
    width: 200,
    height: 200, //362 is actual height of image
  },
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 100,
  },
  icon: {
    fontSize: 36,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 150,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 20,
  },
  listDescription: {
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'sans-serif',
    // fontWeight: "bold"
  },
  headerComponent: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
});
