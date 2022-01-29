import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { authLoginUrl } from '../urls';
import {
  storeAsyncData,
  clearAsyncData,
} from '../../components/common/asyncStorage';

export const initialState = {
  profileLoading: false,
  userInfo: {},
  loginPassword: '',
  loginPasswordError: '',
  loginEmail: '',
  loginEmailError: '',
  loginError: '',
  devicetoken: '',
  reqFavPostedCount: {
    coursedetailscount: 0,
    requestedcoursescount: 0,
    myfavoritescount: 0,
  },
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setDeviceToken: (state, { payload }) => {
      state.devicetoken = payload;
    },
    loginStarted: (state, { payload }) => {
      state.profileLoading = true;
      state.loginEmail = payload;
    },
    loginSuccess: (state, { payload }) => {
      state.userInfo = payload;
      state.profileLoading = false;
      state.loginEmailError = '';
      state.loginPasswordError = '';
    },
    clearErrors: state => {
      state.loginEmailError = '';
      state.loginPasswordError = '';
      state.loginError = '';
    },
    loadUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    loginPasswordChanged: (state, { payload }) => {
      state.loginEmailError = '';
      state.loginPasswordError = '';
      state.loginPassword = payload;
    },
    loginFailure: state => {
      state.profileLoading = false;
      state.loginError = 'Something went wrong, please try again later!';
    },
    passwordIncorrect: (state, { payload }) => {
      state.loginPasswordError = payload;
      state.profileLoading = false;
    },
    EmailIncorrect: (state, { payload }) => {
      state.loginEmailError = payload;
      state.profileLoading = false;
    },
    logoutSuccess: state => {
      state.userInfo = '';
      state.loginEmailError = '';
      state.loginPasswordError = '';
      state.loginError = '';
      state.profileLoading = false;
    },
    logoutStarted: state => {
      state.profileLoading = true;
    },
    logoutDone: state => {
      state.profileLoading = false;
    },
    setReqFavPostedCount: (state, { payload }) => {
      state.reqFavPostedCount = payload;
    },
  },
});

export const {
  setDeviceToken,
  loginStarted,
  loginSuccess,
  clearErrors,
  loginPasswordChanged,
  loginFailure,
  passwordIncorrect,
  EmailIncorrect,
  loadUserInfo,
  logoutSuccess,
  setReqFavPostedCount,
  logoutStarted,
  logoutDone,
} = loginSlice.actions;

export const loginSelector = state => state.login;

export default loginSlice.reducer;

export function onLoginPressed(param) {
  console.log('insideonlogin');

  return async (dispatch, getState) => {
    console.log(param.email);
    dispatch(loginStarted(param.email));
    const devicetokenValue = getState().login.devicetoken;
    try {
      const response = await axios.post(authLoginUrl, {
        devicetoken: devicetokenValue,
        email: param.email,
        password: param.password,
      });
      console.log(response.data);
      if (response) {
        if (response.data.status === '404') {
          if (response.data.field === 'email') {
            dispatch(EmailIncorrect(response.data.error));
          }
          if (response.data.field === 'password') {
            dispatch(passwordIncorrect(response.data.error));
          }
        } else {
          dispatch(loginSuccess(response.data[0]));
          storeAsyncData('userInfo', response.data[0]);

          param.onSuccess();
        }
      } else {
        dispatch(loginFailure());
      }
    } catch (error) {
      dispatch(loginFailure());
    }
  };
}

export function logOutUser(param) {
  return async (dispatch, getState) => {
    param.onSuccess();
    setTimeout(() => {
      dispatch(logoutStarted());
      dispatch(
        setReqFavPostedCount({
          coursedetailscount: 0,
          requestedcoursescount: 0,
          myfavoritescount: 0,
        }),
      );
      clearAsyncData();
      dispatch(logoutSuccess());
    }, 50);
  };
}
