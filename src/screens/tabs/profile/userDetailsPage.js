import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar, Rating } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import CourseListCard from '../../../components/common/CourseListCard';
import { getCourseDetailsByIdUrl } from '../../../redux/urls';

export default function UserDetailsPage({ route, navigation }) {
  const { userinfo } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [courseData, setCourseData] = React.useState([]);

  useEffect(() => {
    getPostedCourses(userinfo.uid);
  }, []);

  const getPostedCourses = uid => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(getCourseDetailsByIdUrl, {
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
        // console.log(JSON.stringify(responseJson));
        setCourseData(responseJson);
        setLoading(false);
      })
      .catch(error => {
        // console.error(error);
        setLoading(false);
      });
  };

  const loadingComponent = () => {
    return (
      <View style={{ marginTop: 50 }}>
        <ActivityIndicator size={35} animating={true} color={Colors.red800} />
      </View>
    );
  };

  const userImageContainer = () => {
    return (
      <View style={styles.userImageContainer}>
        <Avatar
          size={155}
          accessory={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: 30,
            size: 30,
            name: 'edit',
            type: 'entypo',
            style: { backgroundColor: 'white' },
            iconStyle: { fontSize: 20 },
          }}
          rounded
          source={
            userinfo.displaypic
              ? { uri: userinfo.displaypic }
              : require('../../../assets/img/default-mask-avatar.png')
          }
        />
        <Text style={styles.userName}>{userinfo.username}</Text>
        {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                    <Rating imageSize={20} readonly startingValue={userinfo.avgrating} type="custom" tintColor="rgb(243, 246, 252)" ratingBackgroundColor="grey" />
                    <Text style={{ textAlign: "left", paddingLeft: 10, fontWeight: "bold" }}>{userinfo.usersrated}</Text>
                </View> */}
      </View>
    );
  };

  const userDescContainer = () => {
    return (
      <View style={styles.userDescContainer}>
        <Text numberOfLines={6} style={styles.userDesc}>
          {userinfo.description
            ? userinfo.description
            : 'User description is not available!'}
        </Text>
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <View
        style={{
          backgroundColor: 'rgba(243, 246, 252, 0.7)',
          paddingTop: 30,
          paddingBottom: 60,
        }}>
        <Icons
          name={'keyboard-backspace'}
          // color="#fff"
          size={27}
          style={{ flex: 0.2, marginLeft: 20 }}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.upperContainer}>
          {userImageContainer()}
          {userDescContainer()}
        </View>
      </View>
    );
  };

  const courseClicked = item => {
    navigation.navigate('SkillDetail', {
      skill: item,
    });
  };

  const wishlistClicked = item => {
    console.log(item);
  };

  const cardListComponent = () => {
    return (
      <TouchableWithoutFeedback>
        <View style={styles.cardListComponent}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={courseData}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <CourseListCard
                course={item}
                courseClicked={() => courseClicked(item)}
                wishlistClicked={() => wishlistClicked(item)}
              />
            )}
            style={{ marginBottom: 80 }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const noDataFoundComponent = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 80,
        }}>
        <Text style={{ fontSize: 16 }}>
          User has not posted any skills yet!
        </Text>
      </View>
    );
  };

  const postedSkills = () => {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 0.6,
          }}>
          <Text style={styles.headerTitle}>Posted Skills</Text>
        </View>
        {loading
          ? loadingComponent()
          : courseData.length
          ? cardListComponent()
          : noDataFoundComponent()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {headerComponent()}
          <View
            style={{
              padding: 15,
              width: '100%',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              elevation: 5,
              marginTop: -40,
              backgroundColor: 'white',
            }}>
            {postedSkills()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userDesc: {
    borderRadius: 20,
    borderColor: '#dbdbdb',
    backgroundColor: 'rgba(255, 213, 87, 0.63)',
    // height: 75,
    width: 280,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    letterSpacing: 1,
    lineHeight: 20,
  },
  userDescContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  userEmail: {
    color: '#7f7f7f',
    fontSize: 14,
  },
  userImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'sans-serif',
    paddingBottom: 20,
    fontWeight: 'bold',
  },
  headerComponent: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
});
