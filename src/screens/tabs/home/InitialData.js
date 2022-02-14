/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { getAsyncData } from '../../../components/common/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginSelector,
  loadUserInfo,
  setDeviceToken,
} from '../../../redux/slices/loginSlice';
import { getRecentSearches } from '../../../redux/slices/searchSlice';
import {
  fetchInitialDataWhenAppLoading,
  fetchPostedSkills,
} from '../../../redux/slices/homeSlice';
import messaging from '@react-native-firebase/messaging';

export default function LoadInitialData (props){
  const dispatch = useDispatch();
  getUserInfo();
  searchInitialData();
  checkPermission();

  const searchInitialData = () => {
    dispatch(getRecentSearches());
    dispatch(fetchInitialDataWhenAppLoading());
    dispatch(fetchPostedSkills());
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
    <></>
  );
};

