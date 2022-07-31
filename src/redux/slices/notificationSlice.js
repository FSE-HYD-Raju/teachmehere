import { createSlice } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const initialState = {
  notificationsList: [],
  unreadNotification: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationsList: (state, { payload }) => {
      state.notificationsList = payload;
    },
    setUnreadNotification: (state, { payload }) => {
      state.unreadNotification = payload;
    },
  },
});

export const { setNotificationsList } = notificationSlice.actions;

export const notificationSelector = state => state.notification;
export default notificationSlice.reducer;

export function fetchNotifications(userInfo) {
  return async (dispatch, getState) => {
    try {
      firestore()
        .collection('NOTIFICATIONS')
        .where('receiverId', '==', userInfo._id)
        .get()
        .then(
          snapshot => {
            console.log(snapshot.docs.length, 'snapshot.docs.length');
            let notificationsArr = [];
            snapshot.forEach(documentSnapshot => {
              const data = {
                _id: documentSnapshot.id,
                text: '',
                ...documentSnapshot.data(),
              };

              notificationsArr.push(data);
            });
            console.log('notificationsArr', notificationsArr);

            notificationsArr.sort((a, b) => b.createdAt - a.createdAt);
            let count = 0;
            notificationsArr.forEach(notification => {
              if (!notification.status) {
                count++;
              }
            });
            console.log('count', count);
            console.log('notificationsArr', notificationsArr);
            dispatch(setUnreadNotification(count));

            dispatch(setNotificationsList(notificationsArr));

            // setInfoNotificationsList(
            //   notificationsArr.filter(ele => ele.type != 'REQUEST'),
            // );
            // setRequestNotificationsList(
            //   notificationsArr.filter(ele => ele.type == 'REQUEST'),
            // );
          },
          error => {
            // setLoading(false);
          },
        );
    } catch (error) {
      //   dispatch(getChatsFailure());
    }
  };
}
