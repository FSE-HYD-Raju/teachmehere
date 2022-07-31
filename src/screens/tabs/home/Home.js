/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  Platform,
  FlatList,
  RefreshControl,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import SkillFlatList from '../../../components/common/SkillFlatList';
import CategoryWrapper from '../../../components/common/CategoryWrapper';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryChipView from '../../../components/common/CategoryChipView';
import { useSelector, useDispatch } from 'react-redux';
import { homeSelector } from '../../../redux/slices/homeSlice';
import messaging from '@react-native-firebase/messaging';
import { loginSelector } from '../../../redux/slices/loginSlice';
import PushNotification from 'react-native-push-notification';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useIsFocused, useRoute } from '@react-navigation/native';
import {
  chatSelector,
  setNotificationSubscribe,
} from '../../../redux/slices/chatSlice';
import { Illustrations } from '../../../assets/illustrations';

import { getRecentSearches } from '../../../redux/slices/searchSlice';
import {
  fetchInitialDataWhenAppLoading,
  fetchPostedSkills,
} from '../../../redux/slices/homeSlice';
import DoubleTapToClose from '../../../components/common/DoubleTapToClose';
import {
  fetchNotifications,
  notificationSelector,
} from '../../../redux/slices/notificationSlice';

export default function Home(props) {
  const { homeData, loading, homeSkillsData } = useSelector(homeSelector);
  const {
    currentOpenedChat,
    notificationsubscribe,
    chatPageOpened,
  } = useSelector(chatSelector);
  let currOpenedChat = currentOpenedChat;
  console.log(currentOpenedChat._id, 'dasfas');
  console.log(chatPageOpened, 'dasfas chatPageOpened');

  const { userInfo } = useSelector(loginSelector);
  const { unreadNotification } = useSelector(notificationSelector);

  const carouselRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const dispatch = useDispatch();
  var notificunsubscribe = null;
  var focusNotiMsg = null;
  var lastMessageId = '';
  const route = useRoute();
  console.log(route.name);

  const isFocused = useIsFocused();

  const showMore = group => {
    props.navigation.navigate('SkillListView', {
      title: group,
      skills: homeSkillsData[group],
    });
  };

  const showCategorySkills = category => {
    props.navigation.navigate('SkillListView', {
      title: category.category ? category.category : '',
      category: category,
    });
  };

  useEffect(() => {
    if (userInfo._id && !notificationsubscribe) {
      notificationListener();
      appOpenedNotificationListener();
    }
    return () => {
      if (notificunsubscribe && notificationsubscribe) {
        notificunsubscribe();
        dispatch(setNotificationSubscribe(false));
      }
    };
  }, [userInfo]);

  // useEffect(() => {
  //   currOpenedChat = currentOpenedChat;
  //   if (chatPageOpened && notificunsubscribe && notificationsubscribe) {
  //     notificunsubscribe();
  //     notificunsubscribe = null;
  //     dispatch(setNotificationSubscribe(false));
  //   } else if (
  //     !chatPageOpened &&
  //     !notificationsubscribe &&
  //     !notificunsubscribe
  //   ) {
  //     appOpenedNotificationListener();
  //     dispatch(setNotificationSubscribe(true));
  //   }
  // }, [chatPageOpened]);

  const notificationListener = async () => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('notificationListener');
        console.log('notificationListener', notification);

        if (
          focusNotiMsg &&
          focusNotiMsg.data &&
          focusNotiMsg.data.data &&
          JSON.parse(focusNotiMsg.data.data).type == 'CHAT'
        ) {
          // props.navigation.reset({
          //   index: 1,
          //   routes: [{ name: 'ChatPage' }, { name: 'ChatRoom' }],
          // });
          // props.navigation.navigate('Chat')
          // props.navigation.push('ChatRoom', {
          //   thread: JSON.parse(focusNotiMsg.data.data),
          // });
          focusNotiMsg.data.data.fromNotification = true;
          props.navigation.navigate('ChatRoom', {
            thread: JSON.parse(focusNotiMsg.data.data),
          });

          // props.navigation.navigate('Chat')

          // props.navigation.navigate('ChatRoom', { thread: JSON.parse(focusNotiMsg.data.data) })
        } else if (
          notification &&
          notification.data &&
          notification.data.type == 'CHAT'
        ) {
          notification.data.fromNotification = true;
          props.navigation.navigate('ChatRoom', {
            thread: notification.data,
          });

          // props.navigation.navigate('Chat')

          // props.navigation.navigate('ChatRoom', { thread: notification.data })

          // props.navigation.push('ChatRoom', { thread: notification.data });
          // props.navigation.reset({
          //   index: 1,
          //   routes: [{ name: 'ChatPage' }, { name: 'ChatRoom' }],
          // });
        } else {
          props.navigation.navigate('Notification');

          // props.navigation.push('Notification');
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  const getCur = () => {
    return currentOpenedChat._id || null;
  };

  const appOpenedNotificationListener = () => {
    notificunsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('noti');
      console.log(chatPageOpened, 'chatPageOpened');
      console.log(remoteMessage);
      console.log(currentOpenedChat._id, 'currentOpenedChat');

      // alert('sas');
      console.log(currOpenedChat._id);
      // // console.log(JSON.parse(remoteMessage.data.data)._id);
      // console.log(remoteMessage.data.data);

      let remoteData = JSON.parse(remoteMessage?.data?.data)?._id || '';
      console.log(remoteData, 'remoteData');

      focusNotiMsg = remoteMessage;
      if (remoteMessage.messageId !== lastMessageId) {
        lastMessageId = remoteMessage.messageId;
        PushNotification.localNotification({
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_launcher',
          autoCancel: true,
          bigText: remoteMessage.data.body,
          // subText: remoteMessage.data.body,
          title: remoteMessage.data.title,
          message: remoteMessage.data.body,
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: 'default',
          // id: JSON.stringify(remoteMessag?.sentTime),
          // userInfo: { id: JSON.stringify(remoteMessag?.sentTime) },
        });
      }
      // if (chatPageOpened) {
      //   PushNotification.cancelLocalNotification({ id: id });
      // }
      // PushNotification.cancelLocalNotification({ id: id });

      // alert('A new FCM message arrived!' + JSON.stringify(remoteMessage));
    });

    dispatch(setNotificationSubscribe(true));
  };

  const headerComponent = () => {
    return (
      <View style={styles.logo}>
        <View
          style={{
            flex: 0.9,
            alignItems: 'center',
            paddingTop: 10,
            marginLeft: 25,
          }}>
          <Image
            source={require('../../../assets/img/tagSkillsLogo1.png')}
            style={{ height: 50, width: 160, flex: 0.8, resizeMode: 'contain' }}
          />
        </View>
        <View style={{ position: 'relative' }}>
          <Icons
            style={{ marginTop: 0 }}
            name={'bell-outline'}
            size={27}
            onPress={() => props.navigation.navigate('Notification')}
          />
          {/* {!!unreadNotification && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                width: 10,
                height: 10,
                borderRadius: 20,
                marginLeft: 14,
                marginTop: 2,
              }}
            />
          )} */}
        </View>
      </View>
    );
  };

  const carouselComponent = () => {
    const renderItem = ({ item, index }, parallaxProps) => {
      return (
        <TouchableOpacity
          onPress={() => showCategorySkills(item)}
          style={{
            borderColor: 'lightgrey',
            borderRadius: 5,
            borderWidth: 0.5,
            backgroundColor: 'rgba(243, 246, 252, 0.7)',
          }}
          key={index}>
          <ParallaxImage
            source={Illustrations[item.illustration]}
            containerStyle={styles.imageContainer}
            style={{
              resizeMode: item.rezisemode ? item.rezisemode : 'contain',
            }}
            parallaxFactor={0.4}
            showSpinner={true}
            {...parallaxProps}
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.category}
          </Text>
          <View style={styles.subTitleContainer}>
            <IconMaterialIcons
              name={item.icon}
              size={20}
              color={'black'}
              style={{ marginHorizontal: 10 }}
            />
            <Text style={styles.subTitle} numberOfLines={1}>
              {item.helpText}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <Carousel
        ref={carouselRef}
        containerCustomStyle={styles.carouselContainer}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 125}
        data={homeData.categories || []}
        firstItem={0}
        renderItem={renderItem}
        hasParallaxImages={true}
        autoplay={true}
        autoplayDelay={2000}
        autoplayInterval={5000}
        enableMomentum={true}
        lockScrollWhileSnapping={false}
        loop={true}
      />
    );
  };

  const topCategories = () => {
    return (
      !!homeData &&
      !!homeData.topCategories && (
        <View style={{ marginTop: 40 }}>
          <CategoryWrapper
            title={'Top Categories'}
            hideBtn={true}
            // btnText={''}
            // onButtonPress={() => showMore({})}
          />
          <View style={{ marginLeft: 15 }}>
            <CategoryChipView
              data={homeData.topCategories}
              keyProp={'category'}
              categoryClicked={item => showCategorySkills(item)}
            />
          </View>
        </View>
      )
    );
  };

  const dataGroupsComponent = () => {
    const showData = !!homeSkillsData && !!Object.keys(homeSkillsData).length;

    return (
      <View style={{ marginTop: 10 }}>
        {showData &&
          Object.keys(homeSkillsData).map((group, index) => {
            return (
              <View style={{ marginTop: 18 }} key={index}>
                <CategoryWrapper
                  title={group}
                  btnText={'See All'}
                  onButtonPress={() => showMore(group)}
                />
                <SkillFlatList
                  skills={homeSkillsData[group]}
                  categories={homeData.categories}
                />
              </View>
            );
          })}
        {/* {!showData && skeletonPlaceHolder()} */}
        {!loading && !showData && (
          <View style={{ marginLeft: 10 }}>
            {skeletonFlatList()}
            {skeletonFlatList()}
          </View>
        )}
      </View>
    );
  };

  const skeletonFlatList = () => (
    <>
      {titleSkeletonPlaceHolder()}
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={({ item }) => skeletonPlaceHolder(item)}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
      />
    </>
  );

  const titleSkeletonPlaceHolder = () => {
    return (
      <SkeletonPlaceholder>
        <View
          style={{ width: '30%', height: 15, margin: 10, marginBottom: 5 }}
        />
      </SkeletonPlaceholder>
    );
  };

  const skeletonPlaceHolder = () => {
    return (
      <SkeletonPlaceholder>
        <View style={styles.card} />
      </SkeletonPlaceholder>
    );
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={'black'} />
      </View>
    );
  };

  const loadInitialData = () => {
    console.log('from home.js loadInitialData');
    getUserInfo();
    searchInitialData();
    checkPermission();
  };

  const searchInitialData = () => {
    dispatch(getRecentSearches());
    dispatch(fetchInitialDataWhenAppLoading());
    dispatch(fetchPostedSkills());
    // if (userInfo._id) dispatch(fetchNotifications(userInfo));
  };

  const getUserInfo = async () => {
    const userData = await getAsyncData('userInfo');
    if (userData) {
      dispatch(loadUserInfo(userData));
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

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadInitialData} />
        }
        onLayout={() => setScreenWidth(Dimensions.get('window').width)}>
        {headerComponent()}
        {carouselComponent()}
        {topCategories()}
        {dataGroupsComponent()}
      </ScrollView>
      {!!loading && loadingComponent()}
      {isFocused && <DoubleTapToClose message="Tap again to exit app" />}
    </View>
  );
}

const carouselHeight = 210;
const carouselImageHeight = carouselHeight - 60;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  card: {
    height: 150,
    width: 150,
    margin: 10,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loadingBar: {
    // marginTop: 40
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    left: width / 2,
    height: height,
    // flex: 1,
    // zIndex: 99,
  },
  logo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor: "#f7f7f7",
    paddingBottom: 15,
  },
  carouselContainer: {
    // marginTop: 25,
  },
  imageContainer: {
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
    height: carouselHeight,
    // opacity: 0.6,
    maxHeight: carouselImageHeight,
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  title: {
    // padding: 10,
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 17,
    // fontWeight: 'bold',
    marginVertical: carouselImageHeight + 5,
    color: 'black',
    // backgroundColor: "skyblue"
  },
  subTitle: {
    fontSize: 14,
    // fontWeight: 'bold',
    color: 'black',
    flex: 0.9,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    // padding: 10
  },
  subTitleContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    marginVertical: carouselImageHeight + 30,
  },
});
