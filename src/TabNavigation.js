/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/tabs/home/Home';
import Search from './screens/tabs/search/Search';
import Post from './screens/tabs/post/Post';
import Chat from './screens/tabs/chat/Chat';
import ChatRoom from './screens/tabs/chat/ChatRoom';
import NewChat from './screens/tabs/chat/newChat';
import Profile from './screens/tabs/profile/Profile';
import ProfileSettingsPage from './screens/tabs/profile/profileSettingsPage';
import RequestedCoursesPage from './screens/tabs/profile/requestedCourses';
import WishlistCoursesPage from './screens/tabs/profile/wishlistCourses';
import PostedCoursesPage from './screens/tabs/profile/postedCourses';
import ChangeProfilePage from './screens/tabs/profile/changeProfile';
import GuestPage from './screens/tabs/profile/guestPage';
import LoginPage from './screens/tabs/userauth/login';
import SkillListView from './components/common/SkillListView';
import SkillGridView from './components/common/SkillGridView';
import forgotPassword from './screens/tabs/userauth/forgotPassword';
import forgotPasswordOtpPage from './screens/tabs/userauth/forgotPasswordOtp';
import { getAsyncData } from './components/common/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginSelector,
  loadUserInfo,
  setDeviceToken,
} from './redux/slices/loginSlice';
import { fetchReqFavpostedCounts } from './redux/slices/profileSlice';
import { getRecentSearches } from './redux/slices/searchSlice';
import {
  fetchInitialDataWhenAppLoading,
  fetchPostedSkills,
} from './redux/slices/homeSlice';
import messaging from '@react-native-firebase/messaging';
import SkillDetail from './components/SkillDetail';
import NotificationPage from './screens/tabs/notification/notification';
import signupFormPage from './screens/tabs/userauth/singupForm';
import signupOtpPage from './screens/tabs/userauth/signupOtp';
import signupDescPage from './screens/tabs/userauth/signupDesc';
import feedbackPage from './screens/tabs/profile/feedbackPage';
import UserDetailsPage from './screens/tabs/profile/userDetailsPage';
import { Alert, Linking } from 'react-native';

const TabNavigation = props => {
  const dispatch = useDispatch();
  const { colors } = props.theme;
  const Stack = createStackNavigator();
  const Tab = createMaterialBottomTabNavigator();
  const { userInfo } = useSelector(loginSelector);
  const [versionUpdate, setVersionUpdate] = useState(null);

  useEffect(() => {
    checkVersion('0.0.1');
  }, []);

  useEffect(() => {
    if (versionUpdate === true) {
      loadInitialData();
    }
  }, [versionUpdate]);

  const loadInitialData = () => {
    getUserInfo();
    searchInitialData();
    checkPermission();
  };

  const searchInitialData = () => {
    dispatch(getRecentSearches());
    dispatch(fetchInitialDataWhenAppLoading());
    dispatch(fetchPostedSkills());
  };

  const getUserInfo = async () => {
    const userData = await getAsyncData('userInfo');
    if (userData) {
      dispatch(loadUserInfo(userData));
      if (userData?._id)
        dispatch(fetchReqFavpostedCounts({ uid: userData._id }));
    }
  };

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getFcmToken();
    } else {
      requestPermission();
    }
  };

  const getFcmToken = async () => {
    var fcmToken = await messaging().getToken();
    if (fcmToken) {
      dispatch(setDeviceToken(fcmToken));
      console.log(fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      getFcmToken();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  function ProfileStackScreen() {
    return (
      <Stack.Navigator
        headerMode={'none'}
        initialRouteName={userInfo._id ? 'Profile' : 'GuestPage'}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="GuestPage" component={GuestPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={signupFormPage} />
        <Stack.Screen name="SignupOtp" component={signupOtpPage} />
        <Stack.Screen name="SignupDescPage" component={signupDescPage} />
        <Stack.Screen name="ForgotPassword" component={forgotPassword} />
        <Stack.Screen
          name="ForgotPasswordOTP"
          component={forgotPasswordOtpPage}
        />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsPage} />
        <Stack.Screen
          name="RequestedCourses"
          component={RequestedCoursesPage}
        />
        <Stack.Screen name="WishlistCourses" component={WishlistCoursesPage} />
        <Stack.Screen name="PostedCourses" component={PostedCoursesPage} />
        <Stack.Screen name="ChangeProfile" component={ChangeProfilePage} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="Feedback" component={feedbackPage} />
        <Stack.Screen name="UserDetailsPage" component={UserDetailsPage} />
        <Stack.Screen name="SkillDetail" component={SkillDetail} />
        <Stack.Screen name="PostPage" component={Post} />
      </Stack.Navigator>
    );
  }

  function HomeStackScreen() {
    return (
      <Stack.Navigator headerMode={'none'} initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SkillListView" component={SkillListView} />
        <Stack.Screen name="SkillGridView" component={SkillGridView} />
        <Stack.Screen name="SkillDetail" component={SkillDetail} />
        <Stack.Screen name="Notification" component={NotificationPage} />
        <Stack.Screen name="UserDetailsPage" component={UserDetailsPage} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="PostPage" component={Post} />
      </Stack.Navigator>
    );
  }

  function ChatStackScreen() {
    return (
      <Stack.Navigator headerMode={'none'} initialRouteName={'ChatPage'}>
        <Stack.Screen name="ChatPage" component={Chat} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="UserDetailsPage" component={UserDetailsPage} />
      </Stack.Navigator>
    );
  }

  function PostStackScreen() {
    return (
      <Stack.Navigator headerMode={'none'} initialRouteName={'PostPage'}>
        <Stack.Screen name="PostPage" component={Post} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="PostedCourses" component={PostedCoursesPage} />
      </Stack.Navigator>
    );
  }

  function SearchStackScreen() {
    return (
      <Stack.Navigator headerMode={'none'} initialRouteName={'Search'}>
        <Stack.Screen name="SearchPage" component={Search} />
        <Stack.Screen name="SkillDetail" component={SkillDetail} />
        <Stack.Screen name="UserDetailsPage" component={UserDetailsPage} />
      </Stack.Navigator>
    );
  }

  const checkVersion = async verison => {
    await fetch('https://teachmeproject.herokuapp.com/checkVersion', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: verison,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('tag', responseJson);
        setVersionUpdate(responseJson['status']);
      })
      .catch(error => {
        console.error(error);
        setVersionUpdate(true);
        // setLoading(false);
      });
  };

  const versionUpdateAlert = () => {
    Alert.alert(
      'New version available',
      'Please update your app to latest version',
      [
        {
          text: 'Update',
          onPress: () =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB',
            ),
        },
      ],
      { cancelable: false },
    );
  };

  function MyTabs() {
    if (versionUpdate === false) {
      versionUpdateAlert();
      return;
    } else if (versionUpdate === true) {
      return (
        <Tab.Navigator
          initialRouteName="Home"
          activeColor={'black'}
          inactiveColor="grey"
          barStyle={{ backgroundColor: colors.primary }}
          sceneAnimationEnabled={false}>
          <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchStackScreen}
            options={{
              tabBarLabel: 'Search',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="magnify"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Post"
            component={PostStackScreen}
            options={{
              tabBarLabel: 'Post',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Chat"
            component={ChatStackScreen}
            options={{
              tabBarLabel: 'Chat',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="message-outline"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-outline"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
        </Tab.Navigator>
      );
    } else return <></>;
  }

  return <NavigationContainer>{MyTabs()}</NavigationContainer>;
};

export default withTheme(TabNavigation);
