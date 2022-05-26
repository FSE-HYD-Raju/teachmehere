import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Text,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  List,
  Divider,
  Searchbar,
  FAB,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useDispatch, useSelector } from 'react-redux';
import { loginSelector } from '../../../redux/slices/loginSlice';
import {
  chatSelector,
  fetchChats,
  setChatResults,
  clearData,
  clearLoading,
} from '../../../redux/slices/chatSlice';

import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default function Chat({ navigation }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(loginSelector);
  const { chatResults, searchChatResults, loading } = useSelector(chatSelector);
  var focusNotiMsg = null;
  var unsubscribe = null;
  var notificunsubscribe = null;

  useEffect(() => {
    dispatch(clearData());

    if (userInfo._id) {
      unsubscribe = getChats();
    } else {
      dispatch(clearLoading());
    }
    // return () => unsubscribe();
  }, [userInfo]);

  const getChats = () => {
    return dispatch(fetchChats(userInfo));
  };

  const searchFun = query => {
    const newData = chatResults.filter(ele =>
      ele.name.toLowerCase().includes(query.toLowerCase()),
    );
    dispatch(setChatResults(newData));
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={Colors.black} />
      </View>
    );
  };

  var REFERENCE = moment(); // fixed just for testing, use moment();
  var TODAY = REFERENCE.clone().startOf('day');
  var YESTERDAY = REFERENCE.clone()
    .subtract(1, 'days')
    .startOf('day');

  return (
    <>
      <View style={styles.container}>
        <Searchbar
          style={{ margin: 15, borderRadius: 18 }}
          inputStyle={{
            fontSize: 13,
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          placeholder="Search by name..."
          onChangeText={searchFun}
        />

        {!!loading && loadingComponent()}
        {!loading && (
          <View style={{ flex: 1 }}>
            <FlatList
              data={searchChatResults}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => {
                console.log(item);
                console.log('tag', item.latestMessage);
                console.log(userInfo._id);

                let senderId = item.ids.filter(id => id != userInfo._id);
                senderId = senderId[0] || '';

                let unreadMsg;
                let blocked = false;

                if (
                  item?.blockedIds?.indexOf(senderId) > -1 ||
                  item?.latestMessage?.deletedIds?.indexOf(userInfo._id) > -1
                ) {
                  blocked =
                    item?.blockedIds?.indexOf(senderId) > -1 ? 'blocked' : ' ';
                } else {
                  unreadMsg =
                    item.latestMessage?.read == false &&
                    item.latestMessage?.senderId != userInfo._id;
                }
                let createdAt = item.latestMessage?.createdAt;

                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ChatRoom', { thread: item })
                    }>
                    <List.Item
                      title={item.name}
                      description={blocked ? blocked : item.latestMessage.text}
                      left={props => (
                        <Avatar
                          rounded
                          containerStyle={{ margin: 7 }}
                          size={50}
                          // source={require('../../../assets/img/default-mask-avatar.png')}
                          source={
                            item.displaypic
                              ? { uri: item.displaypic }
                              : require('../../../assets/img/default-mask-avatar.png')
                          }
                        />
                      )}
                      right={props => {
                        return (
                          <View style={{ flexDirection: 'column' }}>
                            {!blocked && (
                              <View>
                                <Text
                                  style={[
                                    styles.datetime,
                                    unreadMsg && {
                                      color: 'black',
                                      fontWeight: 'bold',
                                    },
                                  ]}>
                                  {moment(createdAt).isSame(TODAY, 'd')
                                    ? moment(createdAt).format('hh:mm A')
                                    : moment(createdAt).isSame(YESTERDAY, 'd')
                                    ? moment(createdAt).format('ddd')
                                    : moment(createdAt).format('MMM D')}
                                </Text>
                              </View>
                            )}
                            {unreadMsg && (
                              <View
                                style={{
                                  // position: 'absolute',
                                  // width: '100%'
                                  marginTop: 3,
                                  alignItems: 'flex-end',
                                }}>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontSize: 10,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    padding: 5,
                                    height: 25,
                                    width: 25,
                                    backgroundColor: '#04b1ba',
                                    borderRadius: 50,
                                    // // right: -5,
                                    // // top: -5,
                                    // justifyContent: 'center',
                                    // alignItems: 'center'
                                  }}>
                                  {'1'}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      }}
                      titleNumberOfLines={1}
                      titleStyle={[
                        styles.listTitle,
                        unreadMsg && {
                          color: 'black',
                          fontWeight: 'bold',
                        },
                      ]}
                      descriptionStyle={[
                        styles.listDescription,
                        unreadMsg && {
                          color: 'black',
                          fontWeight: 'bold',
                        },
                      ]}
                      descriptionNumberOfLines={1}
                    />
                  </TouchableOpacity>
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => getChats()}
                />
              }
            />
          </View>
        )}

        {!loading && (
          <FAB
            style={styles.fab}
            // small
            icon={props => <AwesomeIcon {...props} name="pencil-square-o" />}
            color="black"
            onPress={() => navigation.navigate('NewChat')}
          />
        )}
      </View>
      {!loading && !chatResults.length && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            // backgroundColor: 'red',
            width: '100%',
            top: 130,
            padding: 3,
            // paddingLeft: 30,
          }}>
          <Image
            // width={Dimensions.get('window').width}
            //     resizeMode={"center"}
            style={styles.backgroundImage}
            source={require('../../../assets/img/charfromhome.png')}
          />
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: 20,
              color: '#105883',
            }}>
            You have no chats!
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
    </>
  );
}

const win = Dimensions.get('window');
const ratio = win.width / 4000;
const styles = StyleSheet.create({
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 100,
  },
  backgroundImage: {
    // width: 360,
    // height: 275,
    // flex: 1,
    width: 200,
    height: 200, //362 is actual height of image
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 10,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  icon: {
    fontSize: 20,
  },
  datetime: {
    marginTop: 13,
  },
  listTitle: {
    fontSize: 20,
  },
  listDescription: {
    fontSize: 13,
  },
});
