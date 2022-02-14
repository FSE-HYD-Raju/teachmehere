import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ScrollView,
  Image,
  Share,
} from 'react-native';
import { Icon, Rating } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Price from './common/Price';
import { Card, ListItem } from 'react-native-elements';
import { Button, Avatar, Snackbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import globalStyles from '../screens/tabs/post/steps/styles';
import { random_rgba } from '../utils/random_rgba';
import { useDispatch, useSelector } from 'react-redux';
import { setLocale } from 'yup';
import { homeSelector } from '../redux/slices/homeSlice';
import { loginSelector, setReqFavPostedCount } from '../redux/slices/loginSlice';
import IconMaterialIcons from 'react-native-vector-icons/FontAwesome';
import { Illustrations } from '../assets/illustrations';

import {
  profileSelector,
  setRequestedSkills,
  setUserRating,
} from '../redux/slices/profileSlice';
import PageSpinner from '../components/common/PageSpinner';
import firestore from '@react-native-firebase/firestore';
import { DataTable } from 'react-native-paper';
import moment from 'moment';

const { labelColor, buttonColor } = random_rgba();

export default function SkillDetail({ route, navigation }) {
  const { skill, origin } = route.params;
  const { homeData } = useSelector(homeSelector);
  const { userInfo } = useSelector(loginSelector);
  const { requestedSkills, userRatings } = useSelector(profileSelector);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [requestedObj, setRequestedObj] = React.useState(null);
  const [areConnected, setAreConnected] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [userRating, setCurrentRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const currentSkillRating = userRatings.filter(
      ele => ele.courseid == skill._id,
    );
    const rating = currentSkillRating[0]?.rating;

    setCurrentRating(rating || 0);
  }, [userRatings]);

  useEffect(() => {
    if (
      userInfo._id
      // && (!requestedSkills || !requestedSkills.length)
    ) {
      getRequetedCourses(userInfo._id);
      getUserRating(userInfo._id);
    }
    // else if (userInfo._id) {
    //   let reqObj = requestedSkills.filter(
    //     obj => obj.courseuid == skill.uid,
    //   );
    //   if (reqObj.length) {
    //     setRequestedObj(reqObj[0]);
    //   }
    // }
  }, [userInfo]);

  const getRequetedCourses = uid => {
    setLoading(true);
    setAreConnected(false)
    setRequestSent(false)
    fetch('https://teachmeproject.herokuapp.com/requestedCoursesByid', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length) {
          dispatch(setRequestedSkills(responseJson));
        }
        let reqObj = responseJson.filter(obj => obj._id == skill._id);

        let connectedOj = responseJson.filter(obj => {
          console.log(obj.request_uid)
          return (((obj.courseuid == skill.uid && obj.request_uid == userInfo._id) || (obj.courseuid == userInfo._id && obj.request_uid == skill.uid)) && obj.request_status === "ACCEPTED")
        })
        let requestSentObj = responseJson.filter(obj => {
          console.log(obj.request_uid)
          return (((obj.courseuid == skill.uid && obj.request_uid == userInfo._id) || (obj.courseuid == userInfo._id && obj.request_uid == skill.uid)))
        })
        if (requestSentObj.length) {
          setRequestSent(true)
        }
        if (connectedOj.length) {
          setAreConnected(true)
        }
        if (reqObj.length) {
          setRequestedObj(reqObj[0]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const getUserRating = uid => {
    setRatingLoading(true);
    fetch('https://teachmeproject.herokuapp.com/getUserRatingById', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length) {
          dispatch(setUserRating(responseJson));
        } else {
          dispatch(setUserRating([]));
        }

        setRatingLoading(false);
      })
      .catch(error => {
        console.log(error);
        setRatingLoading(false);
      });
  };

  const snackComponent = () => {
    return (
      <Snackbar
        visible={!!visibleSnackbar}
        onDismiss={() => setVisibleSnackbar('')}
        duration={2000}
        action={{
          label: 'Dismiss',
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

  const headerComponent = () => {
    var categoryImage = homeData.categories.filter(
      cat => cat.category == skill.category,
    );

    return (
      <View>
        <Image
          source={
            categoryImage && categoryImage.length
              ? Illustrations[categoryImage[0].illustration]
              : require('../assets/img/charfromhome.png')
          }
          style={styles.imgStyle}
        />

      </View>
    );
  };

  const setRating = rating => {
    let url = 'https://teachmeproject.herokuapp.com/addUserRating';
    if (userRating) {
      url = 'https://teachmeproject.herokuapp.com/updateUserRating';
    }
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userInfo._id,
        courseid: skill._id,
        rating: rating,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(JSON.stringify(responseJson));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteSkill = () => {
    setDeleteLoading(true);
    fetch('https://teachmeproject.herokuapp.com/updateCourseDetails', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userInfo._id,
        _id: skill._id,
        status: 'DELETE',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(JSON.stringify(responseJson));
        if (responseJson && responseJson.length)
          dispatch(setReqFavPostedCount(responseJson[0]));
        setDeleteLoading(false);
        navigation.navigate('Profile');
      })
      .catch(error => {
        setDeleteLoading(false);
        console.log(error);
      });
  };

  const imageComponent = () => {
    const showRating =
      userInfo._id &&
      userInfo._id !== skill.uid &&
      !!requestedObj &&
      requestedObj.request_status == 'ACCEPTED';


    const onShare = async () => {
      try {
        const result = await Share.share({
          title: 'Skill On',
          message:
            'Found a good course about ' +
            skill.coursename +
            ' for just ' +
            skill.currency +
            skill.price.oneonone +
            ' in SkillOn App, Check it out! AppLink :https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB',
          url: 'https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    return (
      <View>
        <View style={styles.header}>
          <Icons
            name={'keyboard-backspace'}
            size={27}
            color={'black'}
            style={{ fontWeight: 'bold' }}
            onPress={() => navigation.goBack()}
          />
          <MaterialCommunityIcons
            name="share-variant"
            size={26}
            color={'black'}
            onPress={() => onShare()}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Avatar.Image
            size={130}
            style={{ marginTop: -80, elevation: 10 }}
            source={
              skill.displaypic
                ? { uri: skill.displaypic }
                : require('../assets/img/default-mask-avatar.png')
            }
          // source={require('../assets/img/defaultAvatar.png')}
          />
          <Text
            style={{
              marginTop: 10,
              color: '#444',
              fontWeight: 'bold',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            {skill.username}
          </Text>
          {/* <View style={{ flexDirection: 'row', padding: 3 }}>
            <MaterialCommunityIcons name="account-outline" size={17} />
            <Text style={{ marginLeft: 5 }}>91 students</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 3 }}>
            <MaterialCommunityIcons name="book-outline" size={17} />
            <Text style={{ marginLeft: 5 }}>11 skills</Text>
          </View> */}
          <View style={{ marginLeft: 90, flexDirection: 'row' }}>
            <Rating
              type="star"
              imageSize={15}
              startingValue={skill.avgrating}
              readonly
              style={{ marginTop: 5, marginLeft: -90 }}
            />
            <Text style={styles.usersRated}>({skill.usersrated})</Text>
          </View>
          {userInfo._id != skill.uid && (
            <Button
              mode="text"
              color={'#0052cc'}
              labelStyle={{ fontSize: 14, textTransform: 'capitalize' }}
              onPress={() =>
                navigation.navigate('UserDetailsPage', { userinfo: skill })
              }>
              View profile
            </Button>
          )}

          {showRating && (
            <View style={{ flexDirection: 'row' }}>
              <Text>Rate this skill - </Text>
              {!ratingLoading && (
                <Rating
                  type="star"
                  showRating={false}
                  ratingTextColor="black"
                  imageSize={20}
                  startingValue={userRating}
                  style={{ height: 30 }}
                  onFinishRating={rating => setRating(rating)}
                />
              )}
              {!!ratingLoading && <Text>Please wait</Text>}
            </View>
          )}
        </View>
        {/* <MaterialCommunityIcons
          style={{ marginLeft: '88%', position: 'absolute', padding: 10 }}
          name="heart"
          size={26}
        /> */}
      </View>
    );
  };

  const getSpeakingLanguages = lang => {
    return lang.join(' , ');
  };

  const dataTableComponent = () => {
    return (
      <DataTable>
        <DataTable.Header>
          <Text
            style={{ paddingVertical: 10, fontSize: 20, fontWeight: 'bold' }}>
            Details
          </Text>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell style={{ fontSize: 90 }}>Skill Level</DataTable.Cell>
          <DataTable.Cell>
            - <Text style={styles.tableValues}>{skill.courselevel}</Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Speaking Languages</DataTable.Cell>
          <DataTable.Cell>
            -{' '}
            <Text style={styles.tableValues}>
              {skill.speakinglanguages.length > 0
                ? getSpeakingLanguages(skill.speakinglanguages)
                : ''}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Platform</DataTable.Cell>
          <DataTable.Cell>
            - <Text style={styles.tableValues}> {skill.platform} </Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Country</DataTable.Cell>
          <DataTable.Cell>
            - <Text style={styles.tableValues}> {skill.country}</Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Demo available ?</DataTable.Cell>
          <DataTable.Cell>
            -{' '}
            <Text style={styles.tableValues}> {skill.demo ? 'Yes' : 'No'}</Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Posted</DataTable.Cell>
          <DataTable.Cell>
            -{' '}
            <Text style={styles.tableValues}>
              {' '}
              {moment
                .utc(skill.createddate)
                .local()
                .fromNow()}{' '}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row />
      </DataTable>
    );
  };

  const bodyComponent = () => {
    // console.log(userInfo._id);
    // console.log(skill);

    const showEdit =
      userInfo._id && userInfo._id == skill.uid && origin == 'posted';
    const showDelete =
      userInfo._id && userInfo._id === skill.uid && origin == 'posted';

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: showEdit ? 20 : 0,
          }}>
          <Text style={[styles.skillName, showEdit && { width: '80%' }]}>
            {skill.coursename}
          </Text>

          {showEdit && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PostPage', { editingSkill: skill });
              }}
              style={{ alignItems: 'flex-end', padding: 15, paddingRight: 10 }}>
              <IconMaterialIcons
                name={'edit'}
                color="black"
                size={20}
                style={{ height: 20 }}
              />
            </TouchableOpacity>
          )}
          {showDelete && (
            <TouchableOpacity
              onPress={deleteSkill}
              style={{ alignItems: 'flex-end', padding: 15, paddingRight: 10 }}>
              <IconMaterialIcons
                name={'trash-o'}
                color="black"
                size={20}
                style={{ height: 20 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ width: '40%', padding: 20, paddingTop: 0 }}>
          <Price price={skill.price} currency={skill.currency} />
        </View>
        <View style={[styles.platform, { marginLeft: 15 }]}>
          <Text style={styles.platformText}>
            {`Duration: ${skill.totalhours} Hours`}
          </Text>
        </View>
        {dataTableComponent()}
      </View>
    );
  };

  const contentComponent = () => {
    return (
      <View style={[styles.shadowBottonContainerStyle, { marginTop: 20 }]}>
        <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold' }}>
          What will you learn ?
        </Text>
        <View style={styles.container}>
          {!!skill.content && !!skill.content.length && (
            <FlatList
              data={skill.content}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row' }}>
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    style={{ padding: 7 }}
                  />
                  <Text style={styles.item}>{item}</Text>
                </View>
              )}
            />
          )}
          {(!skill.content || !skill.content.length) && (
            <Text style={{ padding: 20, fontSize: 15 }}>
              Contents not mentioned
            </Text>
          )}
        </View>
      </View>
    );
  };

  const descriptionComponent = () => {
    return (
      <View style={[styles.shadowBottonContainerStyle, { marginTop: 20 }]}>
        <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold' }}>
          Description
        </Text>
        {!!skill.profilesummary && (
          <Text style={{ padding: 10 }}>{skill.profilesummary}</Text>
        )}
        {!skill.profilesummary && (
          <Text style={{ padding: 20, fontSize: 15 }}>
            Description not mentioned
          </Text>
        )}
      </View>
    );
  };

  const requestButtonComponent = () => {
    const requestBtn = () => {
      if (!userInfo._id) {
        setVisibleSnackbar('Please login!');
      } else {
        sendRequest(skill);
      }
    };

    const sendRequest = skill => {
      setLoading(true);
      fetch('https://teachmeproject.herokuapp.com/addToRequestedCourses', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userInfo._id,
          courseid: skill._id,
          courseuid: skill.uid,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          getRequetedCourses(userInfo._id);
          if (!requestSent) {
            addFirebaseNotification(skill);
          }
        })
        .catch(error => {
          setVisibleSnackbar('Something went wrong!');
          console.error(error);
          setLoading(false);
        });
    };

    const addFirebaseNotification = skill => {
      const notifyobj = {
        senderName: userInfo.username,
        senderId: userInfo._id,
        receiverName: skill.username,
        receiverId: skill.uid,
        request_status: 'PENDING',
        type: 'REQUEST',
        createdAt: new Date().getTime(),
        message: 'Want to learn from you..!',
        courseid: skill._id,
      };

      firestore()
        .collection('NOTIFICATIONS')
        .add(notifyobj)
        .then(
          docRef => {
            sendNotification(skill, notifyobj);
          },
          err => {
            setVisibleSnackbar('Something went wrong!');
            console.error(error);
            setLoading(false);
          },
        );
    };

    const sendNotification = (skill, notifyobj) => {
      fetch('https://teachmeproject.herokuapp.com/sendChatNotification', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
          message: notifyobj.message,
          _id: skill.uid,
          data: notifyobj,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          setVisibleSnackbar('Request sent to the user!');
          setLoading(false);
        })
        .catch(error => {
          setVisibleSnackbar('Something went wrong!');
          console.error(error);
          setLoading(false);
        });
    };

    const checkIfChatExists = () => {
      setLoading(true);
      var exists = false;
      firestore()
        .collection('THREADS')
        .where('ids', 'array-contains', userInfo._id)
        .get()
        .then(querySnapshot => {
          var itemObj = {};
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            if (data.ids.indexOf(skill.uid) > -1) {
              exists = true;

              var messageObj = {
                // id: ref.id,
                userDetails: [
                  {
                    id: userInfo._id,
                    name: userInfo.username,
                    displaypic: userInfo.displaypic,
                  },
                  {
                    id: skill.uid,
                    name: skill.username,
                    displaypic: skill.displaypic,
                  },
                ],
                ids: [userInfo._id, skill.uid],
                latestMessage: {
                  text: 'Say Hello..',
                  createdAt: Date.now(),
                },
                deletedIds: [skill.uid],
                newChat: true,
              };

              itemObj = {
                // ...item,
                ...messageObj,
                _id: documentSnapshot.id,
                name: skill.username,
                displaypic: skill.displaypic,
                senderDetailsId: skill.uid,
              };

              // item = {
              //   ...item,
              //   _id: documentSnapshot.id,
              //   name: item.username,
              // };
            }
          });
          if (!exists) {
            sendMessage();
          } else {
            // console.log('elseeeeeeeeeeeeeeeeeeeeeee');
            // console.log(itemObj);
            setLoading(false);
            // navigation.navigate('ChatRoom', { thread: itemObj });
            navigation.navigate('Chat', {
              screen: 'ChatRoom',
              params: { thread: itemObj },
            });
          }
        });
    };

    function sendMessage() {
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
            id: skill.uid,
            name: skill.username,
            displaypic: skill.displaypic,
          },
        ],
        ids: [userInfo._id, skill.uid],
        latestMessage: {
          text: 'Say Hello..',
          createdAt: Date.now(),
        },
        deletedIds: [skill.uid],
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
          .then(() => { });
      });

      var itemObj = {
        // ...item,
        ...messageObj,
        _id: ref.id,
        name: skill.username,
        displaypic: skill.displaypic,
        senderDetailsId: skill.uid,
      };
      // navigation.popToTop();
      setLoading(false);
      // navigation.navigate('ChatRoom', { thread: itemObj });
      navigation.navigate('Chat', {
        screen: 'ChatRoom',
        params: { thread: itemObj },
      });
    }

    // alert(JSON.stringify(requestedObj))
    // alert(userInfo._id)
    if (skill.uid == userInfo._id) return;
    if (loading) {
      return (
        <Button
          disabled={true}
          mode="contained"
          color={'black'}
          labelStyle={globalStyles.btnLabelStyle}>
          {'Please Wait'}
        </Button>
      );
    }
    if (!requestedObj || !requestedObj.request_status) {
      return (
        <Button
          mode="contained"
          color={'black'}
          labelStyle={globalStyles.btnLabelStyle}
          onPress={requestBtn}>
          <Text>Interested To Learn</Text>
        </Button>
      );
    }

    return (
      <View>
        {/* <View style={globalStyles.btnStyle}> */}
        {/* <Text>{JSON.stringify(requestedObj)}</Text> */}
        {/* {(requestedObj.request_status == 'REJECTED' ||
          requestedObj.request_status == 'PENDING') && (
          )} */}
        {areConnected ? (
          <Button
            mode="contained"
            color={'black'}
            labelStyle={globalStyles.btnLabelStyle}
            onPress={checkIfChatExists}>
            Message
          </Button>
        ) :
          <Button
            disabled={true}
            mode="contained"
            color={'black'}
            labelStyle={globalStyles.btnLabelStyle}>
            {requestedObj.request_status}
          </Button>
        }
        {/* </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {headerComponent()}
        <View style={styles.skillDetailView}>
          {imageComponent()}
          {bodyComponent()}
          {(!requestedObj ||
            !userInfo ||
            (requestedObj &&
              userInfo &&
              requestedObj.courseuid != userInfo._id)) &&
            requestButtonComponent()}
          {contentComponent()}
          {descriptionComponent()}
        </View>
        <PageSpinner visible={deleteLoading} />
      </ScrollView>
      {snackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  borderLine: {
    borderRightWidth: 1,
    borderColor: 'lightgrey',
  },
  tableValues: {
    margin: 90,
    padding: 90,
  },
  container: {
    flex: 1,
  },
  item: {
    padding: 5,
    fontSize: 17,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    padding: 20,
  },
  platform: {
    marginTop: 8,
    marginBottom: 20,
    width: 150,
    backgroundColor: '#f7f7f7',
    borderColor: 'lightgrey',
    borderWidth: 0.3,
    padding: 10,
    borderRadius: 10,
  },
  platformText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    // color: 'black',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 20,
    color: 'gray',
  },
  imgStyle: {
    height: 200,
    // resizeMode: 'stretch',
    resizeMode: 'cover',
    width: '100%',
    // opacity: 0.7,
  },
  skillName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#008080',
    padding: 20,
    textTransform: 'capitalize',
  },
  skillLevel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#696969',
    marginLeft: 20,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  usersRated: {
    fontSize: 12,
    color: '#444',
    padding: 3,
    marginTop: 1,
  },
  skillDetailView: {
    padding: 15,
    width: '100%',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    elevation: 10,
    marginTop: -40,
    backgroundColor: 'white',
  },
  shadowBottonContainerStyle: {
    //<--- Style without elevation
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    borderBottomWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
});
