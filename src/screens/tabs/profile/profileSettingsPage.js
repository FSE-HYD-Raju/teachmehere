import React, { useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
} from 'react-native';
import { Surface } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import PageSpinner from '../../../components/common/PageSpinner';
import firestore from '@react-native-firebase/firestore';
import { loginSelector } from '../../../redux/slices/loginSlice';
import { chatSelector } from '../../../redux/slices/chatSlice';
import { searchSelector } from '../../../redux/slices/searchSlice';
import { Snackbar } from 'react-native-paper';

export default function ProfileSettingsPage({ navigation }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { userInfo } = useSelector(loginSelector);
  const { searchChatResults } = useSelector(chatSelector);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState('');

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Skill On',
        message:
          'Checkout this  app where you can share skills while earning money or learn from the professionals within your budget.  AppLink :https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB',
        url: 'https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const headerComponent = () => {
    return (
      <View style={styles.headerComponent}>
        <Icons
          name={'keyboard-backspace'}
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>
    );
  };

  const snackComponent = () => {
    return (
      <Snackbar
        visible={!!visibleSnackbar}
        onDismiss={() => setVisibleSnackbar('')}
        duration={2000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setVisibleSnackbar('');
          },
        }}
        style={{ backgroundColor: 'white' }}
        wrapperStyle={{ backgroundColor: 'white' }}>
        <Text style={{ color: 'black', fontSize: 16, letterSpacing: 1 }}>
          {visibleSnackbar}
        </Text>
      </Snackbar>
    );
  };

  const helpAndSupportComponent = () => {
    const getAdminData = () => {
      if (userInfo._id) {
        setLoading(true);
        fetch('https://teachmeproject.herokuapp.com/getAdmindata', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(response => {
            if (response.length) {
              var item = response[0];
              checkIfChatExists(item);
            } else {
              setLoading(false);
            }
          })
          .catch(error => {
            console.error(error);
            setLoading(false);
          });
      } else {
        setVisibleSnackbar('Please login!');
      }
    };

    const checkIfChatExists = item => {
      var exists = false;
      console.log(JSON.stringify(item), 'checkifchatexists');
      console.log(JSON.stringify(userInfo), 'userinfo');

      // if (searchChatResults && searchChatResults.length) {
      //     exists = searchChatResults.filter(ele => ele["ids"].indexOf(item.userinfo._id) > -1)
      // }

      // if (!exists.length) {
      //     sendMessage(item)
      // } else {
      //     setLoading(false);
      //     navigation.navigate('ChatRoom', { thread: item });
      // }
      firestore()
        .collection('THREADS')
        .where('ids', 'array-contains', userInfo._id)
        .get()
        .then(querySnapshot => {
          for (var i in querySnapshot.docs) {
            const documentSnapshot = querySnapshot.docs[i];
            const data = documentSnapshot.data();

            if (data.ids.indexOf(item._id) > -1) {
              exists = true;
              item = {
                ...data,
                _id: documentSnapshot.id,
                name: item.username,
                support: true,
              };
              break;
            }
          }
          if (!exists) {
            sendMessage(item);
          } else {
            setLoading(false);
            console.log('exists', JSON.stringify(item));
            navigation.navigate('ChatRoom', { thread: item });
          }
        });
    };

    function sendMessage(item) {
      console.log('sendmessage', JSON.stringify(item));
      const ref = firestore()
        .collection('THREADS')
        .doc();
      var messageObj = {
        userDetails: [
          {
            id: userInfo._id,
            name: userInfo.username,
            displaypic: userInfo.displaypic,
          },
          {
            id: item._id,
            name: item.username,
            displaypic: item.displaypic,
          },
        ],
        ids: [userInfo._id, item._id],
        latestMessage: {
          text:
            'Hi, Please let us know your concern, We will get back to you as soon as possible.',
          createdAt: Date.now(),
        },
        deletedIds: [item._id],
        newChat: true,
      };
      ref.set(messageObj).then(() => {
        ref
          .collection('MESSAGES')
          .add({
            text:
              'Hi, Please let us know your concern, We will get back to you as soon as possible.',
            createdAt: Date.now(),
            system: true,
          })
          .then(() => {});
      });

      var itemObj = {
        ...messageObj,
        _id: ref.id,
        name: item.username,
        displaypic: item.displaypic,
        senderDetailsId: item._id,
        support: true,
      };
      setLoading(false);
      console.log('created and navigating', JSON.stringify(itemObj));
      navigation.navigate('ChatRoom', { thread: itemObj });
    }

    return (
      <View style={styles.accountContainer}>
        <Text style={styles.accountContainerTitle}>Help And Support</Text>
        <View style={styles.accountContainerBody}>
          <TouchableOpacity onPress={() => navigation.navigate('Feedback')}>
            <Surface style={styles.surface}>
              <Image
                source={require('../../../assets/img/settings_feedback_icon1.png')}
                style={{ height: 70, width: 80 }}
              />
              <Text style={styles.accountsText}>Feedback</Text>
            </Surface>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => getAdminData()}>
            <Surface style={styles.surface}>
              <Image
                source={require('../../../assets/img/settings_chatwithus.png')}
                style={{ height: 71, width: 77 }}
              />
              <Text style={styles.accountsText}>Chat With Us</Text>
            </Surface>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const aboutComponent = () => {
    return (
      <View style={[styles.accountContainer, { marginTop: 10 }]}>
        <Text style={styles.accountContainerTitle}>About</Text>
        <View style={styles.accountContainerBody}>
          <TouchableOpacity onPress={() => onShare()}>
            <Surface style={styles.surface}>
              <Image
                source={require('../../../assets/img/share.png')}
                style={{ height: 60, width: 70 }}
              />
              <Text style={styles.accountsText}>Invite friends</Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.TAGIdeas.BMB',
              )
            }>
            <Surface style={styles.surface}>
              <Image
                source={require('../../../assets/img/settings_rating_icon.png')}
                style={{ height: 70, width: 80 }}
              />
              <Text style={styles.accountsText}>Rate us</Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://buymybook.flycricket.io/privacy.html')
            }>
            <Surface style={styles.surface}>
              <Image
                source={require('../../../assets/img/settings_privacy_icon.png')}
                style={{ height: 70, width: 90 }}
              />
              <Text style={styles.accountsText}>Privacy policy</Text>
            </Surface>
          </TouchableOpacity>
          <Surface style={styles.surface}>
            <Image
              source={require('../../../assets/img/settings_version_icon1.png')}
              style={{ height: 50, width: 50 }}
            />
            <Text style={styles.accountsText}>Version</Text>
            <Text style={{}}>1.0.0</Text>
          </Surface>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.settingsContainer}>
          {headerComponent()}
          {helpAndSupportComponent()}
          {aboutComponent()}
        </View>
      </ScrollView>
      <PageSpinner visible={loading} />
      {snackComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    margin: 20,
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
    marginTop: 30,
  },
  surface: {
    margin: 5,
    padding: 18,
    height: 113,
    width: 132,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgb(225, 225, 225)',
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
});

// {
//   "_id": "5ee6d37a5b9190aa9113b4b7",
//   "uid": "5ed1622d0b0329e1036266f9",
//   "courseid": "5f047599e8d21aca7f90cd5e",
//   "status": "ACCEPTED",
//   "mystatus": "To be learned",
//   "courseuid": "5ed1622d0b0329e1036266f9",
//   "coursedetails": {
//     "_id": "5f047599e8d21aca7f90cd5e",
//     "coursename": "testtt"
//   },
//   "userinfo": {
//     "_id": "5ed1622d0b0329e1036266f9",
//     "username": "tag",
//     "email": "akhilgoud616@gmail.com",
//     "devicetoken": "cx2jr5v6TpefwksGNaEZ12:APA91bHXVEUZeMqwHB2dEGeCWMACgzkmoRGya_VpV_2GpzTpaV-3YNclaLJUaUkN4gxaB8s_nrHHW9ij6bt3Lz1ljjER4VwdQNx4riPVx_YYL-4mA4oolqS-T3xkRu4KIAd_0fH7Fim1",
//   },
//   "type": "RECEIVED"
// }
