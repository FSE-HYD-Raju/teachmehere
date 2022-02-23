import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { ActivityIndicator, Chip, Colors } from 'react-native-paper';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import CourseListCard from '../../../components/common/CourseListCard';
import {
  searchSelector,
  removeRecentlyViewedCourses,
  removeRecentlySearchedText,
  fetchTopCategories,
} from '../../../redux/slices/searchSlice';

export default function SearchLandingPage({ searchChipSelected, navigation }) {
  const dispatch = useDispatch();
  const {
    recentlySearchedText,
    recentlyViewedCourses,
    topCategories,
    topCategoriesLoading,
  } = useSelector(searchSelector);

  useEffect(() => {
    if (!topCategories || !topCategories.length) dispatch(fetchTopCategories());
  }, []);

  const showCategorySkills = category => {
    navigation.navigate('SkillListView', {
      title: !!category.category ? category.category : '',
      category: category,
    });
  };
  const showTopCategories = () => {
    return (
      !!topCategories.length && (
        <View style={styles.topCategories}>
          <Text h2 style={styles.topCategoriesHeading}>
            Top Categories
          </Text>
          <View style={styles.topCategoriesContainer}>
            {topCategories.map(category => (
              <TouchableOpacity
                style={styles.category}
                onPress={() => showCategorySkills(category)}>
                <View style={styles.IconAndName}>
                  <IconMaterialIcons
                    name={category.icon}
                    color="#000"
                    size={30}
                  />
                  <Text style={{ width: 100, marginLeft: 25 }}>
                    {category.category}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )
    );
  };

  const recentlyViewedCoursesComponent = () => {
    return (
      recentlyViewedCourses &&
      !!recentlyViewedCourses.length && (
        <View style={[styles.topCategories, { marginBottom: 0 }]}>
          <View>
            <Text h2 style={styles.topCategoriesHeading}>
              Recently Viewed Skills
            </Text>
          </View>
          <View style={styles.recentlyViewedCoursesContainer}>
            <FlatList
              data={recentlyViewedCourses}
              keyExtractor={item => item._id}
              renderItem={({ item }) => {
                return (
                  <View style={styles.recentlyViewedCoursesTextIcon}>
                    <View style={{ width: '100%', paddingRight: 10 }}>
                      <CourseListCard
                        course={item}
                        courseClicked={() =>
                          navigation.navigate('SkillDetail', {
                            skill: item,
                          })
                        }
                        wishlistClicked={() =>
                          alert('Imagine skill added to wishlist')
                        }
                        showDelete={true}
                        deleteFun={() =>
                          dispatch(
                            removeRecentlyViewedCourses(
                              item,
                              recentlyViewedCourses,
                            ),
                          )
                        }
                      />
                    </View>
                    {/* <View style={{ flex: 0.1 }}>
                      <IconMaterialIcons
                        name={'cancel'}
                        color="rgb(102, 94, 94)"
                        size={20}
                        style={{ height: 20 }}
                        onPress={() =>
                          dispatch(
                            removeRecentlyViewedCourses(
                              item,
                              recentlyViewedCourses,
                            ),
                          )
                        }
                      />
                    </View> */}
                  </View>
                );
              }}
            />
          </View>
        </View>
      )
    );
  };

  const recentSearches = () => {
    return (
      recentlySearchedText &&
      !!recentlySearchedText.length && (
        <View style={styles.topCategories}>
          <Text h2 style={styles.topCategoriesHeading}>
            Recent Searches
          </Text>
          <View style={styles.topCategoriesContainer}>
            {recentlySearchedText.map(searchQuery => (
              <View style={styles.IconAndName}>
                <Chip
                  textStyle={{ minWidth: 45 }}
                  mode="outlined"
                  onClose={() =>
                    dispatch(
                      removeRecentlySearchedText(
                        searchQuery,
                        recentlySearchedText,
                      ),
                    )
                  }
                  onPress={() => searchChipSelected(searchQuery)}>
                  {searchQuery}
                </Chip>
              </View>
            ))}
          </View>
        </View>
      )
    );
  };

  const loadingComponent = () => {
    return (
      <View style={styles.loadingBar}>
        <ActivityIndicator size={35} animating={true} color={Colors.red800} />
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.SearchDefaultPageContainer}>
        {recentSearches()}
        {showTopCategories()}
        {recentlyViewedCoursesComponent()}
        {topCategoriesLoading && loadingComponent()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  recentlyViewedCoursesTextIcon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    // justifyContent: "space-between",
    // alignItems: "center"
  },
  recentSearchsItem: {
    padding: 6,
  },
  SearchDefaultPageContainer: {
    marginBottom: 100,
    marginTop: 50,
    flex: 1,
  },
  category: {
    minWidth: 140,
    borderRightWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: '#C0C0C0',
    paddingVertical: 15,
    alignItems: 'center',
  },
  IconAndName: {
    alignItems: 'center',
    padding: 6,
    minWidth: 60,
  },
  topCategories: {
    padding: 2,
  },
  topCategoriesHeading: {
    fontSize: 19,
    letterSpacing: 1,
  },
  topCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    marginLeft: 0,
    marginRight: 0,
  },
  recentlyViewedCoursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  loadingBar: {
    marginTop: 80,
  },
});
