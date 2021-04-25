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
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import SkillFlatList from '../../../components/common/SkillFlatList';
import CategoryWrapper from '../../../components/common/CategoryWrapper';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryChipView from '../../../components/common/CategoryChipView';
import { useSelector } from 'react-redux';
import { homeSelector } from '../../../redux/slices/homeSlice';
import messaging from '@react-native-firebase/messaging';
import { loginSelector } from '../../../redux/slices/loginSlice';
import PushNotification from 'react-native-push-notification';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function Home(props) {
  const { homeData, loading, homeSkillsData } = useSelector(homeSelector);
  const { userInfo } = useSelector(loginSelector);
  const carouselRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  var notificunsubscribe = null;
  var focusNotiMsg = null;

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
    if (userInfo._id && !notificunsubscribe) {
      // console.log(notificunsubscribe);
      notificationListener();
      appOpenedNotificationListener();
      // console.log(notificunsubscribe);
    }
    return () => {
      if (notificunsubscribe) {
        notificunsubscribe();
      }
    };
  }, [userInfo]);

  const notificationListener = async () => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('notificationListener');

        if (
          focusNotiMsg &&
          focusNotiMsg.data &&
          focusNotiMsg.data.data &&
          JSON.parse(focusNotiMsg.data.data).type == 'CHAT'
        ) {
          props.navigation.push('ChatRoom', {
            thread: JSON.parse(focusNotiMsg.data.data),
          });
        } else if (
          notification &&
          notification.data &&
          notification.data.type == 'CHAT'
        ) {
          props.navigation.push('ChatRoom', { thread: notification.data });
        } else {
          props.navigation.push('Notification');
        }
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  const appOpenedNotificationListener = () => {
    notificunsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('noti');
      console.log(remoteMessage);

      focusNotiMsg = remoteMessage;
      PushNotification.localNotification({
        // largeIcon: "ic_foreground",
        smallIcon: 'ic_foreground',
        autoCancel: true,
        bigText: remoteMessage.data.body,
        // subText: remoteMessage.data.body,
        title: remoteMessage.data.title,
        message: remoteMessage.data.body,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
      });

      // alert('A new FCM message arrived!' + JSON.stringify(remoteMessage));
    });
  };

  const headerComponent = () => {
    return (
      <View style={styles.logo}>
        <View
          style={{
            flex: 0.9,
            alignItems: 'center',
            paddingTop: 10,
            marginLeft: 10,
          }}>
          <Image
            source={require('../../../assets/img/skillSchoolLogo.png')}
            style={{ height: 60, width: 180, flex: 0.8, resizeMode: 'contain' }}
          />
        </View>
        <Icons
          style={{ marginTop: 0 }}
          name={'bell-outline'}
          size={27}
          onPress={() => props.navigation.navigate('Notification')}
        />
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
          }}>
          <ParallaxImage
            source={{ uri: item.illustration }}
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
          Object.keys(homeSkillsData).map(group => {
            return (
              <View style={{ marginTop: 18 }}>
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

  return (
    <View style={styles.container}>
      <ScrollView
        onLayout={() => setScreenWidth(Dimensions.get('window').width)}>
        {headerComponent()}
        {carouselComponent()}
        {topCategories()}
        {dataGroupsComponent()}
      </ScrollView>
      {!!loading && loadingComponent()}
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
  },
  carouselContainer: {
    marginTop: 25,
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
