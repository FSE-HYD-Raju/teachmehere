/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ScrollView,
  Dimensions,
  Image,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from 'react-native-paper';
import { Icon, Rating } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Price from './Price';
import { random_rgba } from '../../utils/random_rgba';
import { Divider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CategoryChipView from './CategoryChipView';
import CourseListCard from './CourseListCard';
import { updateHomeSkillsData } from '../../redux/slices/homeSlice';
import { Chip, ActivityIndicator } from 'react-native-paper';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { homeSelector } from '../../redux/slices/homeSlice';
import {
  getCourseDetailsByCategoryUrl,
  loadMoreDataForCategoryUrl,
} from '../../redux/urls';

const screenWidth = Dimensions.get('screen').width;

export default function SkillListView({ route, navigation }) {
  const dispatch = useDispatch();
  const { homeSkillsData, endReached } = useSelector(homeSelector);

  const { category, title } = route.params;
  const skills = route.params.skills ? homeSkillsData[title] : null;
  const [subCatSelected, setSubCatSelected] = useState([]);
  const [categorySkills, setCategorySkills] = useState(skills);
  const [loading, setLoading] = useState(false);
  const [moreDataLoading, setMoreDataLoading] = useState(false);
  const [catOnEndReached, setCatOnEndReached] = useState(false);
  const [offset, setOffset] = useState(10);
  const [catOffset, setCatOffset] = useState(0);

  useEffect(() => {
    if (!skills) {
      fetchCategoryData();
    } else {
      setCategorySkills(skills);
    }
  }, [subCatSelected, skills]);

  const loadingComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          // flex: 1,
          zIndex: 99,
        }}>
        <View style={styles.loadingBar}>
          <ActivityIndicator
            size={35}
            animating={true}
            color={'black'}
            style={{ marginTop: 290 }}
          />
        </View>
      </View>
    );
  };

  const fetchCategoryData = moreData => {
    if (catOnEndReached) {
      return;
    }
    if (!moreData) {
      setCatOffset(0);
      setLoading(true);
    } else {
      setMoreDataLoading(true);
    }
    fetch(getCourseDetailsByCategoryUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: category.category,
        subcategory: subCatSelected,
        offset: catOffset,
      }),
    })
      .then(response => response.json())
      .then(requestedJson => {
        let response = requestedJson;
        if (moreData) {
          response = [...categorySkills, ...response];
          setCatOffset(catOffset + 10);
        }
        setCategorySkills(response);
        setLoading(false);
        setMoreDataLoading(false);
        if (moreData && (!requestedJson || !requestedJson.length)) {
          setCatOnEndReached(true);
        }
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setMoreDataLoading(false);
      });
  };

  const showDetails = skill => {
    navigation.navigate('SkillDetail', {
      skill: skill,
    });
  };

  const headerComponent = () => {
    return (
      <View style={styles.header}>
        <Icons
          name={'keyboard-backspace'}
          size={27}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{title}</Text>
        {/* <Icons
        name={'filter'}
        size={27}
      // onPress={() => props.navigation.goBack()}
      /> */}
      </View>
    );
  };

  const subCategoriesComponent = () => {
    const subCategoryClicked = item => {
      var ind = subCatSelected.indexOf(item);
      if (ind === -1) {
        setSubCatSelected([...subCatSelected, item]);
      } else {
        subCatSelected.splice(ind, 1);
        setSubCatSelected([...subCatSelected]);
      }
    };

    return (
      category && (
        <View style={{ marginBottom: 10 }}>
          {!!category.subCategories && !!category.subCategories.length && (
            <Text
              style={{
                padding: 10,
                paddingTop: 0,
                fontSize: 15,
                letterSpacing: 1,
                color: 'black',
                marginTop: 10,
              }}>
              Sub Categories
            </Text>
          )}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 5 }}>
            {!!category.subCategories &&
              !!category.subCategories.length &&
              category.subCategories.map((item, index) => {
                return (
                  <Chip
                    key={index}
                    style={{
                      color: 'black',
                      margin: 5,
                      padding: 3,
                      borderColor: 'lightgrey',
                      borderWidth: 0.3,
                      backgroundColor: 'rgba(243, 246, 252, 0.7)',
                    }}
                    avatar={
                      item.icon ? (
                        <IconMaterialIcons name={item.icon} size={20} />
                      ) : null
                    }
                    onPress={() => subCategoryClicked(item.name)}
                    selected={subCatSelected.indexOf(item.name) > -1}
                    // selectedColor="green"
                  >
                    {item.name}
                  </Chip>
                );
              })}
          </ScrollView>
          {/* <CategoryChipView data={category.subCategories} keyProp={'name'} /> */}
        </View>
      )
    );
  };

  const noDataComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: 120,
        }}>
        <Text style={{ fontSize: 20, letterSpacing: 1 }}>No skills found!</Text>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (endReached[title]) {
      return;
    }
    setMoreDataLoading(true);
    fetch(loadMoreDataForCategoryUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        catType: title,
        offset: offset,
      }),
    })
      .then(response => response.json())
      .then(requestedJson => {
        dispatch(updateHomeSkillsData({ type: title, data: requestedJson }));
        setMoreDataLoading(false);
        setOffset(offset + 10);
        // alert(requestedJson)
      })
      .catch(error => {
        console.error(error);
        setMoreDataLoading(false);
      });
  };

  const renderFooter = () => {
    const disableMoreLoad = !categorySkills || categorySkills.length < 6;

    if (disableMoreLoad || endReached[title] || !moreDataLoading) {
      return null;
    }
    return <ActivityIndicator color={Colors.black} style={{ marginTop: 10 }} />;
  };

  const onRefresh = () => {
    // fetchData(0);
    // setPage(0);
  };

  const skillsListComponent = () => {
    const disableMoreLoad = !categorySkills || categorySkills.length < 6;
    return (
      <View style={{ flex: 1 }}>
        {!!categorySkills && !!categorySkills.length && (
          <FlatList
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            data={categorySkills}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <CourseListCard
                course={item}
                courseClicked={() => showDetails(item)}
                cardWidth={screenWidth - 50}
              />
            )}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (disableMoreLoad) {
                return;
              }
              skills ? handleLoadMore() : fetchCategoryData(true);
            }}
            // refreshControl={
            //   <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            //}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
        {/* <FlatList
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="always"
          // initialNumToRender={10}
          onEndReached={getMoreData}
          // onEndReachedThreshold={0.5}
          data={categorySkills}
          renderItem={({ item }) => (
            <CourseListCard
              course={item}
              courseClicked={() => showDetails(item)}
              cardWidth={screenWidth - 50}
            />
          )}
        /> */}
        {/* {!!categorySkills &&
          !!categorySkills.length &&
          categorySkills.map(skill => {
            return (
              <CourseListCard
                course={skill}
                courseClicked={() => showDetails(skill)}
                cardWidth={screenWidth - 50}
              />
            );
          })} */}
        {(!categorySkills || (categorySkills && !categorySkills.length)) &&
          !loading &&
          !skills &&
          noDataComponent()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {headerComponent()}
      {/* <ScrollView style={{ padding: 0 }} showsVerticalScrollIndicator={false}> */}
      {subCategoriesComponent()}

      {!!loading && loadingComponent()}

      {skillsListComponent()}
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 13,
    paddingBottom: 0,
    // marginBottom: 10,
    backgroundColor: '#fff',
    // zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingBottom: 15,
    marginTop: 5,
    marginBottom: 20,
    // elevation: 5,
    // backgroundColor: "",
  },
  headerTitle: {
    fontSize: 19,
    // fontWeight: 'bold',
    marginLeft: 30,
    letterSpacing: 1,
    // color: 'gray',
  },
  listview: {
    flexDirection: 'row',
    paddingBottom: 20,
    marginTop: 20,
  },
  skillName: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 20,
  },
  teacherName: {
    marginTop: 5,
    color: '#444',
    textTransform: 'capitalize',
  },
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    textAlign: 'center',
    alignContent: 'center',
    marginTop: 190,
    flex: 1,
  },
});
