import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchUrl, topCategoriesUrl } from '../urls';
import {
  storeAsyncData,
  getAsyncData,
  clearAsyncData,
} from '../../components/common/asyncStorage';

export const initialState = {
  searchResults: {},
  loading: false,
  hasErrors: false,
  searchQuery: '',
  recentlySearchedText: [],
  recentlyViewedCourses: [],
  topCategories: [],
  filterObj: {},
  isRefreshing: false,
  topCategoriesLoading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, { payload }) => {
      state.searchQuery = payload;
    },
    setFilterObj: (state, { payload }) => {
      state.filterObj = payload;
    },
    setIsRefreshing: (state, { payload }) => {
      state.isRefreshing = payload;
    },
    getTopCategories: state => {
      state.topCategories = [];
      state.topCategoriesLoading = true;
    },
    getTopCategoriesSuccess: (state, { payload }) => {
      state.topCategoriesLoading = false;
      state.topCategories = payload;
    },
    getTopCategoriesFailure: (state, { payload }) => {
      state.topCategoriesLoading = false;
      state.topCategories = [];
    },
    getSearchResults: state => {
      state.loading = true;
      state.searchResults = {};
    },
    getSearchResultsSuccess: (state, { payload }) => {
      state.searchResults = payload;
      state.loading = false;
      state.hasErrors = false;
      state.isRefreshing = false;
    },
    getSearchResultsFailure: state => {
      state.loading = false;
      state.hasErrors = true;
      state.searchResults = {};
      state.isRefreshing = false;
    },
    clearSearchResults: state => {
      state.searchResults = {};
    },
    setRecentlySearchedText: (state, { payload }) => {
      state.recentlySearchedText = payload;
    },
    setRecentlyViewedCourses: (state, { payload }) => {
      state.recentlyViewedCourses = payload;
    },
  },
});

export const {
  setSearchQuery,
  setFilterObj,
  setIsRefreshing,
  getTopCategories,
  getTopCategoriesSuccess,
  getTopCategoriesFailure,
  getSearchResults,
  getSearchResultsSuccess,
  getSearchResultsFailure,
  clearSearchResults,
  setRecentlySearchedText,
  setRecentlyViewedCourses,
} = searchSlice.actions;

export const searchSelector = state => state.search;
export default searchSlice.reducer;

export function fetchTopCategories() {
  return async dispatch => {
    dispatch(getTopCategories());
    try {
      const response = await axios.get(
        'https://teachmeproject.herokuapp.com/getTopCategories',
      );
      if (response) {
        dispatch(getTopCategoriesSuccess(response.data));
      }
    } catch (error) {
      dispatch(getTopCategoriesFailure());
    }
  };
}

export function fetchSearchResults(data) {
  return async (dispatch, getState) => {
    if (!data.page) dispatch(getSearchResults());
    else dispatch(setIsRefreshing(true));
    try {
      const response = await axios.post(searchUrl, data);
      if (data.page) {
        var availableData = [...getState().search.searchResults.response];
        response.data.response = availableData.concat(response.data.response);
      }
      // console.log(response.data.response);
      dispatch(getSearchResultsSuccess(response.data));
    } catch (error) {
      dispatch(getSearchResultsFailure());
    }
  };
}

export function getRecentSearches() {
  return async dispatch => {
    try {
      const recentlySearchedTextResponse = await getAsyncData(
        'recentlySearchedText',
      );
      const recentlyViewedCoursesResponse = await getAsyncData(
        'recentlyViewedCourses',
      );

      dispatch(setRecentlySearchedText(recentlySearchedTextResponse));
      dispatch(setRecentlyViewedCourses(recentlyViewedCoursesResponse));
    } catch (error) {
      // dispatch(getSearchResultsFailure(error));
    }
  };
}

export function updateRecentSearches(
  item,
  recentlySearchedText,
  recentlyViewedCourses,
) {
  return async dispatch => {
    try {
      var temprecentlySearchedText = recentlySearchedText
        ? [...recentlySearchedText]
        : [];
      var temprecentlyViewedCourses = recentlyViewedCourses
        ? [...recentlyViewedCourses]
        : [];

      if (item.search && !temprecentlySearchedText.includes(item.search)) {
        temprecentlySearchedText.length > 5
          ? temprecentlySearchedText.pop()
          : temprecentlySearchedText.unshift(item.search);
      }
      if (
        !temprecentlyViewedCourses.filter(e => e._id === item.course._id).length
      ) {
        temprecentlyViewedCourses.length > 4
          ? temprecentlyViewedCourses.pop()
          : temprecentlyViewedCourses.unshift(item.course);
      }

      dispatch(setRecentlySearchedText(temprecentlySearchedText));
      dispatch(setRecentlyViewedCourses(temprecentlyViewedCourses));

      storeAsyncData('recentlySearchedText', temprecentlySearchedText);
      storeAsyncData('recentlyViewedCourses', temprecentlyViewedCourses);
    } catch (error) {
      // dispatch(getSearchResultsFailure(error));
    }
  };
}

export function removeRecentlySearchedText(searchItem, recentlySearchedText) {
  return async dispatch => {
    try {
      var temprecentlySearchedText = recentlySearchedText;
      temprecentlySearchedText = temprecentlySearchedText.filter(ele => {
        return ele != searchItem;
      });
      storeAsyncData('recentlySearchedText', temprecentlySearchedText);
      dispatch(setRecentlySearchedText(temprecentlySearchedText));
    } catch (error) {
      // dispatch(getSearchResultsFailure(error));
    }
  };
}

export function removeRecentlyViewedCourses(course, recentlyViewedCourses) {
  return async dispatch => {
    try {
      var temprecentlyViewedCourses = recentlyViewedCourses;
      temprecentlyViewedCourses = temprecentlyViewedCourses.filter(ele => {
        return ele._id != course._id;
      });
      storeAsyncData('recentlyViewedCourses', temprecentlyViewedCourses);
      dispatch(setRecentlyViewedCourses(temprecentlyViewedCourses));
    } catch (error) {
      // dispatch(getSearchResultsFailure(error));
    }
  };
}
