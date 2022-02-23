import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Badge, Icon, Rating } from 'react-native-elements';
import Price from '../common/Price';
import moment from 'moment';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PageSpinner from './PageSpinner';
import {
  setReqFavPostedCount,
  setReqCount,
} from '../../redux/slices/loginSlice';
import { setRequestedSkills } from '../../redux/slices/profileSlice';

export default function CourseListCard({
  course,
  courseClicked,
  wishlistClicked,
  cardWidth,
  showDelete = false,
  deleteFun = null,
}) {
  const userProfilePic =
    course && course.displaypic
      ? {
          uri: course.displaypic,
        }
      : // { uri: "https://bootdey.com/img/Content/avatar/avatar7.png" }
        require('../../assets/img/default-mask-avatar.png');

  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const deleteSkillAlert = () =>
    Alert.alert(
      '',
      'Remove this skill from Requested Skills?',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => deleteSkill() },
      ],
      { cancelable: false },
    );

  const deleteSkill = () => {
    setLoading(true);
    fetch('https://teachmeproject.herokuapp.com/removeFromRequestedCourses', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: course.request_uid,
        courseid: course._id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.length);
        if (responseJson) dispatch(setRequestedSkills(responseJson));
        dispatch(setReqCount(responseJson.length));
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <TouchableOpacity onPress={courseClicked}>
        <View style={styles.card}>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              width: '100%',
              zIndex: 9,
              // padding: 15,
              // paddingRight: 10,
              // marginVertical: 0,
              // marginRight: 30,
            }}>
            {showDelete && (
              <TouchableOpacity
                onPress={deleteFun ? deleteFun : deleteSkillAlert}
                style={{
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  padding: 15,
                  // paddingHorizontal: 10,
                  // justifyContent: 'flex-end',
                  // backgroundColor: 'red',
                  // width: 50
                }}>
                <IconMaterialIcons
                  name={deleteFun ? 'close' : 'delete-outline'}
                  color="black"
                  size={20}
                  style={{ height: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.userDetails}>
            <Image style={styles.userImage} source={userProfilePic} />
            <Text style={{ ...styles.textStyle, alignSelf: 'center' }}>
              {course.username}
            </Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Rating
                type="star"
                imageSize={15}
                startingValue={course.avgrating}
                readonly
                style={{ marginTop: 5, marginBottom: 5 }}
              />
              <Text style={styles.usersRated}>({course.usersrated})</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 10 }}>
                {moment
                  .utc(course.updateddate)
                  .local()
                  .fromNow()}
              </Text>
            </View>
          </View>
          <View style={styles.courseDetails}>
            <View>
              <Text style={styles.courseName} numberOfLines={2}>
                {course.coursename}
              </Text>
              {!!course && !!course.courselevel && (
                <Text style={[styles.textStyle, { width: 135, fontSize: 13 }]}>
                  Level - {course.courselevel}
                </Text>
              )}
              <View style={{ marginTop: 10, width: 110 }}>
                <Price price={course.price} currency={course.currency} />
              </View>
              <View style={styles.platform}>
                <Text style={styles.platformText}>
                  {course.totalhours} Hours Skill
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <PageSpinner visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,
    elevation: 2,
    marginVertical: 5,
    backgroundColor: 'white',
    flexBasis: '46%',
    marginHorizontal: 5,
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    // borderRadius: 5,
  },
  userDetails: {
    padding: 15,
    width: 150,
  },
  courseDetails: {
    marginVertical: 8,
    // width: '60%',
    flex: 0.95,
    // paddingHorizontal: 16,
    // borderTopLeftRadius: 1,
    // borderTopRightRadius: 1,
    // justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 60,
    borderColor: '#DCDCDC',
    // borderWidth: 2,
    alignSelf: 'center',
  },
  courseName: {
    fontSize: 15,
    flex: 1,
    color: '#008080',
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#696969',
    textTransform: 'capitalize',
  },
  followButton: {
    marginTop: 15,
    marginBottom: 5,
    height: 30,
    width: 90,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  icon: {
    height: 20,
    width: 20,
  },
  platform: {
    marginTop: 15,
    marginBottom: 10,
    width: 110,
    // backgroundColor: 'rgba(152,73,166,0.1)',
    // borderColor: 'lightgrey',
    borderWidth: 0.1,
    padding: 3,
    borderRadius: 10,
    // elevation: 2
  },
  platformText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    // paddingHorizontal: 10,
    // color: 'rgba(152,73,166,1)',
  },
  usersRated: {
    fontSize: 12,
    color: '#444',
    padding: 3,
    marginTop: 1,
  },
});
