import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  RefreshControl,
  Image,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseListCard from '../../../components/common/CourseListCard';
import { loginSelector } from '../../../redux/slices/loginSlice';
import {
  profileSelector,
  setPostedSkills,
} from '../../../redux/slices/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function PostedCoursesPage({ navigation }) {
  const { userInfo } = useSelector(loginSelector);
  const { postedSkills } = useSelector(profileSelector);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo._id) getPostedCourses(userInfo._id);
  }, []);

  const getPostedCourses = uid => {
    setLoading(true);
    fetch('https://teachmeproject.herokuapp.com/getCourseDetailsById', {
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
        console.log(JSON.stringify(responseJson));
        if (responseJson && responseJson.length) {
          dispatch(setPostedSkills(responseJson));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={'black'} />
      </View>
    );
  };

  const courseClicked = course => {
    navigation.navigate('SkillDetail', {
      skill: course,
      origin: 'posted',
    });
  };

  const wishlistClicked = item => {
    console.log('wishlistClicked clicked');
  };

  const cardListComponent = () => {
    return (
      <TouchableWithoutFeedback>
        <View style={styles.cardListComponent}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={postedSkills}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <CourseListCard
                course={item}
                courseClicked={() => courseClicked(item)}
                wishlistClicked={() => wishlistClicked(item)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => getPostedCourses(userInfo._id)}
              />
            }
            // style={{ marginBottom: 80 }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const noDataFoundComponent = () => {
    return (
      <View style={{ alignItems: 'center', flex: 1, marginTop: 50 }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={styles.backgroundImage}
            resizeMode={'stretch'}
            source={require('../../../assets/img/chatroom.png')}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              textAlign: 'center',
              letterSpacing: 1,
            }}>
            You have not posted any skills yet!{' '}
          </Text>
        </View>
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <View style={styles.headerComponent}>
        <Icons
          name={'keyboard-backspace'}
          // color="#fff"
          size={27}
          style={{ flex: 0.2 }}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 0.6,
          }}>
          <Text style={styles.headerTitle}>Posted Skills</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {headerComponent()}
      {loading
        ? loadingComponent()
        : postedSkills.length
        ? cardListComponent()
        : noDataFoundComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  cardListComponent: {
    paddingTop: 15,
    marginBottom: 35,
    // paddingBottom: 80
  },
  loadingBar: {
    // marginTop: 40
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'sans-serif',
  },
  headerComponent: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  backgroundImage: {
    marginTop: 5,
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
