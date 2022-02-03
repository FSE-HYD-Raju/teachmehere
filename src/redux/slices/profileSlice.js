import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setReqFavPostedCount } from './loginSlice';

export const initialState = {
  isloading: false,
  postedSkills: [],
  requestedSkills: [],
  wishlistSkills: [],
  userRatings: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setPostedSkills: (state, { payload }) => {
      state.postedSkills = payload;
    },
    setRequestedSkills: (state, { payload }) => {
      state.requestedSkills = payload;
    },
    setUserRating: (state, { payload }) => {
      state.userRatings = payload;
    },
    setWishlistSkills: (state, { payload }) => {
      state.requestedSkills = payload;
    },
  },
});

export const {
  setPostedSkills,
  setRequestedSkills,
  setWishlistSkills,
  setUserRating,
} = profileSlice.actions;

export const profileSelector = state => state.profile;

export function fetchReqFavpostedCounts(param) {
  return async (dispatch, state) => {
    try {
      const response = await axios.post(
        'https://teachmeproject.herokuapp.com/getReqFavPostedCounts',
        {
          uid: param.uid,
        },
      );
      console.log('asdfasf', response.data);
      if (response && response.data && response.data.length)
        dispatch(setReqFavPostedCount(response.data[0]));
    } catch (error) {
      console.error(error);
    }
  };
}

export default profileSlice.reducer;
