import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, BackHandler, Dimensions } from 'react-native';
import { Searchbar, ActivityIndicator, Colors } from 'react-native-paper';
import SideMenu from 'react-native-side-menu';
import { useDispatch, useSelector } from 'react-redux';
import FilterPage from '../../../components/common/filterPage';
import SearchLandingPage from './searchLandingPage';
import {
  searchSelector,
  fetchSearchResults,
  clearSearchResults,
  setSearchQuery,
  setFilterObj,
} from '../../../redux/slices/searchSlice';
import SearchResultsPage from './searchResults';

export default function SearchPage({ navigation }) {
  const dispatch = useDispatch();
  const { searchQuery, loading, filterObj } = useSelector(searchSelector);

  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [openFilterPage, setOpenFilterPage] = React.useState(false);
  // const [filterObj, setFilterObj] = React.useState({});

  const timerRef = useRef(null);
  const searchBarRef = useRef(null);
  // const SCREEN_WIDTH = Dimensions.get('window').width;
  // clearAsyncData()

  const backButtonHandler = () => {
    return BackHandler.addEventListener('hardwareBackPress', function () {
      if (openFilterPage) {
        setOpenFilterPage(false);
        return true;
      } else if (isSearchFocused || searchBarRef.current.isFocused()) {
        searchBackFun();
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    let backhandler = backButtonHandler();
    return () => {
      backhandler.remove();
    };
  }, [openFilterPage, isSearchFocused]);

  const fetchData = (query, filterObj) => {
    dispatch(
      fetchSearchResults({
        textentered: query,
        filterQuery: filterObj,
        page: 0,
      }),
    );
  };

  const searchFun = query => {
    dispatch(setSearchQuery(query));
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      fetchData(query, filterObj);
    }, 700);
  };

  const searchChipSelected = searchQuery => {
    setIsSearchFocused(true);
    dispatch(setSearchQuery(searchQuery));
    searchFun(searchQuery);
  };

  const searchBackFun = () => {
    searchBarRef.current.blur();
    // searchBarRef.current.clear()
    dispatch(setSearchQuery(''));
    dispatch(clearSearchResults());
    setIsSearchFocused(false);
  };

  const applyFilter = filterObj => {
    console.log(filterObj);
    setOpenFilterPage(false);
    var filter = {};
    if (filterObj && filterObj['$and'] && filterObj['$and'].length)
      filter = filterObj;
    dispatch(setFilterObj(filterObj));
    fetchData(searchQuery, filter);
  };

  const clearFilter = () => {
    dispatch(setFilterObj({}));
    setOpenFilterPage(false);
    if (searchQuery) fetchData(searchQuery, {});
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={Colors.red800} />
      </View>
    );
  };

  const searchComponent = () => {
    return (
      <Searchbar
        ref={searchBarRef}
        onFocus={() => setIsSearchFocused(true)}
        icon={isSearchFocused ? 'arrow-left' : null}
        onIconPress={isSearchFocused ? searchBackFun : null}
        inputStyle={{
          fontSize: 13,
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        placeholder="Search by skill name, category ..."
        // placeholderStyle={{ fontSize: 256 }}
        onChangeText={searchFun}
        value={searchQuery}
        style={{ marginRight: 30 }}
      />
    );
  };

  const filterComponent = () => {
    return (
      <View style={{ backgroundColor: '#fafafa' }}>
        <FilterPage
          onFilterClose={() => setOpenFilterPage(false)}
          applyFilter={filterObj => applyFilter(filterObj)}
          clearFilter={() => clearFilter()}
        />
      </View>
    );
  };

  return (
    <SideMenu
      // openMenuOffset={SCREEN_WIDTH}
      onChange={isopen => setOpenFilterPage(isopen)}
      menuPosition="right"
      isOpen={openFilterPage}
      disableGestures={true}
      menu={filterComponent()}>
      <View style={styles.container}>
        {searchComponent()}
        {!isSearchFocused && (
          <SearchLandingPage
            navigation={navigation}
            searchChipSelected={searchQuery => searchChipSelected(searchQuery)}
          />
        )}
        {isSearchFocused && !loading && (
          <SearchResultsPage
            navigation={navigation}
            filterclicked={() => setOpenFilterPage(!openFilterPage)}
          />
        )}
        {isSearchFocused && loading && loadingComponent()}
      </View>
    </SideMenu>
  );
}

const styles = StyleSheet.create({
  defaultPage: {
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    paddingRight: 0,
    paddingBottom: 0,
  },
  loadingBar: {
    marginTop: 40,
  },
});
