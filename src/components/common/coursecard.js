/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Card, Avatar, Badge, Icon, Rating } from 'react-native-elements';
import Price from '../common/Price';

export default function CourseCard({
  course,
  courseClicked,
  wishlistClicked,
  cardWidth,
}) {
  const userProfilePic =
    course && course.displaypic
      ? {
          uri: course.displaypic,
        }
      : // { uri: "https://bootdey.com/img/Content/avatar/avatar7.png" }
        require('../../assets/img/default-mask-avatar.png');
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* <View style={styles.cardHeader}>
        <Image
          style={styles.icon}
          source={{
            uri: 'https://img.icons8.com/flat_round/64/000000/hearts.png',
          }}
        />
      </View> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Image style={styles.userImage} source={userProfilePic} />
        <View style={{ marginTop: 15 }}>
          <Text style={styles.position} numberOfLines={1}>
            {course.username}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Rating
              type="star"
              imageSize={15}
              startingValue={course.avgrating}
              readonly
              style={{ marginTop: 5, marginBottom: 5 }}
            />
            <Text style={styles.usersRated} numberOfLines={1}>
              ({course.usersrated})
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.name} numberOfLines={2}>
            {course.coursename}
          </Text>
          {!!course && !!course.courselevel && (
            <Text
              style={[styles.position, { fontSize: 13, marginTop: 4 }]}
              numberOfLines={1}>
              {course.courselevel} Level
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
    minHeight: 240,
    borderWidth: 0.7,
    borderColor: 'lightgrey',
    borderRadius: 10,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
  },
  listContainer: {
    alignItems: 'center',
  },
  cardFooter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  userImage: {
    height: 60,
    width: 60,
    // borderRadius: 60,
    // alignSelf: 'center',
    borderColor: '#DCDCDC',
    // borderWidth: 2,
    marginTop: 10,
    // elevation: 5,
  },
  name: {
    fontSize: 15,
    // flex: 1,
    alignSelf: 'center',
    color: '#008080',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  position: {
    fontSize: 14,
    fontWeight: 'bold',
    // alignSelf: 'center',
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
    // paddingHorizontal: 10
    // color: 'rgba(152,73,166,1)',
  },
  usersRated: {
    fontSize: 12,
    color: '#444',
    padding: 3,
    marginTop: 1,
  },
});
