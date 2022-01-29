import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Surface } from 'react-native-paper';
import { Avatar, ListItem } from 'react-native-elements';
import IconMaterialIcons from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadUserInfo,
  loginSelector,
  logOutUser,
  setReqFavPostedCount,
  logoutDone,
  logoutSuccess,
} from '../../../redux/slices/loginSlice';
import {
  onChangeImagePressed,
  changeProfileSelector,
} from '../../../redux/slices/changeProfileSlice';
// import { profileSelector, setReqFavPostedCount } from '../../../redux/slices/profileSlice';
import ImagePicker from 'react-native-image-picker';
import { Snackbar } from 'react-native-paper';
import PageSpinner from '../../../components/common/PageSpinner';

export default function Profile({ route, navigation }) {
  const dispatch = useDispatch();
  const { fromDelete } = route.params || {};
  const {
    userInfo,
    reqFavPostedCount,
    devicetoken,
    profileLoading,
  } = useSelector(loginSelector);
  const { loading } = useSelector(changeProfileSelector);
  console.log('profileLoading', profileLoading);
  // const { reqFavPostedCount } = useSelector(profileSelector);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
  const [load, setLoad] = React.useState(false);

  useEffect(() => {
    if (!reqFavPostedCount._id || fromDelete) getReqFavpostedCounts();
    return () => setLoad(false);
  }, []);

  const getReqFavpostedCounts = () => {
    fetch('https://teachmeproject.herokuapp.com/getReqFavPostedCounts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userInfo._id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length)
          dispatch(setReqFavPostedCount(responseJson[0]));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const logout = () => {
    setLoad(true);
    dispatch(
      logOutUser({
        onSuccess: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'GuestPage' }],
          });
        },
      }),
    );
  };

  const logoutAlert = () =>
    Alert.alert(
      '',
      'Do you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => logout() },
      ],
      { cancelable: false },
    );

  const settingsIconContainer = () => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ProfileSettings')}>
        <View style={styles.settingsIconContainer}>
          <IconMaterialIcons
            name={'settings'}
            color="rgb(102, 94, 94)"
            size={25}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const snackComponent = () => {
    return (
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={2000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisibleSnackbar(false);
          },
        }}
        style={{ backgroundColor: 'white' }}
        wrapperStyle={{ backgroundColor: 'white' }}>
        <Text style={{ color: 'black', fontSize: 16 }}>
          Profile pic updated succesfully
        </Text>
      </Snackbar>
    );
  };

  const chooseFile = async () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.2,
    };
    if (userInfo.displaypic) {
      options.customButtons = [{ name: 'RemovePic', title: 'Remove Pic' }];
    }
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        dispatch(
          onChangeImagePressed({
            userId: userInfo._id,
            displaypic: '',
            devicetoken: devicetoken,
            // showToast: this.showToast,
            onSuccess: data => {
              dispatch(loadUserInfo(data));
              setVisibleSnackbar(true);
            },
          }),
        );
      } else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        dispatch(
          onChangeImagePressed({
            userId: userInfo._id,
            displaypic: source.uri,
            devicetoken: devicetoken,
            // showToast: this.showToast,
            onSuccess: data => {
              dispatch(loadUserInfo(data));
              setVisibleSnackbar(true);
            },
          }),
        );
      }
    });
  };

  const userImageContainer = () => {
    return (
      <View style={styles.userImageContainer}>
        <Avatar
          size={155}
          showAccessory={true}
          onAccessoryPress={() => chooseFile()}
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
            userInfo.displaypic
              ? { uri: userInfo.displaypic }
              : require('../../../assets/img/default-mask-avatar.png')
          }
        />
        <Text style={styles.userName}>{userInfo.username}</Text>
        <Text style={styles.userEmail}>{userInfo.email}</Text>
      </View>
    );
  };

  const userDescContainer = () => {
    return (
      <View style={styles.userDescContainer}>
        <Text numberOfLines={4} style={styles.userDesc}>
          {userInfo.description
            ? userInfo.description
            : 'Your description will be shown here! You can add your description from change profile page!'}
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
        {settingsIconContainer()}
        <View style={styles.upperContainer}>
          {userImageContainer()}
          {userDescContainer()}
        </View>
      </View>
    );
  };

  const userStatsContainer = () => {
    return (
      <View style={styles.userStatsContainer}>
        <View style={[styles.stat]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RequestedCourses')}>
            <Surface style={styles.surfaceReq}>
              <Text style={styles.statValue}>
                {reqFavPostedCount.requestedcoursescount}
              </Text>
              <Text style={styles.statText}>Requested {'\n'}Skills</Text>
            </Surface>
          </TouchableOpacity>
        </View>
        <View style={styles.stat}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PostedCourses')}>
            <Surface style={styles.surface}>
              <Text style={styles.statValue}>
                {reqFavPostedCount.coursedetailscount}
              </Text>
              <Text style={styles.statText}>Posted {'\n'}Skills</Text>
            </Surface>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.stat, { width: '30%' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('WishlistCourses')}>
                        <Surface style={styles.surface}>
                            <Text style={styles.statValue}>{reqFavPostedCount.myfavoritescount}</Text>
                            <Text style={styles.statText}>Wishlist {'\n'}Skills</Text>
                        </Surface>
                    </TouchableOpacity>
                </View> */}
      </View>
    );
  };

  const footerContainer = () => {
    return (
      <View style={styles.lowerContainer}>
        <View style={styles.accountContainer}>
          <TouchableOpacity>
            <ListItem
              title={'Change Profile'}
              leftIcon={
                <Icons
                  name={'account-arrow-right-outline'}
                  color="#0e515c"
                  size={25}
                />
              }
              titleStyle={{ letterSpacing: 1 }}
              chevron={
                <Icons
                  name={'chevron-right'}
                  color="rgb(102, 94, 94)"
                  size={30}
                />
              }
              onPress={() => navigation.navigate('ChangeProfile')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <ListItem
              onPress={logoutAlert}
              title={'logout'}
              leftIcon={<Icons name={'logout'} color="#0e515c" size={25} />}
              titleStyle={{ letterSpacing: 1 }}
              chevron={
                <Icons
                  name={'chevron-right'}
                  color="rgb(102, 94, 94)"
                  size={30}
                />
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={getReqFavpostedCounts}
          />
        }>
        <View>
          {headerComponent()}
          <View
            style={{
              padding: 15,
              width: '100%',
              borderTopRightRadius: 45,
              borderTopLeftRadius: 45,
              elevation: 5,
              marginTop: -40,
              backgroundColor: 'white',
            }}>
            {userStatsContainer()}
            {footerContainer()}
          </View>
        </View>

        {(loading || load) && <PageSpinner visible={true} />}
      </ScrollView>
      {snackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  lowerContainer: {
    margin: 25,
    justifyContent: 'center',
  },
  surface: {
    padding: 5,
    height: 80,
    width: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(225, 225, 225)',
  },
  surfaceReq: {
    // padding: 5,
    height: 80,
    width: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(225, 225, 225)',
  },
  accountsText: {
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 10,
  },
  accountContainerBody: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  accountContainerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
  },
  accountContainer: {
    marginTop: 20,
  },
  statText: {
    textAlign: 'center',
    color: '#7f7f7f',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  stat: {
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userStatsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 0,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  userDesc: {
    borderRadius: 20,
    borderColor: '#dbdbdb',
    backgroundColor: 'rgba(255, 213, 87, 0.63)',
    // height: 75,
    width: 280,
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
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
  settingsIconContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 0,
    marginRight: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
