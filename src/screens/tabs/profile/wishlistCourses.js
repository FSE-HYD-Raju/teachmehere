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
  setWishlistSkills,
} from '../../../redux/slices/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getFavoritesByIdUrl } from '../../../redux/urls';

export default function WishlistCoursesPage({ navigation }) {
  const { userInfo } = useSelector(loginSelector);
  const { wishlistSkills } = useSelector(profileSelector);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo._id && wishlistSkills && !wishlistSkills.length)
      getWishlistCourses(userInfo._id);
  }, []);

  const getWishlistCourses = uid => {
    setLoading(true);
    fetch(getFavoritesByIdUrl, {
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
          dispatch(setWishlistSkills(responseJson));
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
            data={wishlistSkills}
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
                onRefresh={() => getWishlistCourses(userInfo._id)}
              />
            }
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
            {' '}
            You have not added any skills to whishlist yet!{' '}
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
          <Text style={styles.headerTitle}>Whishlist Skills</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {headerComponent()}
      {loading
        ? loadingComponent()
        : wishlistSkills.length
        ? cardListComponent()
        : noDataFoundComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  cardListComponent: {
    paddingTop: 15,
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
