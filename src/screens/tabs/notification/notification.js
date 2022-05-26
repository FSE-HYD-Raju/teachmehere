import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  RefreshControl,
  TextInput,
} from 'react-native';
import {
  IconButton,
  List,
  Divider,
  Button,
  ActivityIndicator,
  Colors,
  FAB,
  Chip,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import {
  notificationSelector,
  setNotificationsList,
} from '../../../redux/slices/notificationSlice';
import { loginSelector } from '../../../redux/slices/loginSlice';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, ButtonGroup, Avatar } from 'react-native-elements';
import { sendChatNotificationUrl, updateStatusUrl } from '../../../redux/urls';

export default function NotificationPage({ navigation }) {
  const { userInfo } = useSelector(loginSelector);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { notificationsList } = useSelector(notificationSelector);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [
    requestNotificationsList,
    setRequestNotificationsList,
  ] = React.useState([]);
  const [infoNotificationsList, setInfoNotificationsList] = React.useState([]);

  useEffect(() => {
    if (userInfo && userInfo._id) getNotifications();
  }, []);

  const getNotifications = () => {
    setLoading(true);
    firestore()
      .collection('NOTIFICATIONS')
      .where('receiverId', '==', userInfo._id)
      .get()
      .then(
        snapshot => {
          let notificationsArr = [];
          snapshot.forEach(documentSnapshot => {
            const data = {
              _id: documentSnapshot.id,
              text: '',
              ...documentSnapshot.data(),
            };

            notificationsArr.push(data);
          });
          notificationsArr.sort((a, b) => b.createdAt - a.createdAt);
          dispatch(setNotificationsList(notificationsArr));
          setInfoNotificationsList(
            notificationsArr.filter(ele => ele.type != 'REQUEST'),
          );
          setRequestNotificationsList(
            notificationsArr.filter(ele => ele.type == 'REQUEST'),
          );
          setLoading(false);
        },
        error => {
          setLoading(false);
        },
      );
  };

  const changestatus = async (item, status) => {
    console.log('chn');
    console.log(item);
    console.log(status);

    setLoading(true);
    await firestore()
      .collection('NOTIFICATIONS')
      .doc(item._id)
      .set(
        {
          status: status,
        },
        { merge: true },
      )
      .then(
        res => {
          console.log(res);

          updateRequestedCourse(item, status);
        },
        error => {
          console.error(error);
          setLoading(false);
          cosole.log('something went wrong');
        },
      );
  };

  const updateRequestedCourse = (item, status) => {
    console.log('updateRequestedCourse');

    fetch(updateStatusUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: item.senderId,
        courseid: item.courseid,
        courseuid: item.receiverId,
        status: status,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);

        addNotification(item, status);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        console.log('something went wrong');
      });
  };

  const addNotification = (item, status) => {
    const notifyobj = {
      senderName: userInfo.username,
      senderId: userInfo._id,
      receiverName: item.senderName,
      receiverId: item.senderId,
      status: status,
      type: 'INFO',
      createdAt: new Date().getTime(),
      message:
        status == 'ACCEPTED'
          ? 'Accepted your request'
          : 'Declined your request',
      // _id: docRef._id,
      // ids: [userInfo._id, item._id],
      // senderName: userInfo.username,
      // senderId: userInfo._id,
      // receiverName: item.senderName,
      // receiverId: item.senderId,
      // createdAt: new Date().getTime(),
      // message: "accepted your request"
    };
    console.log(notifyobj);

    firestore()
      .collection('NOTIFICATIONS')
      .add(notifyobj)
      .then(
        docRef => {
          fetch(sendChatNotificationUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: userInfo.username,
              message: notifyobj.message,
              _id: item.senderId,
              thread: notifyobj,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log(responseJson);
              setLoading(false);
              // sendNotification(item, notifyobj)
              navigation.goBack();
            })
            .catch(error => {
              setLoading(false);
              console.error(error);
              cosole.log('something went wrong');
            });
        },
        error => {
          setLoading(false);
          console.error(error);
          cosole.log('something went wrong');
        },
      );
  };

  const sendNotification = (item, notifyobj) => {
    console.log('insendnoti');
    let obj = {
      username: userInfo.username,
      message: notifyobj.message,
      _id: item.senderId,
      data: notifyobj,
    };
    console.log(obj);
    fetch(sendChatNotificationUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
        // setLoading(false);
      });
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={Colors.black} />
      </View>
    );
  };

  const requestNotificationsTab = () => {
    return (
      <View>
        {!!requestNotificationsList.length && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={requestNotificationsList}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={getNotifications}
              />
            }
            renderItem={({ item }) => {
              return item.type == 'REQUEST' && requestsNotifications(item);
            }}
          />
        )}

        {!requestNotificationsList.length && noDataComponent('requests')}
      </View>
    );
  };

  const requestsNotifications = item => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          paddingVertical: 20,
          borderColor: 'rgb(230, 230, 230)',
        }}>
        <Avatar
          rounded
          containerStyle={{ margin: 7 }}
          size={45}
          source={require('../../../assets/img/default-mask-avatar.png')}
        />
        <View style={{ flex: 0.7, justifyContent: 'center', paddingLeft: 10 }}>
          <Text
            style={{
              fontSize: 17,
              letterSpacing: 1,
              textTransform: 'capitalize',
            }}
            numberOfLines={2}>
            {item.senderName}{' '}
          </Text>
          <Text style={{ fontSize: 13, paddingVertical: 2 }} numberOfLines={2}>
            {item.message}{' '}
          </Text>
          {(item.status == 'REJECTED' || item.status == 'ACCEPTED') && (
            <Chip
              icon="information"
              mode="flat"
              disabled
              style={{ width: 100, fontSize: '5' }}
              textStyle={{ fontSize: 10 }}>
              {item.status}
            </Chip>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 0.2,
            justifyContent: 'center',
          }}>
          <FAB
            style={[
              { margin: 10 },
              item.status != 'REJECTED' && { backgroundColor: 'white' },
            ]}
            small
            color={item.status != 'REJECTED' ? 'red' : 'rgb(192, 154, 154)'}
            icon="close"
            onPress={() => changestatus(item, 'REJECTED')}
            disabled={item.status == 'REJECTED'}
          />
          <FAB
            style={[
              { margin: 10 },
              item.status != 'ACCEPTED' && { backgroundColor: 'white' },
            ]}
            color={item.status != 'ACCEPTED' ? 'green' : 'rgb(140, 184, 140)'}
            small
            icon="check"
            onPress={() => changestatus(item, 'ACCEPTED')}
            disabled={item.status == 'ACCEPTED'}
          />
        </View>
      </View>
    );
  };

  const updateNotificationsTab = () => {
    return (
      <View>
        {!!infoNotificationsList.length && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={infoNotificationsList}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={getNotifications}
              />
            }
            renderItem={({ item }) => {
              return item.type != 'REQUEST' && updateNotifications(item);
            }}
          />
        )}
        {!infoNotificationsList.length && noDataComponent('notifications')}
      </View>
    );
  };

  const updateNotifications = item => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          paddingVertical: 20,
          borderColor: 'rgb(230, 230, 230)',
        }}>
        <Avatar
          rounded
          containerStyle={{ margin: 7 }}
          size={45}
          source={require('../../../assets/img/default-mask-avatar.png')}
        />
        <View style={{ flex: 0.9, justifyContent: 'center', paddingLeft: 10 }}>
          <Text
            style={{
              fontSize: 17,
              letterSpacing: 1,
              textTransform: 'capitalize',
            }}
            numberOfLines={2}>
            {item.senderName}{' '}
          </Text>
          <Text style={{ fontSize: 13, paddingVertical: 2 }} numberOfLines={2}>
            {item.message}{' '}
          </Text>
        </View>
        <Icons style={{ fontSize: 20, padding: 15 }} name="bell-outline" />
      </View>
    );
  };

  const buttonsTabsComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          overflow: 'scroll',
        }}>
        <Button
          mode="outlined"
          onPress={() => setSelectedIndex(0)}
          color="black"
          style={[
            {
              margin: 10,
              borderTopStartRadius: 20,
              flex: 0.5,
              backgroundColor: 'rgba(225, 225, 225, 0.38)',
            },
            selectedIndex == 0 && { backgroundColor: 'white', elevation: 3 },
          ]}>
          Requests
        </Button>
        <Button
          mode="outlined"
          onPress={() => setSelectedIndex(1)}
          color="black"
          style={[
            {
              margin: 10,
              borderTopEndRadius: 20,
              flex: 0.5,
              backgroundColor: 'rgba(225, 225, 225, 0.38)',
            },
            selectedIndex == 1 && { backgroundColor: 'white', elevation: 3 },
          ]}>
          Updates
        </Button>
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <View style={styles.headerComponent}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
          <Icons name={'keyboard-backspace'} size={27} />
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            paddingLeft: 20,
            justifyContent: 'center',
          }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Notifications
          </Text>
        </View>
      </View>
    );
  };

  const bodyComponent = () => {
    return (
      <View>
        {buttonsTabsComponent()}
        {!loading && selectedIndex == 0 && requestNotificationsTab()}
        {!loading && selectedIndex == 1 && updateNotificationsTab()}
        {!!loading && loadingComponent()}
      </View>
    );
  };

  const noDataComponent = text => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          // width={Dimensions.get('window').width}
          //     resizeMode={"center"}
          style={styles.backgroundImage}
          source={require('../../../assets/img/notification1.png')}
        />
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: 20,
            color: '#105883',
          }}>
          You have no {text} !
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {headerComponent()}
      {bodyComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
  datetime: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "space-evenly",
    // width: 300,
    // marginTop: 10
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'sans-serif',
    // fontWeight: "bold"
  },
  headerComponent: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 50,
  },
  backgroundImage: {
    // width: 360,
    // height: 275,
    // flex: 1,
    marginTop: 50,
    width: 200,
    height: 200, //362 is actual height of image
  },
});
