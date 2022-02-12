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
  setRequestedSkills,
} from '../../../redux/slices/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function RequestedCoursesPage({ navigation }) {
  const { userInfo } = useSelector(loginSelector);
  const { requestedSkills } = useSelector(profileSelector);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo._id) getRequetedCourses(userInfo._id);
  }, []);

  const getRequetedCourses = uid => {
    setLoading(true);
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
        console.log(JSON.stringify(responseJson));
        if (responseJson && responseJson.length)
          dispatch(setRequestedSkills(responseJson));
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
            data={requestedSkills}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <CourseListCard
                course={item}
                courseClicked={() => courseClicked(item)}
                wishlistClicked={() => wishlistClicked(item)}
                showDelete={true}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => getRequetedCourses(userInfo._id)}
              />
            }
            style={{
              marginBottom: 30
            }}
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
            You have not requested any skills yet!{' '}
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
          <Text style={styles.headerTitle}>Requested Skills</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {headerComponent()}
      {loading
        ? loadingComponent()
        : requestedSkills.length
          ? cardListComponent()
          : noDataFoundComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  cardListComponent: {
    paddingTop: 25,
    // marginBottom: 80
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
